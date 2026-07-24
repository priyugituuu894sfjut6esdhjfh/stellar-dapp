import '@testing-library/svelte/vitest';
import { vi } from 'vitest';

vi.mock('$lib/stellar/wallet', () => ({
	getAvailableWallets: vi.fn().mockResolvedValue([]),
	connectWalletById: vi.fn().mockResolvedValue({ publicKey: 'GTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' }),
	disconnectWallet: vi.fn().mockResolvedValue(undefined),
	signTransaction: vi.fn().mockResolvedValue({ signedTxXdr: 'AAAAAG...', signerAddress: 'GTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' })
}));

vi.mock('$lib/api', () => ({
	fetchBalance: vi.fn().mockResolvedValue({ data: { balance: '100.0000000' } }),
	fetchBalances: vi.fn().mockResolvedValue({
		data: { balances: [{ asset: 'XLM', balance: '100.0000000' }] }
	}),
	validateTransaction: vi.fn().mockResolvedValue({ data: { valid: true } }),
	submitTransaction: vi.fn().mockResolvedValue({ data: { hash: 'abc123' } }),
	fetchTransactionHistory: vi.fn().mockResolvedValue({ data: [] }),
	fetchContractState: vi.fn().mockResolvedValue({ data: { counter: 0 } }),
	simulateContractCall: vi.fn().mockResolvedValue({ data: { result: '0' } }),
	submitContractCall: vi.fn().mockResolvedValue({ data: { hash: 'abc123' } }),
	requestFaucet: vi.fn().mockResolvedValue({ data: { success: true } })
}));
