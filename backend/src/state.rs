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

    pub async fn get_current_challenge(&self) -> Result<Challenge, Error> {
        let result: Challenge = sqlx::query_as!(
            Challenge,
            "SELECT * FROM public.challenges WHERE current=true"
        ).fetch_one(&self.db).await?;

        Ok(result)
    }

    pub async fn get_commit_by_id(&self, commit_id: i32) -> Result<Commit, Error> {
        let result: Commit = sqlx::query_as!(
            Commit,
            "SELECT * FROM public.commits WHERE commit_id = $1", commit_id
        ).fetch_one(&self.db).await?;

        Ok(result)
    }

    pub async fn add_commit(&self, commit: Commit) -> Result<(), Error> {
        // let commit_id = commit.commit_id;

        let result = sqlx::query(
            "INSERT INTO commits (commit_id, username, date, title, solution) VALUES ($1, $2, $3, $4, $5)")
            .bind("Hello")
            .bind("Hello")
            .bind("Hello")
            .bind("Hello")
            .bind("Hello")
            .execute(&self.db)
            .await?;


        // let commit = sqlx::query_as!(
        //     Commit,
        //     "SELECT * FROM commits WHERE commit_id=?",
        //     commit_id
        // )
        //     .fetch_one(&self.db)
        //     .await?;
        //
        // Ok(commit.into())

        Ok(())
    }
}