import React from 'react';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Edit3, Star, Tag, Box, DollarSign, Calendar, Layers } from 'lucide-react';

export const ProductViewDrawer = ({ product, isOpen, onClose, onEdit }) => {
  if (!product) return null;

  const isOutOfStock = Number(product.stock) <= 0;
  const isLowStock = !isOutOfStock && Number(product.stock) <= (product.minStock || 10);
  const profit = (product.price || 0) - (product.costPrice || 0);
  const marginPercent = product.price > 0 && product.costPrice > 0
    ? ((profit / product.price) * 100).toFixed(1)
    : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={product.title}
      subtitle={`SKU: ${product.sku}`}
      wide
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            icon={Edit3}
            onClick={() => {
              onClose();
              onEdit(product);
            }}
          >
            Edit Product
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Product Media Cover */}
        <div
          style={{
            width: '100%',
            height: '240px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-tertiary)',
            position: 'relative',
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <Badge
              variant={
                product.status === 'Active'
                  ? 'success'
                  : product.status === 'Draft'
                  ? 'neutral'
                  : 'danger'
              }
              dot
            >
              {product.status}
            </Badge>
          </div>
          {isLowStock && (
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <Badge variant="warning">Low Stock ({product.stock})</Badge>
            </div>
          )}
        </div>

        {/* Quick Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>
              <DollarSign size={15} /> Retail Price
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatCurrency(product.price)}
            </div>
            {product.costPrice && (
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Cost: {formatCurrency(product.costPrice)} {marginPercent && `(${marginPercent}% margin)`}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>
              <Box size={15} /> Inventory Level
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: isOutOfStock ? 'var(--danger)' : isLowStock ? 'var(--warning)' : 'var(--text-primary)' }}>
              {product.stock} units
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Threshold: {product.minStock || 10} units
            </div>
          </div>
        </div>

        {/* Specifications & Attributes */}
        <div className="card" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
            Attributes & Specifications
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Category:</span>{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{product.category}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Brand:</span>{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{product.brand || 'Generic'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Total Sales:</span>{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{product.salesCount || 0} units</strong>
            </div>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <Star size={13} fill="#f59e0b" color="#f59e0b" /> Rating:
              </span>{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{product.rating || '4.8'}</strong> ({product.reviewsCount || 0} reviews)
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)' }}>Added On:</span>{' '}
              <span style={{ color: 'var(--text-primary)' }}>{formatDate(product.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={13} /> Tags & Labels
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Description
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {product.description || 'No description provided for this product.'}
          </p>
        </div>
      </div>
    </Drawer>
  );
};
