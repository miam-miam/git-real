use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Row};
use sqlx::postgres::PgRow;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Commit {
    pub commit_id: i32,
    pub username: String,
    pub date: DateTime<Utc>,
    pub title: String,
    pub solution: String,
}