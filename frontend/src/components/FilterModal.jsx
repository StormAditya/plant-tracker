import React from 'react';
import { Filter, Calendar, Ruler, RotateCcw, Check, X } from 'lucide-react';

export default function FilterModal({
  filters,
  onUpdateFilter,
  onResetFilters,
  onClose
}) {
  const activeCount = [
    filters.filterExactHeight,
    filters.filterMinHeight,
    filters.filterMaxHeight,
    filters.filterExactDate,
    filters.filterBeforeDate,
    filters.filterAfterDate
  ].filter(Boolean).length;

  // Height Mutual Exclusion Handlers
  const handleExactHeightChange = (val) => {
    onUpdateFilter('filterExactHeight', val);
    if (val) {
      onUpdateFilter('filterMinHeight', '');
      onUpdateFilter('filterMaxHeight', '');
    }
  };

  const handleMinHeightChange = (val) => {
    onUpdateFilter('filterMinHeight', val);
    if (val) {
      onUpdateFilter('filterExactHeight', '');
    }
  };

  const handleMaxHeightChange = (val) => {
    onUpdateFilter('filterMaxHeight', val);
    if (val) {
      onUpdateFilter('filterExactHeight', '');
    }
  };

  // Date Mutual Exclusion Handlers
  const handleExactDateChange = (val) => {
    onUpdateFilter('filterExactDate', val);
    if (val) {
      onUpdateFilter('filterAfterDate', '');
      onUpdateFilter('filterBeforeDate', '');
    }
  };

  const handleAfterDateChange = (val) => {
    onUpdateFilter('filterAfterDate', val);
    if (val) {
      onUpdateFilter('filterExactDate', '');
    }
  };

  const handleBeforeDateChange = (val) => {
    onUpdateFilter('filterBeforeDate', val);
    if (val) {
      onUpdateFilter('filterExactDate', '');
    }
  };

  const isHeightComparisonActive = Boolean(filters.filterMinHeight || filters.filterMaxHeight);
  const isHeightExactActive = Boolean(filters.filterExactHeight);

  const isDateComparisonActive = Boolean(filters.filterAfterDate || filters.filterBeforeDate);
  const isDateExactActive = Boolean(filters.filterExactDate);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={20} color="var(--emerald-light)" /> Advanced Search Filters
              {activeCount > 0 && (
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  {activeCount} Active
                </span>
              )}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Choose either <strong>Exact</strong> values or <strong>Comparison Range</strong> filters at a time.
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

        {/* Filter Controls Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* SECTION 1: HEIGHT FILTERS (MUTUALLY EXCLUSIVE) */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--emerald-light)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <Ruler size={16} /> Height Filter Mode
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {isHeightExactActive ? 'Mode: Exact Height' : isHeightComparisonActive ? 'Mode: Height Range' : 'Exact or Range'}
              </span>
            </div>

            {/* Exact Height Input */}
            <div className="form-group" style={{ marginBottom: '0.75rem', opacity: isHeightComparisonActive ? 0.45 : 1 }}>
              <label className="form-label">
                Exact Height (cm) {isHeightComparisonActive && <span style={{ color: 'var(--accent-gold)' }}>(Disabled in Range mode)</span>}
              </label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 15 cm"
                value={filters.filterExactHeight}
                onChange={(e) => handleExactHeightChange(e.target.value)}
              />
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.4rem 0' }}>— OR COMPARISON RANGE —</div>

            {/* Min / Max Height Range Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', opacity: isHeightExactActive ? 0.45 : 1 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Larger Than (&gt; Min)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="Min cm..."
                  value={filters.filterMinHeight}
                  onChange={(e) => handleMinHeightChange(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Smaller Than (&lt; Max)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="Max cm..."
                  value={filters.filterMaxHeight}
                  onChange={(e) => handleMaxHeightChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: DATE FILTERS (MUTUALLY EXCLUSIVE) */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--emerald-light)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <Calendar size={16} /> Date Filter Mode
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {isDateExactActive ? 'Mode: Exact Date' : isDateComparisonActive ? 'Mode: Date Range' : 'Exact or Range'}
              </span>
            </div>

            {/* Exact Date */}
            <div className="form-group" style={{ marginBottom: '0.75rem', opacity: isDateComparisonActive ? 0.45 : 1 }}>
              <label className="form-label">
                Exact Date {isDateComparisonActive && <span style={{ color: 'var(--accent-gold)' }}>(Disabled in Range mode)</span>}
              </label>
              <input
                type="date"
                className="form-input"
                style={{ colorScheme: 'dark' }}
                value={filters.filterExactDate}
                onChange={(e) => handleExactDateChange(e.target.value)}
              />
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.4rem 0' }}>— OR COMPARISON RANGE —</div>

            {/* Before Date & After Date Range Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', opacity: isDateExactActive ? 0.45 : 1 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">After Date (From)</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ colorScheme: 'dark' }}
                  value={filters.filterAfterDate}
                  onChange={(e) => handleAfterDateChange(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Before Date (To)</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ colorScheme: 'dark' }}
                  value={filters.filterBeforeDate}
                  onChange={(e) => handleBeforeDateChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onResetFilters}
              style={{ fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Reset All
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={onClose}
              style={{ fontSize: '0.88rem' }}
            >
              <Check size={16} /> Apply Filters
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
