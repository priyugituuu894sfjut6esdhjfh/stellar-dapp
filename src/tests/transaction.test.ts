import { describe, it, expect } from 'vitest';
import { sendXlm } from '$lib/stellar/transaction';

describe('Transaction', () => {
	it('rejects invalid amount', async () => {
		const result = await sendXlm('GFAKE', 'GDEST', '0');
		expect(result.success).toBe(false);
		expect(result.message).toContain('Invalid amount');
	});

	it('rejects negative amount', async () => {
		const result = await sendXlm('GFAKE', 'GDEST', '-5');
		expect(result.success).toBe(false);
	});

	it('rejects invalid destination address', async () => {
		const result = await sendXlm('GFAKE', 'invalid', '1');
		expect(result.success).toBe(false);
		expect(result.message).toContain('Invalid destination');
	});

	it('rejects non-numeric amount', async () => {
		const result = await sendXlm('GFAKE', 'GDEST', 'abc');
		expect(result.success).toBe(false);
	});

	it('rejects zero amount', async () => {
		const result = await sendXlm('GFAKE', 'GDEST', '0');
		expect(result.success).toBe(false);
	});
});
