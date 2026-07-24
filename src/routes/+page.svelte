<script lang="ts">
	import WalletConnect from '$lib/components/WalletConnect.svelte';
	import Balance from '$lib/components/Balance.svelte';
	import SendXLM from '$lib/components/SendXLM.svelte';
	import TxHistory from '$lib/components/TxHistory.svelte';
	import ContractInteraction from '$lib/components/ContractInteraction.svelte';
	import { isConnected } from '$lib/stores/wallet';
</script>

<svelte:head>
	<title>Stellar dApp — Testnet</title>
	<meta name="description" content="Stellar testnet dApp with wallet, payments, and smart contracts" />
</svelte:head>

<div class="app">
	<nav>
		<div class="nav-inner">
			<div class="nav-left">
				<span class="logo-mark"></span>
				<span class="logo-text">Stellar</span>
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
			<section class="hero">
				<div class="hero-inner">
					<span class="overline">Stellar Testnet</span>
					<h1>Send crypto<br />with confidence.</h1>
					<p class="hero-body">Connect your wallet, send XLM, and interact with smart contracts on the Stellar testnet.</p>
					<div class="hero-actions">
						<button class="btn-primary" onclick={() => (document.querySelector('[data-wallet-btn]') as HTMLElement)?.click()}>
							Get Started
						</button>
						<a href="https://developers.stellar.org" target="_blank" rel="noopener noreferrer" class="btn-ghost">
							Learn more &rarr;
						</a>
					</div>
				</div>
				<div class="features-row">
					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.5"/></svg>
						</div>
						<h4>Wallet Connection</h4>
						<p>Connect Freighter and manage your Stellar wallet in seconds.</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</div>
						<h4>Send XLM</h4>
						<p>Transfer testnet XLM to any address with instant validation.</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</div>
						<h4>Smart Contracts</h4>
						<p>Deploy and call Soroban contracts from a clean interface.</p>
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
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #FFFFFF;
		color: #0A0B0D;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-variant-numeric: tabular-nums;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(input) {
		font-family: inherit;
	}

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
		gap: 10px;
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

	/* Hero */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 80px 24px 120px;
	}

	.hero-inner {
		max-width: 640px;
	}

	.overline {
		display: inline-block;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #0052FF;
		margin-bottom: 16px;
	}

	h1 {
		font-size: clamp(40px, 6vw, 56px);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: #0A0B0D;
		margin-bottom: 20px;
	}

	.hero-body {
		font-size: 18px;
		line-height: 1.56;
		color: #6B7280;
		max-width: 480px;
		margin-bottom: 32px;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	/* Buttons */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 56px;
		padding: 0 28px;
		border-radius: 100px;
		background: #0052FF;
		color: #FFFFFF;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0.01em;
		border: none;
		cursor: pointer;
		transition: background 0.15s;
		text-decoration: none;
	}

	.btn-primary:hover {
		background: #578BFA;
	}

	.btn-primary:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-ghost {
		display: inline-flex;
		align-items: center;
		height: 56px;
		padding: 0 20px;
		border-radius: 100px;
		background: transparent;
		color: #6B7280;
		font-size: 16px;
		font-weight: 500;
		border: none;
		cursor: pointer;
		transition: background 0.15s;
		text-decoration: none;
	}

	.btn-ghost:hover {
		background: #F2F2F7;
	}

	/* Features */
	.features-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: #E5E5E5;
		border: 1px solid #E5E5E5;
		border-radius: 16px;
		overflow: hidden;
		margin-top: 64px;
	}

	.feature-card {
		background: #FFFFFF;
		padding: 32px;
	}

	.feature-icon {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: #F2F2F7;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #0052FF;
		margin-bottom: 16px;
	}

	.feature-card h4 {
		font-size: 18px;
		font-weight: 600;
		color: #0A0B0D;
		margin-bottom: 8px;
	}

	.feature-card p {
		font-size: 15px;
		line-height: 1.5;
		color: #6B7280;
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

		.features-row {
			grid-template-columns: 1fr;
		}

		.hero {
			padding: 48px 24px 80px;
		}
	}
</style>
