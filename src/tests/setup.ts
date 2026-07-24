import '@testing-library/svelte/vitest';
import { vi } from 'vitest';

vi.mock('$lib/stellar/wallet', () => ({
	getAvailableWallets: vi.fn().mockResolvedValue([]),
	connectWalletById: vi.fn().mockResolvedValue({ publicKey: 'GTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' }),
	disconnectWallet: vi.fn().mockResolvedValue(undefined),
	signTransaction: vi.fn().mockResolvedValue({ signedTxXdr: 'AAAAAG...', signerAddress: 'GTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' })
}));

vi.mock('$lib/api', () => ({
	fetchBalance: vi.fn().mockResolvedValue({ balance: '100.0000000' }),
	fetchBalances: vi.fn().mockResolvedValue({
		balances: [{ asset: 'XLM', balance: '100.0000000' }]
	}),
	validateTransaction: vi.fn().mockResolvedValue({ valid: true }),
	submitTransaction: vi.fn().mockResolvedValue({ hash: 'abc123' }),
	fetchTransactionHistory: vi.fn().mockResolvedValue([]),
	simulateContract: vi.fn().mockResolvedValue({ counter: 0 }),
	callContract: vi.fn().mockResolvedValue({ hash: 'abc123' }),
	requestAirdrop: vi.fn().mockResolvedValue({ success: true })
}));
