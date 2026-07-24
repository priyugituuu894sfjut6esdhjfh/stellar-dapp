use axum::extract::State;
use axum::Json;

use crate::AppState;

pub async fn health_check(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "ok",
        "network": "testnet",
        "horizon": state.stellar.horizon_url(),
        "soroban": state.stellar.soroban_url()
    }))
}
