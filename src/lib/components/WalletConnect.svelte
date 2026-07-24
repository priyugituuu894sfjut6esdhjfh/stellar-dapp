<script lang="ts">
	import {
		isConnected,
		isLoading,
		error,
		walletInstalled,
		shortAddress,
		connect,
		disconnect,
		availableWallets,
		connectedWalletName,
		clearError
	} from '$lib/stores/wallet';
	import { onMount } from 'svelte';
	import { initializeWallet } from '$lib/stores/wallet';

	let showModal = $state(false);

	onMount(() => {
		initializeWallet();
	});

	function handleConnect(walletId: string) {
		showModal = false;
		connect(walletId);
	}
</script>

<div class="wallet-connect">
	{#if $isLoading}
		<button class="btn-loading" disabled aria-label="Connecting">
			<span class="spinner"></span>
			Connecting...
		</button>
	{:else if $isConnected}
		<div class="wallet-info">
			<span class="wallet-badge">{$connectedWalletName}</span>
			<span class="address">{$shortAddress}</span>
			<button class="btn-disconnect" onclick={disconnect}>Disconnect</button>
		</div>
	{:else}
		<button class="btn-connect" data-wallet-btn onclick={() => (showModal = true)}>
			Connect Wallet
		</button>
	{/if}

	{#if $error}
		<div class="error-banner">
			<span class="error-text">{$error}</span>
			<button class="error-dismiss" onclick={clearError}>&times;</button>
		</div>
	{/if}
</div>

{#if showModal}
	<div class="modal-overlay" role="presentation" onclick={() => (showModal = false)} onkeydown={(e) => e.key === 'Escape' && (showModal = false)}>
		<div class="modal" role="dialog" aria-label="Select wallet" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} tabindex="-1">
			<div class="modal-header">
				<h3>Connect a wallet</h3>
				<button class="modal-close" onclick={() => (showModal = false)}>&times;</button>
			</div>

			<div class="wallet-list">
				{#each $availableWallets as wallet}
					<button
						class="wallet-option"
						class:unavailable={!wallet.isAvailable}
						disabled={!wallet.isAvailable}
						onclick={() => handleConnect(wallet.id)}
					>
						<img class="wallet-icon" src={wallet.icon} alt={wallet.name} width="32" height="32" />
						<div class="wallet-details">
							<span class="wallet-name">{wallet.name}</span>
							<span class="wallet-type">
								{#if wallet.isAvailable}
									Installed
								{:else}
									Not installed
								{/if}
							</span>
						</div>
						{#if !wallet.isAvailable}
							<a
								class="install-link"
								href="https://www.google.com/search?q={wallet.name}+stellar+wallet+extension"
								target="_blank"
								rel="noopener noreferrer"
								onclick={(e) => e.stopPropagation()}
							>
								Install
							</a>
						{/if}
					</button>
				{/each}

				{#if $availableWallets.length === 0}
					<div class="empty-state">
						<p>No wallets detected. Install a Stellar wallet extension to get started.</p>
						<a
							class="btn-primary-sm"
							href="https://freighter.app/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Install Freighter
						</a>
					</div>
				{/if}
			</div>

			<div class="modal-footer">
				<a href="https://stellarwalletskit.dev/" target="_blank" rel="noopener noreferrer" class="footer-link">
					Learn about supported wallets
				</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.wallet-connect {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.wallet-info {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.wallet-badge {
		font-size: 12px;
		font-weight: 600;
		color: #0052FF;
		background: #EFF6FF;
		padding: 4px 10px;
		border-radius: 100px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.address {
		font-size: 14px;
		font-weight: 500;
		font-family: 'Inter', monospace;
		color: #6B7280;
		background: #F2F2F7;
		padding: 6px 14px;
		border-radius: 100px;
	}

	.btn-connect {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		padding: 0 20px;
		border-radius: 100px;
		background: #0052FF;
		color: #FFFFFF;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.01em;
		border: none;
		cursor: pointer;
		transition: background 0.15s;
		text-decoration: none;
	}

	.btn-connect:hover {
		background: #578BFA;
	}

	.btn-disconnect {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		padding: 0 20px;
		border-radius: 100px;
		background: transparent;
		color: #6B7280;
		font-size: 14px;
		font-weight: 500;
		border: 1px solid #E5E5E5;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}

	.btn-disconnect:hover {
		background: #F2F2F7;
		color: #0A0B0D;
	}

	.btn-loading {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 40px;
		padding: 0 20px;
		border-radius: 100px;
		background: #F2F2F7;
		color: #9CA3AF;
		font-size: 14px;
		font-weight: 500;
		border: none;
		cursor: wait;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid #E5E5E5;
		border-top-color: #0052FF;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.error-banner {
		background: #FEF2F2;
		color: #DC2626;
		padding: 8px 12px;
		border-radius: 12px;
		font-size: 13px;
		font-weight: 500;
		border: 1px solid #FECACA;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.error-dismiss {
		background: none;
		border: none;
		color: #DC2626;
		font-size: 18px;
		cursor: pointer;
		padding: 0;
		line-height: 1;
		opacity: 0.6;
	}

	.error-dismiss:hover {
		opacity: 1;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 24px;
	}

	.modal {
		background: #FFFFFF;
		border-radius: 16px;
		width: 100%;
		max-width: 420px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		border: 1px solid #E5E5E5;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px;
		border-bottom: 1px solid #E5E5E5;
	}

	.modal-header h3 {
		font-size: 18px;
		font-weight: 600;
		color: #0A0B0D;
	}

	.modal-close {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		border: none;
		background: #F2F2F7;
		color: #6B7280;
		font-size: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;
	}

	.modal-close:hover {
		background: #E5E5E5;
	}

	.wallet-list {
		overflow-y: auto;
		padding: 8px;
	}

	.wallet-option {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 16px;
		border-radius: 12px;
		border: 1px solid transparent;
		background: transparent;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		text-align: left;
	}

	.wallet-option:hover:not(:disabled) {
		background: #F2F2F7;
		border-color: #E5E5E5;
	}

	.wallet-option.unavailable {
		opacity: 0.5;
	}

	.wallet-option:disabled {
		cursor: not-allowed;
	}

	.wallet-icon {
		border-radius: 8px;
		flex-shrink: 0;
	}

	.wallet-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.wallet-name {
		font-size: 15px;
		font-weight: 600;
		color: #0A0B0D;
	}

	.wallet-type {
		font-size: 13px;
		color: #9CA3AF;
	}

	.install-link {
		font-size: 13px;
		font-weight: 600;
		color: #0052FF;
		text-decoration: none;
		padding: 4px 12px;
		border-radius: 100px;
		transition: background 0.15s;
	}

	.install-link:hover {
		background: #EFF6FF;
	}

	.empty-state {
		padding: 40px 24px;
		text-align: center;
	}

	.empty-state p {
		font-size: 14px;
		color: #6B7280;
		margin-bottom: 16px;
		line-height: 1.5;
	}

	.btn-primary-sm {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		padding: 0 20px;
		border-radius: 100px;
		background: #0052FF;
		color: #FFFFFF;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		transition: background 0.15s;
	}

	.btn-primary-sm:hover {
		background: #578BFA;
	}

	.modal-footer {
		padding: 16px 24px;
		border-top: 1px solid #E5E5E5;
		text-align: center;
	}

	.footer-link {
		font-size: 13px;
		color: #6B7280;
		text-decoration: none;
		transition: color 0.15s;
	}

	.footer-link:hover {
		color: #0052FF;
	}
</style>
