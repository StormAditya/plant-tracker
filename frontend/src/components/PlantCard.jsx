import React from 'react';
import { Ruler, Calendar, TrendingUp, Plus, Trash2, Eye } from 'lucide-react';

export default function PlantCard({ plant, onSelect, onAddHeight, onDelete }) {
  const historyCount = plant.heightHistory?.length || 1;
  const initialHeight = plant.heightHistory?.[plant.heightHistory.length - 1]?.height || plant.currentHeight;
  const growthDifference = (plant.currentHeight - initialHeight).toFixed(1);
  const isPositiveGrowth = parseFloat(growthDifference) > 0;

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.25s ease' }}>
      
      {/* Clean Photo Header */}
      <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
        <img
          src={plant.imageUrl || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop'}
          alt={plant.speciesName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(7, 13, 10, 0.9) 0%, rgba(7, 13, 10, 0.15) 60%, transparent 100%)'
        }} />

        {/* Species Name Overlay */}
        <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {plant.speciesName}
          </h3>
          {plant.scientificName && (
            <p style={{ fontSize: '0.78rem', color: '#a7f3d0', fontStyle: 'italic' }}>
              {plant.scientificName}
            </p>
          )}
        </div>
      </div>

      {/* Card Content & Height Specs */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Height Display Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Ruler size={12} color="var(--emerald-light)" /> Current Height
            </span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--emerald-light)', marginTop: '0.1rem' }}>
              {plant.currentHeight} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>{plant.heightUnit}</span>
            </div>
          </div>

          {/* Growth delta */}
          {historyCount > 1 && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Growth</span>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: isPositiveGrowth ? 'var(--emerald-light)' : 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}>
                <TrendingUp size={14} /> +{growthDifference} {plant.heightUnit}
              </div>
            </div>
          )}
        </div>

        {/* History info & date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
          <span>{historyCount} height log{historyCount > 1 ? 's' : ''}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={12} /> {new Date(plant.updatedAt || plant.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => onSelect(plant)} style={{ padding: '0.5rem 0.6rem', fontSize: '0.8rem', justifyContent: 'center' }}>
            <Eye size={14} /> Details
          </button>
          
          <button className="btn-primary" onClick={() => onAddHeight(plant)} style={{ padding: '0.5rem 0.6rem', fontSize: '0.8rem', justifyContent: 'center' }}>
            <Plus size={14} /> Log Height
          </button>

          <button className="btn-danger" onClick={() => onDelete(plant.id)} style={{ padding: '0.5rem', justifyContent: 'center' }} title="Delete plant">
            <Trash2 size={14} />
          </button>
        </div>

      </div>

    </div>
  );
}
