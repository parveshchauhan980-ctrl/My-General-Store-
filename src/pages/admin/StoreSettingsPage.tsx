import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  QrCode,
  Smartphone,
  Upload,
  Check,
  Copy,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
  Terminal,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { PWAInstallButton } from '../../components/common/PWAInstallButton.tsx';
import { buildUpiUri, generateQrDataUrl, isValidUpiId } from '../../utils/upi.ts';

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

  // Payment & QR Gateway Configuration
  const [taxRatePercentage, setTaxRatePercentage] = useState(settings.taxRatePercentage);
  const [upiId, setUpiId] = useState(settings.upiId || 'parveshchauhan980@okhdfcbank');
  const [upiName, setUpiName] = useState(settings.upiName || 'My General Store Enterprises (Parvesh Chauhan)');
  const [upiQrImageUrl, setUpiQrImageUrl] = useState(settings.upiQrImageUrl || '');
  const [upiDisplayMode, setUpiDisplayMode] = useState<'dynamic' | 'custom_image' | 'both'>(settings.upiDisplayMode || 'both');
  const [youpiPgEndpoint, setYoupiPgEndpoint] = useState(settings.youpiPgEndpoint || '');

  // Live Test QR Preview
  const [testAmount, setTestAmount] = useState<number>(100);
  const [previewQrUrl, setPreviewQrUrl] = useState<string>('');
  const [activeGatewayTab, setActiveGatewayTab] = useState<'qr_settings' | 'test_scanner' | 'youpi_pg_guide' | 'apps_guide'>('qr_settings');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Timings
  const [openingTime, setOpeningTime] = useState(settings.openingTime);
  const [closingTime, setClosingTime] = useState(settings.closingTime);
  const [isStoreOpen, setIsStoreOpen] = useState(settings.isStoreOpen);

  // Live generate test QR
  useEffect(() => {
    if (!upiId) return;
    const uri = buildUpiUri({
      upiId,
      upiName,
      amount: testAmount,
      orderNumber: 'TEST-1001',
      transactionNote: `Test payment at ${storeName}`
    });
    generateQrDataUrl(uri, { width: 260 })
      .then(setPreviewQrUrl)
      .catch((e) => console.error('Failed to preview QR:', e));
  }, [upiId, upiName, testAmount, storeName]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (PNG/JPG)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUpiQrImageUrl(base64);
      addToast('Custom QR standee uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

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
      upiQrImageUrl,
      upiDisplayMode,
      youpiPgEndpoint,
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

      {/* Mobile App & APK Distribution Banner */}
      <PWAInstallButton variant="admin-banner" />

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

        {/* 3. Payment Gateway & UPI QR Suite */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Payment Gateway & UPI QR Center</h2>
                <p className="text-[11px] text-gray-500">Configure your store QR, UPI IDs, Standee photos & YouPI-PG Gateway</p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveGatewayTab('qr_settings')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeGatewayTab === 'qr_settings' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                QR & UPI Config
              </button>
              <button
                type="button"
                onClick={() => setActiveGatewayTab('test_scanner')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeGatewayTab === 'test_scanner' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                Live QR Test
              </button>
              <button
                type="button"
                onClick={() => setActiveGatewayTab('youpi_pg_guide')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeGatewayTab === 'youpi_pg_guide' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                YouPI PG
              </button>
              <button
                type="button"
                onClick={() => setActiveGatewayTab('apps_guide')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeGatewayTab === 'apps_guide' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Apps Guide
              </button>
            </div>
          </div>

          {/* TAB 1: QR & UPI Configuration */}
          {activeGatewayTab === 'qr_settings' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-gray-700 font-semibold mb-1 text-xs">
                    Store Merchant UPI VPA / ID *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value.trim())}
                      placeholder="e.g. 9876543210@paytm or store@okhdfcbank"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="absolute right-2 top-2 text-gray-400 hover:text-emerald-700 p-0.5"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Payments will deposit directly into this bank/UPI account (0% commission).
                  </span>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-gray-700 font-semibold mb-1 text-xs">
                    Registered Business / Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                    placeholder="e.g. My General Store (Parvesh Chauhan)"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Shown to customer when they scan or tap payment apps.
                  </span>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-gray-700 font-semibold mb-1 text-xs">
                    GST Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={taxRatePercentage}
                    onChange={(e) => setTaxRatePercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono text-xs"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Calculated on cart subtotal at checkout (default 5%).
                  </span>
                </div>
              </div>

              {/* Custom Store Standee / Printed QR Upload */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-gray-900">
                      Store Physical QR Standee Photo (Optional)
                    </span>
                  </div>
                  {upiQrImageUrl && (
                    <button
                      type="button"
                      onClick={() => setUpiQrImageUrl('')}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-600">
                  Have a printed Google Pay, PhonePe, or Paytm QR standee sticker? Upload a photo so customers can scan your physical shop QR during checkout.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Upload QR Image File (PNG/JPG)
                    </label>
                    <label className="flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl bg-white cursor-pointer transition-colors text-xs font-medium text-gray-600">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Choose file from device...</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Or Paste Direct Image URL
                    </label>
                    <input
                      type="url"
                      value={upiQrImageUrl}
                      onChange={(e) => setUpiQrImageUrl(e.target.value.trim())}
                      placeholder="https://example.com/my-shop-qr.png"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-xs font-mono"
                    />
                  </div>
                </div>

                {upiQrImageUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={upiQrImageUrl}
                      alt="Uploaded QR Standee"
                      className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-emerald-900">Custom Standee Active</p>
                      <p className="text-[11px] text-gray-500">Customers can switch to your standee on checkout.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Display Mode Selection */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-emerald-950 block">Checkout QR Presentation Mode</span>
                  <span className="text-[11px] text-emerald-800">
                    Choose what customers see on the payment page:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-emerald-300">
                    <input
                      type="radio"
                      name="displayMode"
                      value="both"
                      checked={upiDisplayMode === 'both'}
                      onChange={() => setUpiDisplayMode('both')}
                      className="text-emerald-600"
                    />
                    <span className="font-medium text-gray-800">Both (Dynamic + Standee)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-emerald-300">
                    <input
                      type="radio"
                      name="displayMode"
                      value="dynamic"
                      checked={upiDisplayMode === 'dynamic'}
                      onChange={() => setUpiDisplayMode('dynamic')}
                      className="text-emerald-600"
                    />
                    <span className="font-medium text-gray-800">Dynamic Amount QR Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Live Test QR Scanner & Simulator */}
          {activeGatewayTab === 'test_scanner' && (
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>Scan & Test Your Store Payment QR Code</span>
                  </h3>
                  <p className="text-[11px] text-emerald-800">
                    Scan with Google Pay, PhonePe, or Paytm camera on your mobile to verify your VPA works!
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-gray-600 font-semibold">Test Amount:</span>
                  {[1, 10, 100, 499].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTestAmount(amt)}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                        testAmount === amt ? 'bg-emerald-700 text-white shadow-2xs' : 'bg-white text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-white p-4 rounded-xl border border-emerald-200">
                <div className="flex flex-col items-center">
                  {previewQrUrl ? (
                    <img
                      src={previewQrUrl}
                      alt="Live test QR code"
                      className="w-44 h-44 object-contain rounded-lg border border-gray-100 shadow-xs"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-lg text-xs text-gray-400">
                      Generating...
                    </div>
                  )}
                  <span className="mt-2 text-xs font-extrabold bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded-full">
                    Encoded: ₹{testAmount}
                  </span>
                </div>

                <div className="space-y-2 text-xs max-w-sm">
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                    <p className="text-gray-500 font-medium">Merchant VPA:</p>
                    <p className="font-mono font-bold text-emerald-900 bg-white p-1 rounded border border-gray-200">
                      {upiId}
                    </p>
                    <p className="text-gray-500 font-medium pt-1">Merchant Name:</p>
                    <p className="font-semibold text-gray-800">{upiName}</p>
                  </div>
                  <div className="flex items-start gap-1.5 text-[11px] text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      When scanned with any UPI app, the app will automatically open with recipient <strong>{upiName}</strong> and amount <strong>₹{testAmount}</strong>.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: YouPI-PG Gateway Guide */}
          {activeGatewayTab === 'youpi_pg_guide' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <span className="font-black text-sm text-emerald-400">⚡ YOUPI PG V2 - Sovereign Self-Hosted Gateway</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    Cloned in /youpi-pg
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  YOUPI PG is a self-hosted Indian UPI payment gateway providing <strong>0% aggregator fees</strong>, <strong>instant direct-to-bank settlement</strong>, and automated banking observers (via Bank SMS & Gmail webhook alerts).
                </p>

                <div className="p-3 bg-black/50 rounded-xl font-mono text-[11px] text-emerald-300 space-y-1">
                  <p className="text-slate-400"># Start the self-hosted YouPI-PG server:</p>
                  <p>cd youpi-pg</p>
                  <p>npm install</p>
                  <p>npm run dev</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                    <p className="font-bold text-white mb-0.5">1. Zero Aggregator Fees</p>
                    <p className="text-[10px] text-slate-400">0% fees forever compared to 2-3% + GST charged by Razorpay/Cashfree.</p>
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                    <p className="font-bold text-white mb-0.5">2. Instant Settlement</p>
                    <p className="text-[10px] text-slate-400">Funds land directly in your bank account via peer-to-peer UPI transfer.</p>
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                    <p className="font-bold text-white mb-0.5">3. Bank Observers</p>
                    <p className="text-[10px] text-slate-400">Automatic credit matching by parsing bank SMS/email notifications.</p>
                  </div>
                </div>
              </div>

              {/* Endpoint configuration */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  YouPI-PG Server / Webhook Endpoint (Optional)
                </label>
                <input
                  type="url"
                  value={youpiPgEndpoint}
                  onChange={(e) => setYoupiPgEndpoint(e.target.value.trim())}
                  placeholder="http://localhost:4000 or https://gateway.mygeneralstore.in"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono outline-none focus:border-emerald-600"
                />
                <p className="text-[11px] text-gray-500">
                  Connect your store to your running YouPI-PG instance for automated payment status synchronization.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Popular Indian Payment Apps Guide */}
          {activeGatewayTab === 'apps_guide' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Google Pay for Business</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  1. Open <strong>Google Pay for Business</strong> app.<br/>
                  2. Tap on <strong>QR code</strong> or <strong>Business profile</strong>.<br/>
                  3. Copy your UPI ID (e.g. <code>store@okhdfcbank</code>) and paste it into Store UPI VPA above.
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>PhonePe Business / Standee</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  1. Open <strong>PhonePe Business</strong> app.<br/>
                  2. Go to <strong>Manage QR Codes</strong>.<br/>
                  3. Take a screenshot or download the QR photo, then upload it into <strong>Custom QR Standee</strong> above!
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  <span>Paytm for Business / Soundbox</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  1. Open <strong>Paytm for Business</strong>.<br/>
                  2. Your All-In-One Merchant QR is linked to your mobile VPA: <code>phone@paytm</code>.<br/>
                  3. Enter your Paytm merchant VPA above to accept instant payments.
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <span className="w-2 h-2 rounded-full bg-orange-600" />
                  <span>BharatPe Zero Fee QR</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  1. Open <strong>BharatPe</strong> merchant app.<br/>
                  2. Download your QR code or copy your BharatPe VPA (e.g. <code>bharatpe098234@icici</code>).<br/>
                  3. Paste into Store Settings to route payments with zero commission.
                </p>
              </div>
            </div>
          )}
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
