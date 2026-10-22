import React from 'react';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { OrderStatusBadge } from '../orders/OrderStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useData } from '../../context/DataContext';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

export const CustomerDetailsDrawer = ({ customer, isOpen, onClose, onEdit }) => {
  const { orders, toggleCustomerStatus } = useData();

  if (!customer) return null;

  // Filter orders made by this customer
  const customerOrders = orders.filter(
    (o) => o.customerId === customer.id || o.customerEmail === customer.email
  );

  const averageOrderVal =
    customerOrders.length > 0
      ? customer.totalSpent / customerOrders.length
      : 0;

  const getTierColor = (tier) => {
    switch (tier) {
      case 'VIP':
        return 'purple';
      case 'Platinum':
        return 'info';
      case 'Gold':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={customer.name}
      subtitle={`Customer ID: ${customer.id}`}
      wide
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
              Edit Profile
            </Button>
            <Button
              variant={customer.status === 'Active' ? 'outline' : 'primary'}
              size="sm"
              onClick={() => toggleCustomerStatus(customer.id)}
            >
              Mark as {customer.status === 'Active' ? 'Inactive' : 'Active'}
            </Button>
          </div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Customer Profile Banner */}
        <div
          className="card"
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap',
          }}
        >
          <img
            src={customer.avatar}
            alt={customer.name}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--border-strong)',
            }}
          />
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{customer.name}</h3>
              <Badge variant={getTierColor(customer.tier)} dot>
                {customer.tier} Tier
              </Badge>
              <Badge variant={customer.status === 'Active' ? 'success' : 'danger'}>
                {customer.status}
              </Badge>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> Member since {formatDate(customer.joinedDate)}
            </div>
          </div>
        </div>

        {/* Spend & Order Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Lifetime Spent
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              {formatCurrency(customer.totalSpent)}
            </div>
          </div>

          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Orders
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {customerOrders.length || customer.ordersCount || 0}
            </div>
          </div>

          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Average Order
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
              {formatCurrency(averageOrderVal)}
            </div>
          </div>
        </div>

        {/* Contact & Location Info */}
        <div className="card" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Contact & Location Details
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
              <a href={`mailto:${customer.email}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {customer.email}
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {customer.phone || 'Not provided'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MapPin size={16} color="var(--text-muted)" style={{ marginTop: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Address:</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {customer.address ? `${customer.address}, ` : ''}
                {customer.city}, {customer.state} ({customer.country})
              </span>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="card" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Recent Orders ({customerOrders.length})
          </h4>

          {customerOrders.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No recorded orders yet for this customer profile.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                      #{ord.id}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {formatDate(ord.date)} &bull; {ord.items.length} items
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      {formatCurrency(ord.totalAmount)}
                    </div>
                    <div style={{ marginTop: '2px' }}>
                      <OrderStatusBadge status={ord.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
