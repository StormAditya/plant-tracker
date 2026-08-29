import React from 'react';
import { Smartphone, Database, Zap, Code, CheckCircle, Copy, Server } from 'lucide-react';

export default function ApiMobileDocsModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
              <Smartphone size={12} /> Mobile App Direct Plugin Specification
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>Unified Backend & Free Storage Guide</h2>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem 0.8rem' }}>✕</button>
        </div>

        {/* Feature summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '1rem' }}>
            <h4 style={{ color: 'var(--emerald-light)', fontSize: '0.95rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={16} /> Mobile App Ready REST API
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              The Express backend exposes clean REST endpoints (`/api/identify`, `/api/plants`, `/api/plants/:id/height`) that can be consumed identically by React Native, Flutter, iOS (Swift), or Android (Kotlin) apps.
            </p>
          </div>

          <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '14px', padding: '1rem' }}>
            <h4 style={{ color: '#60a5fa', fontSize: '0.95rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} /> 480p Storage Optimization
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Images are compressed client-side to 480p WebP format (~60KB average file size), allowing up to <strong>15,000+ plant photos</strong> to fit inside standard free-tier cloud storage limits (Cloudinary / Supabase Free Tiers).
            </p>
          </div>

        </div>

        {/* API Endpoint Documentation Table */}
        <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Server size={16} color="var(--emerald-light)" /> Backend REST API Endpoints
        </h4>

        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.83rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginRight: '0.5rem' }}>POST</span>
                <code>/api/identify</code>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Upload 480p photo ➔ AI Species Scan</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginRight: '0.5rem' }}>POST</span>
                <code>/api/plants</code>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Save confirmed plant + initial height</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div>
                <span className="badge badge-gold" style={{ marginRight: '0.5rem' }}>GET</span>
                <code>/api/plants</code>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Fetch all plants + current height</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginRight: '0.5rem' }}>POST</span>
                <code>/api/plants/:id/height</code>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Log new height measurement over time</span>
            </div>

          </div>
        </div>

        {/* React Native / Mobile App Snippet */}
        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-light)' }}>
          <Code size={16} /> React Native / Mobile App Code Example
        </h4>
        <pre style={{
          background: '#040a07',
          padding: '1rem',
          borderRadius: '12px',
          fontSize: '0.78rem',
          color: '#34d399',
          overflowX: 'auto',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
{`// Example Mobile App request to record a new plant height log
async function updatePlantHeightOnMobile(plantId, newHeightCm) {
  const response = await fetch('http://YOUR_BACKEND_IP:5000/api/plants/' + plantId + '/height', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ height: newHeightCm, heightUnit: 'cm', note: 'Logged via mobile app' })
  });
  return await response.json();
}`}
        </pre>

      </div>
    </div>
  );
}
