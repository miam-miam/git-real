use crate::auth::UserInfo;
use crate::challenge::Challenge;
use crate::commit::Commit;
use oauth2::basic::BasicClient;
use sqlx::error::Error;
use uuid::Uuid;
use crate::auth::UserInfo;
use sqlx::{Pool, Postgres};

#[derive(Clone)]
pub struct AppState {
    pub oauth: BasicClient,
    pub db: Pool<Postgres>,
}

impl AppState {
    pub fn new(oauth: BasicClient, db: Pool<Postgres>) -> Self {
        AppState { oauth, db }
    }

    pub async fn get_current_challenge(&self) -> Result<Challenge, Error> {
        let result: Challenge = sqlx::query_as!(
            Challenge,
            "SELECT * FROM public.challenges WHERE current=true"
        )
        .fetch_one(&self.db)
        .await?;

        Ok(result)
    }

    pub async fn get_commit_by_id(&self, commit_id: i32) -> Result<Commit, Error> {
        let result: Commit = sqlx::query_as!(
            Commit,
            "SELECT * FROM public.commits WHERE commit_id = $1",
            commit_id
        )
        .fetch_one(&self.db)
        .await?;

        Ok(result)
    }

    pub async fn get_all_commits(&self) -> Result<Vec<Commit>, Error> {
        let result: Vec<Commit> = sqlx::query_as!(
            Commit,
            "SELECT * FROM public.commits"
        ).fetch_all(&self.db).await?;

        Ok(result)
    }

    pub async fn get_user(&self, username: &str) -> Result<UserInfo, Error> {
        let result: UserInfo = sqlx::query_as!(
            UserInfo,
            "SELECT * FROM public.users WHERE username=$1", username
        ).fetch_one(&self.db).await?;

        Ok(result)
    }

    pub async fn add_or_update_user(&self, user: &UserInfo) -> anyhow::Result<bool> {
        let res = sqlx::query!(
            "INSERT INTO users (id, name, username, avatar_url) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
            user.id,
            user.name,
            user.username,
            user.avatar_url
        )
            .execute(&self.db)
            .await?;

        Ok(res.rows_affected() > 0)
    }

    pub async fn get_user_by_id(&self, user_id: i64) -> anyhow::Result<UserInfo> {
        let user = sqlx::query_as!(UserInfo, "SELECT * FROM users WHERE id = $1", user_id)
            .fetch_one(&self.db)
            .await?;
        Ok(user)
    }

    pub async fn add_commit(&self, commit: Commit) -> Result<Commit, Error> {
        let commit_id = commit.commit_id;

        let result = sqlx::query!(
            "INSERT INTO commits (commit_id, username, date, title, solution, is_valid) VALUES ($1, $2, $3, $4, $5, $6)",
            commit.commit_id,
            commit.username,
            commit.date,
            commit.title,
            commit.solution,
            commit.is_valid.unwrap_or(false),
        )
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
        self.get_commit_by_id(commit_id).await
    }

    pub async fn get_past_challenge_by_id(&self, challenge_id: Uuid) -> Result<Challenge, Error> {
        let result: Challenge = sqlx::query_as!(
            Challenge,
            "SELECT * FROM public.challenges WHERE challenge_id=$1", challenge_id
        ).fetch_one(&self.db).await?;

        Ok(result)
    }

    pub async fn get_past_challenges(&self) -> Result<Vec<Challenge>, Error> {
        todo!()
    }

    pub async fn get_past_challenge_commits(&self, challenge_id: Uuid) -> Result<Vec<Challenge>, Error> {
        todo!()
    }
}
