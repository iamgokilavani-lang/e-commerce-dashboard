import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'Try adjusting your search query, clearing filters, or create a new entry.',
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={34} />
      </div>
      <div>
        <h4 className="empty-state-title">{title}</h4>
        <p className="empty-state-desc">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} icon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
