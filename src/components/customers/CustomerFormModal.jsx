import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { validateCustomer } from '../../utils/validators';

const TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'VIP'];

export const CustomerFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    tier: 'Bronze',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'India',
        tier: initialData.tier || 'Bronze',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        tier: 'Bronze',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateCustomer(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Customer Profile' : 'Add New Customer'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Add Customer'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Full Name *"
              name="name"
              placeholder="e.g. Ananya Iyer"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Email Address *"
              type="email"
              name="email"
              placeholder="ananya.iyer@example.in"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <Input
            label="Phone Number"
            name="phone"
            placeholder="+91 98000 00000"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <Select
            label="Customer Tier"
            name="tier"
            value={formData.tier}
            onChange={handleChange}
            options={TIERS}
          />

          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Street Address"
              name="address"
              placeholder="12 Indiranagar 100ft Rd"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <Input
            label="City *"
            name="city"
            placeholder="Bengaluru"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
          />

          <Input
            label="State / Region"
            name="state"
            placeholder="Karnataka"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};
