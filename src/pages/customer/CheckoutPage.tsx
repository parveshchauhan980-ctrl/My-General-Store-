import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { formatINR } from '../../utils/calculations.ts';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartTotals, 
    currentUser, 
    createOrder, 
    navigateCustomer, 
    settings,
    addToast 
  } = useStore();

  // Address form fields
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phoneNumber || '+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [street, setStreet] = useState(currentUser?.address?.street || 'Flat 402, Shanti Heights, Sector 14');
  const [landmark, setLandmark] = useState(currentUser?.address?.landmark || 'Near Hanuman Mandir');
  const [city, setCity] = useState(currentUser?.address?.city || 'Gurugram');
  const [state, setState] = useState(currentUser?.address?.state || 'Haryana');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '122001');
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card' | 'netbanking'>('upi');
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-gray-100 shadow-xs">
        <p className="text-gray-500 text-sm mb-4">You have no items in your cart to checkout.</p>
        <button
          onClick={() => navigateCustomer('products')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !street || !postalCode) {
      addToast('Please complete all required delivery address fields.', 'error');
      return;
    }

    if (paymentMethod === 'upi' && !upiTransactionId.trim()) {
      addToast('Please enter your 12-digit UPI Reference / UTR Number.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        customerName,
        customerPhone,
        customerEmail: customerEmail || 'guest@mygeneralstore.in',
        deliveryAddress: {
          street,
          landmark,
          city,
          state,
          postalCode
        },
        paymentMethod,
        paymentTransactionId: paymentMethod === 'upi' ? upiTransactionId : undefined,
        notes
      });

      setIsSubmitting(false);
      navigateCustomer('my-orders');
    } catch (err) {
      setIsSubmitting(false);
      addToast('Failed to place order. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <button
          onClick={() => navigateCustomer('cart')}
          className="p-1 text-gray-500 hover:text-emerald-700 transition-colors"
          aria-label="Back to Cart"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Checkout & Delivery</h1>
          <p className="text-xs text-gray-500 mt-0.5">Complete your delivery address and payment</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Address & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Delivery Address Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">1. Delivery Address Details</h2>
                <p className="text-[11px] text-gray-500">Provide exact doorstep delivery location</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Phone Number (+91) *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com (for digital receipt)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">House / Flat / Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Flat 402, Building A, Main Road"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near Hanuman Mandir / Opp Bank"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 122001"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Delivery Instructions for Rider (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before arrival, leave with security guard"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">2. Select Payment Mode</h2>
                <p className="text-[11px] text-gray-500">Pay securely via UPI QR or Cash on Delivery</p>
              </div>
            </div>

            {/* Radio Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* UPI Option */}
              <label className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-xs text-gray-900">Instant UPI Payment</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Google Pay, PhonePe, Paytm, BHIM, Cred
                </p>
              </label>

              {/* Cash On Delivery Option */}
              <label className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-xs text-gray-900">Cash on Delivery (COD)</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Pay cash or UPI directly to rider upon delivery
                </p>
              </label>
            </div>

            {/* UPI Payment Instructions Box */}
            {paymentMethod === 'upi' && (
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-white p-1 rounded-lg border border-emerald-200 shrink-0 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-emerald-900" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-950">Store Merchant UPI VPA:</p>
                    <p className="font-mono bg-white px-2 py-1 rounded border border-emerald-300 text-emerald-900 inline-block font-semibold">
                      {settings.upiId}
                    </p>
                    <p className="text-[11px] text-gray-600">
                      Merchant Name: <span className="font-bold">{settings.upiName}</span>
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      Scan QR or pay <span className="font-bold">{formatINR(cartTotals.total)}</span> using any UPI app.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/60">
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    Enter UPI Reference / UTR Number *
                  </label>
                  <input
                    type="text"
                    required={paymentMethod === 'upi'}
                    value={upiTransactionId}
                    onChange={(e) => setUpiTransactionId(e.target.value)}
                    placeholder="e.g. UPI-984719204851 or 12-digit UTR"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">
                    * The store administrator will verify this reference in the backoffice before dispatch.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Bill Summary & Place Button */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
              Order Review ({cart.length} items)
            </h2>

            {/* Mini Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-xs">
                  <span className="truncate max-w-[180px] text-gray-700">
                    {item.quantity} × {item.product.name}
                  </span>
                  <span className="font-semibold text-gray-900 shrink-0">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatINR(cartTotals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax ({settings.taxRatePercentage}%)</span>
                <span>{formatINR(cartTotals.tax)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery</span>
                {cartTotals.isFreeDelivery ? (
                  <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                    FREE
                  </span>
                ) : (
                  <span className="font-semibold text-gray-900">{formatINR(cartTotals.deliveryFee)}</span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-gray-900">Total Payable</span>
              <span className="text-2xl font-black text-emerald-950">
                {formatINR(cartTotals.total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
            </button>

            <div className="pt-2 text-center text-[10px] text-gray-400">
              By confirming, you agree to our Store Terms and Fresh Delivery Policy.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
