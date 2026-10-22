import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { CustomerFilters } from '../components/customers/CustomerFilters';
import { CustomerFormModal } from '../components/customers/CustomerFormModal';
import { CustomerDetailsDrawer } from '../components/customers/CustomerDetailsDrawer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportData';
import {
  Users,
  Plus,
  Eye,
  ArrowUpDown,
} from 'lucide-react';

export const CustomersPage = ({ onViewOrder }) => {
  const { customers, addCustomer, updateCustomer, toggleCustomerStatus } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [sortField, setSortField] = useState('totalSpent');
  const [sortDirection, setSortDirection] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal & Drawer
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || null;

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q));

      const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [customers, searchQuery, tierFilter, statusFilter]);

  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'totalSpent' || sortField === 'ordersCount') {
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
  }, [filteredCustomers, sortField, sortDirection]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const exportData = sortedCustomers.map((c) => ({
      ID: c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone || '',
      City: c.city || '',
      State: c.state || '',
      Country: c.country || '',
      Tier: c.tier,
      Status: c.status,
      TotalSpent: c.totalSpent,
      OrdersCount: c.ordersCount,
      JoinedDate: c.joinedDate,
    }));
    exportToCSV(exportData, `customers_crm_${Date.now()}.csv`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setTierFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

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

  const hasActiveFilters = searchQuery !== '' || tierFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Relationship Hub</h1>
          <p className="page-description">
            View customer directories, purchase frequencies, loyalty tier rankings, and CRM history.
          </p>
        </div>
        <div className="page-actions">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingCustomer(null);
              setIsCustomerFormOpen(true);
            }}
          >
            Add Customer
          </Button>
        </div>
      </div>

      <CustomerFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        tierFilter={tierFilter}
        onTierChange={(val) => {
          setTierFilter(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        onExportCSV={handleExportCSV}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {sortedCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description={
            hasActiveFilters
              ? 'No customers match your search criteria. Try clearing your filters.'
              : 'No customer profiles have been created yet.'
          }
          actionLabel={hasActiveFilters ? 'Reset Filters' : 'Add Customer'}
          onAction={hasActiveFilters ? handleResetFilters : () => {
            setEditingCustomer(null);
            setIsCustomerFormOpen(true);
          }}
        />
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Tier</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('ordersCount')}
                    style={{ textAlign: 'center' }}
                  >
                    Orders <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('totalSpent')}
                    style={{ textAlign: 'right' }}
                  >
                    Lifetime Spend <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th>Status</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('joinedDate')}
                  >
                    Joined <ArrowUpDown size={12} style={{ display: 'inline' }} />
                  </th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((cust) => (
                  <tr key={cust.id} className="tr-hover">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
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
                            onClick={() => setSelectedCustomerId(cust.id)}
                          >
                            {cust.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {cust.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {cust.city}, {cust.state}
                      </span>
                    </td>
                    <td>
                      <Badge variant={getTierColor(cust.tier)} dot>
                        {cust.tier}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      {cust.ordersCount || 0}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatCurrency(cust.totalSpent)}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleCustomerStatus(cust.id)}
                        style={{ cursor: 'pointer' }}
                        title="Click to toggle status"
                      >
                        <Badge variant={cust.status === 'Active' ? 'success' : 'neutral'}>
                          {cust.status}
                        </Badge>
                      </button>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatDate(cust.joinedDate)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-icon"
                        onClick={() => setSelectedCustomerId(cust.id)}
                        title="View CRM profile"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '16px' }}>
            <Pagination
              currentPage={currentPage}
              totalItems={sortedCustomers.length}
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

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isCustomerFormOpen}
        onClose={() => {
          setIsCustomerFormOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={(customerData) => {
          if (editingCustomer) {
            updateCustomer(editingCustomer.id, customerData);
          } else {
            addCustomer(customerData);
          }
        }}
        initialData={editingCustomer}
      />

      {/* Customer Details Drawer */}
      <CustomerDetailsDrawer
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomerId(null)}
        onEdit={(customer) => {
          setSelectedCustomerId(null);
          setEditingCustomer(customer);
          setIsCustomerFormOpen(true);
        }}
        onViewOrder={onViewOrder}
      />
    </div>
  );
};
