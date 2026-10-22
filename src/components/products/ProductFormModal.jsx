import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { validateProduct } from '../../utils/validators';
import { generateSKU } from '../../utils/formatters';
import { Sparkles, Image, Check } from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Audio',
  'Accessories',
  'Fashion & Apparel',
  'Home & Living',
  'Footwear',
];

const PRESET_IMAGES = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
  { label: 'Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80' },
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
  { label: 'Humidifier', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
  { label: 'Webcam', url: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600&auto=format&fit=crop&q=80' },
  { label: 'Coffee Set', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80' },
];

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    brand: '',
    sku: '',
    price: '',
    costPrice: '',
    stock: '',
    minStock: '10',
    status: 'Active',
    image: PRESET_IMAGES[0].url,
    description: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Electronics',
        brand: initialData.brand || '',
        sku: initialData.sku || '',
        price: initialData.price || '',
        costPrice: initialData.costPrice || '',
        stock: initialData.stock !== undefined ? initialData.stock : '',
        minStock: initialData.minStock || '10',
        status: initialData.status || 'Active',
        image: initialData.image || PRESET_IMAGES[0].url,
        description: initialData.description || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      });
    } else {
      setFormData({
        title: '',
        category: 'Electronics',
        brand: '',
        sku: generateSKU('Electronics', 'New Item'),
        price: '',
        costPrice: '',
        stock: '25',
        minStock: '10',
        status: 'Active',
        image: PRESET_IMAGES[0].url,
        description: '',
        tags: 'New Arrival',
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

  const handleGenerateSKU = () => {
    const newSku = generateSKU(formData.category, formData.title || 'PRD');
    setFormData((prev) => ({ ...prev, sku: newSku }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateProduct({
      ...formData,
      price: Number(formData.price),
      costPrice: formData.costPrice ? Number(formData.costPrice) : 0,
      stock: Number(formData.stock),
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const formattedTags = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      onSubmit({
        ...formData,
        price: Number(formData.price),
        costPrice: formData.costPrice ? Number(formData.costPrice) : 0,
        stock: Number(formData.stock),
        minStock: Number(formData.minStock) || 10,
        tags: formattedTags,
      });

      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  // Calculate profit margin %
  const priceNum = Number(formData.price) || 0;
  const costNum = Number(formData.costPrice) || 0;
  const profit = priceNum - costNum;
  const marginPercent = priceNum > 0 && costNum > 0 ? ((profit / priceNum) * 100).toFixed(1) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Title */}
          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Product Title *"
              name="title"
              placeholder="e.g. Aura Wireless Noise-Cancelling Headphones"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
            />
          </div>

          {/* Category */}
          <Select
            label="Category *"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={CATEGORIES}
            error={errors.category}
          />

          {/* Brand */}
          <Input
            label="Brand Name"
            name="brand"
            placeholder="e.g. AuraSound"
            value={formData.brand}
            onChange={handleChange}
          />

          {/* SKU with generator */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>SKU Code *</label>
              <button
                type="button"
                onClick={handleGenerateSKU}
                style={{
                  fontSize: '11px',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={11} /> Auto-Generate
              </button>
            </div>
            <input
              type="text"
              name="sku"
              className={`form-input ${errors.sku ? 'has-error' : ''}`}
              value={formData.sku}
              onChange={handleChange}
              placeholder="CAT-PRD-1234"
            />
            {errors.sku && <div className="form-error">{errors.sku}</div>}
          </div>

          {/* Status */}
          <Select
            label="Product Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Active', 'Draft', 'Out of Stock']}
          />

          {/* Price */}
          <div>
            <Input
              label="Regular Price ($) *"
              type="number"
              step="0.01"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
            />
          </div>

          {/* Cost Price */}
          <div>
            <Input
              label="Cost Price ($)"
              type="number"
              step="0.01"
              name="costPrice"
              placeholder="0.00"
              value={formData.costPrice}
              onChange={handleChange}
              error={errors.costPrice}
              hint={
                marginPercent !== null
                  ? `Est. Margin: ${marginPercent}% ($${profit.toFixed(2)} profit)`
                  : 'Used for margin analytics'
              }
            />
          </div>

          {/* Stock */}
          <Input
            label="Current Inventory Stock *"
            type="number"
            name="stock"
            placeholder="0"
            value={formData.stock}
            onChange={handleChange}
            error={errors.stock}
          />

          {/* Min Stock Alert */}
          <Input
            label="Low Stock Alert Threshold"
            type="number"
            name="minStock"
            placeholder="10"
            value={formData.minStock}
            onChange={handleChange}
            hint="Trigger alert when stock drops below this"
          />

          {/* Image URL & Presets */}
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Product Image URL</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                name="image"
                className="form-input"
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
              {PRESET_IMAGES.map((preset) => {
                const isSelected = formData.image === preset.url;
                return (
                  <div
                    key={preset.label}
                    onClick={() => setFormData((prev) => ({ ...prev, image: preset.url }))}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(99, 102, 241, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Tags (Comma separated)"
              name="tags"
              placeholder="e.g. Best Seller, Summer, Electronics"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Product Description</label>
            <textarea
              name="description"
              rows={3}
              className="form-textarea"
              placeholder="Provide a detailed overview of the product specifications..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
