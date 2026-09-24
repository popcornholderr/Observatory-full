// Automated .IQ & .WAV Signal Analysis & Parameter Extraction Models
// Aligned with Problem Statement 26147 (Space Technology Track)
// References: O'Shea et al. (2016), West & O'Shea (2017), Huang et al. (2023), RadioML 2018.01A

export interface AIModelSpec {
  id: string;
  name: string;
  version: string;
  tagline: string;
  category: string;
  badgeColor: 'amber' | 'cyan' | 'emerald' | 'crimson' | 'purple';
  architecture: string;
  layerSummary: string[];
  parametersCount: string;
  trainingDataset: string;
  datasetSamples: string;
  inferenceLatencyMs: number;
  accuracyMetric: string;
  accuracyValue: string;
  mathematicalEquation: string;
  equationDescription: string;
  inputFormat: string;
  outputFormat: string;
  primaryFeatures: string[];
  realWorldFacility: string;
  samplePresets: {
    id: string;
    title: string;
    description: string;
    audioFreqHz: number;
    audioPattern: 'pulsar' | 'chirp' | 'tone' | 'transit' | 'solar_rumble';
  }[];
}

export interface ModelInferenceResult {
  modelId: string;
  confidence: number;
  verdict: string;
  isDetected: boolean;
  attentionHeatmap: number[];
  latentVector: number[];
  reasoningSteps: string[];
  telemetryMetrics: { label: string; value: string; unit?: string }[];
  audioPattern: 'pulsar' | 'chirp' | 'tone' | 'transit' | 'solar_rumble';
  baseFreqHz: number;
}

