import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils';
import { Networks } from '@creit.tech/stellar-wallets-kit';

export type WalletError = 'wallet_not_found' | 'rejected' | 'insufficient_balance' | 'user_cancelled' | 'network_error' | 'unknown';

export interface WalletErrorInfo {
	type: WalletError;
	message: string;
}

export interface WalletInfo {
	id: string;
	name: string;
	icon: string;
	isAvailable: boolean;
	moduleType: string;
}

let initialized = false;

export function initWalletKit() {
	if (initialized) return;
	StellarWalletsKit.init({
		modules: defaultModules(),
		network: Networks.TESTNET
	});
	initialized = true;
}

function parseWalletError(error: unknown): WalletErrorInfo {
	const msg = error instanceof Error ? error.message : String(error);
	const code = (error as any)?.code;

	if (code === -1 || msg.includes('closed') || msg.includes('cancelled') || msg.includes('cancel') || msg.includes('denied')) {
		return { type: 'user_cancelled', message: 'Connection was cancelled. Please try again.' };
	}
	if (msg.includes('not found') || msg.includes('not installed') || msg.includes('undefined') || code === -3) {
		return { type: 'wallet_not_found', message: 'Wallet not found. Please install a supported wallet extension.' };
	}
	if (msg.includes('reject') || msg.includes('denied')) {
		return { type: 'rejected', message: 'Transaction was rejected by the wallet.' };
	}
	if (msg.includes('insufficient') || msg.includes('balance')) {
		return { type: 'insufficient_balance', message: 'Insufficient XLM balance for this transaction.' };
	}
	if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
		return { type: 'network_error', message: 'Network error. Please check your connection and try again.' };
	}
	return { type: 'unknown', message: msg || 'An unexpected error occurred.' };
}

export async function getAvailableWallets(): Promise<WalletInfo[]> {
	initWalletKit();
	const wallets = await StellarWalletsKit.refreshSupportedWallets();
	return wallets.map((w: any) => ({
		id: w.id,
		name: w.name,
		icon: w.icon,
		isAvailable: w.isAvailable,
		moduleType: w.type
	}));
}

export async function connectWalletById(walletId: string): Promise<{ publicKey: string } | WalletErrorInfo> {
	try {
		initWalletKit();
		StellarWalletsKit.setWallet(walletId);
		const { address } = await StellarWalletsKit.fetchAddress();
		return { publicKey: address };
	} catch (error) {
		return parseWalletError(error);
	}
}

export async function getAddress(): Promise<string | null> {
	try {
		initWalletKit();
		const { address } = await StellarWalletsKit.getAddress();
		return address;
	} catch {
		return null;
	}
}

export async function disconnectWallet(): Promise<void> {
	try {
		initWalletKit();
		await StellarWalletsKit.disconnect();
	} catch {
		// ignore
	}
}

export async function signTransaction(
	xdr: string,
	networkPassphrase?: string
): Promise<{ signedTxXdr: string; signerAddress: string } | WalletErrorInfo> {
	try {
		initWalletKit();
		const address = await getAddress();
		if (!address) {
			return { type: 'wallet_not_found', message: 'No wallet connected. Please connect a wallet first.' };
		}
		const result = await StellarWalletsKit.signTransaction(xdr, {
			networkPassphrase: networkPassphrase || Networks.TESTNET,
			address
		});
		return { signedTxXdr: result.signedTxXdr, signerAddress: address };
	} catch (error) {
		return parseWalletError(error);
	}
}
