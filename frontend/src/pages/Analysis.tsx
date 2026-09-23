import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const PIPELINE_STAGES = [
  'QUEUED',
  'PARSING',
  'PREPROCESSING',
  'DETECTING',
  'ANALYZING',
  'EXTRACTING',
  'CLASSIFYING',
  'GENERATING_REPORT',
  'COMPLETED'
];

export default function Analysis() {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (jobId && status !== 'COMPLETED' && status !== 'FAILED') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/analysis/${jobId}/status`);
          const data = await res.json();
          if (data.status) {
            setStatus(data.status.toUpperCase());
            if (data.status.toUpperCase() === 'COMPLETED') {
              setTimeout(() => navigate(`/results/${jobId}`), 1000);
            } else if (data.status.toUpperCase() === 'FAILED') {
              setError(data.error || 'Analysis failed.');
            }
          }
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [jobId, status, navigate]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/analysis/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setJobId(data.id);
        setStatus('QUEUED');
        setError(null);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Connection to observatory failed.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      
      {/* LEFT: Upload Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 className="mono-text" style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>OBSERVATION INPUT</h2>
        
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', borderStyle: 'dashed' }}>
          
          <input 
            type="file" 
            accept=".wav,.iq"
            ref={fileInputRef}
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
          />
          
          {!file ? (
            <>
              <UploadCloud size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
                Drag and drop your recording here<br/>
                <span style={{ fontSize: '0.8rem' }}>Supported formats: .WAV, .IQ</span>
              </p>
              <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                Select File
              </button>
            </>
          ) : (
            <>
              <File size={64} color="var(--accent-color)" style={{ marginBottom: '1.5rem' }} />
              <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{file.name}</p>
              <p className="mono-text" style={{ marginBottom: '2rem' }}>SIZE: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-secondary" onClick={() => setFile(null)} disabled={!!jobId}>Cancel</button>
                <button className="btn-primary" onClick={handleUpload} disabled={!!jobId}>Initialize Analysis</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Pipeline Status */}
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 className="mono-text" style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>PIPELINE STATUS</h2>
        
        <div className="glass-panel" style={{ flex: 1, padding: '2rem' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ff4d4d', marginBottom: '2rem', padding: '1rem', background: 'rgba(255, 77, 77, 0.1)', borderRadius: '4px' }}>
              <AlertCircle size={24} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {PIPELINE_STAGES.map((stage, idx) => {
              const isActive = status === stage;
              const isPast = status && PIPELINE_STAGES.indexOf(status) > idx && status !== 'FAILED';
              const isFailed = status === 'FAILED' && PIPELINE_STAGES.indexOf(stage) === idx;
              
              let color = 'var(--text-muted)';
              let icon = '○';
              
              if (isActive) {
                color = 'var(--accent-color)';
                icon = '●';
              } else if (isPast) {
                color = '#4caf50';
                icon = '✓';
              } else if (isFailed) {
                color = '#ff4d4d';
                icon = '✗';
              }
              
              return (
                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: (isActive || isPast || isFailed) ? 1 : 0.5 }}>
                  <span style={{ color, width: '20px', textAlign: 'center', fontSize: '1.2rem' }}>{icon}</span>
                  <span className="mono-text" style={{ color: isActive ? 'var(--text-main)' : color }}>{String(idx + 1).padStart(2, '0')} {stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
