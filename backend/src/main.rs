use axum::{
    middleware,
    routing::{get, post},
    Router,
};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod errors;
mod handlers;
mod models;
mod stellar;

use handlers::{balance, contract, faucet, health, transaction, wallet};
use stellar::StellarClient;

#[derive(Clone)]
pub struct AppState {
    pub stellar: Arc<StellarClient>,
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| "stellar_backend=debug,tower_http=debug".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let horizon_url = std::env::var("HORIZON_URL")
        .unwrap_or_else(|_| "https://horizon-testnet.stellar.org".to_string());
    let soroban_url = std::env::var("SOROBAN_URL")
        .unwrap_or_else(|_| "https://soroban-testnet.stellar.org".to_string());
    let network_passphrase = std::env::var("NETWORK_PASSPHRASE")
        .unwrap_or_else(|_| "Test SDF Network ; September 2015".to_string());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".to_string());

    let client = StellarClient::new(&horizon_url, &soroban_url, &network_passphrase);
    let state = AppState {
        stellar: Arc::new(client),
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let api = Router::new()
        .route("/health", get(health::health_check))
        .route("/api/wallet/{address}/balance", get(balance::get_balance))
        .route("/api/wallet/{address}/balances", get(balance::get_balances))
        .route("/api/wallet/{address}/transactions", get(wallet::get_history))
        .route("/api/transaction/validate", post(transaction::validate))
        .route("/api/transaction/submit", post(transaction::submit))
        .route("/api/contract/simulate", post(contract::simulate))
        .route("/api/contract/call", post(contract::call_contract))
        .route("/api/faucet/{address}", get(faucet::request_airdrop))
        .layer(middleware::from_fn(errors::error_middleware))
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .unwrap();

    tracing::info!("Stellar backend running on http://0.0.0.0:{port}");

    axum::serve(listener, api).await.unwrap();
}
