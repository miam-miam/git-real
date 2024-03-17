use crate::auth::UserInfo;
use crate::challenge::DbChallenge;
use crate::commit::{ReqCommit, ResCommit};
use chrono::Utc;
use oauth2::basic::BasicClient;
use sqlx::error::Error;
use sqlx::{Pool, Postgres};
use uuid::Uuid;

#[derive(Clone)]
pub struct AppState {
    pub oauth: BasicClient,
    pub db: Pool<Postgres>,
}

impl AppState {
    pub fn new(oauth: BasicClient, db: Pool<Postgres>) -> Self {
        AppState { oauth, db }
    }

    pub async fn get_current_challenge(&self) -> Result<DbChallenge, Error> {
        let result: DbChallenge = sqlx::query_as!(
            DbChallenge,
            "SELECT * FROM public.challenges WHERE date_released <= $1 AND deadline >= $1",
            Utc::now()
        )
        .fetch_one(&self.db)
        .await?;

        Ok(result)
    }

    pub async fn get_commit_by_id(&self, commit_id: i32) -> Result<ResCommit, Error> {
        let result: ResCommit = sqlx::query_as!(
            ResCommit,
            "SELECT * FROM public.commits WHERE id = $1",
            commit_id
        )
        .fetch_one(&self.db)
        .await?;

        Ok(result)
    }

    pub async fn get_user(&self, username: &str) -> Result<UserInfo, Error> {
        let result: UserInfo = sqlx::query_as!(
            UserInfo,
            "SELECT * FROM public.users WHERE username=$1",
            username
        )
        .fetch_one(&self.db)
        .await?;

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

    pub async fn add_commit(&self, commit: ResCommit) -> Result<ResCommit, Error> {
        let result = sqlx::query!(
            "INSERT INTO commits (commit_hash, user_id, date, title, solution, is_valid, language, description, challenge_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            commit.commit_hash,
            commit.user_id,
            commit.date,
            commit.title,
            commit.solution,
            commit.is_valid,
            commit.language as i32,
            commit.description,
            commit.challenge_id
        )
            .execute(&self.db)
            .await?;

        self.get_commit_by_id(commit.id).await
    }

    pub async fn get_past_challenge_by_id(&self, id: i32) -> Result<DbChallenge, Error> {
        let result: DbChallenge = sqlx::query_as!(
            DbChallenge,
            "SELECT * FROM public.challenges WHERE id=$1",
            id
        )
        .fetch_one(&self.db)
        .await?;

        Ok(result)
    }

    pub async fn get_past_challenges(&self) -> Result<Vec<DbChallenge>, Error> {
        let result = sqlx::query_as!(
            DbChallenge,
            "SELECT * FROM public.challenges ORDER BY deadline DESC LIMIT 10"
        )
        .fetch_all(&self.db)
        .await?;
        Ok(result)
    }

    pub async fn get_past_challenge_commits(
        &self,
        challenge_id: i32,
    ) -> Result<Vec<ResCommit>, Error> {
        let result = sqlx::query_as!(
            ResCommit,
            "SELECT * FROM public.commits WHERE challenge_id = $1 ORDER BY date DESC",
            challenge_id
        )
        .fetch_all(&self.db)
        .await?;
        Ok(result)
    }
}
