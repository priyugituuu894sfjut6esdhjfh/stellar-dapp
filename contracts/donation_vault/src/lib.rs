#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, String, Symbol};

#[contract]
pub struct DonationVault;

#[contractimpl]
impl DonationVault {
    /// Record a donation
    pub fn record_donation(env: Env, donor: Address, amount: i128, message: String) -> bool {
        donor.require_auth();

        assert!(amount > 0, "Donation amount must be positive");

        let key = (donor.clone(), env.ledger().sequence());
        env.storage().persistent().set(&key, &(amount, message));

        env.events().publish((Symbol::new(&env, "donation"),), (donor, amount));

        true
    }

    /// Get total donations received by the contract
    pub fn get_total_donations(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&Symbol::new(&env, "total"))
            .unwrap_or(0)
    }

    /// Get the contract owner
    pub fn version(_env: Env) -> u32 {
        1
    }
}
