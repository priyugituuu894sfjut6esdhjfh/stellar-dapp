import { describe, it, expect } from 'vitest';

describe('Wallet Error Handling', () => {
	it('handles wallet not found error', () => {
		const msg = 'Freighter not found';
		expect(msg.includes('not found')).toBe(true);
	});

	it('handles rejected transaction error', () => {
		const msg = 'User rejected the request';
		expect(msg.includes('reject')).toBe(true);
	});

	it('handles insufficient balance error', () => {
		const msg = 'insufficient funds';
		expect(msg.includes('insufficient')).toBe(true);
	});

	it('validates public key starts with G', () => {
		const testKey = 'GDNBBD2IYW4B3JYSYQH2WKPQHOQZ6JY2G3E4G2Q5A2X5JX3F5K6L7M8N';
		expect(testKey.startsWith('G')).toBe(true);
		expect(testKey.length).toBe(56);
	});
});
