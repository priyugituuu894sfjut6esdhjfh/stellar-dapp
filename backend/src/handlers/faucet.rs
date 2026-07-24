use axum::extract::{Path, State};
use axum::Json;
use serde_json::json;

use crate::errors::AppError;
use crate::AppState;

pub async fn request_airdrop(
    State(state): State<AppState>,
    Path(address): Path<String>,
) -> Result<Json<serde_json::Value>, AppError> {
    if address.len() != 56 || !address.starts_with('G') {
        return Err(AppError::ValidationError(
            "Invalid Stellar public key".into(),
        ));
    }

    let result = state
        .stellar
        .request_airdrop(&address)
        .await
        .map_err(|e| AppError::NetworkError(format!("Airdrop failed: {}", e)))?;

    let successful = result["successful"].as_bool().unwrap_or(false);
    if !successful {
        let detail = result["detail"]
            .as_str()
            .unwrap_or("Friendbot request failed");
        return Err(AppError::NetworkError(format!("Airdrop failed: {}", detail)));
    }

    let hash = result["hash"]
        .as_str()
        .unwrap_or("unknown")
        .to_string();

    Ok(Json(json!({
        "success": true,
        "data": {
            "hash": hash,
            "message": format!("Testnet XLM airdrop sent to {}", address)
        }
    })))
}
