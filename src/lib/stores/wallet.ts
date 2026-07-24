import { writable, derived } from 'svelte/store';
import {
	connectWallet,
	disconnectWallet,
	getPublicKey,
	checkFreighterInstalled
} from '$lib/stellar/wallet';
import { getXlmBalance } from '$lib/stellar/balance';

export const isConnected = writable(false);
export const publicKey = writable<string | null>(null);
export const balance = writable('0');
export const isLoading = writable(false);
export const error = writable<string | null>(null);
export const walletInstalled = writable(false);
export const txStatus = writable<{
	status: 'idle' | 'pending' | 'success' | 'error';
	message: string;
	hash?: string;
}>({ status: 'idle', message: '' });

export const shortAddress = derived(publicKey, ($pk) => {
	if (!$pk) return '';
	return `${$pk.slice(0, 6)}...${$pk.slice(-4)}`;
});

export async function initializeWallet() {
	const installed = await checkFreighterInstalled();
	walletInstalled.set(installed);

	if (installed) {
		const pk = await getPublicKey();
		if (pk) {
			isConnected.set(true);
			publicKey.set(pk);
			await refreshBalance(pk);
		}
	}
}

export async function connect() {
	isLoading.set(true);
	error.set(null);

	const result = await connectWallet();

	if ('publicKey' in result) {
		isConnected.set(true);
		publicKey.set(result.publicKey);
		await refreshBalance(result.publicKey);
	} else {
		error.set(result.message);
	}

	isLoading.set(false);
}

export async function disconnect() {
	await disconnectWallet();
	isConnected.set(false);
	publicKey.set(null);
	balance.set('0');
}

export async function refreshBalance(pk?: string) {
	const address = pk || await getPublicKey();
	if (!address) return;
	const bal = await getXlmBalance(address);
	balance.set(bal);
}

export function setTxStatus(
	status: 'idle' | 'pending' | 'success' | 'error',
	message: string,
	hash?: string
) {
	txStatus.set({ status, message, hash });
}
