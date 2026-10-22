import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { validateRestock } from '../../utils/validators';
import { PlusCircle } from 'lucide-react';

export const RestockModal = ({
  isOpen,
  onClose,
  product,
  onRestock,
}) => {
  const [quantity, setQuantity] = useState('25');
  const [reason, setReason] = useState('Monthly supplier shipment received');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity('25');
      setReason('Monthly supplier shipment received');
      setErrors({});
    }
  }, [isOpen]);

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateRestock(quantity, reason);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onRestock(product.id, Number(quantity), reason);
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  const newProjectedStock = Math.max(0, (product.stock || 0) + (Number(quantity) || 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Restock Product"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            Confirm Restock
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
            SKU: {product.sku} &bull; Current Stock:{' '}
            <strong style={{ color: product.stock === 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
              {product.stock} units
            </strong>
          </div>
        </div>

        <Input
          label="Quantity to Add *"
          type="number"
          min="1"
          placeholder="e.g. 50"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          error={errors.quantity}
          hint={`Projected new inventory level: ${newProjectedStock} units`}
        />

        <Select
          label="Restock Reason *"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={[
            'Monthly supplier shipment received',
            'Factory production batch intake',
            'Customer cancellation return to stock',
            'Internal transfer from secondary warehouse',
          ]}
          error={errors.reason}
        />
      </form>
    </Modal>
  );
};
