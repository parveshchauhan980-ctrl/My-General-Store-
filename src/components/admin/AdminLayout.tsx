import React, { useState } from 'react';
import { useStore, AdminPage } from '../../context/StoreContext.tsx';
import { AdminSidebar } from './AdminSidebar.tsx';
import { AdminHeader } from './AdminHeader.tsx';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  const { adminUser, navigateAdmin, navigateCustomer, view } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on admin-login, render standalone without sidebar
  if (view.mode === 'admin' && view.page === 'admin-login') {
    return <>{children}</>;
  }

  // Security Wall: If not authenticated as Admin, show login gate
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-black text-gray-900 tracking-tight">Admin Authorization Required</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Backoffice management operations are restricted. Only authorized store managers and inventory operators may access this portal.
          </p>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 flex gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Production Security Architecture:</span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Admin authorization must be validated with Firebase Auth tokens and verified against Firestore <code className="font-mono font-semibold">/admins</code> collection before database mutations can execute.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => navigateAdmin('admin-login')}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Sign In to Admin Portal
            </button>
            <button
              onClick={() => navigateCustomer('home')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
