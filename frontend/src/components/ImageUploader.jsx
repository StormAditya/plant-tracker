import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles, AlertCircle, RefreshCw, X, Edit3, Image, Ruler, Check } from 'lucide-react';
import { compressImageTo480p } from '../utils/imageCompressor';
import { plantApi } from '../api/plantApi';

const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop';

export default function ImageUploader({ onIdentificationComplete, onManualSaveComplete, onClose }) {
  // 'scan' (AI Vision Scan - Default on left) or 'manual' (Direct Data Entry on right)
  const [mode, setMode] = useState('scan');

  // AI Scan state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Manual Entry state
  const [manualSpeciesName, setManualSpeciesName] = useState('');
  const [manualScientificName, setManualScientificName] = useState('');
  const [manualHeight, setManualHeight] = useState('15');
  const [manualHeightUnit, setManualHeightUnit] = useState('cm');
  const [manualNotes, setManualNotes] = useState('');
  const [manualPhotoPreview, setManualPhotoPreview] = useState(null);
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState(null);
  const manualFileInputRef = useRef(null);

  // Handle AI Scan photo selection
  const handleScanFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setScanError('Please select a valid plant photo (JPG, PNG, WebP).');
      return;
    }

    setSelectedFile(file);
    setScanError(null);
    setIsCompressing(true);

    try {
      // Step 1: Compress to 480p standard
      const compressionResult = await compressImageTo480p(file);
      setIsCompressing(false);

      // Step 2: Upload and identify via Gemini AI
      setIsIdentifying(true);
      const apiResponse = await plantApi.identifyPlant(compressionResult.compressedFile);
      setIsIdentifying(false);

      // Step 3: Pass to confirmation modal so user can edit all details before confirming
      onIdentificationComplete({
        imageUrl: apiResponse.imageUrl || compressionResult.previewUrl,
        identification: apiResponse.identification
      });

    } catch (err) {
      console.error('Error during AI image scanning:', err);
      setScanError(err.message || 'AI Identification failed. Please try again or enter details manually.');
      setIsCompressing(false);
      setIsIdentifying(false);
    }
  };

  // Handle Manual Entry photo attachment
  const handleManualPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressionResult = await compressImageTo480p(file);
      setManualPhotoPreview(compressionResult.previewUrl);
      setManualError(null);
    } catch {
      setManualPhotoPreview(null);
      setManualError('Failed to process photo. Please choose a valid image file.');
    }
  };

  // Handle Manual Entry Form Submit
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualSpeciesName.trim()) {
      setManualError('Please enter a plant species name.');
      return;
    }

    // Plant photo is required
    if (!manualPhotoPreview) {
      setManualError('Please upload or choose a plant photo.');
      return;
    }

    setIsManualSubmitting(true);
    setManualError(null);

    const plantPayload = {
      speciesName: manualSpeciesName.trim(),
      scientificName: manualScientificName.trim(),
      height: parseFloat(manualHeight) || 0,
      currentHeight: parseFloat(manualHeight) || 0,
      heightUnit: manualHeightUnit,
      imageUrl: manualPhotoPreview,
      notes: manualNotes.trim(),
      isSpeciesConfirmed: true,
      engineUsed: 'Manual Entry'
    };

    try {
      const savedPlant = await plantApi.savePlant(plantPayload);
      setIsManualSubmitting(false);
      if (onManualSaveComplete) {
        onManualSaveComplete(savedPlant);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save manual plant:', err);
      setManualError(err.message || 'Failed to save plant record. Please check authorization.');
      setIsManualSubmitting(false);
    }
  };

  // Drag handlers for AI Scan
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
      handleScanFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', borderRadius: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800 }}>
              Add Plant to Collection
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              Choose to scan a photo with Gemini AI or enter details manually.
            </p>
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

        {/* Option Selector Toggle Tabs (Scan with AI on left/default, Enter Manually on right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: '16px',
          marginBottom: '1.25rem'
        }}>
          {/* Scan with AI (Left / Default) */}
          <button
            type="button"
            id="tab-scan-ai"
            onClick={() => setMode('scan')}
            style={{
              padding: '0.65rem 0.75rem',
              borderRadius: '12px',
              border: mode === 'scan' ? '1px solid rgba(4,120,87,0.3)' : '1px solid transparent',
              background: mode === 'scan' ? '#ffffff' : 'transparent',
              color: mode === 'scan' ? '#047857' : '#64748b',
              fontWeight: mode === 'scan' ? 700 : 600,
              boxShadow: mode === 'scan' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              fontSize: '0.88rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} color={mode === 'scan' ? '#047857' : 'currentColor'} />
            <span>Scan with AI</span>
          </button>

          {/* Enter Manually (Right) */}
          <button
            type="button"
            id="tab-manual-entry"
            onClick={() => setMode('manual')}
            style={{
              padding: '0.65rem 0.75rem',
              borderRadius: '12px',
              border: mode === 'manual' ? '1px solid rgba(230,149,0,0.3)' : '1px solid transparent',
              background: mode === 'manual' ? '#ffffff' : 'transparent',
              color: mode === 'manual' ? '#b45309' : '#64748b',
              fontWeight: mode === 'manual' ? 700 : 600,
              boxShadow: mode === 'manual' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              fontSize: '0.88rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Edit3 size={16} color={mode === 'manual' ? '#e69500' : 'currentColor'} />
            <span>Enter Manually</span>
          </button>
        </div>

        {/* VIEW 1: Scan with AI (Default on Left) */}
        {mode === 'scan' ? (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isCompressing && !isIdentifying && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? '#10b981' : '#cbd5e1'}`,
                borderRadius: '18px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: isCompressing || isIdentifying ? 'default' : 'pointer',
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
                onChange={(e) => e.target.files?.[0] && handleScanFile(e.target.files[0])}
              />

              {isCompressing || isIdentifying ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <RefreshCw size={36} color="#047857" className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <div>
                    <h4 style={{ color: '#047857', fontSize: '1.1rem', fontWeight: 700 }}>
                      {isCompressing ? 'Preparing Image...' : 'Scanning with Gemini AI Vision...'}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.3rem' }}>
                      {isCompressing ? 'Resizing photo to 480p resolution standard' : 'Identifying botanical species. You will be able to edit all details next!'}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#047857'
                  }}>
                    <UploadCloud size={30} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.02rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                      Upload Plant Photo to Scan with AI
                    </p>
                    <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Drag & drop or <span style={{ color: '#047857', textDecoration: 'underline', fontWeight: 700 }}>browse file</span> (JPG, PNG, WebP)
                    </p>
                    <p style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      ✨ You can review & edit all detected details before confirming.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Alert Box with Retry */}
            {scanError && (
              <div style={{
                marginTop: '1.25rem',
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                color: '#dc2626',
                fontSize: '0.88rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <AlertCircle size={20} color="#dc2626" />
                  <strong style={{ color: '#991b1b' }}>AI Identification Notice</strong>
                </div>
                <p style={{ margin: '0 0 0.85rem 0', color: '#7f1d1d', fontSize: '0.83rem', lineHeight: 1.4 }}>
                  {scanError}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ flex: 1, justifyContent: 'center', padding: '0.55rem', fontSize: '0.85rem' }}
                  >
                    <RefreshCw size={15} /> Try Another Photo
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setMode('manual')}
                    style={{ flex: 1, justifyContent: 'center', padding: '0.55rem', fontSize: '0.85rem' }}
                  >
                    Enter Manually
                  </button>
                </div>
              </div>
            )}

            {/* Switch to manual option helper */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setMode('manual')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  fontSize: '0.83rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'underline'
                }}
              >
                Prefer to enter details yourself without scanning? Switch to Manual Entry →
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: Enter Data Manually without Scanning */
          <form onSubmit={handleManualSubmit}>
            {manualError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#dc2626',
                fontSize: '0.83rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{manualError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Plant Species Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Neem Tree, Mango, Snake Plant..."
                value={manualSpeciesName}
                onChange={(e) => setManualSpeciesName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Scientific Botanical Name (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Azadirachta indica, Mangifera indica..."
                value={manualScientificName}
                onChange={(e) => setManualScientificName(e.target.value)}
              />
            </div>

            {/* Height & Unit */}
            <div className="form-group">
              <label className="form-label">Initial Recorded Height *</label>
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                  <Ruler size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                    placeholder="Height value"
                    value={manualHeight}
                    onChange={(e) => setManualHeight(e.target.value)}
                    required
                  />
                </div>

                <select
                  className="form-select form-select-unit"
                  value={manualHeightUnit}
                  onChange={(e) => setManualHeightUnit(e.target.value)}
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                  <option value="inches">in</option>
                  <option value="m">m</option>
                </select>
              </div>
            </div>

            {/* Plant Photo Attachment */}
            <div className="form-group">
              <label className="form-label">Plant Photo *</label>
              <input
                ref={manualFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleManualPhotoChange}
              />

              {manualPhotoPreview ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', border: '1px solid #10b981', padding: '0.5rem', borderRadius: '12px' }}>
                  <img
                    src={manualPhotoPreview}
                    alt="Preview"
                    style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 600, flex: 1 }}>
                    ✓ Photo attached
                  </span>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setManualPhotoPreview(null)}
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => manualFileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: '1.5px dashed #cbd5e1',
                    background: '#f8fafc'
                  }}
                >
                  <Image size={18} color="#047857" /> Choose Plant Photo
                </button>
              )}
            </div>

            {/* Notes / Care tips */}
            <div className="form-group">
              <label className="form-label">Notes / Location Details</label>
              <textarea
                className="form-input form-textarea"
                rows="2"
                placeholder="e.g. Planted near east gate, watered twice weekly..."
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
              />
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isManualSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isManualSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #ffca28 0%, #ffb300 50%, #e69500 100%)',
                  color: '#0f172a',
                  fontWeight: 800
                }}
              >
                <Check size={18} /> {isManualSubmitting ? 'Saving Plant...' : 'Save to Collection'}
              </button>
            </div>

            {/* Switch to scan option helper */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setMode('scan')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#047857',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'underline'
                }}
              >
                Prefer to scan a plant photo with Gemini AI instead? Switch to AI Scan →
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
