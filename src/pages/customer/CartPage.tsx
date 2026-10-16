import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { formatINR } from '../../utils/calculations.ts';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Truck, 
  Tag, 
  ShieldCheck 
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    cartTotals, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    navigateCustomer,
    settings,
    addToast
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'KIRANA50' || code === 'WELCOME50') {
      setAppliedDiscount(50);
      addToast('Coupon applied! ₹50 extra discount granted.', 'success');
    } else if (code === 'FREESHIP') {
      setAppliedDiscount(cartTotals.deliveryFee);
      addToast('Free delivery coupon applied!', 'success');
    } else {
      addToast('Invalid coupon code. Try "KIRANA50"', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Your Grocery Cart is Empty</h2>
        <p className="text-xs text-gray-500 mt-2 mb-6 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any daily staples, dals, atta, or spices to your cart yet.
        </p>
        <button
          onClick={() => navigateCustomer('products')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
        >
          Shop Fresh Groceries
        </button>
      </div>
    );
  }

  const finalPayable = Math.max(0, cartTotals.total - appliedDiscount);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review your selected groceries before checkout ({cart.length} items)
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
        {cartTotals.isFreeDelivery ? (
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Congratulations! You have unlocked FREE Doorstep Delivery on this order.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Add {formatINR(cartTotals.amountNeededForFreeDelivery)} more to get FREE Delivery!</span>
              </span>
              <span>{Math.round((cartTotals.subtotal / settings.freeDeliveryThreshold) * 100)}%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (cartTotals.subtotal / settings.freeDeliveryThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xs divide-y divide-gray-100">
          {cart.map((item) => {
            const itemSubtotal = item.product.price * item.quantity;
            return (
              <div key={item.product.id} className="p-4 sm:p-5 flex items-center gap-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {item.product.brand}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 truncate">
                    {item.product.name}
                  </h3>
                  {item.product.hindiName && (
                    <p className="text-[11px] text-gray-500">{item.product.hindiName}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                      {item.product.unit}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {formatINR(item.product.price)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                    aria-label={`Decrease quantity of ${item.product.name}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-bold text-xs min-w-[20px] text-center text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="p-1 hover:bg-gray-200 text-gray-700 rounded transition-colors disabled:opacity-30"
                    aria-label={`Increase quantity of ${item.product.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price and delete */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-emerald-950">
                    {formatINR(itemSubtotal)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-rose-600 p-1 text-xs transition-colors mt-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="p-4 bg-gray-50 flex items-center justify-between text-xs">
            <button
              onClick={() => navigateCustomer('products')}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
            <span className="text-gray-500 font-medium">All items packed fresh from sanitized shelf</span>
          </div>
        </div>

        {/* Right: Bill Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Promo Coupon Card */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Have a Kirana Promo Code?</span>
            </div>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter KIRANA50"
                className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-emerald-500 uppercase"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Apply
              </button>
            </form>
            {appliedDiscount > 0 && (
              <p className="text-[11px] text-emerald-700 font-semibold">
                ✓ Promo discount of {formatINR(appliedDiscount)} applied!
              </p>
            )}
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
              Bill Details
            </h2>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">{formatINR(cartTotals.subtotal)}</span>
              </div>

              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Catalog MRP Savings</span>
                  <span>- {formatINR(cartTotals.discount)}</span>
                </div>
              )}

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>- {formatINR(appliedDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST Tax ({settings.taxRatePercentage}%)</span>
                <span>{formatINR(cartTotals.tax)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
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
              <div>
                <span className="text-sm font-extrabold text-gray-900 block">To Pay</span>
                <span className="text-[10px] text-gray-400">Inclusive of all taxes</span>
              </div>
              <span className="text-2xl font-black text-emerald-950">
                {formatINR(finalPayable)}
              </span>
            </div>

            <button
              onClick={() => navigateCustomer('checkout')}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure Indian Kirana Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
