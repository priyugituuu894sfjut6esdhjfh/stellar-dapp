import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils';
import { Networks } from '@creit.tech/stellar-wallets-kit';

export type WalletError =
	| 'wallet_not_found'
	| 'rejected'
	| 'insufficient_balance'
	| 'user_cancelled'
	| 'network_error'
	| 'unknown';

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

function ensureInit() {
	if (initialized) return;
	if (typeof window === 'undefined') return;
	StellarWalletsKit.init({
		modules: defaultModules(),
		network: Networks.TESTNET
	});
	initialized = true;
}

function parseWalletError(error: unknown): WalletErrorInfo {
	const msg = error instanceof Error ? error.message : String(error);
	const code = (error as any)?.code;

	if (
		code === -1 ||
		msg.includes('closed') ||
		msg.includes('cancelled') ||
		msg.includes('cancel') ||
		msg.includes('denied')
	) {
		return {
			type: 'user_cancelled',
			message: 'Connection was cancelled. Please try again.'
		};
	}
	if (
		msg.includes('not found') ||
		msg.includes('not installed') ||
		msg.includes('undefined') ||
		code === -3
	) {
		return {
			type: 'wallet_not_found',
			message: 'Wallet not found. Please install a supported wallet extension.'
		};
	}
	if (msg.includes('reject') || msg.includes('denied')) {
		return {
			type: 'rejected',
			message: 'Transaction was rejected by the wallet.'
		};
	}
	if (msg.includes('insufficient') || msg.includes('balance')) {
		return {
			type: 'insufficient_balance',
			message: 'Insufficient XLM balance for this transaction.'
		};
	}
	if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
		return {
			type: 'network_error',
			message: 'Network error. Please check your connection and try again.'
		};
	}
	return { type: 'unknown', message: msg || 'An unexpected error occurred.' };
}

interface WalletDetection {
	id: string;
	name: string;
	icon: string;
	isAvailable: boolean;
}

function detectWalletsInBrowser(): WalletDetection[] {
	if (typeof window === 'undefined') return [];

	const wallets: WalletDetection[] = [
		{
			id: 'freighter',
			name: 'Freighter',
			icon: 'https://stellar.walletskit.dev/freighter.svg',
			isAvailable: !!(window as any).freighter?.isFreighter
		},
		{
			id: 'albedo',
			name: 'Albedo',
			icon: 'https://stellar.walletskit.dev/albedo.svg',
			isAvailable: !!(window as any).albedo
		},
		{
			id: 'rabet',
			name: 'Rabet',
			icon: 'https://stellar.walletskit.dev/rabet.svg',
			isAvailable: !!(window as any).rabet?.isRabet
		},
		{
			id: 'xbull',
			name: 'xBull',
			icon: 'https://stellar.walletskit.dev/xbull.svg',
			isAvailable: !!(window as any).xBull
		},
		{
			id: 'lobstr',
			name: 'LOBSTR',
			icon: 'https://stellar.walletskit.dev/lobstr.svg',
			isAvailable: !!(window as any).stellar?.isLobstr
		},
		{
			id: 'hana',
			name: 'Hana Wallet',
			icon: 'https://stellar.walletskit.dev/hana.svg',
			isAvailable: !!(window as any).hana?.stellar
		},
		{
			id: 'klever',
			name: 'Klever Wallet',
			icon: 'https://stellar.walletskit.dev/klever.svg',
			isAvailable: !!(window as any).klever
		},
		{
			id: 'onekey',
			name: 'OneKey',
			icon: 'https://stellar.walletskit.dev/onekey.svg',
			isAvailable: !!(window as any).onekey?.stellar
		},
		{
			id: 'bitget',
			name: 'Bitget Wallet',
			icon: 'https://stellar.walletskit.dev/bitget.svg',
			isAvailable: !!(window as any).bitgetWallet?.stellar
		},
		{
			id: 'cactuslink',
			name: 'CactusLink',
			icon: 'https://stellar.walletskit.dev/cactuslink.svg',
			isAvailable: !!(window as any).cactusLink
		},
		{
			id: 'dcent',
			name: 'D\'CENT',
			icon: 'https://stellar.walletskit.dev/dcent.svg',
			isAvailable: !!(window as any).dcent
		}
	];

	return wallets;
}

export async function getAvailableWallets(): Promise<WalletInfo[]> {
	if (typeof window === 'undefined') return [];
	const detected = detectWalletsInBrowser();
	return detected.map((w) => ({
		id: w.id,
		name: w.name,
		icon: w.icon,
		isAvailable: w.isAvailable,
		moduleType: 'wallet'
	}));
}

export async function connectWalletById(
	walletId: string
): Promise<{ publicKey: string } | WalletErrorInfo> {
	try {
		ensureInit();
		StellarWalletsKit.setWallet(walletId);
		const { address } = await StellarWalletsKit.fetchAddress();
		return { publicKey: address };
	} catch (error) {
		return parseWalletError(error);
	}
}

export async function disconnectWallet(): Promise<void> {
	try {
		ensureInit();
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
		ensureInit();
		const result = await StellarWalletsKit.signTransaction(xdr, {
			networkPassphrase: networkPassphrase || Networks.TESTNET
		});
		return {
			signedTxXdr: result.signedTxXdr,
			signerAddress: result.signerAddress || ''
		};
	} catch (error) {
		return parseWalletError(error);
	}
}
