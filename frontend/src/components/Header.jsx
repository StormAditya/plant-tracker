import React from 'react';
import { ShieldCheck } from 'lucide-react';
import logoImg from '../assets/rswf-logo.jpg';

export default function Header() {
  return (
    <header className="glass-panel header-panel" style={{ width: '100%', maxWidth: '1400px', margin: '1rem auto 1.5rem auto', padding: '1.1rem 1.5rem', borderRadius: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Title Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Circular RSWF Official Logo */}
          <img 
            src={logoImg} 
            alt="RSWF Logo" 
            onError={(e) => {
              e.target.src = '/rswf-logo.jpg';
            }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0f172a' }}>
                <span style={{ color: '#e69500', marginRight: '0.35rem' }}>RSWF</span>
                <span style={{ color: '#047857' }}>ScanFlora</span>
              </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
              <span className="badge badge-subtle-theme" style={{ fontSize: '0.73rem', padding: '0.2rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={13} color="#e69500" />
                <span style={{ fontWeight: 600, color: '#475569' }}>Reform Social Welfare Foundation</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

