import React from 'react';
import { Filter, Calendar, Ruler, ArrowUpDown, RotateCcw, Check, X } from 'lucide-react';

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
              Filter plant collection by exact date, height, or comparison ranges.
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
          
          {/* SECTION 1: HEIGHT FILTERS */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--emerald-light)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Ruler size={16} /> Height Filters (cm)
            </h4>

            {/* Exact Height Input */}
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Exact Height</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 15 cm"
                value={filters.filterExactHeight}
                onChange={(e) => onUpdateFilter('filterExactHeight', e.target.value)}
              />
            </div>

            {/* Min / Max Height Range Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Larger Than (&gt; Min Height)</label>
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
                <label className="form-label">Smaller Than (&lt; Max Height)</label>
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
          </div>

          {/* SECTION 2: DATE FILTERS */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--emerald-light)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} /> Date Filters
            </h4>

            {/* Exact Date */}
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Exact Date</label>
              <input
                type="date"
                className="form-input"
                style={{ colorScheme: 'dark' }}
                value={filters.filterExactDate}
                onChange={(e) => onUpdateFilter('filterExactDate', e.target.value)}
              />
            </div>

            {/* Before Date & After Date Range Comparison */}
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
