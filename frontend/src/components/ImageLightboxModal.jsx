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
      {/* Container Wrapper taking 100% Width */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '850px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >

        {/* Top Header Bar: Title on Far Left, Close Button explicitly pushed to Far Right */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem',
            padding: '0 0.25rem'
          }}
        >
          {/* Plant Species Name */}
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
            {title || 'Plant Photo'}
          </h3>

          {/* Squircle Close Button pushed 100% to Far Right */}
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{
              width: '42px',
              height: '42px',
              minWidth: '42px',
              marginLeft: 'auto',
              padding: 0,
              borderRadius: '14px', /* Squircle Shape */
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.16)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer'
            }}
            title="Close full photo view"
          >
            <X size={22} color="#ffffff" />
          </button>
        </div>

        {/* Full Image Container - Accurate Uncropped Aspect Ratio */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '82vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            background: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          <img
            src={imageUrl}
            alt={title || 'Full Resolution Plant'}
            style={{
              maxWidth: '100%',
              maxHeight: '82vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>

      </div>

    </div>
  );
}
