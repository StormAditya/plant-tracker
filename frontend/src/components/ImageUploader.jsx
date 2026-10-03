import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react';
import { compressImageTo480p } from '../utils/imageCompressor';
import { plantApi } from '../api/plantApi';

export default function ImageUploader({ onIdentificationComplete, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid plant photo (JPG, PNG, WebP, HEIC).');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setIsCompressing(true);

    try {
      // Step 1: Compress image client-side to 480p resolution standard
      const compressionResult = await compressImageTo480p(file);
      setIsCompressing(false);

      // Step 2: Upload 480p compressed file to backend AI identification endpoint
      setIsIdentifying(true);
      const apiResponse = await plantApi.identifyPlant(compressionResult.compressedFile);
      setIsIdentifying(false);

      // Step 3: Trigger user confirmation modal
      onIdentificationComplete({
        imageUrl: apiResponse.imageUrl || compressionResult.previewUrl,
        identification: apiResponse.identification
      });

    } catch (err) {
      console.error('Error during image processing:', err);
      setError(err.message || 'AI Identification failed. Quota or rate limit exceeded.');
      setIsCompressing(false);
      setIsIdentifying(false);
    }
  };

  const handleRetry = () => {
    if (selectedFile) {
      handleFile(selectedFile);
    } else {
      fileInputRef.current?.click();
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
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#047857" /> Identify Plant Species
            </h2>
          </div>
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ width: '38px', height: '38px', minWidth: '38px', padding: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? '#10b981' : '#cbd5e1'}`,
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragActive ? '#ecfdf5' : '#f8fafc',
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
              <RefreshCw size={36} color="#047857" className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <div>
                <h4 style={{ color: '#047857', fontSize: '1.05rem' }}>
                  {isCompressing ? 'Processing Image...' : 'Scanning Plant Species...'}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {isCompressing ? 'Preparing photo' : 'Identifying botanical species & care details'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#047857'
              }}>
                <UploadCloud size={28} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                  Drag & Drop Plant Photo Here or <span style={{ color: '#047857', textDecoration: 'underline', fontWeight: 700 }}>Browse Files</span>
                </p>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Supports JPG, PNG, WebP, Camera photos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert Box with Retry Button */}
        {error && (
          <div style={{
            marginTop: '1.25rem',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            color: '#dc2626',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={20} color="#dc2626" />
              <strong style={{ color: '#991b1b' }}>AI Identification Error</strong>
            </div>
            <p style={{ margin: '0 0 0.85rem 0', color: '#7f1d1d', fontSize: '0.83rem', lineHeight: 1.4 }}>
              {error}
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={handleRetry}
              style={{ width: '100%', justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={16} /> Retry Identification
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
