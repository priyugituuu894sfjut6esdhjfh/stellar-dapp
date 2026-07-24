import {
	Contract,
	TransactionBuilder,
	Keypair,
	Account,
	Operation,
	Networks
} from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE } from './server';
import { signTransaction } from './wallet';
import type { WalletErrorInfo } from './wallet';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export async function callContract(
	contractAddress: string,
	method: string,
	args: any[] = [],
	sourcePublicKey: string
): Promise<{ success: boolean; result?: any; hash?: string; message: string }> {
	try {
		const contract = new Contract(contractAddress);

		const sourceAccount = await server.getAccount(sourcePublicKey);

		const tx = new TransactionBuilder(sourceAccount, {
			fee: '100',
			networkPassphrase: NETWORK_PASSPHRASE
		})
			.addOperation(contract.call(method, ...args))
			.setTimeout(180)
			.build();

		const preparedTx = await server.prepareTransaction(tx);
		const xdr = preparedTx.toXDR();

		const signResult = await signTransaction(xdr, NETWORK_PASSPHRASE);

		if ('error' in signResult || 'type' in signResult) {
			return {
				success: false,
				message: (signResult as WalletErrorInfo).message || 'Transaction signing failed'
			};
		}

		const signedTx = new TransactionBuilder(
			new Account(sourcePublicKey, '0'),
			{ fee: '100', networkPassphrase: NETWORK_PASSPHRASE }
		)
			.addOperation(contract.call(method, ...args))
			.setTimeout(180)
			.build();

		const sendResponse = await server.sendTransaction(signedTx);

		if (sendResponse.status === 'PENDING') {
			const hash = sendResponse.hash;
			const result = await pollTxResult(hash);
			return { success: true, result, hash, message: `Contract call successful! Hash: ${hash}` };
		}

		return { success: false, message: `Transaction failed: ${sendResponse.status}` };
	} catch (error: any) {
		return { success: false, message: `Contract call error: ${error.message || error}` };
	}
}

async function pollTxResult(hash: string, maxAttempts: number = 30): Promise<any> {
	for (let i = 0; i < maxAttempts; i++) {
		try {
			const getResponse = await server.getTransaction(hash);
			if (getResponse.status === 'SUCCESS') {
				return getResponse;
			}
			if (getResponse.status === 'FAILED') {
				throw new Error('Transaction failed on-chain');
			}
		} catch {
			// still processing
		}
		await new Promise((r) => setTimeout(r, 2000));
	}
	throw new Error('Transaction timed out');
}

export async function readContractState(
	contractAddress: string,
	method: string,
	args: any[] = []
): Promise<{ success: boolean; result?: any; message: string }> {
	try {
		const contract = new Contract(contractAddress);
		const sourceAccount = await server.getAccount(Keypair.random().publicKey());
		const tx = new TransactionBuilder(sourceAccount, {
			fee: '100',
			networkPassphrase: NETWORK_PASSPHRASE
		})
			.addOperation(contract.call(method, ...args))
			.build();
		const result = await server.simulateTransaction(tx);
		return { success: true, result, message: 'State read successfully' };
	} catch (error: any) {
		return { success: false, message: `Read error: ${error.message || error}` };
	}
}
