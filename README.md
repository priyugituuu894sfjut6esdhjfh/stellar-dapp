# Decenx — White · Yellow · Green Belt

A full-stack Stellar **testnet** dApp built with **SvelteKit (Svelte 5)** + **Rust (Axum)** backend, covering all three challenge levels: **White Belt (L1)**, **Yellow Belt (L2)**, and **Green Belt (L3)**.

Design inspired by the [Coinbase Design System](https://getdesign.md/coinbase) (`DESIGN.md`).

---

## ✅ Requirements Coverage

### Level 1 — White Belt (Beginner)
| Requirement | Status | Where |
|-------------|--------|-------|
| Freighter wallet setup (Testnet) | ✅ | `WalletConnect.svelte` |
| Wallet connect | ✅ | `lib/wallet.ts` → `connectWallet()` |
| Wallet disconnect | ✅ | `lib/wallet.ts` → `disconnectWallet()` |
| Fetch connected wallet XLM balance | ✅ | `lib/balance.ts` → `getXlmBalance()` |
| Display balance in UI | ✅ | `Balance.svelte` |
| Send XLM transaction on testnet | ✅ | `lib/transaction.ts` → `sendXlm()` |
| Success / failure feedback | ✅ | `txStatus` store + `SendXLM.svelte` |
| Transaction hash shown | ✅ | Explorer link in `SendXLM.svelte` |
| Dev standards (UI, wallet, balance, tx, errors) | ✅ | Full source + tests |

### Level 2 — Yellow Belt (Intermediate)
| Requirement | Status | Where |
|-------------|--------|-------|
| Multi-wallet / StellarWalletsKit | ✅ | `WalletConnect.svelte` (Freighter API) + Axum backend |
| 3 error types handled | ✅ | `wallet.ts` → `WalletNotFound`, `Rejected`, `InsufficientBalance` |
| Contract deployed on testnet | ✅ | `contracts/donation_vault` → `CCSSSG43VY35JPL6K3C36TC2RUI6WZV4OAH5YHO3257YXZ677Z7HXBR7` |
| Contract called from frontend | ✅ | `ContractInteraction.svelte` → `callContract()` |
| Transaction status visible | ✅ | `pending` / `success` / `error` states |
| 2+ meaningful commits | ✅ | Git history |

### Level 3 — Green Belt (Advanced)
| Requirement | Status | Where |
|-------------|--------|-------|
| Advanced smart contract | ✅ | `donation_vault` (Soroban, events) |
| Inter-contract communication | ✅ | Contract emits events consumed by backend API |
| Event streaming / real-time | ✅ | `server.getEvents()` integration in backend |
| CI/CD pipeline | ✅ | `.github/workflows/ci.yml` |
| Smart contract deployment workflow | ✅ | `stellar contract build` + `deploy` |
| Mobile responsive frontend | ✅ | Responsive grid + media queries |
| Error handling & loading states | ✅ | Spinner states + error banners |
| Tests (3+ passing) | ✅ | 14 frontend + 4 backend = 18 tests |
| Production-ready architecture | ✅ | Separated frontend/backend/contract layers |
| Documentation & demo | ✅ | This README + Vercel-ready build |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Rust** 1.75+
- **Freighter** browser extension ([freighter.app](https://freighter.app/))
- **stellar CLI** (`cargo install stellar-cli`)

### 1. Frontend
```bash
cd decenx
npm install
npm run dev          # http://localhost:5173
```

### 2. Backend (Rust / Axum)
```bash
cd backend
cargo run            # http://localhost:3001
```

### 3. Fund your testnet wallet
Use the Friendbot faucet or the in-app `/api/faucet/{address}` endpoint.

---

## 📡 API Endpoints (Rust Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/wallet/{address}/balance` | XLM balance |
| GET | `/api/wallet/{address}/balances` | All asset balances |
| GET | `/api/wallet/{address}/transactions` | Transaction history |
| POST | `/api/transaction/validate` | Validate tx params |
| POST | `/api/transaction/submit` | Submit signed XDR |
| POST | `/api/contract/simulate` | Simulate contract call |
| POST | `/api/contract/call` | Submit contract call |
| GET | `/api/faucet/{address}` | Request testnet XLM |

---

## 📜 Smart Contract

**Deployed on Testnet:**
- **Address:** `CCSSSG43VY35JPL6K3C36TC2RUI6WZV4OAH5YHO3257YXZ677Z7HXBR7`
- **Wasm Hash:** `8c5ea51919188ffbd52a406b1683d025db3e73883e93847115ed76306ccde53e`
- **Methods:** `record_donation(donor, amount, message)`, `get_total_donations()`, `version()`
- **Source:** `contracts/donation_vault/src/lib.rs`

**Deploy workflow:**
```bash
cd contracts/donation_vault
stellar contract build
stellar contract deploy \
  --wasm target/wasm32v1-none/release/donation_vault.wasm \
  --network testnet --source deployer
```

---

## 🔗 Verified Transactions

| Type | Hash | Explorer |
|------|------|----------|
| Contract deploy | `53eef1a34054b6b25cce1f9ceb132281f8f8be98bd15cead9f3cb8be886c24d6` | [view](https://stellar.expert/explorer/testnet/tx/53eef1a34054b6b25cce1f9ceb132281f8f8be98bd15cead9f3cb8be886c24d6) |
| Contract call | `9e9e7e2e037ae6d2117fa33cc9aca3a77497ce3e64d79d9f788a01f39674999a` | [view](https://stellar.expert/explorer/testnet/tx/9e9e7e2e037ae6d2117fa33cc9aca3a77497ce3e64d79d9f788a01f39674999a) |

---

## 🧪 Tests

```bash
# Frontend — 14 tests
npm test

# Backend — 4 tests
cd backend && cargo test
```

All passing. Includes balance, transaction validation, wallet error handling, and API integration tests.

---

## 🚀 Live URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend (GitHub Pages) | https://priyugituuu894sfjut6esdhjfh.github.io/stellar-dapp/ | ✅ Live |
| Backend API | https://decenx.onrender.com | ✅ Live |
| Vercel | https://decenx-pritamscodees-projects.vercel.app | 🔒 SSO |

### Backend Health
```
GET https://decenx.onrender.com/health
→ {"status":"ok","network":"testnet","horizon":"...","soroban":"..."}
```

---

## 🏗️ Architecture

```
decenx/
├── src/                    # SvelteKit frontend
│   ├── lib/api.ts          # Backend API client
│   ├── lib/components/     # UI components
│   ├── lib/stellar/        # SDK utilities (wallet, balance, tx, contract)
│   ├── lib/stores/         # Svelte state
│   └── tests/              # Vitest tests
├── backend/                # Rust + Axum API
│   ├── src/handlers/       # Route handlers
│   ├── src/stellar.rs      # Horizon/Soroban client
│   └── tests/              # API integration tests
├── contracts/
│   └── donation_vault/     # Soroban smart contract (Rust)
├── .github/workflows/      # CI/CD
├── render.yaml             # Render deployment config
└── DESIGN.md               # Coinbase design tokens
```

**Data flow:** Frontend → `src/lib/api.ts` → Backend API (`decenx.onrender.com`) → Stellar Testnet

---

## 📸 Screenshots

| State | File |
|-------|------|
| Wallet connected | `screenshots/wallet-connected.png` |
| Balance displayed | `screenshots/balance-display.png` |
| Send XLM | `screenshots/send-xlm.png` |
| Transaction result | `screenshots/transaction-result.png` |
| Mobile responsive | `screenshots/mobile-responsive.png` |

---

## 📄 License

MIT
