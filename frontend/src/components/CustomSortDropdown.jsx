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
          background: '#ffffff',
          border: isOpen ? '1px solid #2563eb' : '1px solid #cbd5e1',
          borderRadius: '14px',
          color: '#0f172a',
          fontSize: '0.85rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)'
        }}
        title="Sort Plant Collection"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
          <ArrowUpDown size={15} color="#047857" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            Sort: <strong style={{ color: '#047857', fontWeight: 700 }}>{selectedOption.label}</strong>
          </span>
        </div>

        <ChevronDown
          size={16}
          color="#64748b"
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
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
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
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#047857' : '#475569',
                  background: isSelected ? '#ecfdf5' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                  if (!isSelected) e.currentTarget.style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                  if (!isSelected) e.currentTarget.style.color = '#475569';
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={14} color="#047857" />}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
