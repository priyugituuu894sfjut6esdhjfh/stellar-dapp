use anyhow::Result;
use reqwest::Client;
use serde_json::Value;

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
        let _body = serde_json::json!({
            "tx": signed_xdr
        });
        let resp: Value = self.http
            .post(&url)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(format!("tx={}", signed_xdr))
            .send()
            .await?
            .json()
            .await?;
        Ok(resp)
    }

    pub async fn simulate_contract(
        &self,
        contract_address: &str,
        method: &str,
        args: &Option<Vec<Value>>,
        source: &str,
    ) -> Result<Value> {
        let mut auths = vec![];
        if !source.is_empty() {
            auths.push(serde_json::json!({
                "address": source
            }));
        }

        let mut contract_args = vec![];
        if let Some(args) = args {
            contract_args = args.clone();
        }

        let body = serde_json::json!({
            "transactions": [{
                "source": source,
                "auths": auths,
                "operations": [{
                    "invoke": {
                        "contract_address": contract_address,
                        "method": method,
                        "args": contract_args
                    }
                }]
            }]
        });

        let url = format!("{}/soroban/rpc", self.soroban_url);
        let resp: Value = self.http
            .post(&url)
            .json(&body)
            .send()
            .await?
            .json()
            .await?;
        Ok(resp)
    }

    pub async fn request_airdrop(&self, address: &str) -> Result<Value> {
        let url = format!("{}/accounts/{}/friendbot", self.horizon_url, address);
        let resp: Value = self.http.post(&url).send().await?.json().await?;
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
