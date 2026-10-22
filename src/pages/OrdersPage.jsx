import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { OrderFilters } from '../components/orders/OrderFilters';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/orders/OrderStatusBadge';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportData';
import {
  Eye,
  FileText,
  ShoppingBag,
  ArrowUpDown,
} from 'lucide-react';

export const OrdersPage = ({ onViewOrder, onOpenInvoice }) => {
  const { orders, updateOrderStatus } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'totalAmount') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortField, sortDirection]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedOrders.slice(start, start + pageSize);
  }, [sortedOrders, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const exportData = sortedOrders.map((o) => ({
      OrderID: o.id,
      Customer: o.customerName,
      Email: o.customerEmail,
      Date: o.date,
      Status: o.status,
      PaymentStatus: o.paymentStatus,
      PaymentMethod: o.paymentMethod,
      ItemsCount: o.items.length,
      TotalAmount: o.totalAmount,
      Carrier: o.carrier || '',
      TrackingNumber: o.trackingNumber || '',
    }));
    exportToCSV(exportData, `orders_export_${Date.now()}.csv`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPaymentFilter('All');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || paymentFilter !== 'All';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="page-description">
            Track customer orders, manage shipments, update fulfillment statuses, and generate invoices.
          </p>
        </div>
      </div>

      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        paymentFilter={paymentFilter}
        onPaymentChange={(val) => {
          setPaymentFilter(val);
          setCurrentPage(1);
        }}
        onExportCSV={handleExportCSV}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {sortedOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description={
            hasActiveFilters
              ? 'No orders match your filter parameters. Try clearing the search.'
              : 'There are no customer orders recorded yet.'
          }
          actionLabel={hasActiveFilters ? 'Reset Filters' : undefined}
          onAction={hasActiveFilters ? handleResetFilters : undefined}
        />
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('id')}>
                    Order ID <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th>Customer</th>
                  <th className="sortable" onClick={() => handleSort('date')}>
                    Date <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th>Items</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('totalAmount')}
                    style={{ textAlign: 'right' }}
                  >
                    Total <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th>Payment</th>
                  <th>Fulfillment Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((ord) => (
                  <tr key={ord.id} className="tr-hover">
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: 'var(--primary)',
                          cursor: 'pointer',
                        }}
                        onClick={() => onViewOrder(ord)}
                      >
                        #{ord.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {ord.customerEmail}
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      {formatDate(ord.date)}
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px' }}>
                        {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800 }}>
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <PaymentStatusBadge status={ord.paymentStatus} />
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                          {ord.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className="form-select"
                        style={{
                          width: 'auto',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          className="btn-icon"
                          onClick={() => onViewOrder(ord)}
                          title="View order details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => onOpenInvoice(ord)}
                          title="Invoice receipt"
                        >
                          <FileText size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '16px' }}>
            <Pagination
              currentPage={currentPage}
              totalItems={sortedOrders.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
