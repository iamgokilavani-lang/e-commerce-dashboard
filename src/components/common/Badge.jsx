import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // success, warning, danger, info, neutral, purple
  dot = false,
  className = '',
  ...props
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};
