import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { STORE_OWNER_EMAIL } from '../../services/firebase/auth.ts';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  KeyRound, 
  Mail, 
  CheckCircle2, 
  UserX 
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { 
    loginAdminWithGoogle, 
    loginAdminWithFirebase, 
    loginAdmin, 
    navigateAdmin, 
    navigateCustomer 
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loginMethod, setLoginMethod] = useState<'google' | 'email' | 'passcode'>('google');
  const [loading, setLoading] = useState(false);

  const handleGoogleAdminLogin = async () => {
    setLoading(true);
    const success = await loginAdminWithGoogle();
    setLoading(false);
    if (success) {
      navigateAdmin('admin-dashboard');
    }
  };

  const handleEmailAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginAdminWithFirebase(email, password);
    setLoading(false);
    if (success) {
      navigateAdmin('admin-dashboard');
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (success) {
      navigateAdmin('admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col justify-center items-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />

      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-emerald-900/40 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="w-7 h-7 text-emerald-300" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Store Admin Portal</h1>
          <p className="text-xs text-gray-500">
            Dedicated backoffice authorization for store managers and verified administrators
          </p>
        </div>

        {/* Security Separation Notice */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Strict Role Separation</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Standard customer accounts cannot log into the Admin portal. Authorization requires verification against Firestore <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/admins</code> collection or the designated store owner email (<code className="font-semibold text-amber-950 font-mono">{STORE_OWNER_EMAIL}</code>).
          </p>
        </div>

        {/* Tab Switcher for Admin Auth Method */}
        <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLoginMethod('google')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              loginMethod === 'google' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Google Admin
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              loginMethod === 'email' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('passcode')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              loginMethod === 'passcode' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Passkey
          </button>
        </div>

        {/* Google Admin Login */}
        {loginMethod === 'google' && (
          <div className="space-y-4 text-xs">
            <p className="text-gray-600 text-[11px] text-center">
              Authenticate using your authorized Google Workspace or Store Administrator account:
            </p>
            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-md transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Verifying Admin Privileges...' : 'Sign In with Google (Admin)'}</span>
            </button>
            <p className="text-[10px] text-gray-400 text-center">
              Only verified administrative emails are accepted.
            </p>
          </div>
        )}

        {/* Email & Password Admin Login */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailAdminLogin} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-700 font-semibold">Admin Email Address</label>
                <button
                  type="button"
                  onClick={() => setEmail(STORE_OWNER_EMAIL)}
                  className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100"
                >
                  Use Owner Email
                </button>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parveshchauhan980@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating Role...' : 'Sign In to Backoffice'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Passkey Fast Access */}
        {loginMethod === 'passcode' && (
          <form onSubmit={handlePasscodeSubmit} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-700 font-semibold">Store Manager Passkey</label>
                <button
                  type="button"
                  onClick={() => setPasscode('admin123')}
                  className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"
                >
                  Fill: admin123
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter manager passkey..."
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-mono"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Verify Passkey & Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={() => navigateCustomer('home')}
            className="text-xs text-gray-500 hover:text-emerald-700 font-semibold inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
