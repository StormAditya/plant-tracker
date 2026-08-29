import React, { useState } from 'react';
import { Ruler, Plus, Calendar, AlertCircle } from 'lucide-react';
import { plantApi } from '../api/plantApi';

export default function AddHeightModal({ plant, onSaveComplete, onClose }) {
  const [height, setHeight] = useState((parseFloat(plant.currentHeight) + 1).toString());
  const [unit, setUnit] = useState(plant.heightUnit || 'cm');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!height || isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
      setError('Please enter a valid height measurement.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedPlant = await plantApi.addHeightLog(plant.id, parseFloat(height), unit, note);
      setIsSubmitting(false);
      onSaveComplete(updatedPlant);
    } catch (err) {
      console.error('Error adding height log:', err);
      setError(err.message || 'Failed to record height entry.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ruler size={20} color="var(--emerald-light)" /> Log Plant Height
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Record new growth measurement for <strong>{plant.speciesName}</strong>
            </p>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem 0.8rem' }}>✕</button>
        </div>

        {/* Previous height summary */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justify: 'space-between',
          fontSize: '0.85rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Previous Recorded Height:</span>
          <strong style={{ color: 'var(--emerald-light)' }}>{plant.currentHeight} {plant.heightUnit}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">New Height</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                className="form-input"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 18.5"
                required
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unit</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="cm">cm</option>
                <option value="inches">inches</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Growth Note (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. New leaf sprouted! Watered with fertilizer."
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
              <AlertCircle size={14} inline /> {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Plus size={16} /> {isSubmitting ? 'Recording Log...' : 'Save Height Entry'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
