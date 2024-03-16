mod auth;
mod state;

use actix_web::{web, App, HttpServer};
use auth::auth_routes;
use dotenv::dotenv;
use hex;
use sqlx::{postgres::PgPoolOptions};
use state::AppState;
use std::env;
use actix_session::SessionMiddleware;
use actix_session::storage::CookieSessionStore;
use actix_web::cookie::Key;
use oauth2::basic::BasicClient;
use oauth2::{ClientId, ClientSecret, AuthUrl, TokenUrl};


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new()
        .max_connections(12)
        .connect(&database_url)
        .await
        .expect("Error building a connection pool");
    let github_client_id =
        env::var("GITHUB_CLIENT_ID").expect("Missing the GITHUB_CLIENT_ID environment variable.");
    let github_client_secret = env::var("GITHUB_CLIENT_SECRET")
        .expect("Missing the GITHUB_CLIENT_SECRET environment variable.");
    let secret_key_hex = env::var("SECRET_KEY").expect("SECRET_KEY must be set");
    let secret_key = Key::from(&hex::decode(secret_key_hex).expect("SECRET_KEY must be a hex-encoded byte array"));
    let client = BasicClient::new(
        ClientId::new(github_client_id),
        Some(ClientSecret::new(github_client_secret)),
        AuthUrl::new("https://github.com/login/oauth/authorize".to_string()).unwrap(),
        Some(TokenUrl::new("https://github.com/login/oauth/access_token".to_string()).unwrap()),
    );
    let app_state = web::Data::new(AppState::new(client, pool));

    HttpServer::new(move || {
        App::new()
            .wrap(
                SessionMiddleware::new(CookieSessionStore::default(), secret_key.clone())
            )
            .app_data(app_state.clone())
            .service(auth_routes())
            .service(
                web::scope("/api")
            )
    })
    .bind("0.0.0.0:3000")?
    .run()
    .await
}
