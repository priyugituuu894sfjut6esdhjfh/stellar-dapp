import { writable, derived } from 'svelte/store';
import {
	connectWalletById,
	disconnectWallet,
	getAvailableWallets
} from '$lib/stellar/wallet';
import type { WalletInfo } from '$lib/stellar/wallet';
import { getXlmBalance } from '$lib/stellar/balance';

export const isConnected = writable(false);
export const publicKey = writable<string | null>(null);
export const balance = writable('0');
export const isLoading = writable(false);
export const error = writable<string | null>(null);
export const walletInstalled = writable(false);
export const availableWallets = writable<WalletInfo[]>([]);
export const connectedWalletName = writable<string | null>(null);
export const txStatus = writable<{
	status: 'idle' | 'pending' | 'success' | 'error';
	message: string;
	hash?: string;
	error?: string;
}>({ status: 'idle', message: '' });

export const shortAddress = derived(publicKey, ($pk) => {
	if (!$pk) return '';
	return `${$pk.slice(0, 6)}...${$pk.slice(-4)}`;
});

export async function initializeWallet() {
	if (typeof window === 'undefined') return;
	try {
		const wallets = await getAvailableWallets();
		availableWallets.set(wallets);
		walletInstalled.set(wallets.some((w) => w.isAvailable));
	} catch (err) {
		console.error('Failed to load wallets:', err);
	}
}

export async function connect(walletId: string) {
	isLoading.set(true);
	error.set(null);

	try {
		const result = await connectWalletById(walletId);

		if ('publicKey' in result) {
			isConnected.set(true);
			publicKey.set(result.publicKey);
			const wallets = await getAvailableWallets();
			const wallet = wallets.find((w) => w.id === walletId);
			connectedWalletName.set(wallet?.name || 'Wallet');
			await refreshBalance(result.publicKey);
		} else {
			error.set(result.message);
		}
	} catch (err) {
		error.set('An unexpected error occurred while connecting.');
		console.error('Connect error:', err);
	}

	isLoading.set(false);
}

export async function disconnect() {
	try {
		await disconnectWallet();
	} catch (err) {
		console.error('Disconnect error:', err);
	}
	isConnected.set(false);
	publicKey.set(null);
	balance.set('0');
	connectedWalletName.set(null);
}

export async function refreshBalance(pk?: string) {
	try {
		const address = pk || publicKeyToUse();
		if (!address) return;
		const bal = await getXlmBalance(address);
		balance.set(bal);
	} catch (err) {
		console.error('Failed to refresh balance:', err);
	}
}

function publicKeyToUse(): string | null {
	let pk: string | null = null;
	publicKey.subscribe((v) => (pk = v))();
	return pk;
}

export function setTxStatus(
	status: 'idle' | 'pending' | 'success' | 'error',
	message: string,
	hash?: string,
	errorMsg?: string
) {
	txStatus.set({ status, message, hash, error: errorMsg });
}

export function clearError() {
	error.set(null);
}
