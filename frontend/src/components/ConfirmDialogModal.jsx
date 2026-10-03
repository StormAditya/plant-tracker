import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function ConfirmDialogModal({
  title = 'Delete Plant Record?',
  message = 'Are you sure you want to delete this plant profile? This action cannot be undone.',
  confirmText = 'Delete Plant',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) {
  return (
    <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 1300 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          border: '1px solid #fca5a5',
          background: '#ffffff',
          textAlign: 'center',
          padding: '2rem 1.5rem'
        }}
      >
        {/* Top Warning Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <AlertTriangle size={32} color="#dc2626" />
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            style={{ width: '100%', minHeight: '44px', borderRadius: '12px', justifyContent: 'center' }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            style={{
              width: '100%',
              minHeight: '44px',
              borderRadius: '12px',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700
            }}
          >
            <Trash2 size={16} /> {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
