import { BookOpen, Users, RadioReceiver } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CitizenScience() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 200, marginBottom: '1rem' }}>CITIZEN SCIENCE HUB</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Join the global network of amateur radio astronomers.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h2 className="mono-text" style={{ color: 'var(--accent-color)', fontSize: '1.2rem', marginBottom: '1rem' }}>ANYONE CAN EXPLORE SPACE</h2>
          <p style={{ color: 'var(--text-main)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            You don't need a multi-million dollar observatory to listen to the universe. With a simple $30 RTL-SDR (Software Defined Radio) USB dongle and a homemade dipole antenna, you can receive telemetry from the International Space Station, download live weather images from NOAA satellites, and even detect meteor scatter reflections!
          </p>
          <Link to="/analyze" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Upload Your SDR Recording
          </Link>
        </div>
        <div style={{ flex: '0 0 200px', display: 'flex', justifyContent: 'center' }}>
          <RadioReceiver size={120} color="var(--text-muted)" strokeWidth={1} style={{ opacity: 0.5 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Users size={24} color="var(--accent-color)" />
            <h3 className="mono-text" style={{ margin: 0 }}>CROWDSOURCED DISCOVERY</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            By uploading your `.wav` or `.iq` files to the Observatory, our machine learning classification models help you identify what you captured. We aggregate these findings to track satellite orbits, detect sporadic Fast Radio Bursts (FRBs), and monitor space weather phenomenas globally.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <BookOpen size={24} color="var(--accent-color)" />
            <h3 className="mono-text" style={{ margin: 0 }}>RESEARCH INTEGRATION</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Our analysis engine is built on algorithms adapted from cutting-edge astrophysics research, including the CHIME/FRB project methodologies for spectrogram dispersion measurement. Your backyard observations are processed using real scientific math.
          </p>
        </div>

      </div>

    </div>
  );
}
