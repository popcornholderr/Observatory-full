import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { API_BASE_URL } from '../config';

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/analysis/${id}/results`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setError('Could not fetch results.');
        }
      } catch (err) {
        setError('Connection failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setGeneratingPDF(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#08080a',
        logging: false
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Observation_${id}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>Loading results...</div>;
  }

  if (error || !data) {
    return <div style={{ color: '#ff4d4d', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>{error || 'No data found'}</div>;
  }

  const { detection, parameters, classification, visualizations } = data;

  const renderValue = (val: any) => val !== undefined && val !== null ? val : 'N/A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header outside of the PDF capture area */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '-1rem' }}>
        <a href={`${API_BASE_URL}/api/analysis/${id}/export/json`} download className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> JSON
        </a>
        <a href={`${API_BASE_URL}/api/analysis/${id}/export/csv`} download className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> CSV
        </a>
        <button 
          className="btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
          onClick={downloadPDF}
          disabled={generatingPDF}
        >
          {generatingPDF ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {generatingPDF ? 'GENERATING...' : 'PDF REPORT'}
        </button>
      </div>

      {/* The Area to Capture for PDF */}
      <div ref={reportRef} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: 300 }}>OBSERVATION ANALYSIS</h1>
            <div className="mono-text">JOB ID: {id}</div>
          </div>
        </div>

      {/* Summary Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="mono-text" style={{ marginBottom: '0.5rem' }}>SIGNAL DETECTED</div>
          <div style={{ fontSize: '1.8rem', color: detection?.signal_present ? '#4caf50' : '#ff4d4d' }}>
            {detection?.signal_present ? 'YES' : 'NO'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="mono-text" style={{ marginBottom: '0.5rem' }}>CLASSIFICATION</div>
          <div style={{ fontSize: '1.8rem', color: 'var(--accent-color)' }}>
            {renderValue(classification?.type)}
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            CONF: {renderValue(classification?.confidence_percent)}%
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="mono-text" style={{ marginBottom: '0.5rem' }}>CENTER FREQUENCY</div>
          <div style={{ fontSize: '1.8rem' }}>
            {parameters?.center_frequency_hz ? (parameters.center_frequency_hz / 1000).toFixed(2) : 'N/A'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kHz</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="mono-text" style={{ marginBottom: '0.5rem' }}>BANDWIDTH</div>
          <div style={{ fontSize: '1.8rem' }}>
            {parameters?.bandwidth_hz ? (parameters.bandwidth_hz / 1000).toFixed(2) : 'N/A'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kHz</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="mono-text" style={{ marginBottom: '0.5rem' }}>SNR</div>
          <div style={{ fontSize: '1.8rem' }}>
            {renderValue(parameters?.snr_db)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>dB</span>
          </div>
        </div>
        
        {parameters?.dispersion_measure_pc_cm3 > 0 && (
          <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
            <div className="mono-text" style={{ marginBottom: '0.5rem', color: '#ffb84d' }}>DISPERSION MEASURE (FRB ESTIMATE)</div>
            <div style={{ fontSize: '1.8rem' }}>
              {parameters.dispersion_measure_pc_cm3} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>pc cm⁻³</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.4 }}>
              Dispersion indicates the signal traveled through intergalactic plasma. Higher values = further origin.
            </div>
          </div>
        )}

      </div>

      {/* Scientific Context Panel */}
      <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255, 184, 77, 0.05)', borderLeft: '4px solid var(--accent-color)' }}>
        <h3 className="mono-text" style={{ color: 'var(--accent-color)', margin: '0 0 1rem 0' }}>RESEARCH CONTEXT</h3>
        <p style={{ color: 'var(--text-main)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
          The classification above utilizes heuristic models inspired by real-world radio astronomy frameworks.
          {classification?.type === 'FAST_RADIO_BURST (FRB)' && " Our Fast Radio Burst detection simulates dispersion methodologies used by the CHIME/FRB project (Amiri et al. 2018), where sweeping broadband pulses are isolated using energy thresholding."}
          {classification?.type === 'PULSAR_EMISSION' && " Pulsar identification leverages periodic pulse-train extraction, a staple in neutron star monitoring programs."}
          {classification?.type === 'NOAA_APT_SATELLITE' && " Weather satellite (APT) recognition looks for the specific bandwidth signatures used to broadcast 137 MHz VHF imagery down to Earth."}
        </p>
      </div>

      {/* Advanced DSP Metrics */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="mono-text" style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>ADVANCED DSP METRICS</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="mono-text" style={{ fontSize: '0.85rem', color: parameters?.signal_quality_percent > 80 ? '#4caf50' : (parameters?.signal_quality_percent > 40 ? '#ffb84d' : '#ff4d4d') }}>
              SIGNAL QUALITY: {renderValue(parameters?.signal_quality_percent)}%
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
            <div className="mono-text" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>PEAK / NYQUIST FREQ</div>
            <div style={{ fontSize: '1.2rem' }}>
              {parameters?.peak_frequency_hz ? (parameters.peak_frequency_hz / 1000).toFixed(2) : 'N/A'} / {parameters?.nyquist_frequency_hz ? (parameters.nyquist_frequency_hz / 1000).toFixed(2) : 'N/A'} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kHz</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
            <div className="mono-text" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>RMS / PEAK AMPLITUDE</div>
            <div style={{ fontSize: '1.2rem' }}>
              {renderValue(parameters?.rms_amplitude)} / {renderValue(parameters?.peak_amplitude)}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
            <div className="mono-text" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>PAPR (PEAK-TO-AVG)</div>
            <div style={{ fontSize: '1.2rem', color: parameters?.anomaly_detected ? '#ff4d4d' : 'inherit' }}>
              {renderValue(parameters?.papr_db)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>dB</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
            <div className="mono-text" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>NOISE FLOOR</div>
            <div style={{ fontSize: '1.2rem' }}>
              {renderValue(parameters?.noise_floor_db)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>dB</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
            <div className="mono-text" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>CFO (CARRIER OFFSET)</div>
            <div style={{ fontSize: '1.2rem' }}>
              {renderValue(parameters?.cfo_hz)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hz</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
            <div className="mono-text" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>THD / SINAD / SFDR</div>
            <div style={{ fontSize: '1.1rem' }}>
              {renderValue(parameters?.thd_db)} / {renderValue(parameters?.sinad_db)} / {renderValue(parameters?.sfdr_db)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>dB</span>
            </div>
          </div>

          {parameters?.evm_percent !== undefined && parameters?.evm_percent !== null && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', borderLeft: '2px solid #4caf50' }}>
              <div className="mono-text" style={{ marginBottom: '0.25rem', fontSize: '0.7rem', color: '#4caf50' }}>EVM (ERROR VECTOR)</div>
              <div style={{ fontSize: '1.2rem' }}>
                {parameters.evm_percent} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>%</span>
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', borderLeft: parameters?.aliasing_detected ? '2px solid #ff4d4d' : '2px solid #4caf50' }}>
            <div className="mono-text" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>ALIASING DETECTED</div>
            <div style={{ fontSize: '1.2rem', color: parameters?.aliasing_detected ? '#ff4d4d' : '#4caf50' }}>
              {parameters?.aliasing_detected ? 'YES' : 'NO'}
            </div>
          </div>

        </div>
      </div>

      {/* Visualizations Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Waveform */}
        {visualizations?.waveform && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 className="mono-text" style={{ margin: '0 0 1.5rem 0' }}>SIGNAL OVERVIEW (WAVEFORM)</h3>
            <img src={`${API_BASE_URL}/data/results/${visualizations.waveform}`} alt="Waveform" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* FFT */}
          {visualizations?.fft && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 className="mono-text" style={{ margin: '0 0 1.5rem 0' }}>FREQUENCY (FFT)</h3>
              <img src={`${API_BASE_URL}/data/results/${visualizations.fft}`} alt="FFT" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
            </div>
          )}

          {/* Spectrogram */}
          {visualizations?.spectrogram && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 className="mono-text" style={{ margin: '0 0 1.5rem 0' }}>SPECTROGRAM (WATERFALL)</h3>
              <img src={`${API_BASE_URL}/data/results/${visualizations.spectrogram}`} alt="Spectrogram" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
            </div>
          )}
        </div>

        {/* IQ Constellation */}
        {visualizations?.iq && (
          <div className="glass-panel" style={{ padding: '1.5rem', width: '50%', margin: '0 auto' }}>
            <h3 className="mono-text" style={{ margin: '0 0 1.5rem 0' }}>IQ CONSTELLATION</h3>
            <img src={`${API_BASE_URL}/data/results/${visualizations.iq}`} alt="IQ Constellation" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
          </div>
        )}

      </div>

      </div> {/* End of PDF capture area */}

    </div>
  );
}
