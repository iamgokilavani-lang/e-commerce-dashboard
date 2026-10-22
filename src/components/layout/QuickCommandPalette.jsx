import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import {
  Search,
  Package,
  ShoppingBag,
  Users,
  Sun,
  Moon,
  Plus,
  ArrowRight,
  Boxes,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const QuickCommandPalette = ({ onOpenNewProduct }) => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    theme,
    toggleTheme,
  } = useApp();
  const { products, orders, customers } = useData();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const query = search.trim().toLowerCase();

  // Search Results
  const matchedProducts = products
    .filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    )
    .slice(0, 3)
    .map((p) => ({
      type: 'product',
      id: p.id,
      title: p.title,
      subtitle: `${p.sku} &bull; ${formatCurrency(p.price)} &bull; ${p.category}`,
      icon: Package,
      action: () => {
        setActiveTab('products');
        setIsCommandPaletteOpen(false);
      },
    }));

  const matchedOrders = orders
    .filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query)
    )
    .slice(0, 3)
    .map((o) => ({
      type: 'order',
      id: o.id,
      title: `Order #${o.id} - ${o.customerName}`,
      subtitle: `${formatCurrency(o.totalAmount)} &bull; Status: ${o.status}`,
      icon: ShoppingBag,
      action: () => {
        setActiveTab('orders');
        setIsCommandPaletteOpen(false);
      },
    }));

  const matchedCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
    )
    .slice(0, 2)
    .map((c) => ({
      type: 'customer',
      id: c.id,
      title: c.name,
      subtitle: `${c.email} &bull; ${c.tier} Tier`,
      icon: Users,
      action: () => {
        setActiveTab('customers');
        setIsCommandPaletteOpen(false);
      },
    }));

  const quickActions = [
    {
      type: 'action',
      id: 'act-new-product',
      title: 'Add New Product',
      subtitle: 'Create a new catalog item',
      icon: Plus,
      action: () => {
        setIsCommandPaletteOpen(false);
        onOpenNewProduct();
      },
    },
    {
      type: 'action',
      id: 'act-inventory',
      title: 'View Low Stock Inventory',
      subtitle: 'Open inventory management center',
      icon: Boxes,
      action: () => {
        setActiveTab('inventory');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      type: 'action',
      id: 'act-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Toggle dashboard visual theme',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  const results = query
    ? [...matchedProducts, ...matchedOrders, ...matchedCustomers]
    : quickActions;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    }
  };

  return (
    <div
      className="command-palette-overlay"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="command-palette-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="command-input-wrapper">
          <Search size={18} color="var(--text-muted)" />
          <input
            autoFocus
            type="text"
            className="command-input"
            placeholder="Type a command, product, customer or order #..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="kbd-shortcut">ESC</span>
        </div>

        <div className="command-results-list">
          {results.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No matches found for &ldquo;{search}&rdquo;
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  className={`command-item ${isSelected ? 'selected' : ''}`}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: isSelected
                          ? 'var(--primary)'
                          : 'var(--bg-tertiary)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}
                        dangerouslySetInnerHTML={{ __html: item.subtitle }}
                      />
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ opacity: isSelected ? 1 : 0.3 }} />
                </div>
              );
            })
          )}
        </div>

        <div
          style={{
            padding: '10px 16px',
            background: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
          }}
        >
          <span>Use &uarr; &darr; arrows to navigate</span>
          <span>&crarr; to select</span>
        </div>
      </div>
    </div>
  );
};
