import { fetchBalance, fetchBalances } from '../api';

export async function getXlmBalance(publicKey: string): Promise<string> {
	try {
		const res = await fetchBalance(publicKey);
		return res.balance;
	} catch (error) {
		console.error('Failed to fetch balance:', error);
		return '0';
	}
}

export async function getAssetBalances(
	publicKey: string
): Promise<Array<{ asset: string; balance: string; issuer?: string }>> {
	try {
		const res = await fetchBalances(publicKey);
		return res.balances.map((b) => ({
			asset: b.asset,
			balance: b.balance,
			issuer: b.issuer
		}));
	} catch (error) {
		console.error('Failed to fetch balances:', error);
		return [];
	}
}
