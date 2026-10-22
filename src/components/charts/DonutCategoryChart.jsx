import React, { useState } from 'react';
import { formatNumber } from '../../utils/formatters';

const CATEGORY_COLORS = {
  Audio: '#6366f1',
  Accessories: '#ec4899',
  Electronics: '#06b6d4',
  'Fashion & Apparel': '#8b5cf6',
  'Home & Living': '#10b981',
  Footwear: '#f59e0b',
  Other: '#64748b',
};

export const DonutCategoryChart = ({ categoryBreakdown = {} }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = Object.keys(categoryBreakdown).length
    ? Object.entries(categoryBreakdown).map(([category, count]) => ({
        category,
        count,
        color: CATEGORY_COLORS[category] || '#6366f1',
      }))
    : [
        { category: 'Audio', count: 890, color: '#6366f1' },
        { category: 'Accessories', count: 627, color: '#ec4899' },
        { category: 'Electronics', count: 1980, color: '#06b6d4' },
        { category: 'Fashion & Apparel', count: 710, color: '#8b5cf6' },
        { category: 'Home & Living', count: 990, color: '#10b981' },
        { category: 'Footwear', count: 1015, color: '#f59e0b' },
      ];

  const totalCount = categories.reduce((sum, c) => sum + c.count, 0) || 1;

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const slices = categories.map((cat) => {
    const percent = cat.count / totalCount;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;
    return {
      ...cat,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeData = hoveredCategory
    ? slices.find((s) => s.category === hoveredCategory)
    : null;

  return (
    <div className="donut-chart-wrapper">
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {slices.map((slice) => {
            const isHovered = hoveredCategory === slice.category;
            return (
              <circle
                key={slice.category}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                style={{
                  cursor: 'pointer',
                  transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                  opacity: hoveredCategory && !isHovered ? 0.4 : 1,
                }}
                onMouseEnter={() => setHoveredCategory(slice.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
            {activeData ? activeData.category : 'Total Volume'}
          </span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {activeData ? `${activeData.percent}%` : formatNumber(totalCount)}
          </span>
          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
            {activeData ? `${formatNumber(activeData.count)} sold` : 'units sold'}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="donut-legend">
        {slices.map((slice) => (
          <div
            key={slice.category}
            className="donut-legend-item"
            style={{
              cursor: 'pointer',
              opacity: hoveredCategory && hoveredCategory !== slice.category ? 0.4 : 1,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={() => setHoveredCategory(slice.category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <span
              className="legend-color-dot"
              style={{ backgroundColor: slice.color }}
            />
            <span style={{ color: 'var(--text-secondary)', flex: 1, minWidth: '90px' }}>
              {slice.category}
            </span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
              {slice.percent}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};
