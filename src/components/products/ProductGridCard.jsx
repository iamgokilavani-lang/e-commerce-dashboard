import React from 'react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Eye, Edit3, Trash2, Star, AlertTriangle } from 'lucide-react';

export const ProductGridCard = ({ product, onView, onEdit, onDelete }) => {
  const isOutOfStock = Number(product.stock) <= 0;
  const isLowStock = !isOutOfStock && Number(product.stock) <= (product.minStock || 10);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Draft':
        return 'neutral';
      case 'Out of Stock':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-card-image"
          loading="lazy"
        />
        <div className="product-card-badge">
          <Badge variant={getStatusBadgeVariant(product.status)} dot>
            {product.status}
          </Badge>
        </div>
        {isLowStock && (
          <div className="product-card-stock-badge">
            <Badge variant="warning">
              <AlertTriangle size={11} /> Low Stock ({product.stock})
            </Badge>
          </div>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h4 className="product-card-title" title={product.title}>
          {product.title}
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontWeight: 600 }}>
            <Star size={13} fill="#f59e0b" />
            {product.rating || '4.8'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            ({product.reviewsCount || 0} reviews)
          </span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', fontSize: '11px' }}>
            SKU: {product.sku}
          </span>
        </div>

        <div className="product-card-price-row">
          <div>
            <span className="product-card-price">{formatCurrency(product.price)}</span>
            {product.costPrice && (
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                cost: {formatCurrency(product.costPrice)}
              </span>
            )}
          </div>
          <div className="product-card-stock">
            {isOutOfStock ? (
              <span style={{ color: 'var(--danger)', fontWeight: 600 }}>0 units</span>
            ) : (
              <span>{product.stock} in stock</span>
            )}
          </div>
        </div>
      </div>

      <div className="product-card-footer">
        <button
          className="btn-icon"
          onClick={() => onView(product)}
          title="View specifications"
        >
          <Eye size={16} />
        </button>
        <button
          className="btn-icon"
          onClick={() => onEdit(product)}
          title="Edit product"
        >
          <Edit3 size={16} />
        </button>
        <button
          className="btn-icon"
          style={{ color: 'var(--danger)' }}
          onClick={() => onDelete(product)}
          title="Delete product"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
