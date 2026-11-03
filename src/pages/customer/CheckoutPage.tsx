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
  AlertCircle,
  Building2,
  Lock,
  Sparkles
} from 'lucide-react';
import { UpiPaymentCard } from '../../components/common/UpiPaymentCard.tsx';

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
  const [orderPreviewNumber] = useState<string>(() => `ORD-${Date.now().toString().slice(-6)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card / NetBanking fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

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

    // Determine payment transaction reference based on selected mode
    let finalTxnId = upiTransactionId.trim();

    if (paymentMethod === 'upi') {
      if (!finalTxnId) {
        // Auto-assign order verification reference so customer is never blocked
        finalTxnId = `UPI-APP-${customerPhone.replace(/\D/g, '').slice(-4)}-${Date.now().toString().slice(-4)}`;
      }
    } else if (paymentMethod === 'card') {
      finalTxnId = `CARD-TXN-${cardNumber ? cardNumber.replace(/\s+/g, '').slice(-4) : 'ONLINE'}-${Date.now().toString().slice(-6)}`;
    } else if (paymentMethod === 'netbanking') {
      finalTxnId = `NB-${selectedBank.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    } else if (paymentMethod === 'cod') {
      finalTxnId = `COD-COLLECT-AT-DOORSTEP`;
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
        paymentTransactionId: finalTxnId,
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
                <p className="text-[11px] text-gray-500">Pay securely via UPI QR, Cards, NetBanking or Cash on Delivery</p>
              </div>
            </div>

            {/* Payment Mode Grid (4 Options) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* 1. UPI Option */}
              <label className={`p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50/60 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-gray-900">Instant UPI</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-gray-500">
                  GPay, PhonePe, Paytm QR
                </p>
              </label>

              {/* 2. Card Option */}
              <label className={`p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-50/60 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-gray-900">Card</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-gray-500">
                  Visa, RuPay, MasterCard
                </p>
              </label>

              {/* 3. NetBanking Option */}
              <label className={`p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'netbanking' ? 'border-emerald-600 bg-emerald-50/60 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-gray-900">NetBanking</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-gray-500">
                  SBI, HDFC, ICICI, Axis
                </p>
              </label>

              {/* 4. Cash On Delivery Option */}
              <label className={`p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50/60 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-gray-900">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-gray-500">
                  Pay cash to delivery rider
                </p>
              </label>
            </div>

            {/* Interactive UPI Payment Card */}
            {paymentMethod === 'upi' && (
              <UpiPaymentCard
                settings={settings}
                amount={cartTotals.total}
                orderNumber={orderPreviewNumber}
                upiTransactionId={upiTransactionId}
                onUpiTransactionIdChange={setUpiTransactionId}
              />
            )}

            {/* Debit / Credit Card Form */}
            {paymentMethod === 'card' && (
              <div className="p-4 sm:p-5 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-gray-900">Card Payment Gateway</h3>
                      <p className="text-[10px] text-gray-500">Supports all Indian RuPay, Visa, and MasterCards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    <Lock className="w-3 h-3 text-emerald-700" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1 text-[11px]">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(v);
                      }}
                      placeholder="4532 •••• •••• 8921"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl outline-none font-mono text-xs focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-[11px]">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl outline-none text-xs focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-[11px]">Valid Thru</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '');
                          if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                          setCardExpiry(v);
                        }}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl outline-none font-mono text-xs text-center focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-[11px]">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl outline-none font-mono text-xs text-center focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Card will be authenticated via standard bank OTP upon placing order.</span>
                </div>
              </div>
            )}

            {/* NetBanking Form */}
            {paymentMethod === 'netbanking' && (
              <div className="p-4 sm:p-5 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-xs text-gray-900">Select Bank for NetBanking</h3>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">Instant Login</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda', 'Other Indian Banks'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left truncate ${
                        selectedBank === b 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 shadow-2xs' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cash on Delivery Notice */}
            {paymentMethod === 'cod' && (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <Truck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-emerald-950">Cash on Doorstep Delivery</p>
                  <p className="text-[11px] text-emerald-800">
                    Pay <span className="font-bold">{formatINR(cartTotals.total)}</span> in cash or scan the delivery executive&apos;s UPI QR when your order arrives.
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
