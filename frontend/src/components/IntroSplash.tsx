import { useEffect, useState } from 'react';

export default function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    // Start fading out after 4 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    // Remove from DOM entirely after 5.5 seconds (allowing for 1.5s fade out)
    const cleanup = setTimeout(() => {
      setRender(false);
    }, 5500);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, []);

  if (!render) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 1.5s ease-in-out',
      pointerEvents: visible ? 'auto' : 'none',
      overflow: 'hidden'
    }}>
      
      {/* Black Hole Image with Zoom Animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("/blackhole.jpg")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity: 0.7,
        animation: 'intro-zoom 5s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      }} />

      {/* Title Fade Animation */}
      <h1 className="mono-text" style={{
        position: 'relative',
        zIndex: 10,
        color: '#ffffff',
        fontSize: '2.5rem',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(255,184,77,0.5)',
        animation: 'intro-text-fade 4.5s ease-in-out forwards'
      }}>
        OBSERVATORY
      </h1>
      
      <p className="mono-text" style={{
        position: 'relative',
        zIndex: 10,
        color: 'var(--accent-color)',
        fontSize: '1rem',
        marginTop: '1rem',
        animation: 'intro-text-fade 4.5s ease-in-out forwards',
        animationDelay: '0.2s'
      }}>
        SIGNAL ANALYSIS MACHINE
      </p>

    </div>
  );
}
