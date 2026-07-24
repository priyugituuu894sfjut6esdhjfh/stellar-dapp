use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Wallet not found: {0}")]
    WalletNotFound(String),

    #[error("Insufficient balance: {0}")]
    InsufficientBalance(String),

    #[error("Invalid transaction: {0}")]
    InvalidTransaction(String),

    #[error("Transaction rejected: {0}")]
    TransactionRejected(String),

    #[error("Contract error: {0}")]
    ContractError(String),

    #[error("Network error: {0}")]
    NetworkError(String),

    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("Internal error: {0}")]
    Internal(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_code, message) = match &self {
            AppError::WalletNotFound(msg) => (StatusCode::NOT_FOUND, "WALLET_NOT_FOUND", msg.clone()),
            AppError::InsufficientBalance(msg) => (StatusCode::BAD_REQUEST, "INSUFFICIENT_BALANCE", msg.clone()),
            AppError::InvalidTransaction(msg) => (StatusCode::BAD_REQUEST, "INVALID_TRANSACTION", msg.clone()),
            AppError::TransactionRejected(msg) => (StatusCode::FORBIDDEN, "TRANSACTION_REJECTED", msg.clone()),
            AppError::ContractError(msg) => (StatusCode::BAD_REQUEST, "CONTRACT_ERROR", msg.clone()),
            AppError::NetworkError(msg) => (StatusCode::BAD_GATEWAY, "NETWORK_ERROR", msg.clone()),
            AppError::ValidationError(msg) => (StatusCode::UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", msg.clone()),
            AppError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", msg.clone()),
        };

        let body = json!({
            "success": false,
            "error": {
                "code": error_code,
                "message": message
            }
        });

        (status, Json(body)).into_response()
    }
}

pub async fn error_middleware(
    req: axum::http::Request<axum::body::Body>,
    next: axum::middleware::Next,
) -> Result<impl IntoResponse, AppError> {
    let response = next.run(req).await;
    Ok(response)
}
