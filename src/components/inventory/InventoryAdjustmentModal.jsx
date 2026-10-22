import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Edit3 } from 'lucide-react';

export const InventoryAdjustmentModal = ({
  isOpen,
  onClose,
  product,
  onAdjust,
}) => {
  const [newStock, setNewStock] = useState('');
  const [reason, setReason] = useState('Routine physical inventory cycle count');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setNewStock(String(product.stock || 0));
      setReason('Routine physical inventory cycle count');
      setError(null);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newStock === '' || isNaN(newStock) || Number(newStock) < 0) {
      setError('Stock level must be 0 or higher');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onAdjust(product.id, Number(newStock), reason);
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  const diff = (Number(newStock) || 0) - (product.stock || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Inventory Count"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={Edit3}
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            Apply Adjustment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px', padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {product.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Current Recorded Stock: <strong>{product.stock} units</strong>
          </div>
        </div>

        <Input
          label="Actual Verified On-Hand Count *"
          type="number"
          min="0"
          value={newStock}
          onChange={(e) => {
            setNewStock(e.target.value);
            setError(null);
          }}
          error={error}
          hint={
            diff !== 0
              ? `Adjustment variance: ${diff > 0 ? `+${diff}` : diff} units`
              : 'No change in stock count'
          }
        />

        <Select
          label="Audit Adjustment Reason *"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={[
            'Routine physical inventory cycle count',
            'Damaged goods written off',
            'Inventory discrepancy reconciliation',
            'Return of sample / showroom units',
          ]}
        />
      </form>
    </Modal>
  );
};
