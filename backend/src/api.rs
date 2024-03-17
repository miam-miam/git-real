use crate::commit::ReqCommit;
use crate::state::AppState;
use actix_identity::Identity;
use actix_web::web::{Data, Json, Path};
use actix_web::{get, post, web, App, HttpResponse, Responder, Scope};
use chrono::{DateTime, Utc};
use oauth2::reqwest::Error::Http;
use std::sync::mpsc::channel;
use uuid::Uuid;

pub fn api_routes() -> Scope {
    web::scope("/api")
        .service(hello)
        .service(get_current_challenge)
        .service(submit_commit)
        .service(get_commit_by_id)
        .service(get_all_commits)
        .service(get_user)
        .service(current_user)
}

#[get("/")]
async fn hello() -> HttpResponse {
    HttpResponse::Ok().json("Hello from the GitReal Rust server 🚀!")
}

#[get("/challenge")]
async fn get_current_challenge(db: Data<AppState>) -> HttpResponse {
    let data = db.get_current_challenge().await;
    match data {
        Ok(challenge) => HttpResponse::Ok().json(challenge),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[post("/commits")]
async fn submit_commit(db: Data<AppState>, new_commit: Json<ReqCommit>) -> HttpResponse {
    // call Alec's API
    // data.is_valid = validate(commit)

    // match db.add_commit(data).await {
    //     Ok(commit) => HttpResponse::Ok().json(commit),
    //     Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    // }
    todo!()
}

#[get("/commits/{id}")]
async fn get_commit_by_id(db: Data<AppState>, commit_id: Path<i32>) -> HttpResponse {
    match db.get_commit_by_id(commit_id.into_inner()).await {
        Ok(commit) => HttpResponse::Ok().json(commit),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/me")]
async fn current_user(db: Data<AppState>, identity: Identity) -> HttpResponse {
    let user_id = match identity.id() {
        Ok(user_id) => user_id.parse().unwrap(),
        _ => return HttpResponse::NotFound().body("User id not found."),
    };

    match db.get_user_by_id(user_id).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/commits")]
async fn get_all_commits(db: Data<AppState>) -> HttpResponse {
    match db.get_all_commits().await {
        Ok(commits) => HttpResponse::Ok().json(commits),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/challenges")]
async fn get_challenges(db: Data<AppState>) -> HttpResponse {
    match db.get_past_challenges().await {
        Ok(challenges) => HttpResponse::Ok().json(challenges),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/challenges/{id}")]
async fn get_past_challenge(db: Data<AppState>, challenge_id: Path<i32>) -> HttpResponse {
    match db.get_past_challenge_by_id(challenge_id.into_inner()).await {
        Ok(challenge) => HttpResponse::Ok().json(challenge),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/challenges/{id}/commits")]
async fn get_past_challenge_commits(db: Data<AppState>, challenge_id: Path<Uuid>) -> HttpResponse {
    match db
        .get_past_challenge_commits(challenge_id.into_inner())
        .await
    {
        Ok(commits) => HttpResponse::Ok().json(commits),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/user/{id}")]
async fn get_user(db: Data<AppState>, username: Path<String>) -> HttpResponse {
    match db.get_user(&username.into_inner()).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
