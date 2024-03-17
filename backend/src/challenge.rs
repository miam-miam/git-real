use crate::executor::{Function, Language};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::types::Json;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct DbChallenge {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    #[sqlx(json)]
    pub function: Function,
    pub date_released: DateTime<Utc>,
    pub deadline: DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct ReqChallenge {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub example_input: String,
    pub example_output: String,
    pub boilerplate: HashMap<Language, String>,
    pub default_language: Language,
    pub date_released: DateTime<Utc>,
    pub deadline: DateTime<Utc>,
}
