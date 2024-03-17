mod auth;
mod state;
mod executor;
mod api;
mod challenge;
mod commit;

use crate::api::api_routes;
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
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
        App::new()
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
