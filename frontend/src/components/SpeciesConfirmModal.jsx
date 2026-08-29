import React, { useState } from 'react';
import { Check, Edit3, AlertTriangle, Ruler, Leaf, Info, Zap, Sparkles, Cpu, Database, Cloud } from 'lucide-react';
import { plantApi } from '../api/plantApi';

export default function SpeciesConfirmModal({ data, onSaveComplete, onClose }) {
  const { imageUrl, identification, compressionStats } = data;

  const [speciesName, setSpeciesName] = useState(identification?.speciesName || 'Unknown Plant');
  const [scientificName, setScientificName] = useState(identification?.scientificName || '');
  const [isSpeciesConfirmed, setIsSpeciesConfirmed] = useState(true);
  const [height, setHeight] = useState('15');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [notes, setNotes] = useState('');
  const [careTips, setCareTips] = useState(identification?.careTips || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const engineUsed = identification?.engineUsed || 'Gemini Vision AI';
  const isGeminiEngine = engineUsed.includes('Gemini');
  const isCloudinaryUrl = imageUrl?.includes('cloudinary.com');
  const confidencePct = Math.round((identification?.confidenceScore || 0.85) * 100);

  const handleSelectAlternative = (alt) => {
    setSpeciesName(alt.speciesName);
    setScientificName(alt.scientificName);
    setIsSpeciesConfirmed(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!speciesName.trim()) {
      setError('Please enter a valid plant species name.');
      return;
    }
    if (!height || isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
      setError('Please enter a valid positive plant height.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const plantPayload = {
        speciesName: speciesName.trim(),
        scientificName: scientificName.trim(),
        isSpeciesConfirmed: Boolean(isSpeciesConfirmed),
        engineUsed,
        height: parseFloat(height),
        heightUnit,
        imageUrl,
        notes,
        careTips
      };

      const savedPlant = await plantApi.savePlant(plantPayload);
      setIsSaving(false);
      onSaveComplete(savedPlant);
    } catch (err) {
      console.error('Error saving plant profile:', err);
      setError(err.message || 'Failed to save plant profile.');
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-emerald">
                <Sparkles size={12} /> Step 2: Confirm AI Species & Height
              </span>

              {/* Explicit Engine Identification Badge */}
              {isGeminiEngine ? (
                <span className="badge badge-emerald" style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #34d399' }}>
                  <Cpu size={12} /> Google Gemini AI
                </span>
              ) : (
                <span className="badge badge-gold">
                  <Database size={12} /> Built-in Classifier
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>Verify & Store Plant Details</h2>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem 0.8rem' }}>✕</button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            
            {/* 480p Image Thumbnail */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-glow)' }}>
              <img
                src={imageUrl}
                alt="Plant preview"
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <span className="badge badge-480p" style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '0.65rem' }}>
                <Zap size={10} /> 480p WebP
              </span>
            </div>

            {/* AI Identification & Cloud Storage Result Overview */}
            <div>
              
              {/* Cloudinary Upload Success Alert Badge */}
              {isCloudinaryUrl ? (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  borderRadius: '12px',
                  padding: '0.6rem 0.85rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.8rem',
                  color: '#93c5fd',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Cloud size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#ffffff' }}>Successfully Uploaded to Cloudinary CDN!</strong>
                    <div style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '0.1rem' }}>
                      25GB Free Cloud Tier • Fast Global Delivery
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.78rem',
                  color: '#fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Database size={14} /> Saved to Local Disk Storage
                </div>
              )}

              <div style={{
                background: isGeminiEngine ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${isGeminiEngine ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.3)'}`,
                borderRadius: '14px',
                padding: '0.9rem 1rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {isGeminiEngine ? <Cpu size={12} color="var(--emerald-light)" /> : <Database size={12} color="var(--accent-gold)" />}
                    {engineUsed}
                  </span>
                  <span className="badge badge-emerald">{confidencePct}% Match</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--emerald-light)', marginBottom: '0.15rem' }}>
                  {identification?.speciesName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  {identification?.scientificName}
                </p>
              </div>

              {/* Alternative AI Predictions */}
              {identification?.suggestedAlternatives?.length > 0 && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Not correct? Switch species prediction:</span>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                    {identification.suggestedAlternatives.map((alt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectAlternative(alt)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: 'var(--text-main)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {alt.speciesName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Form Controls */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Plant Species Name (Editable)</label>
              <label style={{ fontSize: '0.78rem', color: 'var(--emerald-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <input
                  type="checkbox"
                  checked={isSpeciesConfirmed}
                  onChange={(e) => setIsSpeciesConfirmed(e.target.checked)}
                />
                <Check size={14} /> Confirmed by User
              </label>
            </div>
            <input
              type="text"
              className="form-input"
              value={speciesName}
              onChange={(e) => setSpeciesName(e.target.value)}
              placeholder="e.g. Monstera Deliciosa"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Scientific Botanical Name (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
              placeholder="e.g. Monstera deliciosa"
            />
          </div>

          {/* Height Measurement Input */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Ruler size={14} color="var(--emerald-light)" /> Current Plant Height
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                className="form-input"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 15.5"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unit</label>
              <select
                className="form-select"
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
              >
                <option value="cm">cm (Centimeters)</option>
                <option value="inches">inches</option>
                <option value="m">m (Meters)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Plant Care & Location Notes (Optional)</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Placed on South window sill. Watered every 5 days."
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '0.82rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving Plant Profile...' : 'Confirm & Save Plant Profile'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
