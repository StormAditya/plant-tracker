import React from 'react';
import { Leaf, Zap, Smartphone, Database, Plus } from 'lucide-react';

export default function Header({ onOpenUpload, activeTab, setActiveTab, plantCount }) {
  return (
    <header className="glass-panel" style={{ margin: '1rem 1.5rem', padding: '1rem 1.5rem', borderRadius: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Leaf size={24} color="#04120a" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', lineHeight: 1.1 }}>
              Flora<span className="text-gradient">Scan</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              AI Plant Identifier & Height Growth Tracker
            </p>
          </div>
        </div>

        {/* Feature Highlights Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span className="badge badge-480p">
            <Zap size={12} /> Auto 480p Compression
          </span>
          <span className="badge badge-emerald">
            <Database size={12} /> Max Free Storage API
          </span>
          <span className="badge badge-gold">
            <Smartphone size={12} /> App Plug-in Ready
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className={`btn-secondary ${activeTab === 'api-docs' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'api-docs' ? 'gallery' : 'api-docs')}
            style={{ fontSize: '0.85rem' }}
          >
            <Smartphone size={16} /> Mobile API Specs
          </button>
          
          <button className="btn-primary" onClick={onOpenUpload}>
            <Plus size={18} /> Identify & Add Plant
          </button>
        </div>

      </div>
    </header>
  );
}
