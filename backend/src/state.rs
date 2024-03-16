use sqlx::{Pool, Postgres};
use oauth2::basic::BasicClient;

#[derive(Clone)]
pub struct AppState {
    pub oauth: BasicClient,
    pub db: Pool<Postgres>,
}

impl AppState {
    pub fn new(oauth: BasicClient, db: Pool<Postgres>) -> Self {
        AppState {
            oauth,
            db,
        }
    }
}