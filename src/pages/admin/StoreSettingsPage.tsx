import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { 
  Store, 
  MapPin, 
  CreditCard, 
  Clock, 
  Save, 
  Plus, 
  X, 
  ShieldCheck,
  Percent,
  CheckCircle2
} from 'lucide-react';

export const StoreSettingsPage: React.FC = () => {
  const { settings, updateSettings, addToast } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [ownerName, setOwnerName] = useState(settings.ownerName || 'Parvesh Chauhan');
  const [ownerEmail, setOwnerEmail] = useState(settings.ownerEmail || 'parveshchauhan980@gmail.com');
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);

  // Delivery
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(settings.freeDeliveryThreshold);
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState(settings.defaultDeliveryFee);
  const [deliveryPincodes, setDeliveryPincodes] = useState<string[]>(settings.deliveryPincodes);
  const [newPincode, setNewPincode] = useState('');

  // Payment
  const [taxRatePercentage, setTaxRatePercentage] = useState(settings.taxRatePercentage);
  const [upiId, setUpiId] = useState(settings.upiId);
  const [upiName, setUpiName] = useState(settings.upiName);

  // Timings
  const [openingTime, setOpeningTime] = useState(settings.openingTime);
  const [closingTime, setClosingTime] = useState(settings.closingTime);
  const [isStoreOpen, setIsStoreOpen] = useState(settings.isStoreOpen);

  const handleAddPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = newPincode.trim();
    if (pin && !deliveryPincodes.includes(pin)) {
      setDeliveryPincodes([...deliveryPincodes, pin]);
      setNewPincode('');
    }
  };

  const handleRemovePincode = (pin: string) => {
    setDeliveryPincodes(deliveryPincodes.filter((p) => p !== pin));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      ownerName,
      ownerEmail,
      phone,
      email,
      address,
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      defaultDeliveryFee: Number(defaultDeliveryFee),
      deliveryPincodes,
      taxRatePercentage: Number(taxRatePercentage),
      upiId,
      upiName,
      openingTime,
      closingTime,
      isStoreOpen
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Store Settings & Configuration</h1>
          <p className="text-xs text-gray-500 mt-0.5">Control store profile, delivery radius pincodes, UPI gateway, and timings</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. General Profile */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Store className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900">General Store Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Support Phone (+91) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">Store Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Store Owner / Root Admin Name</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Parvesh Chauhan"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-medium text-emerald-950"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Store Owner Firebase Email</label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="parveshchauhan980@gmail.com"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono text-emerald-950"
              />
              <span className="text-[10px] text-emerald-700 font-medium">✓ Root Admin verified in security rules</span>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Public Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Physical Store Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Delivery & Pincodes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900">Delivery Rules & Serviceable Pincodes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Free Delivery Order Threshold (₹)</label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-gray-500">Orders equal or above this get free delivery</span>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Default Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={defaultDeliveryFee}
                onChange={(e) => setDefaultDeliveryFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-gray-500">Applied for orders below the free threshold</span>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-gray-700 font-semibold">Serviceable Delivery Pincodes</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 min-h-[50px] items-center">
                {deliveryPincodes.map((pin) => (
                  <span
                    key={pin}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-mono font-bold text-xs"
                  >
                    <span>{pin}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePincode(pin)}
                      className="text-emerald-700 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add pincode input */}
              <div className="flex gap-2 max-w-xs">
                <input
                  type="text"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddPincode}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg"
                >
                  Add Pincode
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Payment & UPI Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900">UPI Merchant & Tax Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Store UPI VPA / ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="mygeneralstore@okhdfcbank"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">UPI Registered Merchant Name</label>
              <input
                type="text"
                value={upiName}
                onChange={(e) => setUpiName(e.target.value)}
                placeholder="My General Store Enterprises"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Standard GST Tax Rate (%)</label>
              <input
                type="number"
                value={taxRatePercentage}
                onChange={(e) => setTaxRatePercentage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 4. Operating Hours & Store Toggle */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900">Store Timings & Availability</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Opening Time</label>
              <input
                type="text"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                placeholder="07:30 AM"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Closing Time</label>
              <input
                type="text"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                placeholder="10:30 PM"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Accepting New Orders</label>
              <button
                type="button"
                onClick={() => setIsStoreOpen(!isStoreOpen)}
                className={`w-full py-2 px-3 rounded-lg font-bold border transition-colors ${
                  isStoreOpen 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                {isStoreOpen ? '✓ Store OPEN' : '✕ Store CLOSED'}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
