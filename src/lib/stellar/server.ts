import {
	Networks,
	rpc as SorobanRpc,
	Horizon as StellarHorizon,
	BASE_FEE
} from '@stellar/stellar-sdk';

const SERVER_URL = 'https://soroban-testnet.stellar.org';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;

export const server = new SorobanRpc.Server(SERVER_URL);
export const horizonServer = new StellarHorizon.Server(HORIZON_URL);
export { NETWORK_PASSPHRASE, HORIZON_URL, SERVER_URL, BASE_FEE };
