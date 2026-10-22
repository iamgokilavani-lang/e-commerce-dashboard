import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 0' }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              height="28px"
              width={c === 0 ? '40px' : c === 1 ? '160px' : '100%'}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
