import React from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { CheckCheck, Trash2, AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const NotificationDrawer = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markAllNotificationsAsRead,
    clearNotifications,
    setActiveTab,
  } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} color="var(--warning)" />;
      case 'error':
        return <AlertCircle size={16} color="var(--danger)" />;
      case 'success':
        return <CheckCircle2 size={16} color="var(--success)" />;
      default:
        return <Info size={16} color="var(--info)" />;
    }
  };

  const handleNotificationClick = (item) => {
    if (item.linkTab) {
      setActiveTab(item.linkTab);
      setIsNotificationDrawerOpen(false);
    }
  };

  return (
    <Drawer
      isOpen={isNotificationDrawerOpen}
      onClose={() => setIsNotificationDrawerOpen(false)}
      title="Notifications"
      subtitle={`${notifications.filter((n) => !n.read).length} unread updates`}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={clearNotifications}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={CheckCheck}
            onClick={markAllNotificationsAsRead}
            disabled={notifications.every((n) => n.read)}
          >
            Mark all read
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No active notifications
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: item.read ? 'transparent' : 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                cursor: item.linkTab ? 'pointer' : 'default',
                display: 'flex',
                gap: '12px',
                transition: 'background-color 0.15s ease',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon(item.type)}</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: item.read ? 600 : 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.title}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {item.time}
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  {item.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
};
