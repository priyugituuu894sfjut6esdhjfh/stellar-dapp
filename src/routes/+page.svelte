<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Stellar dApp — Decentralized Finance on Testnet</title>
	<meta name="description" content="Send crypto with confidence. Connect your wallet, send XLM, and interact with smart contracts on the Stellar testnet." />
</svelte:head>

<div class="landing">
	<nav>
		<div class="nav-inner">
			<div class="nav-left">
				<span class="logo-mark"></span>
				<span class="logo-text">Stellar</span>
			</div>
			<div class="nav-right">
				<button class="btn-ghost" onclick={() => goto('/app')}>Sign in</button>
			</div>
		</div>
	</nav>

	<section class="hero">
		<div class="hero-content">
			<span class="overline">Testnet</span>
			<h1>Send crypto<br />with confidence.</h1>
			<p class="hero-sub">Connect your wallet, send XLM, and interact with smart contracts on the Stellar testnet — all in one clean interface.</p>
			<div class="hero-actions">
				<button class="btn-primary" onclick={() => goto('/app')}>
					Launch App
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</button>
				<a href="https://developers.stellar.org" target="_blank" rel="noopener noreferrer" class="btn-outline">
					Read Docs
				</a>
			</div>
		</div>
		<div class="hero-visual">
			<div class="orb orb-1"></div>
			<div class="orb orb-2"></div>
			<div class="orb orb-3"></div>
		</div>
	</section>

	<section class="features">
		<div class="features-inner">
			<div class="features-grid">
				<div class="feature-card">
					<div class="feature-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.5"/></svg>
					</div>
					<h3>Wallet Connection</h3>
					<p>Connect Freighter in one click. Manage your Stellar wallet without leaving the browser.</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</div>
					<h3>Send XLM</h3>
					<p>Transfer testnet XLM to any address with instant validation and confirmation.</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</div>
					<h3>Smart Contracts</h3>
					<p>Deploy and call Soroban contracts from a clean, intuitive interface.</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</div>
					<h3>Testnet Safe</h3>
					<p>Built on Stellar testnet. Experiment freely without real funds at risk.</p>
				</div>
			</div>
		</div>
	</section>

	<section class="stats">
		<div class="stats-inner">
			<div class="stat">
				<span class="stat-value">3</span>
				<span class="stat-label">Challenge Levels</span>
			</div>
			<div class="stat-divider"></div>
			<div class="stat">
				<span class="stat-value">18</span>
				<span class="stat-label">Tests Passing</span>
			</div>
			<div class="stat-divider"></div>
			<div class="stat">
				<span class="stat-value">100%</span>
				<span class="stat-label">Open Source</span>
			</div>
		</div>
	</section>

	<section class="cta">
		<div class="cta-inner">
			<h2>Ready to start?</h2>
			<p>Connect your Freighter wallet and explore the Stellar testnet in minutes.</p>
			<button class="btn-primary" onclick={() => goto('/app')}>
				Launch App
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</button>
		</div>
	</section>

	<footer>
		<div class="footer-inner">
			<div class="footer-left">
				<span class="logo-mark-sm"></span>
				<span class="footer-text">Stellar dApp</span>
			</div>
			<div class="footer-right">
				<a href="https://stellar.org" target="_blank" rel="noopener noreferrer" class="footer-link">Stellar.org</a>
				<a href="https://developers.stellar.org" target="_blank" rel="noopener noreferrer" class="footer-link">Docs</a>
				<a href="https://github.com/priyugituuu894sfjut6esdhjfh/stellar-dapp" target="_blank" rel="noopener noreferrer" class="footer-link">GitHub</a>
			</div>
		</div>
	</footer>
</div>

