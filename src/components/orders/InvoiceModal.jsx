import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Printer, Download, Sparkles } from 'lucide-react';

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice #${order.id}`}
      maxWidth="max-w-2xl"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print / Save PDF
          </Button>
        </div>
      }
    >
      <div className="invoice-container">
        {/* Invoice Header */}
        <div className="invoice-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>OmniDash Inc.</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              100 Innovation Tech Park, Whitefield<br />
              Bengaluru, Karnataka 560066
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
              INVOICE
            </h2>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              #{order.id}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Date: {formatDate(order.date)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Payment: {order.paymentMethod} ({order.paymentStatus})
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="invoice-details-grid">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Billed To
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {order.customerName}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              {order.customerEmail}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Shipping Address
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
              {order.shippingAddress?.country}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="table" style={{ margin: '16px 0' }}>
          <thead>
            <tr>
              <th>Description</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Item ID: {item.productId}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="invoice-totals">
          <div className="invoice-total-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="invoice-total-row">
            <span>Sales Tax (Est.):</span>
            <span>{formatCurrency(order.tax || 0)}</span>
          </div>
          <div className="invoice-total-row">
            <span>Shipping:</span>
            <span>{order.shippingFee ? formatCurrency(order.shippingFee) : 'Free'}</span>
          </div>
          <div className="invoice-total-row grand-total">
            <span>Total:</span>
            <span style={{ color: 'var(--primary)' }}>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
