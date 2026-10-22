import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Plus,
  Terminal,
} from 'lucide-react';
import { Button } from '../common/Button';

export const Header = ({ onOpenNewProduct }) => {
  const {
    theme,
    toggleTheme,
    mobileMenuOpen,
    setMobileMenuOpen,
    setIsCommandPaletteOpen,
    setIsNotificationDrawerOpen,
    unreadCount,
    setActiveTab,
  } = useApp();

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          className="btn-icon mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div
          className="header-search-bar"
          onClick={() => setIsCommandPaletteOpen(true)}
          role="button"
          tabIndex={0}
        >
          <Search size={16} />
          <span style={{ fontSize: '13px' }}>Quick search catalog, orders...</span>
          <span className="kbd-shortcut">Ctrl K</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Quick Add Product Button */}
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onOpenNewProduct}
          className="hide-on-mobile"
        >
          Add Product
        </Button>

        {/* Theme Toggle */}
        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="header-icon-btn"
          onClick={() => setIsNotificationDrawerOpen(true)}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="notif-badge-dot" />}
        </button>

        {/* User profile capsule */}
        <div className="user-profile-btn">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Gokilavani"
            className="user-avatar"
          />
          <div style={{ paddingRight: '8px', lineHeight: 1.2 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Gokilavani
            </div>
            <div style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 600 }}>
              &bull; Live Store
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
