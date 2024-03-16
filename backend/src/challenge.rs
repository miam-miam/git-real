use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Challenge {
    challenge_id: u64,
    title: String,
    description: String,
    date_released: DateTime<Utc>
}