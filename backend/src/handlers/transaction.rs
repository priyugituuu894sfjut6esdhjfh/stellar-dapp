use axum::extract::State;
use axum::Json;
use serde::Deserialize;
use serde_json::json;

use crate::errors::AppError;
use crate::AppState;

#[derive(Deserialize)]
pub struct ValidateRequest {
    pub source: String,
    pub destination: String,
    pub amount: String,
}

pub async fn validate(
    State(_state): State<AppState>,
    Json(req): Json<ValidateRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    if req.source.len() != 56 || !req.source.starts_with('G') {
        return Err(AppError::ValidationError("Invalid source address".into()));
    }

    if req.destination.len() != 56 || !req.destination.starts_with('G') {
        return Err(AppError::ValidationError(
            "Invalid destination address".into(),
        ));
    }

    if req.source == req.destination {
        return Err(AppError::ValidationError(
            "Source and destination cannot be the same".into(),
        ));
    }

    let amount: f64 = req
        .amount
        .parse()
        .map_err(|_| AppError::ValidationError("Invalid amount format".into()))?;

    if amount <= 0.0 {
        return Err(AppError::ValidationError(
            "Amount must be greater than zero".into(),
        ));
    }

    if amount > 1_000_000_000.0 {
        return Err(AppError::ValidationError(
            "Amount exceeds maximum allowed".into(),
        ));
    }

    Ok(Json(json!({
        "success": true,
        "data": {
            "valid": true,
            "source": req.source,
            "destination": req.destination,
            "amount": req.amount,
            "message": "Transaction parameters are valid"
        }
    })))
}

#[derive(Deserialize)]
pub struct SubmitRequest {
    pub signed_xdr: String,
}

pub async fn submit(
    State(state): State<AppState>,
    Json(req): Json<SubmitRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    if req.signed_xdr.is_empty() {
        return Err(AppError::InvalidTransaction("Signed XDR is required".into()));
    }

    let result = state
        .stellar
        .submit_transaction_xdr(&req.signed_xdr)
        .await
        .map_err(|e| AppError::NetworkError(e.to_string()))?;

    let successful = result["successful"].as_bool().unwrap_or(false);

    if !successful {
        let detail = result["extras"]["result_codes"]
            .to_string();
        return Err(AppError::TransactionRejected(
            format!("Transaction failed: {}", detail),
        ));
    }

    Ok(Json(json!({
        "success": true,
        "data": {
            "hash": result["hash"],
            "ledger": result["ledger"],
            "result_xdr": result["result_xdr"]
        }
    })))
}
