import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = ({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          style={Icon ? { paddingLeft: '38px' } : {}}
          className={`form-input ${error ? 'has-error' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <div className="form-error">
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}
      {hint && !error && <div className="form-hint">{hint}</div>}
    </div>
  );
};
