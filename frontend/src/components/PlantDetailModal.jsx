import React, { useState } from 'react';
import { Ruler, Plus, Edit3, Trash2, Activity, Maximize2, X } from 'lucide-react';
import GrowthChart from './GrowthChart';
import ImageLightboxModal from './ImageLightboxModal';
import ConfirmDialogModal from './ConfirmDialogModal';

export default function PlantDetailModal({ plant, onAddHeight, onUpdatePlant, onDelete, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [speciesName, setSpeciesName] = useState(plant.speciesName);
  const [scientificName, setScientificName] = useState(plant.scientificName || '');
  const [currentHeight, setCurrentHeight] = useState(plant.currentHeight || '');
  const [heightUnit, setHeightUnit] = useState(plant.heightUnit || 'cm');
  const [notes, setNotes] = useState(plant.notes || '');

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdatePlant(plant.id, {
      speciesName: speciesName.trim(),
      scientificName: scientificName.trim(),
      currentHeight: parseFloat(currentHeight) || 0,
      heightUnit,
      notes: notes.trim()
    });
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    onDelete(plant.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        
        {/* Header Bar - Squircle Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.85rem' }}>
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ width: '38px', height: '38px', minWidth: '38px', padding: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Section - 1 Column Stacked on Mobile */}
        <div className="detail-hero-grid">
          
          {/* Photo Box with Lightbox Click Trigger */}
          <div
            className="detail-photo-container"
            onClick={() => setShowLightbox(true)}
            style={{ cursor: 'pointer', position: 'relative' }}
            title="Click to view full image in accurate aspect ratio"
          >
            <img
              src={plant.imageUrl || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500'}
              alt={plant.speciesName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* View Full Image Overlay Hint */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              padding: '0.35rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Maximize2 size={12} color="#ffffff" /> View Full Photo
            </div>
          </div>

          {/* Plant Profile Info Box */}
          <div>
            {!isEditing ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', color: '#0f172a' }}>{plant.speciesName}</h2>
                    {plant.scientificName && (
                      <p style={{ fontSize: '0.9rem', color: '#047857', fontStyle: 'italic', marginBottom: '0.75rem', fontWeight: 600 }}>
                        {plant.scientificName}
                      </p>
                    )}
                  </div>

                  {/* Action Controls: Edit & Delete Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" onClick={() => setIsEditing(true)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}>
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                      title="Delete Plant Record"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                {/* Recorded Height Box */}
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '14px',
                  padding: '0.9rem 1.1rem',
                  margin: '0.75rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#047857', textTransform: 'uppercase', fontWeight: 700 }}>Current Recorded Height</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857' }}>
                      {plant.currentHeight} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>{plant.heightUnit}</span>
                    </div>
                  </div>
                  
                  {/* Icon-Only (+) Button for Adding Height Log */}
                  <button
                    className="btn-primary"
                    onClick={() => { onClose(); onAddHeight(plant); }}
                    style={{ width: '44px', height: '44px', minHeight: '44px', padding: 0, borderRadius: '14px' }}
                    title="Log New Height"
                  >
                    <Plus size={22} />
                  </button>
                </div>

                {/* Notes Box */}
                {plant.notes && (
                  <p style={{ fontSize: '0.85rem', color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.6rem 0.8rem', borderRadius: '10px' }}>
                    <strong style={{ color: '#0f172a' }}>Notes:</strong> {plant.notes}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Species Name</label>
                  <input type="text" className="form-input" value={speciesName} onChange={(e) => setSpeciesName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Scientific Botanical Name</label>
                  <input type="text" className="form-input" value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Recorded Height & Unit</label>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      style={{ flex: 1 }}
                      value={currentHeight}
                      onChange={(e) => setCurrentHeight(e.target.value)}
                      required
                    />
                    <select
                      className="form-select form-select-unit"
                      value={heightUnit}
                      onChange={(e) => setHeightUnit(e.target.value)}
                    >
                      <option value="cm">cm</option>
                      <option value="ft">ft</option>
                      <option value="inches">in</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Notes</label>
                  <input type="text" className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>Save Changes</button>
                  <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>Cancel</button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Growth Trajectory Chart Box */}
        <div style={{ marginBottom: '1.25rem' }}>
          <GrowthChart history={plant.heightHistory} unit={plant.heightUnit} />
        </div>

        {/* Height Growth Timeline Log List Box */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={16} color="#047857" /> Height History Logs ({plant.heightHistory?.length || 0})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
            {plant.heightHistory?.map((log, index) => (
              <div key={log.id || index} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-emerald"><Ruler size={12} /> {log.height} {log.unit}</span>
                  <span style={{ color: '#475569' }}>{log.note || 'Recorded measurement'}</span>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                  {new Date(log.loggedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Custom Confirmation Modal for Deleting Plant */}
      {showDeleteConfirm && (
        <ConfirmDialogModal
          title="Delete Plant Record?"
          message={`Are you sure you want to delete "${plant.speciesName}" from your collection? This action cannot be undone.`}
          confirmText="Delete Plant"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Full-Resolution Accurate Aspect Ratio Image Lightbox */}
      {showLightbox && (
        <ImageLightboxModal
          imageUrl={plant.imageUrl}
          title={plant.speciesName}
          onClose={() => setShowLightbox(false)}
        />
      )}

    </div>
  );
}
