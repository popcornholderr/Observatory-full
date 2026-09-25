# Builds the Observatory backend (Rust API + Python analysis layer) into a single container.
# The Rust binary shells out to `python3 app.py` at runtime, so both live in the same image.

# ---- Stage 1: Compile the Rust backend ----
# Use Debian Bookworm explicitly to match the runtime stage's glibc version
FROM rust:1-bookworm AS rust-builder
WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends pkg-config libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend ./backend
WORKDIR /build/backend
RUN cargo build --release

# ---- Stage 2: Runtime image with Python + compiled backend ----
# Use Debian Bookworm to ensure 100% glibc & ABI compatibility with Stage 1
FROM python:3.11-slim-bookworm
WORKDIR /app

# Install system runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Python scientific dependencies
COPY python-analysis ./python-analysis
RUN pip install --no-cache-dir -r python-analysis/requirements.txt

# Create required runtime directories
RUN mkdir -p /app/data/uploads /app/data/results /app/data/demo /app/backend

# Copy the compiled Rust binary and ensure executable permissions
COPY --from=rust-builder /build/backend/target/release/backend /app/backend/backend
RUN chmod +x /app/backend/backend

# Environment configuration
ENV PYTHON_BIN=python3
ENV PYTHON_SCRIPT_DIR=/app/python-analysis
ENV UPLOADS_DIR=/app/data/uploads
ENV RESULTS_DIR=/app/data/results
ENV RUST_BACKTRACE=1
ENV RUST_LOG=backend=debug,tower_http=debug

WORKDIR /app/backend
EXPOSE 8000

CMD ["/app/backend/backend"]
