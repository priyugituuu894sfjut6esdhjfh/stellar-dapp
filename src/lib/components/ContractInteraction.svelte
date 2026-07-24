<script lang="ts">
	import { isConnected, publicKey, txStatus, setTxStatus } from '$lib/stores/wallet';
	import { callContract, CONTRACT_ADDRESS } from '$lib/stellar/contract';
	import { Address } from '@stellar/stellar-sdk';

	let contractAddr = $state(CONTRACT_ADDRESS);
	let method = $state('get_balance');
	let argsStr = $state('');
	let calling = $state(false);
	let contractResult = $state('');

	let canCall = $derived($isConnected && contractAddr.length > 0 && method.length > 0 && !calling);

	async function handleCall() {
		if (!canCall || !$publicKey) return;

		calling = true;
		contractResult = '';
		setTxStatus('pending', 'Calling contract...');

		const args = argsStr
			.split(',')
			.map((a) => a.trim())
			.filter(Boolean)
			.map((a) => {
				try {
					return new Address(a);
				} catch {
					return a;
				}
			});

		const result = await callContract(contractAddr, method, args, $publicKey);

		if (result.success) {
			setTxStatus('success', result.message, result.hash);
			contractResult = JSON.stringify(result.result, null, 2);
		} else {
			setTxStatus('error', result.message);
		}

		calling = false;
	}
</script>

{#if $isConnected}
	<div class="contract-card">
		<div class="card-header">
			<h3>Smart Contract</h3>
			<span class="badge">Soroban</span>
		</div>

		<div class="form-group">
			<label for="contract-addr">Contract address</label>
			<input
				id="contract-addr"
				type="text"
				bind:value={contractAddr}
				placeholder="C..."
			/>
		</div>

		<div class="form-group">
			<label for="contract-method">Method</label>
			<input
				id="contract-method"
				type="text"
				bind:value={method}
				placeholder="method_name"
			/>
		</div>

		<div class="form-group">
			<label for="contract-args">Arguments</label>
			<input
				id="contract-args"
				type="text"
				bind:value={argsStr}
				placeholder="arg1, arg2, ..."
			/>
		</div>

		<button class="btn-primary" onclick={handleCall} disabled={!canCall}>
			{#if calling}
				<span class="spinner"></span>
				Calling...
			{:else}
				Call Contract
			{/if}
		</button>

		{#if contractResult}
			<div class="result-block">
				<span class="result-label">Result</span>
				<pre>{contractResult}</pre>
			</div>
		{/if}
	</div>
{/if}

<style>
	.contract-card {
		background: #FFFFFF;
		border: 1px solid #E5E5E5;
		border-radius: 16px;
		padding: 24px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	h3 {
		font-size: 18px;
		font-weight: 600;
		color: #0A0B0D;
	}

	.badge {
		font-size: 12px;
		font-weight: 600;
		padding: 4px 12px;
		border-radius: 100px;
		background: #F2F2F7;
		color: #6B7280;
	}

	.form-group {
		margin-bottom: 16px;
	}

	label {
		display: block;
		font-size: 13px;
		font-weight: 500;
		color: #6B7280;
		margin-bottom: 6px;
	}

	input {
		width: 100%;
		height: 48px;
		padding: 0 16px;
		border-radius: 12px;
		border: 1px solid #E5E5E5;
		background: #FFFFFF;
		color: #0A0B0D;
		font-size: 15px;
		font-family: 'Inter', monospace;
		transition: border-color 0.15s;
		outline: none;
	}

	input:focus {
		border-color: #0052FF;
	}

	input::placeholder {
		color: #9CA3AF;
	}

	.btn-primary {
		width: 100%;
		height: 56px;
		border-radius: 100px;
		background: #0052FF;
		color: #FFFFFF;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0.01em;
		border: none;
		cursor: pointer;
		transition: background 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.btn-primary:hover:not(:disabled) {
		background: #578BFA;
	}

	.btn-primary:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: #FFFFFF;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.result-block {
		margin-top: 16px;
		background: #F2F2F7;
		border-radius: 12px;
		padding: 16px;
	}

	.result-label {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #6B7280;
		display: block;
		margin-bottom: 8px;
	}

	pre {
		margin: 0;
		font-size: 13px;
		color: #0A0B0D;
		white-space: pre-wrap;
		word-break: break-all;
		font-family: 'Inter', monospace;
	}
</style>
