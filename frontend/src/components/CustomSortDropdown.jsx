import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Date (Newest)' },
  { value: 'oldest', label: 'Date (Oldest)' },
  { value: 'height-high', label: 'Height (Tallest)' },
  { value: 'height-low', label: 'Height (Shortest)' },
  { value: 'name', label: 'Name (A - Z)' }
];

export default function CustomSortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', minWidth: '175px', flexShrink: 0 }}>
      
      {/* Custom Styled Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn-secondary"
        style={{
          width: '100%',
          height: '46px',
          padding: '0 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(12px)',
          border: isOpen ? '1px solid var(--emerald-primary)' : '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '14px',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none'
        }}
        title="Sort Plant Collection"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
          <ArrowUpDown size={15} color="var(--emerald-light)" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            Sort: <strong style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>{selectedOption.label}</strong>
          </span>
        </div>

        <ChevronDown
          size={16}
          color="var(--text-muted)"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }}
        />
      </button>

      {/* Glassmorphic Options Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            background: 'rgba(10, 20, 15, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glow)',
            borderRadius: '16px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.8), 0 0 15px rgba(16, 185, 129, 0.15)',
            padding: '0.35rem',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'var(--emerald-light)' : 'var(--text-muted)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  if (!isSelected) e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                  if (!isSelected) e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={14} color="var(--emerald-light)" />}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
