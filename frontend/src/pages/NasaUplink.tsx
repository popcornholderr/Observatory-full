import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { DSN_STATIONS } from '../services/nasaService';

interface SpaceSignalBenchmark {
  id: string;
  name: string;
  format: '.WAV' | '.IQ';
  freq: string;
  bandwidth: string;
  modulation: string;
  dopplerDrift: string;
  snr: string;
  origin: string;
  description: string;
  demoId: string;
}

export default function NasaUplink() {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<string>('noaa');

  // Space-Domain Signals Benchmark Library (.IQ & .WAV)
  const benchmarks: SpaceSignalBenchmark[] = [
    {
      id: 'noaa',
      name: 'NOAA-19 Weather Satellite APT Pass',
      format: '.WAV',
      freq: '137.100 MHz',
      bandwidth: '41.6 kHz',
      modulation: 'Analog FM / Subcarrier AM',
      dopplerDrift: '-48.5 Hz/s (S-Curve)',
      snr: '18.4 dB',
      origin: 'LEO Weather Satellite (850 km)',
      description: 'Continuous automatic picture transmission broadcast during a direct orbital overhead pass, showing signature Doppler frequency drift.',
      demoId: 'demo-noaa'
    },
    {
      id: 'cubesat',
      name: 'LEO CubeSat QPSK Telemetry Downlink',
      format: '.IQ',
      freq: '437.500 MHz',
      bandwidth: '120.0 kHz',
      modulation: 'QPSK Digital (9600 Baud)',
      dopplerDrift: '-72.0 Hz/s (S-Curve)',
      snr: '22.1 dB',
      origin: 'Orbital CubeSat Downlink',
      description: 'Raw complex I/Q baseband capture exhibiting 4-phase constellation clustering with carrier frequency offset and orbital Doppler.',
      demoId: 'demo-cubesat'
    },
    {
      id: 'iss',
      name: 'ISS ARISS Amateur Radio Packet',
      format: '.WAV',
      freq: '145.800 MHz',
      bandwidth: '16.0 kHz',
      modulation: '1200 Baud AFSK / FM',
      dopplerDrift: '-32.4 Hz/s',
      snr: '16.5 dB',
      origin: 'International Space Station (LEO 418 km)',
      description: 'VHF orbital downlink recorded from Kenwood transceiver aboard the Columbus module during ground station transit.',
      demoId: 'demo-iss'
    },
    {
      id: 'voyager',
      name: 'NASA Deep Space Voyager 1 Carrier',
      format: '.IQ',
      freq: '8.400 GHz (X-Band)',
      bandwidth: '2.4 kHz',
      modulation: 'Narrowband Carrier / BPSK',
      dopplerDrift: '-0.12 Hz/s',
      snr: '8.2 dB',
      origin: 'Interstellar Space (160+ AU)',
      description: 'Weak ultra-narrowband carrier tone received by NASA Deep Space Network 70-meter parabolic dish with extreme path attenuation.',
      demoId: 'demo-voyager'
    },
    {
      id: 'pulsar',
      name: 'Pulsar B0329+54 Cosmic Baseband',
      format: '.WAV',
      freq: '408.000 MHz',
      bandwidth: '2.5 kHz',
      modulation: 'Periodic Coherent Pulse-Train',
      dopplerDrift: '0.00 Hz/s (Barycentric)',
      snr: '19.8 dB',
      origin: 'Neutron Star (ATNF PSR J0332+5434)',
      description: 'Digitized radio telescope baseband recording with a 714.24 ms rotation period and 26.7 pc cm⁻³ dispersion measure.',
      demoId: 'demo-pulsar'
    }
  ];

  const currentBenchmark = benchmarks.find(b => b.id === selectedPreset) || benchmarks[0];

  const handleAnalyzePreset = (demoId: string) => {
    navigate(`/results/${demoId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
              SPACE TECHNOLOGY TRACK // PROBLEM STATEMENT 26147
            </div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: 300 }}>
              SPACE-DOMAIN SIGNALS & DOPPLER ANALYSIS
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, maxWidth: '750px' }}>
              Automated ingestion, parameter extraction, and Doppler S-curve tracking for space-domain satellite and radio astronomy .IQ and .WAV captures.
            </p>
          </div>

          <button 
            className="btn-primary" 
            onClick={() => handleAnalyzePreset(currentBenchmark.demoId)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Play size={16} />
            RUN AUTOMATED PIPELINE
          </button>
        </div>

        {/* NASA Deep Space Network Ground Intercepts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          {DSN_STATIONS.map(station => (
            <div key={station.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '4px', borderLeft: '2px solid var(--accent-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span className="mono-text" style={{ color: '#fff' }}>{station.id} ({station.diameter_m}M DISH)</span>
                <span className="mono-text" style={{ color: '#4caf50', fontSize: '0.65rem' }}>{station.status}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{station.name}</div>
              <div className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--accent-color)', marginTop: '0.3rem' }}>
                TARGET: {station.target_craft} // {station.frequency_ghz} GHz
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doppler S-Curve Innovation Panel (Slide 6) */}
      <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span className="mono-text" style={{ color: 'var(--accent-color)', fontSize: '0.75rem' }}>
              SPACE-DOMAIN INNOVATION // SATELLITE RF DISCRIMINATION
            </span>
            <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.3rem', fontWeight: 400 }}>
              Autonomous Doppler S-Curve Frequency Tracking
            </h3>
          </div>
          <span className="mono-text" style={{ fontSize: '0.8rem', color: '#4caf50' }}>
            df/dt DRIFT SENSITIVITY: &lt; 0.5 Hz/s
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>
          A moving space-based transmitter — such as a LEO satellite pass — produces a distinctive rising-then-falling Doppler frequency curve:
          <span className="mono-text" style={{ color: '#fff', margin: '0 0.5rem' }}>df/dt = - (f₀ · v²) / (c · R_PCA)</span>.
          Our automated pipeline slices the incoming .IQ / .WAV file into segments, estimates instantaneous carrier frequency, and automatically flags the signature Doppler trajectory, separating orbital space signals from stationary terrestrial transmitters.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '2px' }}>
            <div className="mono-text" style={{ fontSize: '0.7rem' }}>ORBITAL VELOCITY (LEO)</div>
            <div style={{ fontSize: '1.2rem', color: '#fff', marginTop: '0.2rem' }}>7.66 km/s</div>
            <div className="mono-text" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>~27,600 km/h</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '2px' }}>
            <div className="mono-text" style={{ fontSize: '0.7rem' }}>VHF MAX DOPPLER (137 MHz)</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}>± 3.49 kHz</div>
            <div className="mono-text" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>NOAA Weather Satellites</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '2px' }}>
            <div className="mono-text" style={{ fontSize: '0.7rem' }}>UHF MAX DOPPLER (437 MHz)</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}>± 11.16 kHz</div>
            <div className="mono-text" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>LEO CubeSats & ISS</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '2px' }}>
            <div className="mono-text" style={{ fontSize: '0.7rem' }}>SPACE-DOMAIN FLAG</div>
            <div style={{ fontSize: '1.2rem', color: '#4caf50', marginTop: '0.2rem' }}>AUTOMATED</div>
            <div className="mono-text" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>Terrestrial RFI Rejection</div>
          </div>
        </div>
      </div>

      {/* Space Signal Benchmark Library (.IQ & .WAV) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="mono-text" style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>
            SPACE RF BENCHMARK LIBRARY (.IQ & .WAV FILES)
          </h2>
          <span className="mono-text" style={{ fontSize: '0.75rem' }}>CLICK PRESET TO TEST AUTOMATED PIPELINE</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {benchmarks.map(b => {
            const isSelected = b.id === selectedPreset;
            return (
              <div 
                key={b.id} 
                className="glass-panel" 
                style={{ 
                  padding: '1.5rem', 
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid var(--accent-color)' : '3px solid rgba(255,255,255,0.1)',
                  background: isSelected ? 'rgba(255, 184, 77, 0.08)' : 'var(--glass-bg)'
                }}
                onClick={() => setSelectedPreset(b.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <span className="mono-text" style={{ color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 600 }}>
                    {b.format} BASEBAND // {b.origin}
                  </span>
                  <span className="mono-text" style={{ fontSize: '0.7rem', color: '#4caf50' }}>{b.snr} SNR</span>
                </div>

                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', color: '#fff' }}>{b.name}</h3>

                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {b.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '2px' }}>
                    <div className="mono-text" style={{ fontSize: '0.65rem' }}>CENTER FREQ</div>
                    <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: '0.15rem' }}>{b.freq}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '2px' }}>
                    <div className="mono-text" style={{ fontSize: '0.65rem' }}>BANDWIDTH</div>
                    <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: '0.15rem' }}>{b.bandwidth}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '2px' }}>
                    <div className="mono-text" style={{ fontSize: '0.65rem' }}>MODULATION</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', marginTop: '0.15rem' }}>{b.modulation}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '2px' }}>
                    <div className="mono-text" style={{ fontSize: '0.65rem' }}>DOPPLER DRIFT</div>
                    <div style={{ fontSize: '0.85rem', color: '#4caf50', marginTop: '0.15rem' }}>{b.dopplerDrift}</div>
                  </div>
                </div>

                <button 
                  className="btn-secondary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnalyzePreset(b.demoId);
                  }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem' }}
                >
                  <span>Analyse This Capture</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
