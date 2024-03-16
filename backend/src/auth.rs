use actix_session::Session;
use actix_web::{web, HttpResponse, Responder, Scope};
use crate::state::AppState;
use actix_web::http::header;
use oauth2::{AccessToken, AuthorizationCode, CsrfToken, PkceCodeChallenge, TokenResponse};
use oauth2::reqwest::async_http_client;
use oauth2::Scope as OAuthScope;
use serde::{Deserialize, Serialize};

pub fn auth_routes() -> Scope {
    web::scope("/auth")
        .route("/login", web::get().to(login))
        .route(
            "/github_oauth_redirect",
            web::get().to(github_oauth_redirect),
        )
        .route("/logout", web::post().to(logout))
}

#[derive(Deserialize, Serialize, Debug)]
pub struct UserInfo {
    id: u64,
    name: Option<String>,
    #[serde(rename(deserialize = "login"))]
    username: String,
    avatar_url: String,
}

async fn read_user(access_token: &AccessToken) -> anyhow::Result<UserInfo> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://api.github.com/user")
        .bearer_auth(access_token.secret())
        .header("User-Agent", "git-real")
        .send()
        .await?;


    Ok(response.json().await?)
}

async fn login(data: web::Data<AppState>) -> HttpResponse {
    // Create a PKCE code verifier and SHA-256 encode it as a code challenge.
    let (pkce_code_challenge, _pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();
    // Generate the authorization URL to which we'll redirect the user.
    let (auth_url, _csrf_token) = &data
        .oauth
        .authorize_url(CsrfToken::new_random)
        // Set the desired scopes.
        .add_scope(OAuthScope::new("read_user".to_string()))
        // Set the PKCE code challenge.
        .set_pkce_challenge(pkce_code_challenge)
        .url();

    HttpResponse::Found()
        .append_header((header::LOCATION, auth_url.to_string()))
        .finish()
}



#[derive(Deserialize)]
struct AuthRequest {
    code: String,
    state: String,
}

async fn github_oauth_redirect(
    session: Session,
    data: web::Data<AppState>,
    params: web::Query<AuthRequest>,
) -> HttpResponse {
    let code = AuthorizationCode::new(params.code.clone());
    let _state = CsrfToken::new(params.state.clone());

    // Exchange the code with a token.
    let token = &data
        .oauth
        .exchange_code(code)
        .request_async(async_http_client).await
        .expect("exchange_code failed");

    let user_info = read_user(token.access_token()).await.unwrap();

    session.insert("login", user_info.username.clone()).unwrap();

    HttpResponse::Ok().json(user_info)
}
pub async fn logout(session: Session) -> impl Responder {
    session.purge();
    HttpResponse::Ok().body("Logged out")
}