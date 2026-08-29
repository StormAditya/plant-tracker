import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function GrowthChart({ history = [], unit = 'cm' }) {
  if (!history || history.length === 0) return null;

  // Sort chronological
  const sorted = [...history].sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt));
  const heights = sorted.map(h => parseFloat(h.height));
  
  const maxH = Math.max(...heights, 10);
  const minH = Math.min(...heights, 0);
  const range = maxH - minH || 1;

  // Calculate SVG points
  const width = 450;
  const height = 150;
  const padding = 30;

  const points = sorted.map((item, index) => {
    const x = padding + (index / Math.max(sorted.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((parseFloat(item.height) - minH) / range) * (height - padding * 2);
    return { x, y, val: item.height, date: new Date(item.loggedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
  });

  const svgPathD = points.length === 1
    ? `M ${padding} ${height - padding} L ${width - padding} ${height - padding}`
    : points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1.25rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-light)' }}>
          <TrendingUp size={16} /> Plant Growth Trajectory
        </h4>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          {sorted.length} Measurement{sorted.length > 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          
          {/* Horizontal grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

          {/* Growth Trend Line */}
          <path
            d={svgPathD}
            fill="none"
            stroke="var(--emerald-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#04120a" stroke="var(--emerald-light)" strokeWidth="2.5" />
              <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="var(--emerald-light)" fontSize="10" fontWeight="bold">
                {pt.val} {unit}
              </text>
              <text x={pt.x} y={height - 10} textAnchor="middle" fill="var(--text-dim)" fontSize="9">
                {pt.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
