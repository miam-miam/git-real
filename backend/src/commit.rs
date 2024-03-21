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

pub type ReactionState = ReactionHolder<i32>;
pub type UserReactions = ReactionHolder<bool>;

#[derive(Serialize, Deserialize, Default, Debug)]
pub struct ReactionHolder<T> {
    pub heart: T,
    pub rocket: T,
    pub thumbsup: T,
    pub thumbsdown: T,
    pub skull: T,
    pub trash: T,
    pub tada: T,
    pub facepalm: T,
    pub nerd: T
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

// Used for the API endpoint
#[derive(Serialize, Deserialize, Debug)]
pub struct ReqReaction {
    pub reaction_id: i32,
    pub commit_id: i32,
    pub active: bool
}