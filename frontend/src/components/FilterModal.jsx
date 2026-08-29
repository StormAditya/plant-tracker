import React, { useState } from 'react';
import { Filter, Calendar, Ruler, RotateCcw, Check, X } from 'lucide-react';

export default function FilterModal({
  filters,
  onUpdateFilter,
  onResetFilters,
  onClose
}) {
  // Determine initial active mode for Height
  const getInitialHeightMode = () => {
    if (filters.filterExactHeight) return 'exact';
    if (filters.filterMinHeight || filters.filterMaxHeight) return 'range';
    return 'all';
  };

  // Determine initial active mode for Date
  const getInitialDateMode = () => {
    if (filters.filterExactDate) return 'exact';
    if (filters.filterAfterDate || filters.filterBeforeDate) return 'range';
    return 'all';
  };

  const [heightMode, setHeightMode] = useState(getInitialHeightMode());
  const [dateMode, setDateMode] = useState(getInitialDateMode());

  const handleHeightModeChange = (mode) => {
    setHeightMode(mode);
    if (mode === 'all') {
      onUpdateFilter('filterExactHeight', '');
      onUpdateFilter('filterMinHeight', '');
      onUpdateFilter('filterMaxHeight', '');
    } else if (mode === 'exact') {
      onUpdateFilter('filterMinHeight', '');
      onUpdateFilter('filterMaxHeight', '');
    } else if (mode === 'range') {
      onUpdateFilter('filterExactHeight', '');
    }
  };

  const handleDateModeChange = (mode) => {
    setDateMode(mode);
    if (mode === 'all') {
      onUpdateFilter('filterExactDate', '');
      onUpdateFilter('filterAfterDate', '');
      onUpdateFilter('filterBeforeDate', '');
    } else if (mode === 'exact') {
      onUpdateFilter('filterAfterDate', '');
      onUpdateFilter('filterBeforeDate', '');
    } else if (mode === 'range') {
      onUpdateFilter('filterExactDate', '');
    }
  };

  const handleResetAll = () => {
    setHeightMode('all');
    setDateMode('all');
    onResetFilters();
  };

  const activeCount = [
    filters.filterExactHeight,
    filters.filterMinHeight,
    filters.filterMaxHeight,
    filters.filterExactDate,
    filters.filterBeforeDate,
    filters.filterAfterDate
  ].filter(Boolean).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={20} color="var(--emerald-light)" /> Search Filters
              {activeCount > 0 && (
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  {activeCount} Active
                </span>
              )}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Select a mode to show only active filter input controls.
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ width: '38px', height: '38px', minWidth: '38px', padding: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Close Filters"
          >
            <X size={18} />
          </button>
        </div>

        {/* Clean Segmented Filter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* SECTION 1: HEIGHT FILTER SEGMENTED CONTROLS */}
          <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.1rem' }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--emerald-light)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Ruler size={16} /> Height Filter
            </h4>

            {/* Segmented Mode Selector Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '12px', marginBottom: '1rem', gap: '4px' }}>
              <button
                type="button"
                onClick={() => handleHeightModeChange('all')}
                style={{
                  background: heightMode === 'all' ? 'var(--emerald-primary)' : 'transparent',
                  color: heightMode === 'all' ? '#04120a' : 'var(--text-muted)',
                  fontWeight: heightMode === 'all' ? 700 : 500,
                  fontSize: '0.78rem',
                  padding: '0.5rem 0.25rem',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                All Heights
              </button>

              <button
                type="button"
                onClick={() => handleHeightModeChange('exact')}
                style={{
                  background: heightMode === 'exact' ? 'var(--emerald-primary)' : 'transparent',
                  color: heightMode === 'exact' ? '#04120a' : 'var(--text-muted)',
                  fontWeight: heightMode === 'exact' ? 700 : 500,
                  fontSize: '0.78rem',
                  padding: '0.5rem 0.25rem',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Exact Height
              </button>

              <button
                type="button"
                onClick={() => handleHeightModeChange('range')}
                style={{
                  background: heightMode === 'range' ? 'var(--emerald-primary)' : 'transparent',
                  color: heightMode === 'range' ? '#04120a' : 'var(--text-muted)',
                  fontWeight: heightMode === 'range' ? 700 : 500,
                  fontSize: '0.78rem',
                  padding: '0.5rem 0.25rem',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Height Range
              </button>
            </div>

            {/* ONLY DISPLAY ACTIVE MODE INPUTS */}
            {heightMode === 'all' && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', margin: '0.2rem 0' }}>
                Showing plants of all height measurements.
              </p>
            )}

            {heightMode === 'exact' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Enter Exact Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 15 cm"
                  value={filters.filterExactHeight}
                  onChange={(e) => onUpdateFilter('filterExactHeight', e.target.value)}
                  autoFocus
                />
              </div>
            )}

            {heightMode === 'range' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Larger Than (&gt; Min cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="Min cm..."
                    value={filters.filterMinHeight}
                    onChange={(e) => onUpdateFilter('filterMinHeight', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Smaller Than (&lt; Max cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="Max cm..."
                    value={filters.filterMaxHeight}
                    onChange={(e) => onUpdateFilter('filterMaxHeight', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: DATE FILTER SEGMENTED CONTROLS */}
          <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.1rem' }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--emerald-light)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} /> Date Filter
            </h4>

            {/* Segmented Mode Selector Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '12px', marginBottom: '1rem', gap: '4px' }}>
              <button
                type="button"
                onClick={() => handleDateModeChange('all')}
                style={{
                  background: dateMode === 'all' ? 'var(--emerald-primary)' : 'transparent',
                  color: dateMode === 'all' ? '#04120a' : 'var(--text-muted)',
                  fontWeight: dateMode === 'all' ? 700 : 500,
                  fontSize: '0.78rem',
                  padding: '0.5rem 0.25rem',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                All Dates
              </button>

              <button
                type="button"
                onClick={() => handleDateModeChange('exact')}
                style={{
                  background: dateMode === 'exact' ? 'var(--emerald-primary)' : 'transparent',
                  color: dateMode === 'exact' ? '#04120a' : 'var(--text-muted)',
                  fontWeight: dateMode === 'exact' ? 700 : 500,
                  fontSize: '0.78rem',
                  padding: '0.5rem 0.25rem',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Exact Date
              </button>

              <button
                type="button"
                onClick={() => handleDateModeChange('range')}
                style={{
                  background: dateMode === 'range' ? 'var(--emerald-primary)' : 'transparent',
                  color: dateMode === 'range' ? '#04120a' : 'var(--text-muted)',
                  fontWeight: dateMode === 'range' ? 700 : 500,
                  fontSize: '0.78rem',
                  padding: '0.5rem 0.25rem',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Date Range
              </button>
            </div>

            {/* ONLY DISPLAY ACTIVE MODE INPUTS */}
            {dateMode === 'all' && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', margin: '0.2rem 0' }}>
                Showing plants recorded across all dates.
              </p>
            )}

            {dateMode === 'exact' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Exact Date</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ colorScheme: 'dark' }}
                  value={filters.filterExactDate}
                  onChange={(e) => onUpdateFilter('filterExactDate', e.target.value)}
                />
              </div>
            )}

            {dateMode === 'range' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">After Date (From)</label>
                  <input
                    type="date"
                    className="form-input"
                    style={{ colorScheme: 'dark' }}
                    value={filters.filterAfterDate}
                    onChange={(e) => onUpdateFilter('filterAfterDate', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Before Date (To)</label>
                  <input
                    type="date"
                    className="form-input"
                    style={{ colorScheme: 'dark' }}
                    value={filters.filterBeforeDate}
                    onChange={(e) => onUpdateFilter('filterBeforeDate', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleResetAll}
              style={{ fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Reset Filters
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={onClose}
              style={{ fontSize: '0.88rem' }}
            >
              <Check size={16} /> Apply & Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
