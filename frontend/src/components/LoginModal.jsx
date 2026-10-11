import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, X, Sparkles } from 'lucide-react';
import { plantApi } from '../api/plantApi';
import logoImg from '../assets/rswf-logo.jpg';

export default function LoginModal({ onLoginSuccess, onContinueAsGuest, onClose, canDismiss = true }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = await plantApi.login(username.trim(), password);
      setIsSubmitting(false);
      onLoginSuccess(data.user);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Invalid admin credentials. Only authorized RSWF admin can log in.');
    }
  };

  return (
    <div className="modal-overlay" onClick={canDismiss ? onClose : undefined} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          padding: '2rem 1.75rem',
          borderRadius: '24px',
          border: '1px solid #fde047',
          boxShadow: '0 25px 60px -10px rgba(15, 23, 42, 0.2), 0 10px 25px rgba(245, 158, 11, 0.12)'
        }}
      >
        {/* Top Dismiss Button (if dismissible) */}
        {canDismiss && onClose && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0, borderRadius: '10px' }}
              title="Close Login Modal"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Brand Logo & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src={logoImg}
            alt="RSWF Logo"
            onError={(e) => { e.target.src = '/rswf-logo.jpg'; }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '0.75rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
            }}
          />

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            <span style={{ color: '#e69500', marginRight: '0.35rem' }}>RSWF</span>
            <span style={{ color: '#047857' }}>ScanFlora</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.45, maxWidth: '360px', margin: '0 auto' }}>
            Sign in as Administrator to add, edit, or record plant growth logs.
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            color: '#dc2626',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            lineHeight: 1.4
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Admin Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#64748b" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{
              width: '100%',
              minHeight: '48px',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(255, 179, 0, 0.4)'
            }}
          >
            <ShieldCheck size={18} /> {isSubmitting ? 'Authenticating...' : 'Login as Admin'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* Continue as Guest Button */}
        <button
          type="button"
          className="btn-secondary"
          onClick={onContinueAsGuest}
          style={{
            width: '100%',
            minHeight: '48px',
            borderRadius: '14px',
            fontSize: '0.92rem',
            fontWeight: 700,
            justifyContent: 'center',
            borderColor: '#e2e8f0',
            color: '#1e293b',
            background: '#ffffff'
          }}
        >
          Continue as Guest (View Plants) <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
