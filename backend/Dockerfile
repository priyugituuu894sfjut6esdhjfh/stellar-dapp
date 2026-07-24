# Build stage
FROM rust:1.93-slim AS builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/stellar-backend .

EXPOSE 3001

ENV HORIZON_URL=https://horizon-testnet.stellar.org
ENV SOROBAN_URL=https://soroban-testnet.stellar.org
ENV NETWORK_PASSPHRASE=Test SDF Network ; September 2015
ENV PORT=3001
ENV RUST_LOG=info

CMD ["./stellar-backend"]
