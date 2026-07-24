<script lang="ts">
	import {
		isConnected,
		isLoading,
		error,
		walletInstalled,
		shortAddress,
		connect,
		disconnect
	} from '$lib/stores/wallet';
	import { onMount } from 'svelte';
	import { initializeWallet } from '$lib/stores/wallet';

	onMount(() => {
		initializeWallet();
	});
</script>

<div class="wallet-connect">
	{#if $isLoading}
		<button class="btn-loading" disabled aria-label="Connecting">
			<span class="spinner"></span>
		</button>
	{:else if $isConnected}
		<div class="wallet-info">
			<span class="address">{$shortAddress}</span>
			<button class="btn-disconnect" onclick={disconnect}>Disconnect</button>
		</div>
	{:else if $walletInstalled}
		<button class="btn-connect" data-wallet-btn onclick={connect}>Connect wallet</button>
	{:else}
		<a
			class="btn-connect"
			href="https://freighter.app/"
			target="_blank"
			rel="noopener noreferrer"
		>
			Install Freighter
		</a>
	{/if}

	{#if $error}
		<div class="error-banner">{$error}</div>
	{/if}
</div>

<style>
	.wallet-connect {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.wallet-info {
		display: flex;
		align-items: center;
		gap: 12px;
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
		justify-content: center;
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
		width: 16px;
		height: 16px;
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
		padding: 10px 16px;
		border-radius: 12px;
		font-size: 13px;
		font-weight: 500;
		border: 1px solid #FECACA;
	}
</style>
