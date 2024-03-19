mod api;
mod auth;
mod challenge;
mod commit;
mod executor;
mod state;

use crate::api::api_routes;
use actix_cors::Cors;
use actix_identity::IdentityMiddleware;
use actix_session::storage::CookieSessionStore;
use actix_session::SessionMiddleware;
use actix_web::cookie::Key;
use actix_web::{web, App, HttpServer};
use auth::auth_routes;
use dotenv::dotenv;
use oauth2::basic::BasicClient;
use oauth2::{AuthUrl, ClientId, ClientSecret, TokenUrl};
use sqlx::postgres::PgPoolOptions;
use state::AppState;
use std::env;
use log4rs::append::console::ConsoleAppender;
use log4rs::append::file::FileAppender;
use log4rs::encode::pattern::PatternEncoder;
use log::info;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    setup_logging();

    dotenv().ok();
    let database_url = env!("DATABASE_URL");
    let pool = PgPoolOptions::new()
        .max_connections(12)
        .connect(&database_url)
        .await
        .expect("Error building a connection pool");
    let github_client_id = env!("GITHUB_CLIENT_ID");
    let github_client_secret = env!("GITHUB_CLIENT_SECRET");
    let secret_key_hex = env!("SECRET_KEY");
    let secret_key = Key::from(
        &hex::decode(secret_key_hex).expect("SECRET_KEY must be a hex-encoded byte array"),
    );
    let client = BasicClient::new(
        ClientId::new(github_client_id.to_string()),
        Some(ClientSecret::new(github_client_secret.to_string())),
        AuthUrl::new("https://github.com/login/oauth/authorize".to_string()).unwrap(),
        Some(TokenUrl::new("https://github.com/login/oauth/access_token".to_string()).unwrap()),
    );
    let app_state = web::Data::new(AppState::new(client, pool));

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("localhost:3000")
            .allow_any_method()
            .supports_credentials()
            .allow_any_header()
            .expose_any_header()
            .max_age(3600);
        App::new()
            .wrap(cors)
            .wrap(IdentityMiddleware::default())
            .wrap(SessionMiddleware::new(
                CookieSessionStore::default(),
                secret_key.clone(),
            ))
            .app_data(app_state.clone())
            .service(auth_routes())
            .service(api_routes())
    })
    .bind("localhost:3001")?
    .run()
    .await
}

fn setup_logging() {
    log4rs::init_file("log4rs.yml", Default::default()).unwrap();
    info!("Logging set up!");
}

#[cfg(test)]
mod test {
    use crate::challenge::DbChallenge;
    use crate::executor::{FuncType, Function};
    use chrono::{TimeZone, Utc};
    use sqlx::postgres::PgPoolOptions;

    #[tokio::test]
    pub async fn add_challenge() {
        let database_url = env!("DATABASE_URL");
        let pool = PgPoolOptions::new()
            .max_connections(12)
            .connect(database_url)
            .await
            .expect("Error building a connection pool");

        let challenge = DbChallenge {
            id: 0,
            title: "Climbing Stairs".to_string(),
            description: Some(
                r#"Write a function that takes the an unsigned 
                
integer and returns the number of '1' bits it has (also known as the Hamming weight).
"#
                .to_string(),
            ),
            function: Function {
                name: "hamming_weight".to_string(),
                inputs: vec![("num".to_string(), FuncType::Int(11))],
                output: FuncType::Int(3),
            },
            date_released: Utc.timestamp_opt(1710652456, 0).unwrap().to_utc(),
            deadline: Utc.timestamp_opt(1710663256, 0).unwrap().to_utc(),
        };

        sqlx::query!("INSERT INTO challenges (title, description, function, date_released, deadline) VALUES ($1, $2, $3, $4, $5)",
            challenge.title,
            challenge.description,
            Some(serde_json::to_value(challenge.function).unwrap()),
            challenge.date_released,
            challenge.deadline
        )
            .execute(&pool)
            .await.unwrap();
    }
}
