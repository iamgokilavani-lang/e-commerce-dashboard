import React from 'react';
import { Search, Download, X } from 'lucide-react';
import { Button } from '../common/Button';

export const OrderFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
  onExportCSV,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="filter-toolbar">
      <div className="filter-group-left">
        {/* Search */}
        <div className="filter-search-input">
          <Search size={16} className="filter-search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by Order ID, customer, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Order Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Payment Dropdown */}
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '140px' }}
          value={paymentFilter}
          onChange={(e) => onPaymentChange(e.target.value)}
        >
          <option value="All">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            icon={X}
            onClick={onResetFilters}
            title="Reset filters"
          >
            Clear
          </Button>
        )}
      </div>

      <div className="filter-group-right">
        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={onExportCSV}
          title="Export Orders CSV"
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
};
