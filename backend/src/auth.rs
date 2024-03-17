use crate::executor::Language;
use crate::state::AppState;
use actix_identity::Identity;
use actix_session::Session;
use actix_web::http::header;
use actix_web::web::Redirect;
use actix_web::{web, HttpMessage, HttpRequest, HttpResponse, Responder, Scope};
use oauth2::reqwest::async_http_client;
use oauth2::Scope as OAuthScope;
use oauth2::{AccessToken, AuthorizationCode, CsrfToken, PkceCodeChallenge, TokenResponse};
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
    pub id: i64,
    pub name: Option<String>,
    #[serde(rename(deserialize = "login"))]
    pub username: String,
    pub avatar_url: String,
    #[serde(default)]
    pub default_language: Language,
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
    request: HttpRequest,
    data: web::Data<AppState>,
    params: web::Query<AuthRequest>,
) -> impl Responder {
    let code = AuthorizationCode::new(params.code.clone());
    let _state = CsrfToken::new(params.state.clone());

    // Exchange the code with a token.
    let token = &data
        .oauth
        .exchange_code(code)
        .request_async(async_http_client)
        .await
        .expect("exchange_code failed");

    let user_info = read_user(token.access_token()).await.unwrap();

    data.add_or_update_user(&user_info).await.unwrap();

    Identity::login(&request.extensions(), user_info.id.to_string()).unwrap();

    let env = std::env::var("FRONTEND_REDIRECT_URL").unwrap();

    Redirect::to(env)
    // HttpResponse::Ok().body(format!("github done! {env}"))
}
pub async fn logout(identity: Identity) -> impl Responder {
    identity.logout();
    HttpResponse::Ok().body("Logged out")
}
