import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import { DataProvider, useData } from './context/DataContext';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { QuickCommandPalette } from './components/layout/QuickCommandPalette';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { ToastContainer } from './components/common/ToastContainer';

import { DashboardOverview } from './pages/DashboardOverview';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { InventoryPage } from './pages/InventoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

import { ProductFormModal } from './components/products/ProductFormModal';
import { ProductViewDrawer } from './components/products/ProductViewDrawer';
import { OrderDetailsDrawer } from './components/orders/OrderDetailsDrawer';
import { InvoiceModal } from './components/orders/InvoiceModal';

const AppContent = () => {
  const { activeTab, setActiveTab } = useApp();
  const { addProduct, updateProduct } = useData();

  // Modals and Drawers state
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleProductFormSubmit = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };

  return (
    <div className="app-layout">
      {/* Collapsible, responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Header onOpenNewProduct={handleOpenNewProduct} />

        <main className="page-container">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onOpenNewProduct={handleOpenNewProduct}
              onViewProduct={(p) => setViewingProduct(p)}
              onViewOrder={(o) => setViewingOrder(o)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsPage
              onOpenNewProduct={handleOpenNewProduct}
              onViewProduct={(p) => setViewingProduct(p)}
              onEditProduct={handleOpenEditProduct}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersPage
              onViewOrder={(o) => setViewingOrder(o)}
              onOpenInvoice={(o) => setInvoiceOrder(o)}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersPage
              onViewOrder={(o) => {
                setViewingOrder(o);
                setActiveTab('orders');
              }}
            />
          )}

          {activeTab === 'inventory' && <InventoryPage />}

          {activeTab === 'analytics' && <AnalyticsPage />}
        </main>
      </div>

      {/* Global Interactive Drawers and Modals */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSubmit={handleProductFormSubmit}
        initialData={editingProduct}
      />

      <ProductViewDrawer
        product={viewingProduct}
        isOpen={Boolean(viewingProduct)}
        onClose={() => setViewingProduct(null)}
        onEdit={(p) => {
          setViewingProduct(null);
          handleOpenEditProduct(p);
        }}
      />

      <OrderDetailsDrawer
        order={viewingOrder}
        isOpen={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        onOpenInvoice={(o) => setInvoiceOrder(o)}
      />

      <InvoiceModal
        order={invoiceOrder}
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
      />

      <QuickCommandPalette onOpenNewProduct={handleOpenNewProduct} />
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
