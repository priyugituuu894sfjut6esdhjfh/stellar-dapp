const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://decenx.onrender.com';

async function apiGet<T>(path: string): Promise<T> {
	const res = await fetch(`${BACKEND_URL}${path}`);
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error || `Backend error ${res.status}`);
	}
	return res.json();
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
	const res = await fetch(`${BACKEND_URL}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.error || `Backend error ${res.status}`);
	}
	return res.json();
}

export async function fetchBalance(address: string) {
	return apiGet<{ success: boolean; data: { address: string; balance: string; asset: string } }>(
		`/api/wallet/${address}/balance`
	);
}

export async function fetchBalances(address: string) {
	return apiGet<{
		success: boolean;
		data: { address: string; balances: Array<{ asset: string; balance: string; asset_type: string; issuer?: string }> };
	}>(`/api/wallet/${address}/balances`);
}

export async function fetchTransactionHistory(address: string, limit = 10) {
	return apiGet<{ success: boolean; data: Array<{ hash: string; memo?: string; source: string; successful: boolean; created_at: string; fee_charged: string; operation_count: number }> }>(
		`/api/wallet/${address}/transactions?limit=${limit}`
	);
}

export async function validateTransaction(source: string, destination: string, amount: string) {
	return apiPost<{ success: boolean; data: { valid: boolean } }>(
		'/api/transaction/validate',
		{ source, destination, amount }
	);
}

export async function submitTransaction(signedXdr: string) {
	return apiPost<{ success: boolean; data: { hash: string; ledger: number; result_xdr: string } }>(
		'/api/transaction/submit',
		{ signed_xdr: signedXdr }
	);
}

export async function simulateContract(contractAddress: string, method: string, args?: unknown[], source?: string) {
	return apiPost<{ success: boolean; data: unknown }>(
		'/api/contract/simulate',
		{ contract_address: contractAddress, method, args, source }
	);
}

export async function callContract(signedXdr: string) {
	return apiPost<{ success: boolean; data: { hash: string; ledger: number; result: unknown } }>(
		'/api/contract/call',
		{ signed_xdr: signedXdr }
	);
}

export async function requestAirdrop(address: string) {
	return apiGet<{ success: boolean; data: { hash: string; message: string } }>(
		`/api/faucet/${address}`
	);
}
