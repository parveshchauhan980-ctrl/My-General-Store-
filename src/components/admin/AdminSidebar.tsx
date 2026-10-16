import React from 'react';
import { useStore, AdminPage } from '../../context/StoreContext.tsx';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Boxes, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AdminSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = false, onClose }) => {
  const { 
    view, 
    navigateAdmin, 
    navigateCustomer, 
    adminUser, 
    logoutAdmin,
    orders,
    payments,
    products,
    connectionStatus 
  } = useStore();

  const currentPage = view.mode === 'admin' ? view.page : 'admin-dashboard';

  // Badges
  const pendingPaymentsCount = payments.filter((p) => p.status === 'pending').length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'placed').length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  const navItems: { id: AdminPage; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-products', label: 'Products Management', icon: Package },
    { id: 'admin-categories', label: 'Categories Management', icon: Layers },
    { 
      id: 'admin-orders', 
      label: 'Orders Management', 
      icon: ShoppingBag, 
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    { 
      id: 'admin-inventory', 
      label: 'Inventory & Restock', 
      icon: Boxes, 
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'admin-customers', label: 'Customers', icon: Users },
    { 
      id: 'admin-payments', 
      label: 'Payment Verification', 
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'admin-reports', label: 'Sales Reports', icon: BarChart3 },
    { id: 'admin-settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-emerald-950 text-white flex flex-col border-r border-emerald-900 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-emerald-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight">Store Admin</h2>
            <p className="text-[10px] text-emerald-400 font-medium">My General Store Backoffice</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
          Store Operations
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                navigateAdmin(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-emerald-900">
          <p className="px-3 pb-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Quick Actions
          </p>

          <button
            onClick={() => {
              navigateCustomer('home');
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-900/40 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>Customer Website</span>
          </button>
        </div>
      </nav>

      {/* Admin Status & User Footer */}
      <div className="p-3 border-t border-emerald-900 bg-emerald-950/80">
        <div className="p-2.5 rounded-xl bg-emerald-900/50 border border-emerald-800/60 mb-2">
          <div className="flex items-center gap-2 text-[10px] font-medium text-emerald-200">
            <span className={`w-2 h-2 rounded-full ${connectionStatus.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{connectionStatus.isConfigured ? 'Firebase Production' : 'Local Architecture Mode'}</span>
          </div>
          <p className="text-[10px] text-emerald-400/80 mt-0.5 truncate">
            {connectionStatus.isConfigured ? connectionStatus.projectId : 'Service modules ready'}
          </p>
        </div>

        {adminUser && (
          <div className="flex items-center justify-between px-1">
            <div className="leading-tight truncate">
              <p className="text-xs font-bold text-white truncate">{adminUser.displayName}</p>
              <p className="text-[10px] text-emerald-400 truncate">{adminUser.email}</p>
            </div>
            <button
              onClick={logoutAdmin}
              className="p-1.5 text-emerald-400 hover:text-rose-400 hover:bg-emerald-900 rounded-lg transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
