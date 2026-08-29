import React, { useState } from 'react';
import { Leaf, Check, Ruler } from 'lucide-react';

export default function SpeciesConfirmModal({ data, onSaveComplete, onClose }) {
  const [speciesName, setSpeciesName] = useState(data?.identification?.speciesName || 'Unknown Plant');
  const [scientificName, setScientificName] = useState(data?.identification?.scientificName || '');
  const [currentHeight, setCurrentHeight] = useState(data?.identification?.suggestedHeight || '10');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [notes, setNotes] = useState(data?.identification?.careSummary || 'Added to plant collection');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!speciesName.trim()) return;

    setIsSubmitting(true);

    const newPlantPayload = {
      speciesName: speciesName.trim(),
      scientificName: scientificName.trim(),
      currentHeight: parseFloat(currentHeight) || 0,
      heightUnit,
      imageUrl: data.imageUrl,
      notes: notes.trim(),
      isSpeciesConfirmed: true
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlantPayload)
      });
      const savedPlant = await response.json();
      setIsSubmitting(false);
      onSaveComplete(savedPlant);
    } catch (err) {
      console.error('Error saving plant:', err);
      alert('Failed to save plant. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Leaf size={22} color="var(--emerald-light)" /> Confirm Plant Profile
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Verify identified species and initial height measurement.
            </p>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem 0.8rem' }}>✕</button>
        </div>

        {/* Clean Plant Photo Preview */}
        <div style={{
          position: 'relative',
          height: '200px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-glow)'
        }}>
          <img
            src={data.imageUrl}
            alt="Plant Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Plant Details Form */}
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Plant Species Name</label>
            <input
              type="text"
              className="form-input"
              value={speciesName}
              onChange={(e) => setSpeciesName(e.target.value)}
              placeholder="e.g. Neem Tree, Mango, Snake Plant..."
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
              placeholder="e.g. Mangifera indica..."
            />
          </div>

          {/* Height Input & Unit Selector - Combined Flex Row for Mobile Safe Bounds */}
          <div className="form-group">
            <label className="form-label">Initial Recorded Height & Unit</label>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <Ruler size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                  value={currentHeight}
                  onChange={(e) => setCurrentHeight(e.target.value)}
                  required
                />
              </div>

              <select
                className="form-select form-select-unit"
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
              >
                <option value="cm">cm</option>
                <option value="inches">in</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Care Summary</label>
            <textarea
              className="form-input form-textarea"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add care notes or location details..."
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Check size={18} /> {isSubmitting ? 'Saving...' : 'Save to Collection'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
