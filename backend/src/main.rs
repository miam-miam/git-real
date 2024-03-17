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
use actix_web::web::ServiceConfig;
use actix_web::{web, App, HttpServer};
use auth::auth_routes;
use dotenv::dotenv;
use oauth2::basic::BasicClient;
use oauth2::{AuthUrl, ClientId, ClientSecret, TokenUrl};
use sqlx::postgres::PgPoolOptions;
use state::AppState;
use std::env;

#[shuttle_runtime::main]
async fn main(
) -> shuttle_actix_web::ShuttleActixWeb<impl FnOnce(&mut ServiceConfig) + Send + Clone + 'static> {
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

    let config = move |cfg: &mut ServiceConfig| {
        let cors = Cors::default()
            .allowed_origin("localhost:3000")
            .allow_any_method()
            .supports_credentials()
            .allow_any_header()
            .expose_any_header()
            .max_age(3600);
        cfg.service(
            web::scope("/")
                .wrap(cors)
                .wrap(IdentityMiddleware::default())
                .wrap(SessionMiddleware::new(
                    CookieSessionStore::default(),
                    secret_key.clone(),
                ))
                .app_data(app_state.clone())
                .service(auth_routes())
                .service(api_routes()),
        );
    };

    Ok(config.into())
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
            title: "Test Challenge".to_string(),
            description: Some("Really descriptive description".to_string()),
            function: Function {
                name: "add".to_string(),
                inputs: vec![
                    ("left".to_string(), FuncType::Int(21)),
                    ("right".to_string(), FuncType::Int(15)),
                ],
                output: FuncType::Int(36),
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
