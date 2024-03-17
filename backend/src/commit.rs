use chrono::prelude::*;
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct Commit {
    #[serde(skip_serializing)]
    pub id: i32,
    #[serde(skip_serializing)]
    pub commit_id: i32,
    pub username: String,
    pub date: DateTime<Utc>,
    pub title: String,
    pub solution: String,
    #[serde(skip_serializing)]
    pub is_valid: Option<bool>,
}
