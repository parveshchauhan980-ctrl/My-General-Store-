import React from 'react';
import { useStore, AdminPage } from '../../context/StoreContext.tsx';
import { Menu, Bell, CheckCircle2, AlertTriangle, Plus, Store } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, title }) => {
  const { settings, updateSettings, navigateAdmin, payments, orders } = useStore();

  const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'placed').length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-gray-600 hover:text-gray-900 lg:hidden rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-[11px] text-gray-500 hidden sm:block">My General Store Management Console</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Store Open/Closed Toggle */}
        <button
          onClick={() => updateSettings({ isStoreOpen: !settings.isStoreOpen })}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
            settings.isStoreOpen 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
          }`}
          title="Toggle online ordering status"
        >
          <Store className="w-3.5 h-3.5" />
          <span>{settings.isStoreOpen ? 'Store Open for Orders' : 'Store Closed'}</span>
        </button>

        {/* Quick Add Product Button */}
        <button
          onClick={() => navigateAdmin('admin-products')}
          className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>

        {/* Pending Alerts Pill */}
        {(pendingPayments > 0 || pendingOrders > 0) && (
          <button
            onClick={() => navigateAdmin(pendingPayments > 0 ? 'admin-payments' : 'admin-orders')}
            className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span className="hidden sm:inline">Pending:</span>
            <span>{pendingOrders + pendingPayments}</span>
          </button>
        )}
      </div>
    </header>
  );
};
