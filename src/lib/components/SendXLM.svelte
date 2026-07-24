<script lang="ts">
	import { isConnected, publicKey, txStatus, setTxStatus, refreshBalance } from '$lib/stores/wallet';
	import { sendXlm } from '$lib/stellar/transaction';
	import { StrKey } from '@stellar/stellar-sdk';

	let destination = $state('');
	let amount = $state('');
	let sending = $state(false);

	let isValidDestination = $derived(destination.length === 56 && StrKey.isValidEd25519PublicKey(destination));
	let isValidAmount = $derived(!isNaN(parseFloat(amount)) && parseFloat(amount) > 0);
	let canSend = $derived($isConnected && isValidDestination && isValidAmount && !sending);

	async function handleSend() {
		if (!canSend || !$publicKey) return;

		sending = true;
		setTxStatus('pending', 'Sending transaction...');

		const result = await sendXlm($publicKey, destination, amount);

		if (result.success) {
			setTxStatus('success', result.message, result.hash);
			await refreshBalance();
			destination = '';
			amount = '';
		} else {
			setTxStatus('error', result.message);
		}

		sending = false;
	}
</script>

{#if $isConnected}
	<div class="send-card">
		<div class="card-header">
			<h3>Send XLM</h3>
		</div>

		<div class="form-group">
			<label for="destination">Recipient address</label>
			<input
				id="destination"
				type="text"
				bind:value={destination}
				placeholder="G..."
				class:error={destination.length > 0 && !isValidDestination}
			/>
			{#if destination.length > 0 && !isValidDestination}
				<span class="field-error">Enter a valid Stellar public key</span>
			{/if}
		</div>

		<div class="form-group">
			<label for="amount">Amount</label>
			<input
				id="amount"
				type="number"
				bind:value={amount}
				placeholder="0.00"
				min="0"
				step="0.01"
				class:error={amount.length > 0 && !isValidAmount}
			/>
		</div>

		<button class="btn-primary" onclick={handleSend} disabled={!canSend}>
			{#if sending}
				<span class="spinner"></span>
				Sending...
			{:else}
				Send XLM
			{/if}
		</button>

		{#if $txStatus.status === 'success'}
			<div class="tx-result success">
				<div class="result-icon">&#10003;</div>
				<div class="result-content">
					<span class="result-title">Transaction sent</span>
					{#if $txStatus.hash}
						<a
							class="result-hash"
							href="https://stellar.expert/explorer/testnet/tx/{$txStatus.hash}"
							target="_blank"
							rel="noopener noreferrer"
						>
							{$txStatus.hash.slice(0, 16)}... &nearr;
						</a>
					{/if}
				</div>
			</div>
		{:else if $txStatus.status === 'error'}
			<div class="tx-result error">
				<div class="result-icon">&#10007;</div>
				<div class="result-content">
					<span class="result-title">Transaction failed</span>
					<span class="result-message">{$txStatus.message}</span>
				</div>
			</div>
		{:else if $txStatus.status === 'pending'}
			<div class="tx-result pending">
				<span class="spinner small"></span>
				<span class="result-message">{$txStatus.message}</span>
			</div>
		{/if}
	</div>
{/if}

<style>
	.send-card {
		background: #FFFFFF;
		border: 1px solid #E5E5E5;
		border-radius: 16px;
		padding: 24px;
	}

	.card-header h3 {
		font-size: 18px;
		font-weight: 600;
		color: #0A0B0D;
		margin-bottom: 20px;
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

	input.error {
		border-color: #DC2626;
	}

	.field-error {
		display: block;
		font-size: 13px;
		color: #DC2626;
		margin-top: 6px;
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

	.spinner.small {
		width: 14px;
		height: 14px;
		border-width: 2px;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.tx-result {
		margin-top: 16px;
		padding: 14px 16px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 14px;
	}

	.tx-result.success {
		background: #F0FDF4;
		border: 1px solid #BBF7D0;
		color: #16A34A;
	}

	.tx-result.error {
		background: #FEF2F2;
		border: 1px solid #FECACA;
		color: #DC2626;
	}

	.tx-result.pending {
		background: #F2F2F7;
		border: 1px solid #E5E5E5;
		color: #6B7280;
	}

	.result-icon {
		font-size: 16px;
		flex-shrink: 0;
	}

	.result-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.result-title {
		font-weight: 600;
		font-size: 14px;
	}

	.result-hash {
		font-size: 13px;
		font-family: 'Inter', monospace;
		color: inherit;
		opacity: 0.7;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.result-message {
		font-size: 13px;
		opacity: 0.8;
	}
</style>
