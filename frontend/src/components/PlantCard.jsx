import React, { useState } from 'react';
import { Ruler, Calendar, TrendingUp, Plus, Trash2, Eye } from 'lucide-react';
import ConfirmDialogModal from './ConfirmDialogModal';

export default function PlantCard({ plant, onSelect, onAddHeight, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const historyCount = plant.heightHistory?.length || 1;
  const initialHeight = plant.heightHistory?.[plant.heightHistory.length - 1]?.height || plant.currentHeight;
  const growthDifference = (plant.currentHeight - initialHeight).toFixed(1);
  const isPositiveGrowth = parseFloat(growthDifference) > 0;

  const handleConfirmDelete = () => {
    onDelete(plant.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '18px', transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      
      {/* Clean Photo Header */}
      <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
        <img
          src={plant.imageUrl || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop'}
          alt={plant.speciesName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.15) 60%, transparent 100%)'
        }} />

        {/* Species Name Overlay */}
        <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
            {plant.speciesName}
          </h3>
          {plant.scientificName && (
            <p style={{ fontSize: '0.8rem', color: '#a7f3d0', fontStyle: 'italic', fontWeight: 500, marginTop: '1px' }}>
              {plant.scientificName}
            </p>
          )}
        </div>
      </div>

      {/* Card Content & Height Specs */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Height Display Box */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, letterSpacing: '0.04em' }}>
              <Ruler size={13} color="#047857" /> Current Height
            </span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#047857', marginTop: '0.1rem', letterSpacing: '-0.02em' }}>
              {plant.currentHeight} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{plant.heightUnit}</span>
            </div>
          </div>

          {/* Growth Delta Pill */}
          {historyCount > 1 && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total Growth</span>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: isPositiveGrowth ? '#047857' : '#b45309',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.1rem'
              }}>
                <TrendingUp size={13} /> +{growthDifference} {plant.heightUnit}
              </div>
            </div>
          )}
        </div>

        {/* History info & date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', marginBottom: '1.1rem', fontWeight: 500 }}>
          <span>{historyCount} height log{historyCount > 1 ? 's' : ''}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} color="#94a3b8" /> {new Date(plant.updatedAt || plant.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 40px', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => onSelect(plant)} style={{ padding: '0.5rem 0.6rem', fontSize: '0.82rem', justifyContent: 'center', minHeight: '38px' }}>
            <Eye size={14} /> Details
          </button>
          
          <button className="btn-primary" onClick={() => onAddHeight(plant)} style={{ padding: '0.5rem 0.6rem', fontSize: '0.82rem', justifyContent: 'center', minHeight: '38px' }}>
            <Plus size={14} /> Log Height
          </button>

          <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)} style={{ padding: '0.5rem', justifyContent: 'center', minHeight: '38px' }} title="Delete plant">
            <Trash2 size={14} />
          </button>
        </div>

      </div>

      {/* Custom Confirmation Dialog Modal for Deleting Plant */}
      {showDeleteConfirm && (
        <ConfirmDialogModal
          title="Delete Plant Record?"
          message={`Are you sure you want to delete "${plant.speciesName}" from your collection? This action cannot be undone.`}
          confirmText="Delete Plant"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

    </div>
  );
}
