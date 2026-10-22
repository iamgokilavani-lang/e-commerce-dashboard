import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Low Stock Alert',
    message: 'PureFlow Smart Ultrasonic Humidifier has only 4 units remaining.',
    time: '10m ago',
    type: 'warning',
    read: false,
    linkTab: 'inventory',
  },
  {
    id: 'notif-2',
    title: 'High-Value Order Received',
    message: 'Priya Sharma placed order #ORD-9041 for $648.99.',
    time: '45m ago',
    type: 'success',
    read: false,
    linkTab: 'orders',
  },
  {
    id: 'notif-3',
    title: 'Stock Out Alert',
    message: 'StudioPro 4K HDR Webcam is currently Out of Stock.',
    time: '2h ago',
    type: 'error',
    read: false,
    linkTab: 'inventory',
  },
  {
    id: 'notif-4',
    title: 'New VIP Customer',
    message: 'Dev Patel crossed the $4,000 lifetime spend milestone.',
    time: '5h ago',
    type: 'info',
    read: true,
    linkTab: 'customers',
  },
];

export const AppProvider = ({ children }) => {
  // Theme state with localStorage fallback
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('omnidash_theme') || 'dark';
  });

  // Current main navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sidebar collapse & mobile states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Command palette & notification popovers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Synchronize theme to document body and dataset
  useEffect(() => {
    localStorage.setItem('omnidash_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K for Command Palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsNotificationDrawerOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        notifications,
        unreadCount,
        markAllNotificationsAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
