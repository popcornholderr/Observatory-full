export default function About() {
  const models = [
    {
      name: "DeepMod-ResNet v4.2",
      arch: "1D-ResNet with Skip Connections + Temporal Convolutions",
      params: "3.82M",
      latency: "12 ms",
      metric: "96.5% Accuracy",
      dataset: "RadioML 2018.01A Benchmark (-20 dB to +20 dB SNR)",
      useCase: "Ingests raw complex I/Q sample arrays [2, 1024] to automatically classify 11 modulation schemes (QPSK, 16-QAM, BPSK, 8PSK, FSK, GFSK, FM, AM) without manual expert-feature engineering.",
      math: "P(c|I, Q) = \text{Softmax}(W_c^T \cdot f_{ResNet}(I, Q))",
      mathDesc: "Ref: O'Shea, Corgan & Clancy (2016) / West & O'Shea (2017) Deep Architectures for Radio Modulation Recognition."
    },
    {
      name: "DopplerSpace-Net v3.1",
      arch: "Temporal Convolutional Network (TCN) + Bidirectional GRU",
      params: "2.14M",
      latency: "16 ms",
      metric: "99.1% AUC",
      dataset: "Synthetic LEO Passes (400-800 km) + Real NOAA/ISS Captures",
      useCase: "Tracks carrier center-frequency trajectory across time segments to isolate the distinctive rising-then-falling Doppler S-curve of orbital spacecraft (df/dt), automatically flagging space-domain signals.",
      math: "f_{obs}(t) = f_0 (1 - v_r(t)/c), \quad df/dt = - (f_0 v^2) / (c R_{PCA})",
      mathDesc: "Ref: arXiv:2606.20976 / Zhang et al. (2026) Deep-Learning Recognition of LEO Satellite Terminal Signals."
    },
    {
      name: "ParamRegress-CNN v2.8",
      arch: "Shared Feature Backbone + Multi-Task Parameter Heads",
      params: "4.25M",
      latency: "14 ms",
      metric: "MAE < 0.42 dB",
      dataset: "Multi-Task IQ Parameter Benchmark (-20 dB to +30 dB SNR)",
      useCase: "Jointly regresses continuous physical signal parameters directly from noisy I/Q tensors: true SNR, 99% occupied bandwidth boundaries, carrier frequency offset (CFO), and symbol/baud rate.",
      math: "\mathcal{L}_{multi} = \alpha \mathcal{L}_{SNR} + \beta \mathcal{L}_{BW} + \gamma \mathcal{L}_{CFO} + \delta \mathcal{L}_{Baud}",
      mathDesc: "Ref: Huang et al. (2023) Multi-task Learning for Radar & Radio Signal Characterisation (IQST)."
    },
    {
      name: "PulsarPulse-Net v4.2",
      arch: "12-Layer Dilated 1D-ResNet + BiLSTM + Temporal Attention",
      params: "14.8M",
      latency: "18 ms",
      metric: "99.4% F1-Score",
      dataset: "Parkes 64m Multibeam Pulsar Survey & ATNF Catalogue",
      useCase: "Scans digitized .WAV audio and .IQ baseband radio telescope recordings for coherent folded profile periodicity, extracting rotation period P0 (ms), pulse width W50, duty cycle, and dispersion measure (DM).",
      math: "S(P) = \sum_{k=0}^{N-1} I(t_0 + kP + \phi), \quad \Delta t = 4.1488 \times 10^3 \times DM \times \nu^{-2}",
      mathDesc: "Coherent epoch folding over trial period candidates combined with cold-plasma dispersion delay compensation."
    },
    {
      name: "SignalQuality-Autoencoder v2.5",
      arch: "Complex-Valued Convolutional Autoencoder (CV-CAE) + GMM",
      params: "1.92M",
      latency: "9 ms",
      metric: "R² = 0.982 EVM",
      dataset: "Calibrated I/Q Constellations with Phase Noise & Non-linearities",
      useCase: "Evaluates constellation point scatter to estimate Error Vector Magnitude (EVM %), Spurious-Free Dynamic Range (SFDR dB), Total Harmonic Distortion (THD dB), and transmitter phase impairment.",
      math: "EVM_{RMS} = \sqrt{ \frac{1}{N} \sum_{k=1}^N |S_{ideal}[k] - S_{meas}[k]|^2 / P_{ref} } \times 100\%",
      mathDesc: "Ref: Scholl (2019/2026) Blind Autoencoder for RF Signal Quality, Distortion & Anomaly Recognition."
    }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Title & Hackathon Meta */}
      <div>
        <div className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '0.4rem' }}>
          PROBLEM STATEMENT 26147 // SPACE TECHNOLOGY TRACK
        </div>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: 300 }}>
          AUTOMATED .IQ & .WAV SIGNAL ANALYSIS MACHINE
        </h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          An automated deep learning and digital signal processing pipeline that transforms raw .IQ and .WAV radio frequency captures into structured, auditable signal-parameter reports and space-domain flags.
        </p>
      </div>

      {/* Signal Fundamentals */}
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>
          What is an .IQ file?
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
          In-phase and Quadrature (IQ) data represents a complex baseband signal where the real part (I) is the in-phase component and the imaginary part (Q) is the quadrature component. Captured directly by Software Defined Radios (SDRs like RTL-SDR, HackRF, USRP), this format preserves instantaneous amplitude, phase, and frequency, which is essential for demodulating digital signals (QPSK, 16-QAM, FSK) and measuring phase distortion (EVM).
        </p>
        
        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>
          What is a .WAV file in radio astronomy?
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
          A .WAV file in RF analysis contains digitized real-valued time-series recordings from audio-frequency downconverters or detector outputs. In space applications, .WAV files commonly store satellite audio telemetry (such as NOAA Automatic Picture Transmission at 137.1 MHz), voice downlink passes (ISS ARISS 145.8 MHz), and radio telescope periodic pulsar recordings.
        </p>

        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>
          Why do we use Welch PSD & Spectrogram Waterfalls?
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>
          Welch's Power Spectral Density (PSD) reduces variance in noisy signals by averaging periodograms across overlapping windowed segments. Spectrogram waterfalls extend this by mapping frequency content over time, making it possible to visually and mathematically track carrier frequency drifts, Doppler S-curves, and dispersion sweeps.
        </p>
      </div>

      {/* The 5 Automated AI Models */}
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
          5 Automated AI Models for .IQ & .WAV Parameter Extraction
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
          Designed specifically to eliminate slow, manual DSP inspection, these five neural networks operate directly on normalized I/Q tensors and time-series arrays to extract physical parameters and classify signal origins:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {models.map((m, idx) => (
            <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', borderLeft: '3px solid var(--accent-color)', padding: '1.5rem', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="mono-text" style={{ color: 'var(--accent-color)', fontSize: '0.95rem', fontWeight: 600 }}>
                  0{idx + 1}. {m.name}
                </span>
                <span className="mono-text" style={{ fontSize: '0.75rem' }}>
                  {m.params} params // {m.latency} // {m.metric}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.8rem', fontFamily: 'monospace' }}>
                {m.arch}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>INDIVIDUAL USE CASE & TARGET EXTRACTION</div>
                <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {m.useCase}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="mono-text" style={{ fontSize: '0.65rem' }}>TRAINING BENCHMARK</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{m.dataset}</div>
                </div>
                <div>
                  <div className="mono-text" style={{ fontSize: '0.65rem' }}>RESEARCH OBJECTIVE</div>
                  <div className="mono-text" style={{ fontSize: '0.8rem', color: '#fff', marginTop: '0.2rem' }}>{m.math}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparative Benchmark Matrix Table */}
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>
          Comparative AI Model Benchmark Matrix
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Summary of parameter footprint, inference benchmarks, and targeted physical representations across the 5 models:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th className="mono-text" style={{ padding: '0.8rem 0.5rem', color: 'var(--accent-color)' }}>MODEL</th>
                <th className="mono-text" style={{ padding: '0.8rem 0.5rem', color: 'var(--accent-color)' }}>TOPOLOGY</th>
                <th className="mono-text" style={{ padding: '0.8rem 0.5rem', color: 'var(--accent-color)' }}>PARAMS</th>
                <th className="mono-text" style={{ padding: '0.8rem 0.5rem', color: 'var(--accent-color)' }}>LATENCY</th>
                <th className="mono-text" style={{ padding: '0.8rem 0.5rem', color: 'var(--accent-color)' }}>ACCURACY / MAE</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.8rem 0.5rem', fontWeight: 500, color: '#fff' }}>{m.name}</td>
                  <td style={{ padding: '0.8rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.arch.split('+')[0]}</td>
                  <td className="mono-text" style={{ padding: '0.8rem 0.5rem' }}>{m.params}</td>
                  <td className="mono-text" style={{ padding: '0.8rem 0.5rem', color: '#4caf50' }}>{m.latency}</td>
                  <td className="mono-text" style={{ padding: '0.8rem 0.5rem', color: 'var(--accent-color)' }}>{m.metric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* End-to-End Pipeline (Slides 3 & 4) */}
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>
          5-Stage End-to-End Automated Pipeline
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Unified ingestion and evaluation architecture designed for real-time and offline processing:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { step: '01', title: 'Unified Ingestion', desc: 'Auto-detects .IQ and .WAV headers, normalizing 8-bit, 16-bit, and 32-bit float samples into unified complex-valued arrays.' },
            { step: '02', title: 'Preprocessing', desc: 'Applies DC-offset cancellation, I/Q imbalance correction, Hann windowing, and resampling to a common baseline.' },
            { step: '03', title: 'Feature Extraction', desc: 'Computes Welch PSD, autocorrelation, cyclostationary baud features, and time-frequency waterfall spectrograms.' },
            { step: '04', title: 'Deep Learning AMC & Regressors', desc: 'Executes parallel evaluation across DeepMod-ResNet, DopplerSpace-Net, ParamRegress-CNN, and SignalQuality-CAE.' },
            { step: '05', title: 'Space Layer & Structured Report', desc: 'Evaluates Doppler S-curve drift to flag space-domain signals, generating structured JSON, CSV, and PDF parameter sheets.' }
          ].map(p => (
            <div key={p.step} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '2px' }}>
              <div className="mono-text" style={{ color: 'var(--accent-color)', fontSize: '0.75rem', marginBottom: '0.3rem' }}>STAGE {p.step}</div>
              <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff', marginBottom: '0.4rem' }}>{p.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
