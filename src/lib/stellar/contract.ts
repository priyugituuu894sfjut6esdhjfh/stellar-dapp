import {
	Contract,
	TransactionBuilder,
	Keypair,
	Account,
	Networks
} from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE } from './server';
import { signTransaction } from './wallet';
import type { WalletErrorInfo } from './wallet';
import { simulateContract, callContract as apiCallContract } from '../api';

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

		const result = await apiCallContract(signResult.signedTxXdr);

		return {
			success: true,
			result: result.data.result,
			hash: result.data.hash,
			message: `Contract call successful! Hash: ${result.data.hash}`
		};
	} catch (error: any) {
		return { success: false, message: `Contract call error: ${error.message || error}` };
	}
}

export async function readContractState(
	contractAddress: string,
	method: string,
	args: any[] = []
): Promise<{ success: boolean; result?: any; message: string }> {
	try {
		const result = await simulateContract(contractAddress, method, args);
		return { success: true, result: result.data, message: 'State read successfully' };
	} catch (error: any) {
		return { success: false, message: `Read error: ${error.message || error}` };
	}
}
