import React from 'react';
import { X } from 'lucide-react';

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
      {/* Top Header Bar: Title on Far Left, Close Button on Far Right */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '92vw',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          padding: '0 0.25rem'
        }}
      >
        {/* Plant Species Name */}
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
          {title || 'Plant Photo'}
        </h3>

        {/* Circular Close Button on Far Right */}
        <button
          className="btn-secondary"
          onClick={onClose}
          style={{
            width: '40px',
            height: '40px',
            minWidth: '40px',
            padding: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          title="Close full photo view"
        >
          <X size={20} color="#ffffff" />
        </button>
      </div>

      {/* Full Image Container - Accurate Uncropped Aspect Ratio */}
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
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>

    </div>
  );
}
