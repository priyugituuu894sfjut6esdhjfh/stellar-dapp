use reqwest;
use serde_json::Value;

const BASE_URL: &str = "http://localhost:3001";

#[tokio::test]
async fn health_check() {
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("{}/health", BASE_URL))
        .send()
        .await;

    if resp.is_err() {
        // Server not running, skip test
        return;
    }

    let resp = resp.unwrap();
    assert_eq!(resp.status(), 200);

    let body: Value = resp.json().await.unwrap();
    assert_eq!(body["status"], "ok");
    assert!(body["network"].as_str().unwrap().len() > 0);
}

#[tokio::test]
async fn invalid_public_key_returns_error() {
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("{}/api/wallet/INVALID/balance", BASE_URL))
        .send()
        .await;

    if resp.is_err() {
        return;
    }

    let resp = resp.unwrap();
    assert!(resp.status().is_client_error());

    let body: Value = resp.json().await.unwrap();
    assert_eq!(body["success"], false);
    assert!(body["error"]["code"].as_str().is_some());
}

#[tokio::test]
async fn validate_transaction_rejects_zero_amount() {
    let client = reqwest::Client::new();
    let resp = client
        .post(format!("{}/api/transaction/validate", BASE_URL))
        .json(&serde_json::json!({
            "source": "GBBM6BKZPEQYOY25YDEF7FTYJYOI5IHTV6KALY6HNTMWHTUOVPQ2BEF",
            "destination": "GBBM6BKZPEQYOY25YDEF7FTYJYOI5IHTV6KALY6HNTMWHTUOVPQ2BEF",
            "amount": "0"
        }))
        .send()
        .await;

    if resp.is_err() {
        return;
    }

    let resp = resp.unwrap();
    assert!(resp.status().is_client_error());
}

#[tokio::test]
async fn validate_transaction_rejects_invalid_address() {
    let client = reqwest::Client::new();
    let resp = client
        .post(format!("{}/api/transaction/validate", BASE_URL))
        .json(&serde_json::json!({
            "source": "invalid",
            "destination": "GBBM6BKZPEQYOY25YDEF7FTYJYOI5IHTV6KALY6HNTMWHTUOVPQ2BEF",
            "amount": "10"
        }))
        .send()
        .await;

    if resp.is_err() {
        return;
    }

    let resp = resp.unwrap();
    assert!(resp.status().is_client_error());

    let body: Value = resp.json().await.unwrap();
    assert_eq!(body["success"], false);
}
