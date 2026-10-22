import React from 'react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Boxes,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useApp();

  const { products, orders, stats, resetToInitialData } = useData();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: products.length,
      badgeVariant: 'neutral',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
      badgeVariant: 'info',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: stats.lowStockCount > 0 ? stats.lowStockCount : null,
      badgeVariant: 'warning',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <aside
      className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${
        mobileMenuOpen ? 'mobile-open' : ''
      }`}
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Sparkles size={20} />
          </div>
          <span className="logo-text">OmniDash</span>
        </div>
        <button
          className="btn-icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ display: mobileMenuOpen ? 'none' : 'flex' }}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              <span className="nav-text">{item.label}</span>
              {item.badge !== null && item.badge !== undefined && (
                <span className={`nav-badge badge badge-${item.badgeVariant}`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        <div className="sidebar-section-title" style={{ marginTop: '20px' }}>
          System
        </div>
        <div
          className="nav-item"
          onClick={resetToInitialData}
          title="Reset sample catalog & orders"
        >
          <RotateCcw size={18} />
          <span className="nav-text">Reset Demo Data</span>
        </div>
      </nav>

      {/* Footer User Info */}
      <div className="sidebar-footer">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          alt="Admin"
          className="user-avatar"
        />
        <div className="user-info">
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Gokilavani
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Store Director</div>
        </div>
      </div>
    </aside>
  );
};
