import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { BackendStatusBanner } from './components/common/BackendStatusBanner.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';

// Customer Pages
import { HomePage } from './pages/customer/HomePage.tsx';
import { AllProductsPage } from './pages/customer/AllProductsPage.tsx';
import { CategoriesPage } from './pages/customer/CategoriesPage.tsx';
import { ProductDetailsPage } from './pages/customer/ProductDetailsPage.tsx';
import { CartPage } from './pages/customer/CartPage.tsx';
import { CheckoutPage } from './pages/customer/CheckoutPage.tsx';
import { LoginPage } from './pages/customer/LoginPage.tsx';
import { RegisterPage } from './pages/customer/RegisterPage.tsx';
import { MyOrdersPage } from './pages/customer/MyOrdersPage.tsx';
import { ProfilePage } from './pages/customer/ProfilePage.tsx';

// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { DashboardPage } from './pages/admin/DashboardPage.tsx';
import { ProductsManagementPage } from './pages/admin/ProductsManagementPage.tsx';
import { CategoriesManagementPage } from './pages/admin/CategoriesManagementPage.tsx';
import { OrdersManagementPage } from './pages/admin/OrdersManagementPage.tsx';
import { InventoryManagementPage } from './pages/admin/InventoryManagementPage.tsx';
import { CustomersManagementPage } from './pages/admin/CustomersManagementPage.tsx';
import { PaymentVerificationPage } from './pages/admin/PaymentVerificationPage.tsx';
import { SalesReportsPage } from './pages/admin/SalesReportsPage.tsx';
import { StoreSettingsPage } from './pages/admin/StoreSettingsPage.tsx';

const AppContent: React.FC = () => {
  const { view } = useStore();

  // Admin Mode Rendering
  if (view.mode === 'admin') {
    switch (view.page) {
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin-dashboard':
        return (
          <AdminLayout title="Dashboard & Store Overview">
            <DashboardPage />
          </AdminLayout>
        );
      case 'admin-products':
        return (
          <AdminLayout title="Products Catalog & Pricing">
            <ProductsManagementPage />
          </AdminLayout>
        );
      case 'admin-categories':
        return (
          <AdminLayout title="Grocery Categories & Aisles">
            <CategoriesManagementPage />
          </AdminLayout>
        );
      case 'admin-orders':
        return (
          <AdminLayout title="Customer Orders & Dispatch">
            <OrdersManagementPage />
          </AdminLayout>
        );
      case 'admin-inventory':
        return (
          <AdminLayout title="Inventory Levels & Restock">
            <InventoryManagementPage />
          </AdminLayout>
        );
      case 'admin-customers':
        return (
          <AdminLayout title="Registered Customer Accounts">
            <CustomersManagementPage />
          </AdminLayout>
        );
      case 'admin-payments':
        return (
          <AdminLayout title="Payment Verification Ledger">
            <PaymentVerificationPage />
          </AdminLayout>
        );
      case 'admin-reports':
        return (
          <AdminLayout title="Sales & Financial Reports">
            <SalesReportsPage />
          </AdminLayout>
        );
      case 'admin-settings':
        return (
          <AdminLayout title="Store & Delivery Settings">
            <StoreSettingsPage />
          </AdminLayout>
        );
      default:
        return (
          <AdminLayout title="Dashboard">
            <DashboardPage />
          </AdminLayout>
        );
    }
  }

  // Customer Mode Rendering
  const renderCustomerPage = () => {
    switch (view.page) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <AllProductsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'product-details':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'my-orders':
        return <MyOrdersPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfa] text-gray-800">
      <BackendStatusBanner />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {renderCustomerPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
      <ToastContainer />
    </StoreProvider>
  );
}
