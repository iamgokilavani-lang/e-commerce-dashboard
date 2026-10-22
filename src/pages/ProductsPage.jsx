import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductGridCard } from '../components/products/ProductGridCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { formatCurrency } from '../utils/formatters';
import { exportToCSV } from '../utils/exportData';
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  ArrowUpDown,
  Star,
  Package,
  Layers,
  AlertTriangle,
} from 'lucide-react';

export const ProductsPage = ({
  onOpenNewProduct,
  onViewProduct,
  onEditProduct,
}) => {
  const { products, deleteProduct, bulkDeleteProducts, bulkUpdateStatus } = useData();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Sorting
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Delete Modals
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  }, [products]);

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q));

      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  // Sorting
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'price' || sortField === 'stock' || sortField === 'salesCount') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortField, sortDirection]);

  // Pagination slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const exportData = sortedProducts.map((p) => ({
      ID: p.id,
      SKU: p.sku,
      Title: p.title,
      Category: p.category,
      Brand: p.brand || '',
      Price: p.price,
      CostPrice: p.costPrice || '',
      Stock: p.stock,
      Status: p.status,
      SalesCount: p.salesCount || 0,
      Rating: p.rating || 0,
    }));
    exportToCSV(exportData, `products_catalog_${Date.now()}.csv`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="page-description">
            Manage your store inventory, pricing, variations, and catalog listings.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" icon={Plus} onClick={onOpenNewProduct}>
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryChange={(val) => {
          setCategoryFilter(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        categories={categories}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportCSV={handleExportCSV}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Bulk Action Bar (when rows selected) */}
      {selectedIds.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
            {selectedIds.length} product(s) selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                bulkUpdateStatus(selectedIds, 'Active');
                setSelectedIds([]);
              }}
            >
              Set Active
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                bulkUpdateStatus(selectedIds, 'Draft');
                setSelectedIds([]);
              }}
            >
              Set Draft
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setIsBulkDeleteOpen(true)}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={
            hasActiveFilters
              ? 'No products matched your search or filter criteria. Try clearing filters.'
              : 'Your store catalog is currently empty. Add your first product to get started!'
          }
          actionLabel={hasActiveFilters ? 'Reset Filters' : 'Add Product'}
          onAction={hasActiveFilters ? handleResetFilters : onOpenNewProduct}
          actionIcon={hasActiveFilters ? undefined : Plus}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <>
          <div className="product-grid">
            {paginatedProducts.map((p) => (
              <ProductGridCard
                key={p.id}
                product={p}
                onView={onViewProduct}
                onEdit={onEditProduct}
                onDelete={setDeletingProduct}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={sortedProducts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      ) : (
        /* Table View */
        <div className="card" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={
                        paginatedProducts.length > 0 &&
                        paginatedProducts.every((p) => selectedIds.includes(p.id))
                      }
                      onChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </th>
                  <th>Product</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('category')}
                  >
                    Category <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('price')}
                    style={{ textAlign: 'right' }}
                  >
                    Price <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('stock')}
                    style={{ textAlign: 'center' }}
                  >
                    Stock <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('salesCount')}
                    style={{ textAlign: 'center' }}
                  >
                    Sales <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const isLowStock = p.stock > 0 && p.stock <= (p.minStock || 10);
                  const isOutOfStock = p.stock === 0;

                  return (
                    <tr
                      key={p.id}
                      className="tr-hover"
                      style={isSelected ? { backgroundColor: 'var(--primary-light)' } : {}}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          aria-label={`Select ${p.title}`}
                        />
                      </td>
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
                              backgroundColor: 'var(--bg-tertiary)',
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: '13.5px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                              }}
                              onClick={() => onViewProduct(p)}
                            >
                              {p.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              SKU: {p.sku} {p.brand && `&bull; ${p.brand}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>{formatCurrency(p.price)}</div>
                        {p.costPrice && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Cost: {formatCurrency(p.costPrice)}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {isOutOfStock ? (
                          <Badge variant="danger">Out of stock</Badge>
                        ) : isLowStock ? (
                          <Badge variant="warning">
                            <AlertTriangle size={11} /> {p.stock} units
                          </Badge>
                        ) : (
                          <span style={{ fontWeight: 600 }}>{p.stock}</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {p.salesCount || 0}
                        </span>
                      </td>
                      <td>
                        <Badge
                          variant={
                            p.status === 'Active'
                              ? 'success'
                              : p.status === 'Draft'
                              ? 'neutral'
                              : 'danger'
                          }
                          dot
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <button
                            className="btn-icon"
                            onClick={() => onViewProduct(p)}
                            title="View product"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => onEditProduct(p)}
                            title="Edit product"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => setDeletingProduct(p)}
                            title="Delete product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '16px' }}>
            <Pagination
              currentPage={currentPage}
              totalItems={sortedProducts.length}
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

      {/* Delete Single Product Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) {
            deleteProduct(deletingProduct.id);
            setDeletingProduct(null);
          }
        }}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deletingProduct?.title}"? All stock and sales references will be removed.`}
        confirmText="Yes, Delete"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={() => {
          bulkDeleteProducts(selectedIds);
          setSelectedIds([]);
          setIsBulkDeleteOpen(false);
        }}
        title="Batch Delete Products"
        message={`Are you sure you want to delete ${selectedIds.length} selected products?`}
        confirmText={`Delete ${selectedIds.length} Products`}
      />
    </div>
  );
};
