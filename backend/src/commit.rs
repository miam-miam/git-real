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
    pub description: Option<String>,
    pub solution: String,
    pub language: Language,
}

#[derive(Serialize, Deserialize, Default, Debug)]
pub struct ReactionState {
    pub heart: i32,
    pub rocket: i32,
    pub thumbsup: i32,
    pub thumbsdown: i32,
    pub skull: i32,
    pub trash: i32,
    pub tada: i32,
    pub facepalm: i32,
    pub nerd: i32
}


// #[derive(Serialize, Deserialize, sqlx::Type, Debug)]
// pub struct ReactionTuple {
//     pub reaction_id: i32,
//     pub user_id: i32,
//     pub commit_id: i32,
// }

#[derive(Serialize, Deserialize, sqlx::Type, Debug)]
pub struct Reaction {
    pub reaction_id: i32,
    pub user_id: i32,
    pub commit_id: i32,
    pub active: bool
}