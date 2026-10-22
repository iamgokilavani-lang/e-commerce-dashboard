import React from 'react';
import { Search, LayoutGrid, List, Download, X } from 'lucide-react';
import { Button } from '../common/Button';

export const ProductFilters = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  categories = [],
  viewMode,
  onViewModeChange,
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
            placeholder="Search by title, SKU, brand..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Select */}
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status Select */}
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '130px' }}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        {/* Reset button if filters active */}
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
        {/* Export data */}
        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={onExportCSV}
          title="Export CSV"
        >
          Export CSV
        </Button>

        {/* View Mode Switcher */}
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
            title="Table View"
          >
            <List size={16} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
