import React from 'react';
import { Search, Download, X } from 'lucide-react';
import { Button } from '../common/Button';

export const CustomerFilters = ({
  searchQuery,
  onSearchChange,
  tierFilter,
  onTierChange,
  statusFilter,
  onStatusChange,
  onExportCSV,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="filter-toolbar">
      <div className="filter-group-left">
        <div className="filter-search-input">
          <Search size={16} className="filter-search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, city..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '130px' }}
          value={tierFilter}
          onChange={(e) => onTierChange(e.target.value)}
        >
          <option value="All">All Tiers</option>
          <option value="VIP">VIP Tier</option>
          <option value="Platinum">Platinum</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Bronze">Bronze</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '130px' }}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
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
          title="Export Customers CSV"
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
};
