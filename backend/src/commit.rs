use chrono::prelude::*;
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct Commit {
    pub id: i32,
    pub commit_id: i32,
    pub username: String,
    pub date: DateTime<Utc>,
    pub title: String,
    pub solution: String,
    pub is_valid: Option<bool>,
}
