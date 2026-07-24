import * as FreighterApi from '@stellar/freighter-api';
import { Networks } from '@stellar/stellar-sdk';

export type WalletError = 'wallet_not_found' | 'rejected' | 'insufficient_balance';

export interface WalletErrorInfo {
	type: WalletError;
	message: string;
}

function handleFreighterError(error: unknown): WalletErrorInfo {
	const msg = error instanceof Error ? error.message : String(error);

	if (msg.includes('not found') || msg.includes('not installed') || msg.includes('undefined')) {
		return { type: 'wallet_not_found', message: 'Freighter wallet not found. Please install the Freighter browser extension.' };
	}
	if (msg.includes('reject') || msg.includes('denied') || msg.includes('cancel')) {
		return { type: 'rejected', message: 'Transaction was rejected by the user.' };
	}
	if (msg.includes('insufficient') || msg.includes('balance')) {
		return { type: 'insufficient_balance', message: 'Insufficient XLM balance for this transaction.' };
	}
	return { type: 'wallet_not_found', message: msg };
}

export async function checkFreighterInstalled(): Promise<boolean> {
	try {
		const result = await FreighterApi.isConnected();
		return result.isConnected;
	} catch {
		return false;
	}
}

export async function connectWallet(): Promise<{ publicKey: string } | WalletErrorInfo> {
	try {
		const access = await FreighterApi.requestAccess();
		return { publicKey: access.address };
	} catch (error) {
		return handleFreighterError(error);
	}
}

export async function disconnectWallet(): Promise<void> {
	try {
		// Freighter v6 does not expose a disconnect; clearing state is enough
	} catch {
		// Silently ignore disconnect errors
	}
}

export async function getPublicKey(): Promise<string | null> {
	try {
		const connected = await FreighterApi.isConnected();
		if (!connected.isConnected) return null;
		const access = await FreighterApi.getAddress();
		return access.address;
	} catch {
		return null;
	}
}

export async function signTransaction(
	xdr: string,
	networkPassphrase?: string
): Promise<{ signedTxXdr: string; signerAddress: string } | WalletErrorInfo> {
	try {
		const result = await FreighterApi.signTransaction(xdr, {
			networkPassphrase: networkPassphrase || Networks.TESTNET
		});
		return { signedTxXdr: result.signedTxXdr, signerAddress: result.signerAddress };
	} catch (error) {
		return handleFreighterError(error);
	}
}