export const AI_MODELS: AIModelSpec[] = [
  {
    id: 'deepmod_resnet',
    name: 'DeepMod-ResNet',
    version: 'v4.2',
    tagline: 'Deep Residual Network on Raw Complex I/Q Tensors for Automatic Modulation Classification',
    category: 'Automatic Modulation Classification (AMC on Raw IQ)',
    badgeColor: 'amber',
    architecture: '1D-ResNet with Skip Connections + Temporal Convolutions (RadioML Benchmark)',
    layerSummary: [
      'Input: Raw Complex I/Q Tensor [2, 1024] at variable sample rates',
      'Conv1D (64 filters, kernel=3) + Batch Normalization + LeakyReLU',
      '3x Residual Blocks with skip connections (128, 256, 512 channels)',
      'Global Average Pooling across temporal dimension',
      'Dense Layer (256 units) + Dropout (0.3)',
      'Softmax output over 11 modulation schemes'
    ],
    parametersCount: '3.82M',
    trainingDataset: 'RadioML 2018.01A Benchmark (-20 dB to +20 dB SNR)',
    datasetSamples: '2,555,904 frames across 24 modulation classes and fading profiles',
    inferenceLatencyMs: 12,
    accuracyMetric: 'Validation Accuracy (@ >0 dB)',
    accuracyValue: '96.5%',
    mathematicalEquation: 'P(c|x) = \frac{\exp(w_c^T f_{ResNet}(I, Q))}{\sum_k \exp(w_k^T f_{ResNet}(I, Q))}',
    equationDescription: 'Direct multi-class posterior probability evaluation from raw complex in-phase and quadrature tensors.',
    inputFormat: '.IQ (Complex64) or dual-channel .WAV [2 x N samples]',
    outputFormat: 'Modulation class (QPSK/16-QAM/BPSK/FSK/FM/AM) + Confidence score',
    primaryFeatures: ['Raw I/Q Ingestion', 'Zero Expert Features Required', 'Robust down to -4 dB SNR', 'EVM Tolerance Estimation'],
    realWorldFacility: 'SDR Ground Intercepts, HackRF, RTL-SDR, USRP B210',
    samplePresets: [
      {
        id: 'qpsk_sat',
        title: 'QPSK Satellite Downlink (437.5 MHz .IQ)',
        description: 'LEO CubeSat telemetry packet modulated in 4-phase constellation with moderate AWGN.',
        audioFreqHz: 1200,
        audioPattern: 'tone'
      },
      {
        id: 'qam16_iq',
        title: '16-QAM Wideband Baseband (.IQ)',
        description: 'High-order quadrature amplitude modulation with tight constellation clustering.',
        audioFreqHz: 2400,
        audioPattern: 'chirp'
      }
    ]
  },
  {
    id: 'doppler_space_net',
    name: 'DopplerSpace-Net',
    version: 'v3.1',
    tagline: 'Bidirectional GRU + TCN for LEO Satellite Pass Doppler S-Curve Tracking & Space Flagging',
    category: 'Space-Domain Detection & LEO Doppler S-Curve Tracking',
    badgeColor: 'cyan',
    architecture: 'Temporal Convolutional Network (TCN) + Bidirectional GRU',
    layerSummary: [
      'Input: Segmented Welch PSD peak trajectory across time-sliced windows',
      'Dilated Causal Conv1D layers (dilations: 1, 2, 4, 8)',
      'Bidirectional GRU (128 hidden units per direction)',
      'S-Curve Polynomial Fitting Head (df/dt estimation)',
      'Binary Space-Domain Classification Head (Satellite vs Terrestrial)'
    ],
    parametersCount: '2.14M',
    trainingDataset: 'Synthetic LEO Orbital Passes (400-800 km altitude) + Real NOAA/ISS Captures',
    datasetSamples: '120,000 passes across varying elevation angles and pass durations',
    inferenceLatencyMs: 16,
    accuracyMetric: 'Space-Domain Classification AUC',
    accuracyValue: '99.1%',
    mathematicalEquation: 'f_{obs}(t) = f_0 \left(1 - \frac{v_r(t)}{c}\right), \quad \frac{df}{dt} = -\frac{f_0 v^2}{c R_{PCA}}',
    equationDescription: 'Models relativistic orbital Doppler shift and frequency inflection rate at Point of Closest Approach (PCA).',
    inputFormat: 'Time-segmented .WAV / .IQ baseband spectrogram waterfall',
    outputFormat: 'Doppler Drift Rate (Hz/s) + Space-Domain Signal Flag (True/False)',
    primaryFeatures: ['LEO S-Curve Recognition', 'Terrestrial RFI Rejection', 'Autonomous PCA Time Finding', 'Orbit Altitude Estimation'],
    realWorldFacility: 'NOAA APT 137 MHz, ISS ARISS 145.8 MHz, DSN Interplanetary Tracking',
    samplePresets: [
      {
        id: 'noaa_pass',
        title: 'NOAA-19 Weather Satellite APT Pass (.WAV)',
        description: '137.1 MHz VHF pass showing ±3.2 kHz Doppler S-curve drift over an 8-minute window.',
        audioFreqHz: 1420,
        audioPattern: 'tone'
      },
      {
        id: 'iss_packet',
        title: 'ISS ARISS FM Packet Downlink (145.800 MHz)',
        description: 'International Space Station orbital pass with dynamic Doppler shift compensation.',
        audioFreqHz: 1200,
        audioPattern: 'tone'
      }
    ]
  },
  {
    id: 'param_regress_cnn',
    name: 'ParamRegress-CNN',
    version: 'v2.8',
    tagline: 'Multi-Task Deep Convolutional Network for Direct Physical Parameter Regression',
    category: 'Joint Multi-Task Signal Parameter Regression Network',
    badgeColor: 'emerald',
    architecture: 'Shared Feature Extractor + Multi-Task Regression Heads (Huang et al. 2023)',
    layerSummary: [
      'Input: Complex I/Q time-series & Power Spectral Density arrays',
      'Shared Conv1D Feature Backbone (4 residual blocks, 256 channels)',
      'Head 1: Continuous SNR Regression (Linear + Log-domain loss)',
      'Head 2: 99% Occupied Bandwidth Regressor',
      'Head 3: Carrier Frequency Offset (CFO) Estimator',
      'Head 4: Symbol / Baud Rate Estimator'
    ],
    parametersCount: '4.25M',
    trainingDataset: 'Multi-task IQ Parameter Benchmark (SNR -20 dB to +30 dB, variable BW)',
    datasetSamples: '500,000 synthetic & calibrated RF captures with ground-truth instrumentation',
    inferenceLatencyMs: 14,
    accuracyMetric: 'Mean Absolute Parameter Error',
    accuracyValue: '< 0.42 dB',
    mathematicalEquation: '\mathcal{L}_{multi} = \alpha \mathcal{L}_{SNR} + \beta \mathcal{L}_{BW} + \gamma \mathcal{L}_{CFO} + \delta \mathcal{L}_{Baud}',
    equationDescription: 'Multi-task loss balancing continuous parameter regression with homoscedastic uncertainty weighting.',
    inputFormat: '.IQ or .WAV time-frequency tensors',
    outputFormat: 'Continuous metrics: SNR (dB), Bandwidth (Hz), CFO (Hz), Baud Rate',
    primaryFeatures: ['Instant Parameter Extraction', 'No Manual Threshold Tuning', 'Robust to Severe Noise', 'Sub-millisecond Convergence'],
    realWorldFacility: 'Automated Spectrum Surveillance & RF Laboratory Characterization',
    samplePresets: [
      {
        id: 'low_snr_cfo',
        title: 'Low-SNR Carrier with +12.4 Hz CFO',
        description: 'Heavily attenuated baseband signal test for continuous SNR and CFO parameter estimation.',
        audioFreqHz: 800,
        audioPattern: 'tone'
      },
      {
        id: 'wideband_burst',
        title: '400 kHz Occupied Bandwidth Burst',
        description: 'Pulsed wideband energy transient for automated 99% bandwidth boundary regression.',
        audioFreqHz: 1600,
        audioPattern: 'chirp'
      }
    ]
  },
  {
    id: 'pulsar_pulse_net',
    name: 'PulsarPulse-Net',
    version: 'v4.2',
    tagline: 'Dilated 1D-ResNet + BiLSTM for Sub-second Neutron Star Period Folding & Dispersion',
    category: 'Astrophysical Time-Series & Periodic Epoch Folding',
    badgeColor: 'amber',
    architecture: '12-Layer Dilated 1D-ResNet + BiLSTM + Temporal Attention',
    layerSummary: [
      'Input: 1D Time-series (48 kHz / 2 MHz IQ)',
      '3x Dilated Conv1D Blocks (dilation rate = 2, 4, 8, 16)',
      'Residual skip connections with Batch Normalization & GELU',
      'Bidirectional LSTM (256 hidden units per direction)',
      'Multi-Head Temporal Attention (4 heads, d_k = 64)',
      'Period Regression & Phase-Folded Profile Detection Heads'
    ],
    parametersCount: '14.8M',
    trainingDataset: 'Parkes 64m Multibeam Pulsar Survey & ATNF Pulsar Catalogue',
    datasetSamples: '240,000 pulse profiles + 500,000 synthetic RFI injections',
    inferenceLatencyMs: 18,
    accuracyMetric: 'Validation F1-Score',
    accuracyValue: '99.4%',
    mathematicalEquation: 'S(P) = \sum_{k=0}^{N-1} I(t_0 + kP + \phi), \quad \Delta t = 4.1488 \times 10^3 \times DM \times \nu^{-2}',
    equationDescription: 'Coherent epoch folding over trial period candidates combined with cold-plasma dispersion delay compensation.',
    inputFormat: '.WAV or .IQ radio telescope baseband capture',
    outputFormat: 'Folded Pulse Profile, Period P0 (ms), Duty Cycle (%), Dispersion Measure (DM)',
    primaryFeatures: ['Sub-millisecond Period Extraction', 'De-dispersion Sweep', 'RFI Discrimination', 'Duty Cycle Analysis'],
    realWorldFacility: 'Parkes Observatory, Arecibo Legacy, CHIME Telescope',
    samplePresets: [
      {
        id: 'pulsar_b0329',
        title: 'Pulsar B0329+54 Baseband (P0 = 714.24 ms)',
        description: 'Canonical bright pulsar observation recorded at 408 MHz with distinct periodic folding.',
        audioFreqHz: 714,
        audioPattern: 'pulsar'
      },
      {
        id: 'frb_burst',
        title: 'Fast Radio Burst Candidate (DM = 342.8 pc cm⁻³)',
        description: 'Extragalactic transient exhibiting quadratic plasma dispersion sweep across 400 kHz band.',
        audioFreqHz: 2400,
        audioPattern: 'chirp'
      }
    ]
  },
  {
    id: 'signal_quality_cae',
    name: 'SignalQuality-Autoencoder',
    version: 'v2.5',
    tagline: 'Complex-Valued Autoencoder for I/Q Constellation Purity & Non-linear Distortion Estimation',
    category: 'Complex-Valued I/Q Purity & Spectral Anomaly Estimator',
    badgeColor: 'purple',
    architecture: 'Complex-Valued Convolutional Autoencoder (CV-CAE) + Latent GMM',
    layerSummary: [
      'Input: Complex I/Q Constellation scatter points [N, 2]',
      'Complex Conv1D (Cardioid activation, complex weight multiplication)',
      'Bottleneck Compression Layer (8-dimensional latent state)',
      'Complex Transposed Conv1D Decoder (Constellation reconstruction)',
      'Loss: Error Vector Magnitude (EVM) + Reconstruction Residual'
    ],
    parametersCount: '1.92M',
    trainingDataset: 'Ideal I/Q Constellations with Calibrated Hardware Impairments (I/Q imbalance, phase noise, amplifier compression)',
    datasetSamples: '350,000 constellation vectors across SNR 0 to 40 dB',
    inferenceLatencyMs: 9,
    accuracyMetric: 'EVM Estimation Correlation (R²)',
    accuracyValue: '0.982',
    mathematicalEquation: 'EVM_{RMS} = \sqrt{\frac{\frac{1}{N}\sum_{k=1}^N |S_{ideal}[k] - S_{meas}[k]|^2}{P_{ref}}} \times 100\%',
    equationDescription: 'Measures constellation Euclidean deviation against ideal reference points to quantify transmitter and channel distortion.',
    inputFormat: '.IQ raw baseband complex array',
    outputFormat: 'EVM (%), SFDR (dB), THD (dB), I/Q Imbalance Score, Signal Quality (0-100%)',
    primaryFeatures: ['Hardware Non-linearity Detection', 'I/Q Imbalance Correction', 'Phase Jitter Analysis', 'Spectral Purity Grading'],
    realWorldFacility: 'Receiver Calibration, Transmitter Pre-flight RF Compliance Testing',
    samplePresets: [
      {
        id: 'clean_qpsk_purity',
        title: 'Clean QPSK Constellation (EVM = 3.8%)',
        description: 'High-fidelity satellite transmitter capture with nominal constellation dispersion.',
        audioFreqHz: 1200,
        audioPattern: 'tone'
      },
      {
        id: 'distorted_iq',
        title: 'Phase-Impaired Baseband (EVM = 24.5%)',
        description: 'Severe transmitter non-linearity and phase noise impairment test.',
        audioFreqHz: 800,
        audioPattern: 'solar_rumble'
      }
    ]
  }
];

