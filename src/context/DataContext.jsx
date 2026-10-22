import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialProducts } from '../data/initialProducts';
import { initialOrders } from '../data/initialOrders';
import { initialCustomers } from '../data/initialCustomers';
import { initialInventoryLogs } from '../data/initialInventoryLogs';
import { useToast } from './ToastContext';
import { generateId } from '../utils/formatters';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { showToast } = useToast();

  // Load state from localStorage with fallbacks
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('omnidash_v2_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('omnidash_v2_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('omnidash_v2_customers');
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [inventoryLogs, setInventoryLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('omnidash_v2_inventory_logs');
      return saved ? JSON.parse(saved) : initialInventoryLogs;
    } catch {
      return initialInventoryLogs;
    }
  });

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem('omnidash_v2_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('omnidash_v2_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('omnidash_v2_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('omnidash_v2_inventory_logs', JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  // Product CRUD
  const addProduct = (productData) => {
    const id = generateId('PRD');
    const newProduct = {
      ...productData,
      id,
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      salesCount: productData.salesCount || 0,
      createdAt: new Date().toISOString(),
      status: Number(productData.stock) <= 0 ? 'Out of Stock' : (productData.status || 'Active'),
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Add inventory log
    const logEntry = {
      id: generateId('LOG'),
      productId: id,
      productTitle: newProduct.title,
      sku: newProduct.sku,
      previousStock: 0,
      adjustment: Number(newProduct.stock),
      newStock: Number(newProduct.stock),
      type: 'Initial Stock',
      reason: 'Product created in catalog',
      performedBy: 'Store Admin',
      timestamp: new Date().toISOString(),
    };
    setInventoryLogs((prev) => [logEntry, ...prev]);

    showToast({
      type: 'success',
      title: 'Product Created',
      message: `"${newProduct.title}" was added successfully.`,
    });

    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const updated = { ...prod, ...updatedFields };
          // Auto adjust status if stock reaches 0
          if (Number(updated.stock) <= 0 && updated.status !== 'Draft') {
            updated.status = 'Out of Stock';
          } else if (Number(updated.stock) > 0 && updated.status === 'Out of Stock') {
            updated.status = 'Active';
          }
          return updated;
        }
        return prod;
      })
    );

    showToast({
      type: 'success',
      title: 'Product Updated',
      message: 'Product changes saved successfully.',
    });
  };

  const deleteProduct = (id) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));

    showToast({
      type: 'info',
      title: 'Product Deleted',
      message: target ? `"${target.title}" was removed.` : 'Product removed.',
    });
  };

  const bulkDeleteProducts = (ids) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    showToast({
      type: 'info',
      title: 'Batch Deletion',
      message: `Removed ${ids.length} products.`,
    });
  };

  const bulkUpdateStatus = (ids, status) => {
    setProducts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status } : p))
    );
    showToast({
      type: 'success',
      title: 'Status Updated',
      message: `Updated status to "${status}" for ${ids.length} products.`,
    });
  };

  // Order Management
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [...ord.timeline];
          // Update timeline step matching status
          const existingStep = updatedTimeline.find((s) => s.status.toLowerCase().includes(newStatus.toLowerCase()));
          if (existingStep) {
            existingStep.done = true;
            existingStep.time = new Date().toISOString();
          } else {
            updatedTimeline.push({
              status: `Status changed to ${newStatus}`,
              time: new Date().toISOString(),
              done: true,
            });
          }

          let paymentStatus = ord.paymentStatus;
          if (newStatus === 'Cancelled') {
            paymentStatus = 'Refunded';
          }

          return {
            ...ord,
            status: newStatus,
            paymentStatus,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );

    showToast({
      type: 'success',
      title: 'Order Status Updated',
      message: `Order #${orderId} changed to ${newStatus}.`,
    });
  };

  const updateOrderNotes = (orderId, notes) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, notes } : ord))
    );
    showToast({
      type: 'success',
      title: 'Notes Saved',
      message: `Internal notes for #${orderId} saved.`,
    });
  };

  // Customer Management
  const addCustomer = (customerData) => {
    const id = generateId('CUST');
    const newCustomer = {
      ...customerData,
      id,
      totalSpent: 0,
      ordersCount: 0,
      tier: customerData.tier || 'Bronze',
      status: 'Active',
      joinedDate: new Date().toISOString(),
      avatar: customerData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    showToast({
      type: 'success',
      title: 'Customer Added',
      message: `${newCustomer.name} was added to the directory.`,
    });

    return newCustomer;
  };

  const updateCustomer = (id, fields) => {
    setCustomers((prev) =>
      prev.map((cust) => (cust.id === id ? { ...cust, ...fields } : cust))
    );
    showToast({
      type: 'success',
      title: 'Customer Updated',
      message: 'Profile information updated.',
    });
  };

  const toggleCustomerStatus = (id) => {
    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id === id) {
          const nextStatus = cust.status === 'Active' ? 'Inactive' : 'Active';
          showToast({
            type: 'info',
            title: 'Customer Status',
            message: `${cust.name} marked as ${nextStatus}.`,
          });
          return { ...cust, status: nextStatus };
        }
        return cust;
      })
    );
  };

  // Inventory Management
  const restockProduct = (productId, amount, reason = 'Restock') => {
    const qty = Number(amount);
    let targetProduct = null;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          targetProduct = p;
          const newQty = Math.max(0, p.stock + qty);
          return {
            ...p,
            stock: newQty,
            status: newQty > 0 && p.status === 'Out of Stock' ? 'Active' : p.status,
          };
        }
        return p;
      })
    );

    if (targetProduct) {
      const logEntry = {
        id: generateId('LOG'),
        productId: targetProduct.id,
        productTitle: targetProduct.title,
        sku: targetProduct.sku,
        previousStock: targetProduct.stock,
        adjustment: qty,
        newStock: Math.max(0, targetProduct.stock + qty),
        type: qty >= 0 ? 'Restock' : 'Adjustment',
        reason,
        performedBy: 'Inventory Manager',
        timestamp: new Date().toISOString(),
      };

      setInventoryLogs((prev) => [logEntry, ...prev]);

      showToast({
        type: 'success',
        title: 'Inventory Updated',
        message: `Restocked ${qty} units of "${targetProduct.title}".`,
      });
    }
  };

  const adjustInventory = (productId, newAbsoluteStock, reason) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const newStockNum = Math.max(0, Number(newAbsoluteStock));
    const diff = newStockNum - targetProduct.stock;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            stock: newStockNum,
            status: newStockNum === 0 ? 'Out of Stock' : (p.status === 'Out of Stock' ? 'Active' : p.status),
          };
        }
        return p;
      })
    );

    const logEntry = {
      id: generateId('LOG'),
      productId: targetProduct.id,
      productTitle: targetProduct.title,
      sku: targetProduct.sku,
      previousStock: targetProduct.stock,
      adjustment: diff,
      newStock: newStockNum,
      type: 'Manual Audit',
      reason: reason || 'Inventory cycle count audit',
      performedBy: 'Quality Controller',
      timestamp: new Date().toISOString(),
    };

    setInventoryLogs((prev) => [logEntry, ...prev]);

    showToast({
      type: 'info',
      title: 'Stock Level Adjusted',
      message: `${targetProduct.title} set to ${newStockNum} units.`,
    });
  };

  const resetToInitialData = () => {
    setProducts(initialProducts);
    setOrders(initialOrders);
    setCustomers(initialCustomers);
    setInventoryLogs(initialInventoryLogs);
    localStorage.removeItem('omnidash_v2_products');
    localStorage.removeItem('omnidash_v2_orders');
    localStorage.removeItem('omnidash_v2_customers');
    localStorage.removeItem('omnidash_v2_inventory_logs');

    showToast({
      type: 'info',
      title: 'Reset Completed',
      message: 'All datasets restored to initial demo showcase state.',
    });
  };

  // Computed KPIs & Aggregations
  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrdersCount = orders.length;
    const totalCustomersCount = customers.length;
    const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    const lowStockProducts = products.filter(
      (p) => p.stock > 0 && p.stock <= (p.minStock || 10)
    );
    const outOfStockProducts = products.filter((p) => p.stock === 0);
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + p.price * (p.stock || 0),
      0
    );

    // Sales by Category
    const categoryMap = {};
    products.forEach((p) => {
      const cat = p.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + (p.salesCount || 0);
    });

    return {
      totalRevenue,
      totalOrdersCount,
      totalCustomersCount,
      averageOrderValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      totalInventoryValue,
      lowStockProducts,
      categoryBreakdown: categoryMap,
    };
  }, [products, orders, customers]);

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        customers,
        inventoryLogs,
        stats,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkDeleteProducts,
        bulkUpdateStatus,
        updateOrderStatus,
        updateOrderNotes,
        addCustomer,
        updateCustomer,
        toggleCustomerStatus,
        restockProduct,
        adjustInventory,
        resetToInitialData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
