import { useState } from 'react';
import { Cpu, Sliders, Zap } from 'lucide-react';
import { AI_MODELS, runModelInference } from '../services/aiModelsData';

export default function AiModelsLab() {
  const [selectedModelId, setSelectedModelId] = useState<string>('deepmod_resnet');
  const selectedModel = AI_MODELS.find(m => m.id === selectedModelId) || AI_MODELS[0];
  
  const [selectedPresetId, setSelectedPresetId] = useState<string>(selectedModel.samplePresets[0].id);
  const [threshold, setThreshold] = useState<number>(0.85);
  const [anomalySigma, setAnomalySigma] = useState<number>(3.5);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState(() => 
    runModelInference(selectedModel.id, selectedModel.samplePresets[0].id, 0.85)
  );

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const model = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0];
    const firstPreset = model.samplePresets[0].id;
    setSelectedPresetId(firstPreset);
    setInferenceResult(runModelInference(modelId, firstPreset, threshold));
  };

  const handleRunInference = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runModelInference(selectedModelId, selectedPresetId, threshold);
      setInferenceResult(res);
      setIsRunning(false);
    }, 350);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
              SIGNAL INTELLIGENCE & PARAMETER EXTRACTION // 5 SPECIALIZED MODELS
            </div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: 300 }}>
              AI MODEL INFERENCE & ARCHITECTURE LAB
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, maxWidth: '750px' }}>
              Inspect neural topologies, review individual signal analysis applications, adjust hyperparameter thresholds, and simulate raw .IQ &amp; .WAV baseband tensor evaluations.
            </p>
          </div>

          <button 
            className="btn-primary" 
            onClick={handleRunInference}
            disabled={isRunning}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Zap size={16} />
            {isRunning ? 'CALCULATING TENSORS...' : 'RUN INFERENCE'}
          </button>
        </div>

        {/* Model Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          {AI_MODELS.map(model => {
            const isSelected = model.id === selectedModelId;
            return (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className="glass-panel"
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid var(--accent-color)' : '3px solid transparent',
                  background: isSelected ? 'rgba(255, 184, 77, 0.08)' : 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span className="mono-text" style={{ fontSize: '0.65rem', color: isSelected ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                    MODEL 0{AI_MODELS.indexOf(model) + 1}
                  </span>
                  <span className="mono-text" style={{ fontSize: '0.65rem', color: 'var(--text-main)' }}>
                    {model.accuracyValue}
                  </span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: isSelected ? '#fff' : 'var(--text-main)' }}>
                  {model.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {model.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Cpu size={20} color="var(--accent-color)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 400 }}>{selectedModel.name} {selectedModel.version}</h3>
              </div>
              <span className="mono-text" style={{ color: 'var(--accent-color)', fontSize: '0.8rem' }}>
                {selectedModel.accuracyMetric}: {selectedModel.accuracyValue}
              </span>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              {selectedModel.tagline}
            </p>

            <div style={{ background: 'rgba(255, 184, 77, 0.05)', borderLeft: '3px solid var(--accent-color)', padding: '1rem 1.25rem', borderRadius: '2px', marginBottom: '1.5rem' }}>
              <div className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                INDIVIDUAL SIGNAL ANALYSIS & PARAMETER EXTRACTION USE CASE
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Benchmark / Facility: {selectedModel.realWorldFacility}. Input format: {selectedModel.inputFormat}. Output: {selectedModel.outputFormat}.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '2px' }}>
                <div className="mono-text" style={{ fontSize: '0.65rem' }}>PARAMETERS</div>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{selectedModel.parametersCount}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '2px' }}>
                <div className="mono-text" style={{ fontSize: '0.65rem' }}>INFERENCE LATENCY</div>
                <div style={{ fontSize: '1.1rem', color: '#4caf50', marginTop: '0.2rem' }}>{selectedModel.inferenceLatencyMs} ms</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '2px', gridColumn: 'span 2' }}>
                <div className="mono-text" style={{ fontSize: '0.65rem' }}>TRAINING DATASET</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{selectedModel.trainingDataset}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '2px', marginBottom: '1.5rem' }}>
              <div className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '0.3rem', fontSize: '0.7rem' }}>
                MATHEMATICAL FOUNDATION
              </div>
              <div className="mono-text" style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                {selectedModel.mathematicalEquation}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {selectedModel.equationDescription}
              </div>
            </div>

            <div>
              <div className="mono-text" style={{ marginBottom: '0.6rem', fontSize: '0.75rem' }}>NEURAL LAYER TOPOLOGY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {selectedModel.layerSummary.map((layer, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span className="mono-text" style={{ color: 'var(--accent-color)', fontSize: '0.7rem' }}>{idx + 1}.</span>
                    <span>{layer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hyperparameter Controls */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Sliders size={18} color="var(--accent-color)" />
              <h3 className="mono-text" style={{ margin: 0, fontSize: '1rem' }}>INFERENCE HYPERPARAMETERS</h3>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div className="mono-text" style={{ marginBottom: '0.6rem', fontSize: '0.75rem' }}>SELECT OBSERVATION PRESET</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedModel.samplePresets.map(preset => {
                  const isPresetActive = preset.id === selectedPresetId;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setInferenceResult(runModelInference(selectedModelId, preset.id, threshold));
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '2px',
                        border: isPresetActive ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.08)',
                        background: isPresetActive ? 'rgba(255, 184, 77, 0.1)' : 'rgba(255,255,255,0.02)',
                        color: isPresetActive ? '#fff' : 'var(--text-muted)'
                      }}
                    >
                      <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{preset.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{preset.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="mono-text">CONFIDENCE CUTOFF:</span>
                <span className="mono-text" style={{ color: 'var(--accent-color)' }}>{(threshold * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="0.98" 
                step="0.01" 
                value={threshold} 
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-color)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="mono-text">ANOMALY SIGMA CUTOFF:</span>
                <span className="mono-text" style={{ color: 'var(--accent-color)' }}>{anomalySigma.toFixed(1)}σ</span>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="5.5" 
                step="0.1" 
                value={anomalySigma} 
                onChange={(e) => setAnomalySigma(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-color)' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="mono-text" style={{ color: 'var(--accent-color)', margin: '0 0 1.5rem 0' }}>LIVE INFERENCE RESULTS</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '4px' }}>
                <div className="mono-text" style={{ fontSize: '0.7rem' }}>DETECTION STATUS</div>
                <div style={{ fontSize: '1.4rem', color: inferenceResult.isDetected ? '#4caf50' : '#ff4d4d', marginTop: '0.2rem' }}>
                  {inferenceResult.isDetected ? 'POSITIVE DETECT' : 'NULL CANDIDATE'}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '4px' }}>
                <div className="mono-text" style={{ fontSize: '0.7rem' }}>NEURAL CONFIDENCE</div>
                <div style={{ fontSize: '1.4rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}>
                  {(inferenceResult.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem 1.25rem', borderRadius: '2px', marginBottom: '1.5rem' }}>
              <div className="mono-text" style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>MODEL VERDICT</div>
              <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 500 }}>
                {inferenceResult.verdict}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div className="mono-text" style={{ marginBottom: '0.6rem', fontSize: '0.75rem' }}>EXTRACTED PHYSICAL PARAMETERS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem' }}>
                {inferenceResult.telemetryMetrics.map((metric, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '2px' }}>
                    <div className="mono-text" style={{ fontSize: '0.65rem' }}>{metric.label}</div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      {metric.value} {metric.unit ? <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{metric.unit}</span> : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mono-text" style={{ marginBottom: '0.6rem', fontSize: '0.75rem' }}>
                {inferenceResult.latentVector && inferenceResult.latentVector.length > 0 ? 'LATENT BOTTLENECK VECTOR' : 'ATTENTION PATCH ACTIVATIONS (4x4)'}
              </div>
              
              {inferenceResult.latentVector && inferenceResult.latentVector.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${inferenceResult.latentVector.length}, 1fr)`, gap: '0.4rem' }}>
                  {inferenceResult.latentVector.map((val: number, idx: number) => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                      <div style={{ height: '70px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '2px' }}>
                        <div style={{ width: '100%', height: `${Math.min(100, Math.max(10, Math.abs(val) * 35))}%`, background: val >= 0 ? 'var(--accent-color)' : '#4caf50', borderRadius: '1px' }} />
                      </div>
                      <span className="mono-text" style={{ fontSize: '0.6rem', display: 'block', marginTop: '0.25rem' }}>z{idx+1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {(inferenceResult.attentionHeatmap || []).map((val: number, idx: number) => (
                    <div 
                      key={idx} 
                      style={{ 
                        height: '42px', 
                        background: `rgba(255, 184, 77, ${Math.max(0.08, val)})`, 
                        borderRadius: '2px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <span className="mono-text" style={{ fontSize: '0.65rem', color: val > 0.6 ? '#000' : '#fff' }}>
                        {val.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
