# ---- Stage 1: build the Rust backend ----
# Pin to Debian Bookworm to match the Python runtime's glibc version
FROM rust:1-bookworm AS builder

WORKDIR /app/backend
COPY backend/Cargo.toml backend/Cargo.lock* ./
# Pre-fetch deps for layer caching
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release || true

COPY backend/src ./src
RUN cargo build --release

# ---- Stage 2: runtime image with Python + the compiled binary ----
# Use Debian Bookworm to guarantee 100% glibc and ABI compatibility
FROM python:3.11-slim-bookworm

# Install runtime system certificates
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies for the analysis pipeline
WORKDIR /app/python-analysis
COPY python-analysis/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY python-analysis/ .

# Bring in the compiled Rust binary and ensure executable permissions
WORKDIR /app/backend
COPY --from=builder /app/backend/target/release/backend ./backend
RUN chmod +x ./backend

# Data dirs the Rust app writes to (uploads + results + demo), created up front
RUN mkdir -p /app/data/uploads /app/data/results /app/data/demo

# Env vars matching the Rust code's relative-path expectations
ENV PYTHON_BIN=python3
ENV PYTHON_SCRIPT_DIR=../python-analysis
ENV UPLOADS_DIR=../data/uploads
ENV RESULTS_DIR=../data/results
ENV RUST_BACKTRACE=1
ENV RUST_LOG=backend=debug,tower_http=debug

EXPOSE 8000
CMD ["./backend"]
