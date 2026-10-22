import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

const TIMEFRAME_DATA = {
  '7D': [
    { label: 'Mon', date: 'Mar 18', revenue: 1420, orders: 12 },
    { label: 'Tue', date: 'Mar 19', revenue: 2180, orders: 19 },
    { label: 'Wed', date: 'Mar 20', revenue: 1890, orders: 15 },
    { label: 'Thu', date: 'Mar 21', revenue: 3450, orders: 28 },
    { label: 'Fri', date: 'Mar 22', revenue: 2900, orders: 24 },
    { label: 'Sat', date: 'Mar 23', revenue: 4120, orders: 36 },
    { label: 'Sun', date: 'Mar 24', revenue: 3780, orders: 31 },
  ],
  '30D': [
    { label: 'Week 1', date: 'Mar 01 - 07', revenue: 14200, orders: 115 },
    { label: 'Week 2', date: 'Mar 08 - 14', revenue: 18500, orders: 148 },
    { label: 'Week 3', date: 'Mar 15 - 21', revenue: 22400, orders: 182 },
    { label: 'Week 4', date: 'Mar 22 - 28', revenue: 26800, orders: 210 },
  ],
  '90D': [
    { label: 'Jan', date: 'January 2026', revenue: 54000, orders: 420 },
    { label: 'Feb', date: 'February 2026', revenue: 68500, orders: 540 },
    { label: 'Mar', date: 'March 2026', revenue: 81900, orders: 655 },
  ],
  '1Y': [
    { label: 'Q1', date: 'Q1 2025', revenue: 140000, orders: 1100 },
    { label: 'Q2', date: 'Q2 2025', revenue: 175000, orders: 1380 },
    { label: 'Q3', date: 'Q3 2025', revenue: 195000, orders: 1540 },
    { label: 'Q4', date: 'Q4 2025', revenue: 245000, orders: 1980 },
    { label: 'Q1', date: 'Q1 2026', revenue: 280000, orders: 2240 },
  ],
};

export const AreaTrendChart = () => {
  const [timeframe, setTimeframe] = useState('7D');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const data = TIMEFRAME_DATA[timeframe] || TIMEFRAME_DATA['7D'];

  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 35, left: 30 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxRevenue = Math.max(...data.map((d) => d.revenue)) * 1.15;

  const points = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.revenue / maxRevenue) * chartHeight;
    return { ...d, x, y };
  });

  // Generate smooth SVG curve path using cubic bezier segments
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    padding.top + chartHeight
  } L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div className="svg-chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Revenue Velocity</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}
          </div>
        </div>
        <div className="chart-header-tabs">
          {['7D', '30D', '90D', '1Y'].map((tf) => (
            <button
              key={tf}
              className={`chart-tab-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => {
                setTimeframe(tf);
                setHoveredPoint(null);
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = padding.top + chartHeight * ratio;
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Curved Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint === i ? 6.5 : 4}
                fill={hoveredPoint === i ? '#ffffff' : '#6366f1'}
                stroke="#6366f1"
                strokeWidth="2.5"
                style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* X Axis Label */}
              <text
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-muted)"
                fontWeight="500"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint !== null && points[hoveredPoint] && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(points[hoveredPoint].x / width) * 100}%`,
              top: `${(points[hoveredPoint].y / height) * 100}%`,
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {points[hoveredPoint].date}
            </div>
            <div style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Revenue: {formatCurrency(points[hoveredPoint].revenue)}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
              Orders: {points[hoveredPoint].orders} completed
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
