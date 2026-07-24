import { horizonServer } from './server';

export async function getXlmBalance(publicKey: string): Promise<string> {
	try {
		const account = await horizonServer.loadAccount(publicKey);
		const xlmBalance = account.balances.find(
			(b: { asset_type: string }) => b.asset_type === 'native'
		);
		return xlmBalance ? xlmBalance.balance : '0';
	} catch (error) {
		console.error('Failed to fetch balance:', error);
		return '0';
	}
}

export async function getAssetBalances(
	publicKey: string
): Promise<Array<{ asset: string; balance: string; issuer?: string }>> {
	try {
		const account = await horizonServer.loadAccount(publicKey);
		return account.balances.map((b: any) => {
			if (b.asset_type === 'native') {
				return { asset: 'XLM', balance: b.balance };
			}
			return {
				asset: `${b.asset_code}`,
				balance: b.balance,
				issuer: b.asset_issuer
			};
		});
	} catch (error) {
		console.error('Failed to fetch balances:', error);
		return [];
	}
}
