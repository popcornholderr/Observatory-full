# Space Radio Signal Analysis Machine

> **ANALYSE THE RADIO WAVES OR SIGNALS FROM SPACE**

A full-stack, scientific instrument-style web application for analyzing space radio signals. Built for a hackathon.

## Features
- **Upload & Process:** Supports `.WAV` and `.IQ` files.
- **Scientific Pipeline:** File parsing -> Pre-processing -> Detection -> Analysis -> Extraction -> Classification -> Report.
- **Visualizations:** Waveforms, FFTs, Spectrograms, and IQ Constellations.
- **Export:** Export results as JSON, CSV, or PDF.

## Project Structure
- `frontend/`: React + Vite frontend (Liquid Glass aesthetic).
- `backend/`: Rust + Axum backend for API and orchestration.
- `python-analysis/`: Python-based scientific computing layer (NumPy, SciPy, Seaborn).

## How to Run Locally

### 1. Python Analysis Layer
You need Python 3.9+ installed.
```bash
cd python-analysis
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
# Test generating demo data
python generate_demo.py
```

### 2. Rust Backend
You need Rust (cargo) installed.
```bash
cd backend
cargo run
```

### 3. React Frontend
You need Node.js installed.
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

## Demo
Click "Explore Demo Observation" on the home page to run predefined synthetic deep space radio signals through the pipeline.
