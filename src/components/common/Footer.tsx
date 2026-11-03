import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Lock
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton.tsx';

export const Footer: React.FC = () => {
  const { navigateCustomer, navigateAdmin, settings, categories, adminUser } = useStore();

  return (
    <footer className="bg-emerald-950 text-white mt-16 pt-12 pb-8 border-t border-emerald-900">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-emerald-900/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/40">
            <div className="w-10 h-10 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Quick Doorstep Delivery</h4>
              <p className="text-[11px] text-emerald-300">Fast morning & evening slots</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/40">
            <div className="w-10 h-10 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">100% Pure & Genuine</h4>
              <p className="text-[11px] text-emerald-300">Direct from certified millers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/40">
            <div className="w-10 h-10 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Easy UPI & Cash</h4>
              <p className="text-[11px] text-emerald-300">GPay, PhonePe, Paytm or COD</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/40">
            <div className="w-10 h-10 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Kirana Assurance</h4>
              <p className="text-[11px] text-emerald-300">No questions asked replacement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-emerald-200">
        {/* Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold text-white">{settings.storeName}</span>
          </div>
          <p className="text-xs text-emerald-300 leading-relaxed">
            {settings.tagline}
          </p>
          <div className="pt-2 text-[11px] text-emerald-400 space-y-1">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{settings.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{settings.email}</span>
            </p>
          </div>
        </div>

        {/* Customer Quick Links */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Website</h3>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigateCustomer('home')} className="hover:text-white transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => navigateCustomer('products')} className="hover:text-white transition-colors">
                All Products
              </button>
            </li>
            <li>
              <button onClick={() => navigateCustomer('categories')} className="hover:text-white transition-colors">
                Product Categories
              </button>
            </li>
            <li>
              <button onClick={() => navigateCustomer('cart')} className="hover:text-white transition-colors">
                Shopping Cart
              </button>
            </li>
            <li>
              <button onClick={() => navigateCustomer('my-orders')} className="hover:text-white transition-colors">
                My Orders & Tracking
              </button>
            </li>
            <li>
              <button onClick={() => navigateCustomer('profile')} className="hover:text-white transition-colors">
                My Account Profile
              </button>
            </li>
            <li className="pt-1">
              <PWAInstallButton variant="footer" customLabel="📱 Android APK & Mobile App" />
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Daily Categories</h3>
          <ul className="space-y-2">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => navigateCustomer('products', { categoryId: c.id })}
                  className="hover:text-white transition-colors"
                >
                  {c.name} {c.hindiName && <span className="text-[10px] opacity-75">({c.hindiName})</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Fast Delivery & Serviceable Pincodes */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Doorstep Delivery</h3>
          <p className="text-[11px] text-emerald-200 leading-relaxed mb-3">
            Fresh, pure staples delivered directly to your doorstep. Free delivery on orders over ₹{settings.freeDeliveryThreshold}.
          </p>
          <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-800 text-[11px] text-emerald-300">
            <span className="font-semibold text-white block mb-1">Serviceable Pincodes:</span>
            <div className="flex flex-wrap gap-1">
              {settings.deliveryPincodes.map((pin) => (
                <span key={pin} className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px] font-mono">
                  {pin}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400 gap-2">
        <p>© 2026 {settings.storeName}. All rights reserved. Indian Kirana Commerce System.</p>
        <p className="flex items-center gap-1">
          Crafted with care for local Indian retail
        </p>
      </div>
    </footer>
  );
};