<style>
	.landing {
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
		gap: 12px;
	}

	/* Hero */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 100px 24px 120px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
		align-items: center;
		width: 100%;
	}

	.hero-content {
		max-width: 560px;
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

	.hero-sub {
		font-size: 18px;
		line-height: 1.56;
		color: #6B7280;
		max-width: 480px;
		margin-bottom: 40px;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.hero-visual {
		position: relative;
		height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.orb {
		border-radius: 50%;
		position: absolute;
		animation: float 6s ease-in-out infinite;
	}

	.orb-1 {
		width: 200px;
		height: 200px;
		background: #0052FF;
		opacity: 0.12;
		top: 40px;
		left: 50%;
		transform: translateX(-50%);
		animation-delay: 0s;
	}

	.orb-2 {
		width: 140px;
		height: 140px;
		background: #0052FF;
		opacity: 0.08;
		top: 80px;
		left: 30%;
		animation-delay: 2s;
	}

	.orb-3 {
		width: 100px;
		height: 100px;
		background: #0052FF;
		opacity: 0.06;
		top: 120px;
		left: 65%;
		animation-delay: 4s;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0) translateX(-50%); }
		50% { transform: translateY(-20px) translateX(-50%); }
	}

	.orb-2 { animation-name: float2; }
	@keyframes float2 {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-15px); }
	}

	.orb-3 { animation-name: float3; }
	@keyframes float3 {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-25px); }
	}

	/* Buttons */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
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

	.btn-outline {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 56px;
		padding: 0 24px;
		border-radius: 100px;
		background: transparent;
		color: #0A0B0D;
		font-size: 16px;
		font-weight: 500;
		border: 1px solid #E5E5E5;
		cursor: pointer;
		transition: background 0.15s;
		text-decoration: none;
	}

	.btn-outline:hover {
		background: #F2F2F7;
	}

	.btn-ghost {
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
		border: none;
		cursor: pointer;
		transition: background 0.15s;
	}

	.btn-ghost:hover {
		background: #F2F2F7;
		color: #0A0B0D;
	}

	/* Features */
	.features {
		background: #F2F2F7;
		border-top: 1px solid #E5E5E5;
		border-bottom: 1px solid #E5E5E5;
	}

	.features-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 80px 24px;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
	}

	.feature-card {
		background: #FFFFFF;
		border: 1px solid #E5E5E5;
		border-radius: 16px;
		padding: 32px;
		transition: border-color 0.15s;
	}

	.feature-card:hover {
		border-color: #D1D5DB;
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

	h3 {
		font-size: 20px;
		font-weight: 500;
		color: #0A0B0D;
		margin-bottom: 8px;
	}

	.feature-card p {
		font-size: 15px;
		line-height: 1.5;
		color: #6B7280;
	}

	/* Stats */
	.stats {
		background: #0A0B0D;
	}

	.stats-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 64px 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 64px;
	}

	.stat {
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 40px;
		font-weight: 400;
		color: #FFFFFF;
		letter-spacing: -0.02em;
		line-height: 1.1;
		margin-bottom: 8px;
	}

	.stat-label {
		font-size: 14px;
		font-weight: 500;
		color: #6B7280;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.stat-divider {
		width: 1px;
		height: 48px;
		background: #1A1B1E;
	}

	/* CTA */
	.cta {
		border-top: 1px solid #E5E5E5;
	}

	.cta-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 96px 24px;
		text-align: center;
	}

	.cta h2 {
		font-size: 40px;
		font-weight: 400;
		letter-spacing: -0.015em;
		color: #0A0B0D;
		margin-bottom: 12px;
	}

	.cta p {
		font-size: 18px;
		line-height: 1.56;
		color: #6B7280;
		margin-bottom: 32px;
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

	.footer-left {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.logo-mark-sm {
		width: 20px;
		height: 20px;
		border-radius: 6px;
		background: #0052FF;
		display: block;
	}

	.footer-text {
		font-size: 14px;
		color: #9CA3AF;
	}

	.footer-right {
		display: flex;
		gap: 24px;
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
		.hero {
			grid-template-columns: 1fr;
			padding: 60px 24px 80px;
			gap: 40px;
		}

		.hero-visual {
			display: none;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.stats-inner {
			flex-direction: column;
			gap: 32px;
		}

		.stat-divider {
			width: 48px;
			height: 1px;
		}
	}
</style>
