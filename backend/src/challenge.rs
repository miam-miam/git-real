use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, sqlx::Type)]
pub struct Challenge {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub example_input: String,
    pub example_output: String,
    pub date_released: DateTime<Utc>,
    pub deadline: DateTime<Utc>,
    pub current: bool,
}

// #[derive(Serialize, Deserialize, sqlx::Type)]
// struct LangBoilerplate {
//     python: String,
//     javascript: String,
//     java: String,
//     cpp: String
// }