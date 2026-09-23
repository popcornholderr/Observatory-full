export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 300 }}>ABOUT THE OBSERVATORY</h1>
      
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>What is a radio signal?</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
          Radio waves are a type of electromagnetic radiation with wavelengths in the electromagnetic spectrum longer than infrared light. In radio astronomy, specialized antennas capture these waves emitted by astronomical objects like pulsars, quasars, and active galaxies.
        </p>
        
        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>What is IQ data?</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
          In-phase and Quadrature (IQ) data represents a complex signal where the real part (I) is the in-phase component and the imaginary part (Q) is the quadrature component. This format preserves the phase information of the signal, which is crucial for analyzing digital modulations and advanced signal processing.
        </p>

        <h2 className="mono-text" style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>Why do we use FFT?</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '0' }}>
          The Fast Fourier Transform (FFT) converts a signal from its original domain (often time) to a representation in the frequency domain. It allows us to see exactly which frequencies are present in an observation and how strong they are.
        </p>
      </div>
    </div>
  );
}
