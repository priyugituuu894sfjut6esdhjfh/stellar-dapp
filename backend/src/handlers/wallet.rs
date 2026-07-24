use axum::extract::{Path, State};
use axum::Json;
use serde_json::json;

use crate::errors::AppError;
use crate::AppState;

pub async fn get_history(
    State(state): State<AppState>,
    Path(address): Path<String>,
) -> Result<Json<serde_json::Value>, AppError> {
    if address.len() != 56 || !address.starts_with('G') {
        return Err(AppError::ValidationError(
            "Invalid Stellar public key".into(),
        ));
    }

    let txs = state
        .stellar
        .get_transactions(&address, 20)
        .await
        .map_err(|e| AppError::NetworkError(e.to_string()))?;

    let records: Vec<serde_json::Value> = txs
        .iter()
        .map(|tx| {
            json!({
                "hash": tx["hash"],
                "memo": tx.get("memo"),
                "source": tx["source_account"],
                "successful": tx["successful"],
                "created_at": tx["created_at"],
                "fee_charged": tx["fee_charged"],
                "operation_count": tx["operation_count"]
            })
        })
        .collect();

    Ok(Json(json!({
        "success": true,
        "data": records
    })))
}
