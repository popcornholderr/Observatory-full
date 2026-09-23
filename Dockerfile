# Builds the Observatory backend (Rust API + Python analysis layer) into a single
# container. The Rust binary shells out to `python3 app.py` at runtime, so both
# need to live in the same image.

# ---- Stage 1: compile the Rust backend ----
FROM rust:1.82-slim AS rust-builder
WORKDIR /build
RUN apt-get update && apt-get install -y --no-install-recommends pkg-config libssl-dev \
    && rm -rf /var/lib/apt/lists/*
COPY backend ./backend
WORKDIR /build/backend
RUN cargo build --release

# ---- Stage 2: runtime image with Python + the compiled backend ----
FROM python:3.11-slim
WORKDIR /app

# Python analysis layer
COPY python-analysis ./python-analysis
RUN pip install --no-cache-dir -r python-analysis/requirements.txt

# Data directories the backend reads/writes (uploads, generated plots, results).
# NOTE: Render's default disk is ephemeral — files here are wiped on every
# redeploy/restart. For real persistence, attach a Render Disk mounted at /app/data.
RUN mkdir -p data/uploads data/results data/demo

# Compiled backend binary
COPY --from=rust-builder /build/backend/target/release/backend ./backend/backend

ENV PYTHON_BIN=python3
ENV PYTHON_SCRIPT_DIR=/app/python-analysis
ENV UPLOADS_DIR=/app/data/uploads
ENV RESULTS_DIR=/app/data/results

WORKDIR /app/backend
EXPOSE 8000
CMD ["./backend"]
