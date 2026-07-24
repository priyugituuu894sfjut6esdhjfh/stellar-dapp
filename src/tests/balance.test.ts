import { describe, it, expect } from 'vitest';
import { StrKey } from '@stellar/stellar-sdk';
import { getXlmBalance, getAssetBalances } from '$lib/stellar/balance';

describe('Stellar Balance', () => {
	it('getXlmBalance returns a string', async () => {
		const result = await getXlmBalance('GDNBBD2IYW4B3JYSYQH2WKPQHOQZ6JY2G3E4G2Q5A2X5JX3F5K6L7M8N');
		expect(typeof result).toBe('string');
	});

	it('getAssetBalances returns an array', async () => {
		const result = await getAssetBalances('GDNBBD2IYW4B3JYSYQH2WKPQHOQZ6JY2G3E4G2Q5A2X5JX3F5K6L7M8N');
		expect(Array.isArray(result)).toBe(true);
	});
});
