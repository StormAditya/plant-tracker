import React from 'react';
import { X, Maximize2 } from 'lucide-react';

export default function ImageLightboxModal({ imageUrl, title, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1200,
        background: 'rgba(3, 7, 5, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Top Bar with Title & Close Button */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0 0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Maximize2 size={18} color="var(--emerald-light)" />
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{title || 'Plant Photo'}</h3>
        </div>
        <button
          className="btn-secondary"
          onClick={onClose}
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Accurate Aspect Ratio Full Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '92vw',
          maxHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}
      >
        <img
          src={imageUrl}
          alt={title || 'Full Resolution Plant'}
          style={{
            maxWidth: '100%',
            maxHeight: '85vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain', /* Exact accurate aspect ratio without cropping */
            display: 'block'
          }}
        />
      </div>

    </div>
  );
}
