<script lang="ts">
	import { balance, isConnected, publicKey, refreshBalance } from '$lib/stores/wallet';
	import { requestAirdrop } from '$lib/api';
	import { onMount } from 'svelte';

	let refreshing = $state(false);
	let faucetLoading = $state(false);
	let faucetStatus = $state<'idle' | 'success' | 'error'>('idle');
	let faucetMessage = $state('');

	onMount(() => {
		if ($isConnected) {
			refreshBalance();
		}
	});

	async function handleRefresh() {
		refreshing = true;
		await refreshBalance();
		refreshing = false;
	}

	async function handleFaucet() {
		if (!$publicKey || faucetLoading) return;
		faucetLoading = true;
		faucetStatus = 'idle';
		faucetMessage = '';
		try {
			await requestAirdrop($publicKey);
			faucetStatus = 'success';
			faucetMessage = '10,000 XLM sent. Balance updates shortly.';
			setTimeout(async () => {
				await refreshBalance();
				faucetStatus = 'idle';
			}, 3000);
		} catch (err: any) {
			faucetStatus = 'error';
			const msg = err?.message || '';
			if (msg.includes('rate limit') || msg.includes('too many')) {
				faucetMessage = 'Faucet rate-limited. Please wait a few minutes before trying again.';
			} else if (msg.includes('already funded') || msg.includes('Existing')) {
				faucetMessage = 'Account already has funds. Refreshing balance...';
				setTimeout(async () => {
					await refreshBalance();
					faucetStatus = 'idle';
				}, 1500);
			} else {
				faucetMessage = msg || 'Airdrop failed. Please try again in a moment.';
			}
			if (faucetStatus !== 'idle') {
				setTimeout(() => { faucetStatus = 'idle'; }, 6000);
			}
		}
		faucetLoading = false;
	}
</script>

{#if $isConnected}
	<div class="balance-card">
		<div class="balance-header">
			<span class="balance-label">XLM Balance</span>
			<button class="refresh-btn" onclick={handleRefresh} disabled={refreshing} title="Refresh">
				<span class="refresh-icon" class:spinning={refreshing}>&#x21bb;</span>
			</button>
		</div>
		<div class="balance-row">
			<span class="balance-amount">{$balance}</span>
			<span class="balance-asset">XLM</span>
		</div>
		<div class="balance-meta">Testnet</div>
		{#if parseFloat($balance) === 0}
			<div class="unfunded-notice">This account is not yet funded on testnet.</div>
			<button class="faucet-btn" onclick={handleFaucet} disabled={faucetLoading}>
				{#if faucetLoading}
					Requesting...
				{:else}
					Request Test XLM
				{/if}
			</button>
		{/if}
		{#if faucetStatus === 'success'}
			<div class="faucet-msg success">{faucetMessage}</div>
		{:else if faucetStatus === 'error'}
			<div class="faucet-msg error">{faucetMessage}</div>
		{/if}
	</div>
{/if}

<style>
	.balance-card {
		background: #0A0B0D;
		border: 1px solid #1A1B1E;
		border-radius: 16px;
		padding: 24px;
	}

	.balance-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.balance-label {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #6B7280;
	}

	.refresh-btn {
		background: none;
		border: none;
		color: #6B7280;
		cursor: pointer;
		padding: 4px;
		transition: color 0.15s;
	}

	.refresh-btn:hover {
		color: #0052FF;
	}

	.refresh-btn:disabled {
		cursor: wait;
	}

	.refresh-icon {
		display: inline-block;
		font-size: 16px;
	}

	.spinning {
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.balance-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.balance-amount {
		font-size: 36px;
		font-weight: 400;
		color: #FFFFFF;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
	}

	.balance-asset {
		font-size: 16px;
		font-weight: 600;
		color: #0052FF;
	}

	.balance-meta {
		margin-top: 8px;
		font-size: 13px;
		color: #6B7280;
	}

	.unfunded-notice {
		margin-top: 12px;
		padding: 10px 14px;
		border-radius: 10px;
		background: #FFFBEB;
		border: 1px solid #FDE68A;
		color: #92400E;
		font-size: 13px;
		line-height: 1.4;
	}

	.faucet-btn {
		margin-top: 8px;
		width: 100%;
		height: 44px;
		border-radius: 10px;
		background: #0052FF;
		color: #FFFFFF;
		font-size: 14px;
		font-weight: 600;
		border: none;
		cursor: pointer;
		transition: background 0.15s;
	}

	.faucet-btn:hover:not(:disabled) {
		background: #578BFA;
	}

	.faucet-btn:disabled {
		opacity: 0.5;
		cursor: wait;
	}

	.faucet-msg {
		margin-top: 8px;
		padding: 10px 14px;
		border-radius: 10px;
		font-size: 13px;
		line-height: 1.4;
	}

	.faucet-msg.success {
		background: #F0FDF4;
		border: 1px solid #BBF7D0;
		color: #16A34A;
	}

	.faucet-msg.error {
		background: #FEF2F2;
		border: 1px solid #FECACA;
		color: #DC2626;
	}
</style>
