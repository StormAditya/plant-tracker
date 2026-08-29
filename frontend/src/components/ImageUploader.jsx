import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { compressImageTo480p } from '../utils/imageCompressor';
import { plantApi } from '../api/plantApi';

export default function ImageUploader({ onIdentificationComplete, onClose }) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid plant photo (JPG, PNG, WebP, HEIC).');
      return;
    }

    setError(null);
    setIsCompressing(true);
    setCompressionStats(null);

    try {
      // Step 1: Compress image client-side to 480p resolution standard
      const compressionResult = await compressImageTo480p(file);
      setCompressionStats(compressionResult);
      setIsCompressing(false);

      // Step 2: Upload 480p compressed file to backend AI identification endpoint
      setIsIdentifying(true);
      const apiResponse = await plantApi.identifyPlant(compressionResult.compressedFile);
      setIsIdentifying(false);

      // Step 3: Trigger user confirmation & edit modal with AI species result
      onIdentificationComplete({
        imageUrl: apiResponse.imageUrl || compressionResult.previewUrl,
        identification: apiResponse.identification,
        compressionStats: compressionResult
      });

    } catch (err) {
      console.error('Error during image processing:', err);
      setError(err.message || 'Failed to process plant photo. Please try again.');
      setIsCompressing(false);
      setIsIdentifying(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--emerald-primary)" /> Identify Plant Species
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Upload a plant photo for instant AI species detection.
            </p>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem 0.8rem' }}>✕</button>
        </div>

        {/* Compression & Free Storage Guarantee Banner */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.82rem',
          color: '#a7f3d0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <Zap size={18} color="var(--emerald-light)" style={{ flexShrink: 0 }} />
          <div>
            <strong>480p Auto Compression Enabled:</strong> Photos are automatically scaled down to 480p client-side before storage, preserving free storage tier quotas.
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.18)'}`,
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0, 0, 0, 0.35)',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {isCompressing || isIdentifying ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <RefreshCw size={36} color="var(--emerald-primary)" className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <div>
                <h4 style={{ color: 'var(--emerald-light)', fontSize: '1.05rem' }}>
                  {isCompressing ? 'Compressing Image to 480p...' : 'AI Scanning Plant Species...'}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {isCompressing ? 'Encoding to high-efficiency WebP format' : 'Identifying leaves, scientific name & care details'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--emerald-light)'
              }}>
                <UploadCloud size={28} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem' }}>
                  Drag & Drop Plant Photo Here or <span style={{ color: 'var(--emerald-light)', textDecoration: 'underline' }}>Browse Files</span>
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Supports JPG, PNG, WebP, Camera photos up to 15MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Compression Statistics Feedback */}
        {compressionStats && (
          <div style={{
            marginTop: '1.25rem',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            fontSize: '0.83rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              <span>Compression Status:</span>
              <span className="badge badge-emerald"><CheckCircle2 size={12} /> 480p Ready</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', marginTop: '0.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>ORIGINAL</span>
                <strong>{compressionStats.originalSizeFormatted}</strong>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--emerald-light)', display: 'block' }}>COMPRESSED 480P</span>
                <strong style={{ color: 'var(--emerald-light)' }}>{compressionStats.compressedSizeFormatted}</strong>
              </div>
              <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#60a5fa', display: 'block' }}>SAVINGS</span>
                <strong style={{ color: '#60a5fa' }}>{compressionStats.savingsPercent}% Smaller</strong>
              </div>
            </div>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div style={{
            marginTop: '1rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#fca5a5',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

      </div>
    </div>
  );
}
