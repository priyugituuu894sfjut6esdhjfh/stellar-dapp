use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use serde_json::json;

use crate::errors::AppError;
use crate::AppState;

#[derive(Deserialize)]
pub struct HistoryParams {
    pub limit: Option<u32>,
}

pub async fn get_history(
    State(state): State<AppState>,
    Path(address): Path<String>,
    Query(params): Query<HistoryParams>,
) -> Result<Json<serde_json::Value>, AppError> {
    if address.len() != 56 || !address.starts_with('G') {
        return Err(AppError::ValidationError(
            "Invalid Stellar public key".into(),
        ));
    }

    let limit = params.limit.unwrap_or(20).min(100);

    let txs = state
        .stellar
        .get_transactions(&address, limit)
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
