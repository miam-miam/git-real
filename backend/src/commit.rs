use crate::executor::Language;
use chrono::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ResCommit {
    pub id: i32,
    pub commit_hash: String,
    pub user_id: i64,
    pub date: DateTime<Utc>,
    pub title: String,
    pub solution: String,
    pub is_valid: bool,
    pub language: Language,
    pub description: Option<String>,
    pub challenge_id: i32,
}

#[derive(Serialize, Deserialize)]
pub struct ReqCommit {
    pub title: String,
    pub description: String,
    pub solution: String,
}
