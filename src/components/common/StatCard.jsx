import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  trend, // e.g. 12.5 or -3.2 or null
  trendLabel = 'vs last month',
  icon: Icon,
  color = 'primary', // primary, success, warning, info, secondary
  subtitle,
}) => {
  const isPositive = trend !== undefined && trend !== null && trend > 0;
  const isNegative = trend !== undefined && trend !== null && trend < 0;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">{title}</span>
        {Icon && (
          <div
            className="stat-icon-wrapper"
            style={{
              backgroundColor: `var(--${color}-light)`,
              color: `var(--${color})`,
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="stat-value">{value}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {trend !== undefined && trend !== null && (
          <span
            className={`stat-trend ${
              isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'
            }`}
          >
            {isPositive && <ArrowUpRight size={13} />}
            {isNegative && <ArrowDownRight size={13} />}
            {!isPositive && !isNegative && <Minus size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {subtitle || trendLabel}
        </span>
      </div>
    </div>
  );
};
