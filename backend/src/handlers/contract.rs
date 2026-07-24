use axum::extract::State;
use axum::Json;
use serde::Deserialize;
use serde_json::json;

use crate::errors::AppError;
use crate::AppState;

#[derive(Deserialize)]
pub struct SimulateRequest {
    pub contract_address: String,
    pub method: String,
    pub args: Option<Vec<serde_json::Value>>,
    pub source: Option<String>,
}

pub async fn simulate(
    State(state): State<AppState>,
    Json(req): Json<SimulateRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    if req.contract_address.is_empty() {
        return Err(AppError::ValidationError(
            "Contract address is required".into(),
        ));
    }

    if req.method.is_empty() {
        return Err(AppError::ValidationError("Method is required".into()));
    }

    let source = req.source.unwrap_or_default();

    let result = state
        .stellar
        .simulate_contract(
            &req.contract_address,
            &req.method,
            &req.args,
            &source,
        )
        .await
        .map_err(|e| AppError::ContractError(e.to_string()))?;

    Ok(Json(json!({
        "success": true,
        "data": result
    })))
}

#[derive(Deserialize)]
pub struct CallContractRequest {
    pub signed_xdr: String,
}

pub async fn call_contract(
    State(state): State<AppState>,
    Json(req): Json<CallContractRequest>,
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
        return Err(AppError::ContractError(
            result["extras"]["result_codes"].to_string(),
        ));
    }

    Ok(Json(json!({
        "success": true,
        "data": {
            "hash": result["hash"],
            "ledger": result["ledger"],
            "result": result["result"]
        }
    })))
}
