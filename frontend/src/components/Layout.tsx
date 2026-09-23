import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ 
        padding: '1.5rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(5, 5, 5, 0.7)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" className="high-end-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
          <Radio size={20} color="var(--accent-color)" />
          <span className="mono-text" style={{ fontSize: '0.9rem', letterSpacing: '0.15em', color: 'var(--text-main)' }}>OBSERVATORY</span>
        </Link>
        <nav style={{ display: 'flex', gap: '3rem' }}>
          <Link to="/analyze" className="mono-text" style={{ 
            color: location.pathname === '/analyze' ? 'var(--accent-color)' : 'var(--text-muted)' 
          }}>ANALYSE</Link>
          <Link to="/citizen-science" className="mono-text" style={{ 
            color: location.pathname === '/citizen-science' ? 'var(--accent-color)' : 'var(--text-muted)' 
          }}>CITIZEN SCIENCE</Link>
          <Link to="/about" className="mono-text" style={{ 
            color: location.pathname === '/about' ? 'var(--accent-color)' : 'var(--text-muted)' 
          }}>ABOUT</Link>
        </nav>
      </header>
      
      <main style={{ flex: 1, padding: '2rem 3rem', display: 'flex', flexDirection: 'column', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {children}
      </main>
      
      <footer style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--glass-border)',
        marginTop: 'auto',
        background: 'rgba(5, 5, 5, 0.4)'
      }}>
        <div className="mono-text" style={{ opacity: 0.3 }}>SPACE RADIO SIGNAL ANALYSIS MACHINE</div>
      </footer>
    </div>
  );
}
