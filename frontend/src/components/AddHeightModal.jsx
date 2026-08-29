import React, { useState } from 'react';
import { Ruler, Plus, Calendar, AlertCircle } from 'lucide-react';
import { plantApi } from '../api/plantApi';

export default function AddHeightModal({ plant, onSaveComplete, onClose }) {
  const [height, setHeight] = useState(plant.currentHeight || '');
  const [unit, setUnit] = useState(plant.heightUnit || 'cm');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!height || parseFloat(height) <= 0) {
      setError('Please enter a valid height measurement.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedPlant = await plantApi.addHeightLog(plant.id, {
        height: parseFloat(height),
        unit,
        note: note.trim() || 'Recorded growth update'
      });

      setIsSubmitting(false);
      onSaveComplete(updatedPlant);
    } catch (err) {
      console.error('Failed to log height update:', err);
      setError('Could not save height log. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Ruler size={20} color="var(--emerald-light)" /> Log Plant Height
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Record new height measurement for <strong>{plant.speciesName}</strong>
            </p>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.35rem 0.75rem' }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Height Input & Unit Selector - Combined Flex Row for Mobile Safe Bounds */}
          <div className="form-group">
            <label className="form-label">New Recorded Height & Unit</label>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <Ruler size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter height..."
                  required
                />
              </div>

              <select
                className="form-select"
                style={{ width: '90px', minWidth: '90px', padding: '0.75rem 0.5rem', textAlign: 'center' }}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="cm">cm</option>
                <option value="inches">in</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Log Note (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Added fertilizer, new leaf growth..."
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', padding: '0.65rem', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Plus size={18} /> {isSubmitting ? 'Saving Log...' : 'Save Height Log'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
