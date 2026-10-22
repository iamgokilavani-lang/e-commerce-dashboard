import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

const MONTHLY_DATA = [
  { month: 'Oct', revenue: 42000, cost: 21000 },
  { month: 'Nov', revenue: 58000, cost: 28000 },
  { month: 'Dec', revenue: 79000, cost: 36000 },
  { month: 'Jan', revenue: 51000, cost: 24000 },
  { month: 'Feb', revenue: 64000, cost: 29000 },
  { month: 'Mar', revenue: 83000, cost: 35000 },
];

export const BarComparisonChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxVal = Math.max(...MONTHLY_DATA.map((d) => Math.max(d.revenue, d.cost))) * 1.15;
  const height = 180;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--primary)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Revenue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ec4899' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Cost</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: `${height}px`,
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        {MONTHLY_DATA.map((item, idx) => {
          const revHeight = (item.revenue / maxVal) * (height - 30);
          const costHeight = (item.cost / maxVal) * (height - 30);
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.month}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Bars Pair */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '4px',
                  height: `${height - 30}px`,
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: `${revHeight}px`,
                    background: 'var(--primary-gradient)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.2s ease',
                    opacity: isHovered ? 1 : 0.85,
                    transform: isHovered ? 'scaleY(1.04)' : 'none',
                    transformOrigin: 'bottom',
                  }}
                />
                <div
                  style={{
                    width: '14px',
                    height: `${costHeight}px`,
                    background: 'linear-gradient(180deg, #ec4899 0%, #be185d 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.2s ease',
                    opacity: isHovered ? 1 : 0.85,
                    transform: isHovered ? 'scaleY(1.04)' : 'none',
                    transformOrigin: 'bottom',
                  }}
                />
              </div>

              {/* Month label */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '-22px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {item.month}
              </span>

              {/* Tooltip */}
              {isHovered && (
                <div
                  className="chart-tooltip"
                  style={{
                    bottom: `${Math.max(revHeight, costHeight) + 40}px`,
                    left: '50%',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.month} 2026
                  </div>
                  <div style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    Revenue: {formatCurrency(item.revenue)}
                  </div>
                  <div style={{ color: '#ec4899', fontWeight: 600 }}>
                    Cost: {formatCurrency(item.cost)}
                  </div>
                  <div style={{ color: 'var(--success)', fontSize: '11px', marginTop: '2px' }}>
                    Gross Profit: {formatCurrency(item.revenue - item.cost)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
