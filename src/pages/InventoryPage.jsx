import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { RestockModal } from '../components/inventory/RestockModal';
import { InventoryAdjustmentModal } from '../components/inventory/InventoryAdjustmentModal';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  RefreshCw,
  Edit3,
  History,
  DollarSign,
  Search,
} from 'lucide-react';

export const InventoryPage = () => {
  const { products, inventoryLogs, stats, restockProduct, adjustInventory } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('All'); // All, Low, Out, Healthy

  // Active modals
  const [restockProductTarget, setRestockProductTarget] = useState(null);
  const [adjustProductTarget, setAdjustProductTarget] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);

      const isOut = p.stock === 0;
      const isLow = !isOut && p.stock <= (p.minStock || 10);
      const isHealthy = p.stock > (p.minStock || 10);

      if (stockStatusFilter === 'Low') return matchesSearch && isLow;
      if (stockStatusFilter === 'Out') return matchesSearch && isOut;
      if (stockStatusFilter === 'Healthy') return matchesSearch && isHealthy;

      return matchesSearch;
    });
  }, [products, searchQuery, stockStatusFilter]);

  const healthyCount = products.filter((p) => p.stock > (p.minStock || 10)).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Operations & Auditing</h1>
          <p className="page-description">
            Monitor real-time warehouse stocks, prevent stock-outs, execute replenishments, and log cycle audits.
          </p>
        </div>
      </div>

      {/* Health Overview Metric Cards */}
      <div className="stats-grid">
        <StatCard
          title="Catalog Inventory Value"
          value={formatCurrency(stats.totalInventoryValue)}
          subtitle="Total on-hand asset worth"
          color="primary"
          icon={DollarSign}
        />
        <StatCard
          title="Healthy Stock Items"
          value={healthyCount}
          subtitle="Above min threshold"
          color="success"
          icon={CheckCircle2}
        />
        <StatCard
          title="Low Stock Warnings"
          value={stats.lowStockCount}
          subtitle="Immediate restock advised"
          color="warning"
          icon={AlertTriangle}
        />
        <StatCard
          title="Out of Stock Items"
          value={stats.outOfStockCount}
          subtitle="Depleted inventory items"
          color="danger"
          icon={XCircle}
        />
      </div>

      {/* Critical Stock Alert Banner (if any item low) */}
      {stats.lowStockCount > 0 && (
        <div
          style={{
            backgroundColor: 'var(--warning-light)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--warning)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {stats.lowStockCount} Products are currently below minimum safety stock levels!
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Items like &ldquo;{stats.lowStockProducts[0]?.title}&rdquo; may cause order delays if unreplenished.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={RefreshCw}
            onClick={() => setRestockProductTarget(stats.lowStockProducts[0])}
          >
            Restock Priority Item
          </Button>
        </div>
      )}

      {/* Inventory Stock Table Card */}
      <Card
        title="Live Stock Registry"
        subtitle="Inline quick adjusters and stock variance monitors"
      >
        {/* Table Toolbar */}
        <div className="filter-toolbar">
          <div className="filter-group-left">
            <div className="filter-search-input">
              <Search size={16} className="filter-search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Search inventory by title, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="chart-header-tabs">
              {[
                { id: 'All', label: 'All Items' },
                { id: 'Low', label: `Low Stock (${stats.lowStockCount})` },
                { id: 'Out', label: `Out of Stock (${stats.outOfStockCount})` },
                { id: 'Healthy', label: 'Healthy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`chart-tab-btn ${stockStatusFilter === tab.id ? 'active' : ''}`}
                  onClick={() => setStockStatusFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'center' }}>Stock Level</th>
                <th style={{ textAlign: 'center' }}>Quick Inline Adjust</th>
                <th style={{ textAlign: 'right' }}>Total Asset Value</th>
                <th style={{ textAlign: 'center' }}>Restock / Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock === 0;
                const isLowStock = !isOutOfStock && p.stock <= (p.minStock || 10);
                const assetValue = p.price * (p.stock || 0);

                return (
                  <tr key={p.id} className="tr-hover">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.image}
                          alt={p.title}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            SKU: {p.sku} &bull; Min: {p.minStock || 10}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(p.price)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '15px',
                            color: isOutOfStock
                              ? 'var(--danger)'
                              : isLowStock
                              ? 'var(--warning)'
                              : 'var(--text-primary)',
                          }}
                        >
                          {p.stock}
                        </span>
                        {isOutOfStock ? (
                          <Badge variant="danger">Out of stock</Badge>
                        ) : isLowStock ? (
                          <Badge variant="warning">Low stock</Badge>
                        ) : (
                          <Badge variant="success">Healthy</Badge>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          className="btn-icon"
                          disabled={p.stock <= 0}
                          onClick={() => adjustInventory(p.id, Math.max(0, p.stock - 1), 'Inline 1-unit reduction')}
                          title="Reduce stock by 1"
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '24px' }}>
                          {p.stock}
                        </span>
                        <button
                          className="btn-icon"
                          onClick={() => restockProduct(p.id, 1, 'Inline 1-unit increment')}
                          title="Add 1 unit to stock"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatCurrency(assetValue)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={RefreshCw}
                          onClick={() => setRestockProductTarget(p)}
                        >
                          Restock
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit3}
                          onClick={() => setAdjustProductTarget(p)}
                        >
                          Audit
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inventory Audit Logs Table */}
      <div style={{ marginTop: '24px' }}>
        <Card
          title="Inventory Movement Audit Logs"
          subtitle="Immutable operational trace of all replenishments, dispatches, audits, and adjustments"
        >
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Product</th>
                  <th>Action Type</th>
                  <th style={{ textAlign: 'center' }}>Previous</th>
                  <th style={{ textAlign: 'center' }}>Adjustment</th>
                  <th style={{ textAlign: 'center' }}>New Balance</th>
                  <th>Reason</th>
                  <th>Operator</th>
                </tr>
              </thead>
              <tbody>
                {inventoryLogs.slice(0, 10).map((log) => {
                  const isPositive = log.adjustment > 0;
                  return (
                    <tr key={log.id} className="tr-hover">
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>
                          {log.productTitle}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {log.sku}
                        </div>
                      </td>
                      <td>
                        <Badge
                          variant={
                            log.type === 'Restock'
                              ? 'success'
                              : log.type === 'Out of Stock Alert'
                              ? 'danger'
                              : 'info'
                          }
                        >
                          {log.type}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        {log.previousStock}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          fontWeight: 700,
                          color: isPositive ? 'var(--success)' : 'var(--danger)',
                        }}
                      >
                        {isPositive ? `+${log.adjustment}` : log.adjustment}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800 }}>
                        {log.newStock}
                      </td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {log.reason}
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {log.performedBy}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Restock Modal */}
      <RestockModal
        isOpen={Boolean(restockProductTarget)}
        onClose={() => setRestockProductTarget(null)}
        product={restockProductTarget}
        onRestock={restockProduct}
      />

      {/* Adjust Inventory Modal */}
      <InventoryAdjustmentModal
        isOpen={Boolean(adjustProductTarget)}
        onClose={() => setAdjustProductTarget(null)}
        product={adjustProductTarget}
        onAdjust={adjustInventory}
      />
    </div>
  );
};
