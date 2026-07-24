<script lang="ts">
	import { balance, isConnected, refreshBalance } from '$lib/stores/wallet';
	import { onMount } from 'svelte';

	let refreshing = $state(false);

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
</style>
