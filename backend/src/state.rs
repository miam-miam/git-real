use std::result;
use sqlx::{Executor, Pool, Postgres, Row};
use oauth2::basic::BasicClient;
use crate::challenge::Challenge;
use crate::commit::Commit;
use sqlx::error::Error;

#[derive(Clone)]
pub struct AppState {
    pub oauth: BasicClient,
    pub db: Pool<Postgres>,
}

impl AppState {
    pub fn new(oauth: BasicClient, db: Pool<Postgres>) -> Self {
        AppState {
            oauth,
            db,
        }
    }

    pub async fn get_challenge() -> Challenge {
        todo!()
    }

    pub async fn add_commit(self, commit: Commit) -> Result<Commit, Error> {
        let commit_id = commit.commit_id;

        let result = sqlx::query(
            "INSERT INTO commits (commit_id, username, date, title, solution) VALUES ($1, $2, $3, $4, $5)")
            .bind(commit.commit_id.into())
            .bind(commit.username)
            .bind(commit.date)
            .bind(commit.title)
            .bind(commit.solution)
            .execute(&self.db).await?;

        let commit = sqlx::query_as!(
            Commit,
            "SELECT * FROM commits WHERE commit_id=$1",
            commit_id
        )
            .fetch_one(&self.db)
            .await?;

        Ok(commit.into())
    }
}