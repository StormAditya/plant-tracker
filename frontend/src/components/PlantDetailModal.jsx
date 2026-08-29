import React, { useState } from 'react';
import { Ruler, Calendar, Plus, Edit3, Trash2, Leaf, Info, Activity, Maximize2 } from 'lucide-react';
import GrowthChart from './GrowthChart';
import ImageLightboxModal from './ImageLightboxModal';

export default function PlantDetailModal({ plant, onAddHeight, onUpdatePlant, onDelete, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [speciesName, setSpeciesName] = useState(plant.speciesName);
  const [scientificName, setScientificName] = useState(plant.scientificName || '');
  const [notes, setNotes] = useState(plant.notes || '');

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdatePlant(plant.id, {
      speciesName: speciesName.trim(),
      scientificName: scientificName.trim(),
      notes: notes.trim()
    });
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        
        {/* Header Bar - Safe Top Breathing Room */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.85rem' }}>
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ width: '38px', height: '38px', minWidth: '38px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Close Modal"
          >
            ✕
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
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              padding: '0.35rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <Maximize2 size={12} color="var(--emerald-light)" /> View Full Photo
            </div>
          </div>

          {/* Plant Profile Info Box */}
          <div>
            {!isEditing ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>{plant.speciesName}</h2>
                    {plant.scientificName && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--emerald-light)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                        {plant.scientificName}
                      </p>
                    )}
                  </div>
                  <button className="btn-secondary" onClick={() => setIsEditing(true)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}>
                    <Edit3 size={14} /> Edit
                  </button>
                </div>

                {/* Recorded Height Box */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '14px',
                  padding: '0.9rem 1.1rem',
                  margin: '0.75rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Recorded Height</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
                      {plant.currentHeight} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>{plant.heightUnit}</span>
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
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.8rem', borderRadius: '10px' }}>
                    <strong>Notes:</strong> {plant.notes}
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
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={16} color="var(--emerald-light)" /> Height History Logs
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
            {plant.heightHistory?.map((log, index) => (
              <div key={log.id || index} style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-emerald"><Ruler size={12} /> {log.height} {log.unit}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{log.note || 'Recorded measurement'}</span>
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                  {new Date(log.loggedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

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
