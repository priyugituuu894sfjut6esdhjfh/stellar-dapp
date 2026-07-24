import {
	TransactionBuilder,
	Operation,
	Asset,
	Account,
	Transaction,
	StrKey
} from '@stellar/stellar-sdk';
import { horizonServer, NETWORK_PASSPHRASE, BASE_FEE } from './server';
import { signTransaction } from './wallet';
import type { WalletErrorInfo } from './wallet';
import { validateTransaction, submitTransaction, fetchTransactionHistory } from '../api';

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
	const amountStr = String(amount);
	const numAmount = parseFloat(amountStr);
	if (isNaN(numAmount) || numAmount <= 0) {
		return { success: false, message: 'Invalid amount. Must be greater than 0.' };
	}

	if (!StrKey.isValidEd25519PublicKey(destinationAddress)) {
		return { success: false, message: 'Invalid destination address.' };
	}

	if (sourcePublicKey === destinationAddress) {
		return { success: false, message: 'Cannot send XLM to your own address.' };
	}

	try {
		await validateTransaction(sourcePublicKey, destinationAddress, amountStr);

		let sourceAccount;
		try {
			sourceAccount = await horizonServer.loadAccount(sourcePublicKey);
		} catch (loadErr: any) {
			const status = loadErr?.response?.status || loadErr?.status;
			if (status === 404) {
				return {
					success: false,
					message:
						'Account not found on testnet. This account has not been funded yet. Use the "Request Test XLM" button in your balance card to receive testnet funds before sending.'
				};
			}
			throw loadErr;
		}

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

		const result = await submitTransaction(signResult.signedTxXdr);

		return {
			success: true,
			hash: result.hash,
			message: `Transaction successful! Hash: ${result.hash}`
		};
	} catch (error: any) {
		return {
			success: false,
			message: `Transaction failed: ${error.message || String(error)}`
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
		const res = await fetchTransactionHistory(publicKey, limit);
		return res.map((tx) => ({
			hash: tx.hash,
			type: tx.memo || 'payment',
			timestamp: new Date(tx.created_at).toLocaleString(),
			success: tx.successful
		}));
	} catch {
		return [];
	}
}
