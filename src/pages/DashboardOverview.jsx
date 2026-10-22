import React from 'react';
import { useData } from '../context/DataContext';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { AreaTrendChart } from '../components/charts/AreaTrendChart';
import { DonutCategoryChart } from '../components/charts/DonutCategoryChart';
import { OrderStatusBadge } from '../components/orders/OrderStatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Eye,
  Star,
  Package,
} from 'lucide-react';

export const DashboardOverview = ({
  onOpenNewProduct,
  onViewProduct,
  onViewOrder,
}) => {
  const { products, orders, stats } = useData();
  const { setActiveTab } = useApp();

  // Top 5 products by salesCount
  const topProducts = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5);

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Commerce Dashboard</h1>
          <p className="page-description">
            Real-time overview of revenue performance, orders fulfillment, and inventory health.
          </p>
        </div>
        <div className="page-actions">
          <Button
            variant="outline"
            onClick={() => setActiveTab('analytics')}
            iconRight={ArrowRight}
          >
            Detailed Analytics
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={onOpenNewProduct}
          >
            New Product
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(stats.totalRevenue)}
          trend={14.8}
          color="primary"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrdersCount}
          trend={8.2}
          color="info"
          icon={ShoppingBag}
        />
        <StatCard
          title="Customer Base"
          value={stats.totalCustomersCount}
          trend={12.4}
          color="secondary"
          icon={Users}
        />
        <StatCard
          title="Average Order Value"
          value={formatCurrency(stats.averageOrderValue)}
          trend={4.1}
          color="success"
          icon={TrendingUp}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          subtitle={stats.lowStockCount > 0 ? 'Requires attention' : 'All stocks healthy'}
          trend={stats.lowStockCount > 0 ? -stats.lowStockCount : 0}
          color="warning"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid-2">
        <Card title="Sales Velocity & Trends" subtitle="Revenue trajectory over selectable historical windows">
          <AreaTrendChart />
        </Card>

        <Card title="Sales by Category" subtitle="Revenue share distribution across product departments">
          <DonutCategoryChart categoryBreakdown={stats.categoryBreakdown} />
        </Card>
      </div>

      {/* Bottom Row: Recent Orders & Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '20px' }}>
        {/* Recent Orders Table */}
        <Card
          title="Recent Orders"
          subtitle="Latest client purchases requiring fulfillment"
          actions={
            <Button
              variant="outline"
              size="sm"
              iconRight={ArrowRight}
              onClick={() => setActiveTab('orders')}
            >
              View All
            </Button>
          }
        >
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="tr-hover">
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        #{ord.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {ord.items.length} item(s)
                      </div>
                    </td>
                    <td>
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatDate(ord.date)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-icon"
                        onClick={() => onViewOrder(ord)}
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Selling Products */}
        <Card
          title="Top Performing Products"
          subtitle="Highest units shipped this quarter"
          actions={
            <Button
              variant="outline"
              size="sm"
              iconRight={ArrowRight}
              onClick={() => setActiveTab('products')}
            >
              Catalog
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topProducts.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color 0.15s ease',
                }}
                className="hover-lift"
                onClick={() => onViewProduct(p)}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: idx === 0 ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {idx + 1}
                </div>

                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate" style={{ fontWeight: 600, fontSize: '13px' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                    <span>{formatCurrency(p.price)}</span>
                    <span>&bull;</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                      {p.salesCount} sold
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Badge variant={p.stock <= p.minStock ? 'warning' : 'neutral'}>
                    {p.stock} left
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
