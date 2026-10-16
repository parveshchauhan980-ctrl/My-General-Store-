import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { Database, AlertTriangle, CheckCircle2, ChevronRight, X, ShieldAlert } from 'lucide-react';

export const BackendStatusBanner: React.FC = () => {
  const { connectionStatus } = useStore();
  const [showDetails, setShowDetails] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <aside aria-label="System Integration Status" className="bg-emerald-950 text-emerald-100 border-b border-emerald-800/80 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connectionStatus.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${connectionStatus.isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-semibold text-white tracking-wide uppercase text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded">
              Phase 1 Development
            </span>
            <span className="text-emerald-200">
              {connectionStatus.isConfigured 
                ? `Firebase Live Firestore Connected (${connectionStatus.projectId})`
                : 'Architecture Prototype Engine active — Firebase Service Layer ready for production credentials'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDetails(true)}
              className="text-emerald-300 hover:text-white underline underline-offset-2 font-medium flex items-center gap-1 transition-colors"
            >
              Architecture & Firebase Setup Info
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss banner"
              className="text-emerald-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Architecture Info Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 text-gray-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Backend & Security Architecture</h3>
                <p className="text-xs text-gray-500">My General Store — Production Readiness Audit</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 text-xs">Security & Development Integrity Rule</p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    No hardcoded credentials. Admin access is strictly protected. Authentication, payments, and inventory are tested through structured service modules (<code className="text-amber-950 font-mono">src/services/firebase/*</code>).
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Service Modules Implemented</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <li className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><code>src/services/firebase/auth.ts</code> (Auth & Roles)</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><code>src/services/firebase/products.ts</code> (Catalog CRUD)</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><code>src/services/firebase/orders.ts</code> (Order Lifecycle)</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><code>src/services/firebase/payments.ts</code> (UPI/COD Ledger)</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><code>src/services/firebase/inventory.ts</code> (Stock Audits)</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><code>firestore.rules</code> (Role-based Security)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">To Connect Live Firebase Cloud Project</h4>
                <p className="text-xs text-gray-500 mb-2">Populate your keys in <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code>:</p>
                <div className="bg-gray-900 text-emerald-400 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                  <div>VITE_FIREBASE_API_KEY="AIzaSy..."</div>
                  <div>VITE_FIREBASE_AUTH_DOMAIN="mygeneralstore.firebaseapp.com"</div>
                  <div>VITE_FIREBASE_PROJECT_ID="mygeneralstore-prod"</div>
                  <div>VITE_FIREBASE_STORAGE_BUCKET="mygeneralstore.appspot.com"</div>
                  <div>VITE_FIREBASE_MESSAGING_SENDER_ID="..."</div>
                  <div>VITE_FIREBASE_APP_ID="1:..."</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
