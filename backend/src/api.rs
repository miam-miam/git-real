use crate::commit::Commit;
use crate::state::AppState;
use actix_identity::Identity;
use actix_web::web::{Data, Json, Path};
use actix_web::{get, post, web, HttpResponse, Scope};
use chrono::Utc;

pub fn api_routes() -> Scope {
    web::scope("/api")
        .service(hello)
        .service(get_current_challenge)
        .service(submit_commit)
        .service(get_commit_by_id)
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

#[post("/commit")]
async fn submit_commit(db: Data<AppState>, new_commit: Json<Commit>) -> HttpResponse {
    let data = Commit {
        id: 0,
        commit_id: 0, // TODO change
        username: new_commit.username.to_owned(),
        date: Utc::now(),
        title: new_commit.title.to_owned(),
        solution: new_commit.solution.to_owned(),
        is_valid: None,
    };

    // call Alec's API
    // data.is_valid = validate(commit)

    match db.add_commit(data).await {
        Ok(_) => HttpResponse::Ok().finish(), // TODO CHANGE THIS
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/commit/{id}")]
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

    match db.get_user(user_id).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/user/{id}")]
async fn get_user(db: Data<AppState>, user_id: Path<i32>) -> HttpResponse {
    todo!()
}

#[get("/solutions")]
async fn get_solutions(db: Data<AppState>) -> HttpResponse {
    todo!()
}
