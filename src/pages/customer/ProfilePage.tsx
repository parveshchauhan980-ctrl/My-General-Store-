import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { User, Mail, Phone, MapPin, Save, LogOut, PackageCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, logoutCustomer, navigateCustomer, orders } = useStore();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '');
  const [landmark, setLandmark] = useState(currentUser?.address?.landmark || '');
  const [city, setCity] = useState(currentUser?.address?.city || '');
  const [state, setState] = useState(currentUser?.address?.state || '');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-gray-100 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Please Sign In</h2>
        <p className="text-xs text-gray-500 mt-2 mb-6">
          Sign in to access and manage your delivery profile, addresses, and saved kirana preferences.
        </p>
        <button
          onClick={() => navigateCustomer('login')}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName,
      phoneNumber,
      address: {
        street,
        landmark,
        city,
        state,
        postalCode
      }
    });
  };

  const userOrdersCount = orders.filter((o) => o.customerId === currentUser.uid || o.customerEmail === currentUser.email).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">My Customer Profile</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage personal information and saved doorstep delivery address</p>
        </div>
        <button
          onClick={() => {
            logoutCustomer();
            navigateCustomer('home');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-900/10">
          {currentUser.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">{currentUser.displayName}</h2>
          <p className="text-xs text-gray-500">{currentUser.email}</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
              Verified Customer
            </span>
            <button
              onClick={() => navigateCustomer('my-orders')}
              className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>{userOrdersCount} Orders Placed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs space-y-5 text-xs">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
          Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone Number (+91)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 pt-2">
          Default Delivery Address
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Street / House / Apartment</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Flat 402, Shanti Heights"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Landmark</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Near Temple / School"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Postal Pincode</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g. 122001"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Gurugram"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Haryana"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
