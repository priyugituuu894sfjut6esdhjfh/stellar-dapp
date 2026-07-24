const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://decenx.onrender.com';

async function apiGet<T>(path: string): Promise<T> {
	const res = await fetch(`${BACKEND_URL}${path}`);
	const body = await res.json();
	if (!res.ok || !body.success) {
		const msg = body?.error?.message || body?.error || `Backend error ${res.status}`;
		throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
	}
	return body.data;
}

async function apiPost<T>(path: string, data: unknown): Promise<T> {
	const res = await fetch(`${BACKEND_URL}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	const body = await res.json();
	if (!res.ok || !body.success) {
		const msg = body?.error?.message || body?.error || `Backend error ${res.status}`;
		throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
	}
	return body.data;
}

export async function fetchBalance(address: string) {
	return apiGet<{ address: string; balance: string; asset: string }>(
		`/api/wallet/${address}/balance`
	);
}

export async function fetchBalances(address: string) {
	return apiGet<{
		address: string;
		balances: Array<{ asset: string; balance: string; asset_type: string; issuer?: string }>;
	}>(`/api/wallet/${address}/balances`);
}

export async function fetchTransactionHistory(address: string, limit = 10) {
	return apiGet<Array<{ hash: string; memo?: string; source: string; successful: boolean; created_at: string; fee_charged: string; operation_count: number }>>(
		`/api/wallet/${address}/transactions?limit=${limit}`
	);
}

export async function validateTransaction(source: string, destination: string, amount: string) {
	return apiPost<{ valid: boolean }>(
		'/api/transaction/validate',
		{ source, destination, amount }
	);
}

export async function submitTransaction(signedXdr: string) {
	return apiPost<{ hash: string; ledger: number; result_xdr: string }>(
		'/api/transaction/submit',
		{ signed_xdr: signedXdr }
	);
}

export async function simulateContract(contractAddress: string, method: string, args?: unknown[], source?: string) {
	return apiPost<unknown>(
		'/api/contract/simulate',
		{ contract_address: contractAddress, method, args, source }
	);
}

export async function callContract(signedXdr: string) {
	return apiPost<{ hash: string; ledger: number; result: unknown }>(
		'/api/contract/call',
		{ signed_xdr: signedXdr }
	);
}

export async function requestAirdrop(address: string) {
	return apiGet<{ hash: string; message: string }>(
		`/api/faucet/${address}`
	);
}
