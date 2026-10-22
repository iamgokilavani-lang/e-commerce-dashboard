import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Select = ({
  label,
  error,
  options = [],
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`form-select ${error ? 'has-error' : ''}`}
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error && (
        <div className="form-error">
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