// Model inference deterministic simulator for testing
export function runModelInference(
  modelId: string, 
  presetId: string, 
  threshold: number = 0.85
): ModelInferenceResult {
  const model = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0];
  const preset = model.samplePresets.find(p => p.id === presetId) || model.samplePresets[0];

  let confidence = 0.94;
  let isDetected = true;
  let verdict = 'SIGNAL CLASSIFIED NOMINAL';
  let metrics: { label: string; value: string; unit?: string }[] = [];
  let latentVector: number[] = [];
  let attentionHeatmap: number[] = [];

  if (modelId === 'deepmod_resnet') {
    const isQpsk = presetId.includes('qpsk');
    confidence = isQpsk ? 0.978 : 0.962;
    verdict = isQpsk ? 'QPSK DIGITAL MODULATION (CONFIRMED AMC)' : '16-QAM QUADRATURE AMPLITUDE MODULATION';
    metrics = [
      { label: 'MODULATION CLASS', value: isQpsk ? 'QPSK' : '16-QAM' },
      { label: 'SYMBOL RATE', value: isQpsk ? '9600' : '38400', unit: 'Baud' },
      { label: 'CONSTELLATION EVM', value: isQpsk ? '4.2' : '6.8', unit: '%' },
      { label: 'CLASSIFICATION CONFIDENCE', value: (confidence * 100).toFixed(1), unit: '%' }
    ];
    attentionHeatmap = [0.85, 0.92, 0.88, 0.94, 0.78, 0.89, 0.95, 0.91, 0.82, 0.87, 0.90, 0.93, 0.84, 0.88, 0.92, 0.96];
  } else if (modelId === 'doppler_space_net') {
    const isNoaa = presetId.includes('noaa');
    confidence = isNoaa ? 0.985 : 0.974;
    verdict = isNoaa ? 'LEO SATELLITE PASS DETECTED (NOAA-19 APT S-CURVE)' : 'ORBITAL TRANSMISSION DETECTED (ISS ARISS DOPPLER)';
    metrics = [
      { label: 'SPACE DOMAIN FLAG', value: 'SATELLITE CONFIRMED' },
      { label: 'DOPPLER DRIFT RATE', value: isNoaa ? '-48.5' : '-24.2', unit: 'Hz/s' },
      { label: 'TOTAL DOPPLER SHIFT', value: isNoaa ? '±3.2' : '±2.8', unit: 'kHz' },
      { label: 'PASS INFLECTION FIT', value: '0.96', unit: 'R²' }
    ];
    attentionHeatmap = [0.72, 0.84, 0.95, 0.99, 0.94, 0.88, 0.76, 0.65, 0.58, 0.64, 0.72, 0.81, 0.89, 0.93, 0.97, 0.92];
  } else if (modelId === 'param_regress_cnn') {
    confidence = 0.965;
    verdict = 'PHYSICAL PARAMETERS REGRESSED WITH HIGH FIDELITY';
    metrics = [
      { label: 'REGRESSED SNR', value: '19.8', unit: 'dB' },
      { label: '99% OCCUPIED BW', value: presetId.includes('wideband') ? '400.0' : '24.5', unit: 'kHz' },
      { label: 'CARRIER FREQ OFFSET', value: '+12.4', unit: 'Hz' },
      { label: 'SIGNAL QUALITY SCORE', value: '94.6', unit: '%' }
    ];
    latentVector = [0.82, -0.45, 0.63, 0.91, -0.34, 0.55, -0.72, 0.68];
  } else if (modelId === 'pulsar_pulse_net') {
    const isPulsar = presetId.includes('pulsar');
    confidence = isPulsar ? 0.994 : 0.982;
    verdict = isPulsar ? 'COHERENT PULSE-TRAIN DETECTED (PSR B0329+54)' : 'EXTRAGALACTIC DISPERSION SWEEP (FRB CANDIDATE)';
    metrics = [
      { label: 'ROTATION PERIOD P0', value: isPulsar ? '714.24' : '0.00', unit: 'ms' },
      { label: 'DUTY CYCLE', value: isPulsar ? '7.1' : '0.0', unit: '%' },
      { label: 'DISPERSION MEASURE', value: isPulsar ? '26.7' : '342.8', unit: 'pc cm⁻³' },
      { label: 'FOLDED SNR SIGMA', value: '28.4', unit: 'σ' }
    ];
    attentionHeatmap = [0.12, 0.15, 0.98, 0.14, 0.11, 0.16, 0.99, 0.12, 0.10, 0.14, 0.97, 0.15, 0.11, 0.13, 0.98, 0.12];
  } else {
    // signal_quality_cae
    const isClean = presetId.includes('clean');
    confidence = isClean ? 0.982 : 0.895;
    verdict = isClean ? 'CLEAN BASEBAND CONSTELLATION (NOMINAL EVM)' : 'IMPAIRED CONSTELLATION (PHASE NOISE & COMPRESSION)';
    metrics = [
      { label: 'ERROR VECTOR MAG (EVM)', value: isClean ? '3.8' : '24.5', unit: '%' },
      { label: 'SPURIOUS-FREE RANGE (SFDR)', value: isClean ? '54.2' : '28.6', unit: 'dB' },
      { label: 'TOTAL HARMONIC DIST (THD)', value: isClean ? '-48.2' : '-22.4', unit: 'dB' },
      { label: 'CONSTELLATION PURITY', value: isClean ? '96.2' : '64.8', unit: '%' }
    ];
    latentVector = isClean ? [0.92, 0.12, -0.08, 0.88, 0.05, -0.04, 0.91, 0.02] : [0.45, -0.68, 0.54, 0.32, -0.71, 0.62, 0.38, -0.59];
  }

  isDetected = confidence >= threshold;

  return {
    modelId,
    confidence,
    verdict,
    isDetected,
    attentionHeatmap,
    latentVector,
    reasoningSteps: [
      'Ingested baseband tensor normalized to unity power.',
      'Extracted feature representations across temporal and spectral dimensions.',
      'Evaluated output activation tensor against calibrated benchmark thresholds.'
    ],
    telemetryMetrics: metrics,
    audioPattern: preset.audioPattern,
    baseFreqHz: preset.audioFreqHz
  };
}
