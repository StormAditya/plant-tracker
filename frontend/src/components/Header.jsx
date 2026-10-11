import React from 'react';
import { ShieldCheck, Lock, LogOut } from 'lucide-react';
import logoImg from '../assets/rswf-logo.jpg';

export default function Header({ isAdmin, onOpenLogin, onLogout }) {
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

        {/* Right Side: Auth Status & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-gold" style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fffde7', border: '1px solid #fde047', color: '#b45309' }}>
                <ShieldCheck size={14} color="#e69500" />
                <strong>Admin: RSWF</strong>
              </span>
              <button
                type="button"
                className="btn-secondary"
                onClick={onLogout}
                style={{ padding: '0.45rem 0.85rem', minHeight: '38px', fontSize: '0.82rem', borderRadius: '12px' }}
                title="Log out of Admin mode"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={onOpenLogin}
              style={{
                padding: '0.55rem 1.1rem',
                minHeight: '40px',
                fontSize: '0.85rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ffca28 0%, #ffb300 50%, #e69500 100%)',
                color: '#0f172a',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(255, 179, 0, 0.35)'
              }}
              title="Admin Login to add or edit plants"
            >
              <Lock size={15} /> Admin Login
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
