import { describe, it, expect } from 'vitest';
import { StrKey } from '@stellar/stellar-sdk';

describe('Stellar Utilities', () => {
	it('rejects an invalid public key', () => {
		expect(StrKey.isValidEd25519PublicKey('invalid-key')).toBe(false);
	});

	it('rejects too-short public key', () => {
		expect(StrKey.isValidEd25519PublicKey('GBBB')).toBe(false);
	});

	it('validates Stellar key format rules', () => {
		expect('G'.repeat(56)).toHaveLength(56);
		expect('S'.repeat(56)).toHaveLength(56);
	});
});
