<script lang="ts">
	import { isConnected, publicKey } from '$lib/stores/wallet';
	import { getTransactionHistory } from '$lib/stellar/transaction';
	import { onMount } from 'svelte';

	type TxRecord = {
		hash: string;
		type: string;
		amount?: string;
		timestamp: string;
		success: boolean;
	};

	let transactions: TxRecord[] = $state([]);
	let loading = $state(false);

	onMount(() => {
		if ($isConnected && $publicKey) {
			loadHistory();
		}
	});

	async function loadHistory() {
		if (!$publicKey) return;
		loading = true;
		transactions = await getTransactionHistory($publicKey, 10);
		loading = false;
	}
</script>

{#if $isConnected}
	<div class="history-card">
		<div class="card-header">
			<h3>Transactions</h3>
			<button class="btn-ghost-sm" onclick={loadHistory} disabled={loading}>
				{loading ? 'Loading...' : 'Refresh'}
			</button>
		</div>

		{#if transactions.length === 0}
			<div class="empty">
				<p>No transactions yet</p>
			</div>
		{:else}
			<div class="tx-list">
				{#each transactions as tx}
					<a
						class="tx-row"
						href="https://stellar.expert/explorer/testnet/tx/{tx.hash}"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div class="tx-indicator" class:success={tx.success} class:failed={!tx.success}></div>
						<div class="tx-body">
							<span class="tx-hash">{tx.hash.slice(0, 12)}...</span>
							<span class="tx-time">{tx.timestamp}</span>
						</div>
						<span class="tx-badge" class:success={tx.success} class:failed={!tx.success}>
							{tx.success ? 'Confirmed' : 'Failed'}
						</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.history-card {
		background: #FFFFFF;
		border: 1px solid #E5E5E5;
		border-radius: 16px;
		padding: 24px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	h3 {
		font-size: 18px;
		font-weight: 600;
		color: #0A0B0D;
	}

	.btn-ghost-sm {
		background: transparent;
		color: #6B7280;
		border: none;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		padding: 4px 10px;
		border-radius: 100px;
		transition: background 0.15s, color 0.15s;
	}

	.btn-ghost-sm:hover:not(:disabled) {
		background: #F2F2F7;
		color: #0A0B0D;
	}

	.btn-ghost-sm:disabled {
		opacity: 0.4;
		cursor: wait;
	}

	.empty {
		text-align: center;
		padding: 32px 16px;
		color: #9CA3AF;
		font-size: 14px;
	}

	.tx-list {
		display: flex;
		flex-direction: column;
	}

	.tx-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
		text-decoration: none;
		color: inherit;
		border-bottom: 1px solid #F2F2F7;
		transition: background 0.1s;
	}

	.tx-row:last-child {
		border-bottom: none;
	}

	.tx-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.tx-indicator.success {
		background: #00D26F;
	}

	.tx-indicator.failed {
		background: #DC2626;
	}

	.tx-body {
		flex: 1;
		min-width: 0;
	}

	.tx-hash {
		font-size: 14px;
		font-weight: 500;
		color: #0A0B0D;
		font-family: 'Inter', monospace;
		display: block;
	}

	.tx-time {
		font-size: 12px;
		color: #9CA3AF;
	}

	.tx-badge {
		font-size: 12px;
		font-weight: 600;
		padding: 3px 10px;
		border-radius: 100px;
		flex-shrink: 0;
	}

	.tx-badge.success {
		background: #F0FDF4;
		color: #16A34A;
	}

	.tx-badge.failed {
		background: #FEF2F2;
		color: #DC2626;
	}
</style>
