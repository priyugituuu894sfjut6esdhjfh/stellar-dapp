use anyhow::Result;
use reqwest::Client;
use serde_json::Value;
use urlencoding::encode;

pub struct StellarClient {
    http: Client,
    horizon_url: String,
    soroban_url: String,
    network_passphrase: String,
}

impl StellarClient {
    pub fn new(horizon_url: &str, soroban_url: &str, network_passphrase: &str) -> Self {
        Self {
            http: Client::new(),
            horizon_url: horizon_url.trim_end_matches('/').to_string(),
            soroban_url: soroban_url.trim_end_matches('/').to_string(),
            network_passphrase: network_passphrase.to_string(),
        }
    }

    pub async fn get_account(&self, address: &str) -> Result<Value> {
        let url = format!("{}/accounts/{}", self.horizon_url, address);
        let resp = self.http.get(&url).send().await?.json().await?;
        Ok(resp)
    }

    pub async fn get_account_balances(&self, address: &str) -> Result<Vec<Value>> {
        let account = self.get_account(address).await?;
        let balances = account["balances"]
            .as_array()
            .cloned()
            .unwrap_or_default();
        Ok(balances)
    }

    pub async fn get_native_balance(&self, address: &str) -> Result<String> {
        let balances = self.get_account_balances(address).await?;
        for b in &balances {
            if b["asset_type"] == "native" {
                return Ok(b["balance"]
                    .as_str()
                    .unwrap_or("0")
                    .to_string());
            }
        }
        Ok("0".to_string())
    }

    pub async fn get_transactions(
        &self,
        address: &str,
        limit: u32,
    ) -> Result<Vec<Value>> {
        let url = format!(
            "{}/accounts/{}/transactions?order=desc&limit={}",
            self.horizon_url, address, limit
        );
        let resp: Value = self.http.get(&url).send().await?.json().await?;
        Ok(resp["_embedded"]["records"]
            .as_array()
            .cloned()
            .unwrap_or_default())
    }

    pub async fn submit_transaction_xdr(&self, signed_xdr: &str) -> Result<Value> {
        let url = format!("{}/transactions", self.horizon_url);
        let encoded = encode(signed_xdr);
        let resp: Value = self.http
            .post(&url)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(format!("tx={}", encoded))
            .send()
            .await?
            .json()
            .await?;
        Ok(resp)
    }

    pub async fn simulate_xdr(&self, xdr: &str) -> Result<Value> {
        let body = serde_json::json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "simulateTransaction",
            "params": [xdr]
        });

        let url = format!("{}/soroban/rpc", self.soroban_url);
        let resp: Value = self.http
            .post(&url)
            .header("Content-Type", "application/json")
            .json(&body)
            .send()
            .await?
            .json()
            .await?;
        Ok(resp)
    }

    pub async fn request_airdrop(&self, address: &str) -> Result<Value> {
        let url = format!("{}/friendbot?addr={}", self.horizon_url, address);
        let resp = self.http.get(&url).send().await?.json().await?;
        Ok(resp)
    }

    pub fn network_passphrase(&self) -> &str {
        &self.network_passphrase
    }

    pub fn horizon_url(&self) -> &str {
        &self.horizon_url
    }

    pub fn soroban_url(&self) -> &str {
        &self.soroban_url
    }
}
