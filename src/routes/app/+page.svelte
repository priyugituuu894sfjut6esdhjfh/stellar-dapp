<script lang="ts">
	import WalletConnect from '$lib/components/WalletConnect.svelte';
	import Balance from '$lib/components/Balance.svelte';
	import SendXLM from '$lib/components/SendXLM.svelte';
	import TxHistory from '$lib/components/TxHistory.svelte';
	import ContractInteraction from '$lib/components/ContractInteraction.svelte';
	import { isConnected } from '$lib/stores/wallet';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Stellar dApp — Wallet</title>
	<meta name="description" content="Stellar testnet dApp — wallet, payments, and smart contracts" />
</svelte:head>

<div class="app">
	<nav>
		<div class="nav-inner">
			<div class="nav-left">
				<button class="nav-home" onclick={() => goto('/')}>
					<span class="logo-mark"></span>
					<span class="logo-text">Stellar</span>
				</button>
			</div>
			<div class="nav-right">
				<WalletConnect />
			</div>
		</div>
	</nav>

	<main>
		{#if $isConnected}
			<section class="dashboard">
				<div class="dashboard-grid">
					<div class="col-left">
						<Balance />
						<SendXLM />
					</div>
					<div class="col-right">
						<ContractInteraction />
						<TxHistory />
					</div>
				</div>
			</section>
		{:else}
			<section class="connect-prompt">
				<div class="prompt-card">
					<div class="prompt-icon">
						<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" rx="4" stroke="currentColor" stroke-width="1.5"/><path d="M4 14h24" stroke="currentColor" stroke-width="1.5"/><circle cx="22" cy="20" r="2" fill="currentColor"/></svg>
					</div>
					<h2>Connect your wallet</h2>
					<p>Connect your Freighter wallet to start sending XLM and interacting with smart contracts on the Stellar testnet.</p>
					<div class="prompt-action">
						<WalletConnect />
					</div>
				</div>
			</section>
		{/if}
	</main>

	<footer>
		<div class="footer-inner">
			<span class="footer-text">Stellar dApp &mdash; Testnet</span>
			<a href="https://stellar.org" target="_blank" rel="noopener noreferrer" class="footer-link">Stellar.org</a>
		</div>
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* Nav */
	nav {
		border-bottom: 1px solid #E5E5E5;
		background: #FFFFFF;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-left {
		display: flex;
		align-items: center;
	}

	.nav-home {
		display: flex;
		align-items: center;
		gap: 10px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.logo-mark {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: #0052FF;
		display: block;
	}

	.logo-text {
		font-size: 18px;
		font-weight: 600;
		color: #0A0B0D;
	}

	.nav-right {
		display: flex;
		align-items: center;
	}

	/* Connect prompt */
	.connect-prompt {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
	}

	.prompt-card {
		max-width: 440px;
		text-align: center;
	}

	.prompt-icon {
		width: 64px;
		height: 64px;
		border-radius: 16px;
		background: #F2F2F7;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #0052FF;
		margin: 0 auto 24px;
	}

	.prompt-card h2 {
		font-size: 28px;
		font-weight: 500;
		color: #0A0B0D;
		margin-bottom: 12px;
	}

	.prompt-card p {
		font-size: 16px;
		line-height: 1.5;
		color: #6B7280;
		margin-bottom: 32px;
	}

	.prompt-action {
		display: flex;
		justify-content: center;
	}

	/* Dashboard */
	.dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 24px 80px;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		align-items: start;
	}

	.col-left, .col-right {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* Footer */
	footer {
		border-top: 1px solid #E5E5E5;
		margin-top: auto;
	}

	.footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer-text {
		font-size: 14px;
		color: #9CA3AF;
	}

	.footer-link {
		font-size: 14px;
		color: #6B7280;
		transition: color 0.15s;
	}

	.footer-link:hover {
		color: #0052FF;
	}

	@media (max-width: 768px) {
		.dashboard-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
