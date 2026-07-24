import {
	TransactionBuilder,
	Operation,
	Asset,
	Keypair,
	Account,
	Transaction,
	StrKey,
	Networks
} from '@stellar/stellar-sdk';
import { horizonServer, NETWORK_PASSPHRASE, BASE_FEE } from './server';
import { signTransaction } from './wallet';
import type { WalletErrorInfo } from './wallet';

export interface TransactionResult {
	success: boolean;
	hash?: string;
	message: string;
	error?: WalletErrorInfo;
}

export async function sendXlm(
	sourcePublicKey: string,
	destinationAddress: string,
	amount: string
): Promise<TransactionResult> {
	const numAmount = parseFloat(amount);
	if (isNaN(numAmount) || numAmount <= 0) {
		return { success: false, message: 'Invalid amount. Must be greater than 0.' };
	}

	if (!StrKey.isValidEd25519PublicKey(destinationAddress)) {
		return { success: false, message: 'Invalid destination address.' };
	}

	try {
		const sourceAccount = await horizonServer.loadAccount(sourcePublicKey);

		const transaction = new TransactionBuilder(sourceAccount, {
			fee: BASE_FEE,
			networkPassphrase: NETWORK_PASSPHRASE
		})
			.addOperation(
				Operation.payment({
					destination: destinationAddress,
					asset: Asset.native(),
					amount: numAmount.toFixed(7)
				})
			)
			.setTimeout(180)
			.build();

		const xdr = transaction.toXDR();

		const signResult = await signTransaction(xdr, NETWORK_PASSPHRASE);

		if ('error' in signResult || 'type' in signResult) {
			return {
				success: false,
				message: (signResult as WalletErrorInfo).message,
				error: signResult as WalletErrorInfo
			};
		}

		const signedTx = new Transaction(
			signResult.signedTxXdr,
			NETWORK_PASSPHRASE
		);

		const result = await horizonServer.submitTransaction(signedTx);

		return {
			success: true,
			hash: result.hash,
			message: `Transaction successful! Hash: ${result.hash}`
		};
	} catch (error: any) {
		const msg = error?.response?.data?.extras?.result_codes?.transaction || error?.message || String(error);
		return {
			success: false,
			message: `Transaction failed: ${msg}`
		};
	}
}

export async function getTransactionHistory(
	publicKey: string,
	limit: number = 10
): Promise<
	Array<{
		hash: string;
		type: string;
		amount?: string;
		timestamp: string;
		success: boolean;
	}>
> {
	try {
		const response = await horizonServer
			.transactions()
			.forAccount(publicKey)
			.order('desc')
			.limit(limit)
			.call();

		const records = await response.records;
		return records.map((tx: any) => ({
			hash: tx.hash,
			type: tx.memo || 'payment',
			timestamp: new Date(tx.created_at).toLocaleString(),
			success: tx.successful
		}));
	} catch {
		return [];
	}
}
