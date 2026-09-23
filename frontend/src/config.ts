// Base URL of the Rust backend API.
//
// In production (e.g. on Vercel), set VITE_API_URL to your deployed backend's
// URL, e.g. https://observatory-p4pz.onrender.com — no trailing slash.
//
// Locally, it falls back to the default `cargo run` address.
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8000';
