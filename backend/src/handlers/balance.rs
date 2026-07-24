use axum::extract::{Path, State};
use axum::Json;
use serde_json::json;

use crate::errors::AppError;
use crate::AppState;

pub async fn get_balance(
    State(state): State<AppState>,
    Path(address): Path<String>,
) -> Result<Json<serde_json::Value>, AppError> {
    if address.len() != 56 || !address.starts_with('G') {
        return Err(AppError::ValidationError(
            "Invalid Stellar public key".into(),
        ));
    }

    let balance = state
        .stellar
        .get_native_balance(&address)
        .await
        .map_err(|e| AppError::NetworkError(e.to_string()))?;

    Ok(Json(json!({
        "success": true,
        "data": {
            "address": address,
            "balance": balance,
            "asset": "XLM"
        }
    })))
}

pub async fn get_balances(
    State(state): State<AppState>,
    Path(address): Path<String>,
) -> Result<Json<serde_json::Value>, AppError> {
    if address.len() != 56 || !address.starts_with('G') {
        return Err(AppError::ValidationError(
            "Invalid Stellar public key".into(),
        ));
    }

    let balances = state
        .stellar
        .get_account_balances(&address)
        .await
        .map_err(|e| AppError::NetworkError(e.to_string()))?;

    let formatted: Vec<serde_json::Value> = balances
        .iter()
        .map(|b| {
            let asset = if b["asset_type"] == "native" {
                "XLM".to_string()
            } else {
                format!(
                    "{}:{}",
                    b["asset_code"].as_str().unwrap_or(""),
                    b["asset_issuer"].as_str().unwrap_or("")
                )
            };
            json!({
                "asset": asset,
                "balance": b["balance"],
                "asset_type": b["asset_type"],
                "issuer": b.get("asset_issuer").and_then(|v| v.as_str()).map(String::from)
            })
        })
        .collect();

    Ok(Json(json!({
        "success": true,
        "data": {
            "address": address,
            "balances": formatted
        }
    })))
}
