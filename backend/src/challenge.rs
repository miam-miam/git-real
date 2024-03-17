use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, sqlx::Type)]
pub struct Challenge {
    #[serde(skip_serializing)]
    pub id: i32,
    #[serde(skip_serializing)]
    pub challenge_id: Uuid,
    pub title: String,
    pub description: String,
    pub example_input: String,
    pub example_output: String,
    pub date_released: DateTime<Utc>,
    pub deadline: DateTime<Utc>,
    #[serde(skip_serializing)]
    pub current: bool,
}

// #[derive(Serialize, Deserialize, sqlx::Type)]
// struct LangBoilerplate {
//     python: String,
//     javascript: String,
//     java: String,
//     cpp: String
// }