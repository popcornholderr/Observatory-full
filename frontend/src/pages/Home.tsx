import { Link } from 'react-router-dom';
import { Activity, Globe, RadioReceiver } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [feed, setFeed] = useState([
    { id: 1, user: 'AstroDave', location: 'UK', time: '2m ago', signal: 'NOAA-19 APT' },
    { id: 2, user: 'SDR_Hacker', location: 'Brazil', time: '12m ago', signal: 'Unknown Burst' },
    { id: 3, user: 'SpaceCadet', location: 'Japan', time: '45m ago', signal: 'ISS SSTV' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prev => {
        const newFeed = [...prev];
        newFeed.pop();
        newFeed.unshift({
          id: Date.now(),
          user: `Citizen_${Math.floor(Math.random() * 9000)}`,
          location: ['USA', 'Germany', 'Australia', 'Chile'][Math.floor(Math.random() * 4)],
          time: 'Just now',
          signal: ['NOAA-18', 'FRB Candidate', 'Pulsar B0329+54', 'Unknown Drift'][Math.floor(Math.random() * 4)]
        });
        return newFeed;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
      
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, pointerEvents: 'none' }}>
        <Activity size={400} strokeWidth={0.5} color="var(--accent-color)" />
      </div>

      <div className="glass-panel" style={{ padding: '4rem 6rem', maxWidth: '800px', zIndex: 10 }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', fontWeight: 200, letterSpacing: '0.05em' }}>
          LISTEN TO THE COSMOS.
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', letterSpacing: '0.02em' }}>
          Analyse the radio waves or signals from Space.
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <Link to="/analyze" className="btn-primary pulse" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
            Analyse a Signal
          </Link>
          <Link to="/citizen-science" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
            Join Citizen Science
          </Link>
        </div>
      </div>
      
      {/* Global Citizen Feed */}
      <div style={{ marginTop: '4rem', maxWidth: '1000px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
          <Globe size={18} color="var(--accent-color)" />
          <span className="mono-text" style={{ color: 'var(--accent-color)' }}>LIVE CITIZEN SCIENCE FEED</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {feed.map(item => (
            <div key={item.id} className="glass-panel" style={{ padding: '1rem', textAlign: 'left', animation: 'float 4s ease-in-out infinite alternate' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="mono-text" style={{ color: 'var(--text-main)' }}>@{item.user}</span>
                <span className="mono-text">{item.time}</span>
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>{item.signal}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <RadioReceiver size={12} /> Captured in {item.location}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1000px', width: '100%' }}>
        {[
          { title: 'Signal Detection', desc: 'Identify active transmission regions from background noise using energy thresholding.' },
          { title: 'Astronomical Classification', desc: 'Identify characteristic signatures of Pulsars, FRBs, and Weather Satellites.' },
          { title: 'Dispersion Analysis', desc: 'Calculate the Dispersion Measure to estimate cosmic distances of transient events.' }
        ].map((feature, i) => (
          <div key={i} className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
            <h3 className="mono-text" style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginBottom: '1rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
