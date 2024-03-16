use actix_web::{Responder, HttpResponse, Scope, web, get, post, App};
use actix_web::web::{Data, Json, Path};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::commit::Commit;
use crate::state::AppState;

pub fn api_routes() -> Scope {
    web::scope("/api")
        .service(hello)

}

#[get("/")]
async fn hello() -> HttpResponse {
    HttpResponse::Ok().json("Hello from the GitReal Rust server 🚀!")
}

#[get("/challenge")]
async fn get_challenge(db: Data<AppState>) -> HttpResponse {
    todo!()
}

#[post("/commit")]
async fn submit_commit(db: Data<AppState>, new_commit: Json<Commit>) -> HttpResponse {
    let data = Commit {
        commit_id: 0, // TODO change
        username: new_commit.username.to_owned(),
        date: Utc::now(),
        title: new_commit.title.to_owned(),
        solution: new_commit.solution.to_owned(),
    };
    match db.add_commit(data.clone()).await {
        Ok(_) => HttpResponse::Ok().json(data), // TODO CHANGE THIS
        Err(err) => HttpResponse::InternalServerError().body(err),
    }
}

#[get("/commit/{id}")]
async fn get_commit(db: Data<AppState>, commit_id: Path<String>) -> HttpResponse {
    todo!()
}

#[get("/user/{id}")]
async fn get_user(db: Data<AppState>, user_id: Path<String>) -> HttpResponse {
    todo!()
}

#[get("/solutions")]
async fn get_solutions(db: Data<AppState>) -> HttpResponse {
    todo!()
}




