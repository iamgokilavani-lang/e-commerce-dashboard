import React, { useState, useEffect } from 'react';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { useData } from '../../context/DataContext';
import {
  FileText,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  Save,
  Package,
} from 'lucide-react';

export const OrderDetailsDrawer = ({
  order,
  isOpen,
  onClose,
  onOpenInvoice,
}) => {
  const { updateOrderStatus, updateOrderNotes } = useData();

  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  useEffect(() => {
    if (order) {
      setNotes(order.notes || '');
      setSelectedStatus(order.status || 'Pending');
    }
  }, [order]);

  if (!order) return null;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    updateOrderStatus(order.id, newStatus);
  };

  const handleSaveNotes = () => {
    updateOrderNotes(order.id, notes);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Order #${order.id}`}
      subtitle={`Placed by ${order.customerName} &bull; ${formatDateTime(order.date)}`}
      wide
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            variant="outline"
            icon={FileText}
            onClick={() => {
              onClose();
              onOpenInvoice(order);
            }}
          >
            View Invoice
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Status Control Banner */}
        <div
          className="card"
          style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              Current Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Change Status:</span>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '12.5px' }}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Fulfillment Timeline Stepper */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Clock size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Fulfillment Timeline</h4>
          </div>

          <div className="order-stepper">
            {order.timeline?.map((step, idx) => (
              <div
                key={idx}
                className={`stepper-step ${step.done ? 'done' : ''}`}
              >
                <div className="stepper-icon">
                  {step.done ? <CheckCircle2 size={16} /> : <Circle size={14} />}
                </div>
                <div className="stepper-content">
                  <div className="stepper-title">{step.status}</div>
                  <div className="stepper-time">
                    {step.time.includes('T') ? formatDateTime(step.time) : step.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {order.trackingNumber && order.trackingNumber !== 'Pending' && order.trackingNumber !== 'N/A' && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12.5px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Truck size={14} /> Carrier: <strong>{order.carrier}</strong>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                {order.trackingNumber}
              </span>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Package size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Items Ordered ({order.items.length})</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingBottom: '12px',
                  borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    backgroundColor: 'var(--bg-tertiary)',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} &times; {formatCurrency(item.price)}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {formatCurrency(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12.5px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(order.items.reduce((s, i) => s + i.subtotal, 0))}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Sales Tax:</span>
              <span>{formatCurrency(order.tax || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping Fee:</span>
              <span>{order.shippingFee ? formatCurrency(order.shippingFee) : 'Free ($0.00)'}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '15px',
                color: 'var(--text-primary)',
                paddingTop: '6px',
                borderTop: '1px dashed var(--border-strong)',
              }}
            >
              <span>Total Paid:</span>
              <span style={{ color: 'var(--primary)' }}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <MapPin size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '13.5px', fontWeight: 700 }}>Shipping Destination</h4>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>{order.customerName}</strong><br />
            {order.shippingAddress?.street}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
            {order.shippingAddress?.country}
          </div>
        </div>

        {/* Order Notes */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="form-label" style={{ margin: 0 }}>Internal Order Notes</label>
            <Button variant="outline" size="sm" icon={Save} onClick={handleSaveNotes}>
              Save Note
            </Button>
          </div>
          <textarea
            className="form-textarea"
            rows={2}
            placeholder="Special instructions or fulfillment notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </Drawer>
  );
};
