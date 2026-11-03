import React, { useState } from 'react';
import { useStore, CustomerPage } from '../../context/StoreContext.tsx';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  User, 
  Shield, 
  Menu, 
  X, 
  PhoneCall, 
  Clock, 
  ChevronDown, 
  LogOut, 
  PackageCheck,
  Percent
} from 'lucide-react';
import { formatINR } from '../../utils/calculations.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

export const Header: React.FC = () => {
  const { 
    cart, 
    cartTotals, 
    currentUser, 
    adminUser,
    logoutCustomer, 
    navigateCustomer, 
    navigateAdmin, 
    searchQuery, 
    setSearchQuery,
    settings,
    categories
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateCustomer('products');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-emerald-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-emerald-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Timings: {settings.openingTime} - {settings.closingTime}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Order on Call: {settings.phone}</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-300 font-medium">
              <Percent className="w-3.5 h-3.5" />
              <span>Free Delivery above ₹{settings.freeDeliveryThreshold}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-700 hover:text-emerald-700 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            onClick={() => navigateCustomer('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-emerald-950 tracking-tight">My General Store</span>
              </div>
              <p className="text-[10px] font-medium text-emerald-700 leading-none">
                मेरी जनरल स्टोर • Fresh & Pure Kirana
              </p>
            </div>
          </button>
        </div>

        {/* Location Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-gray-700">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="leading-tight">
            <div className="text-[10px] text-gray-500 font-medium">Delivering to</div>
            <div className="font-semibold text-emerald-900 truncate max-w-[130px]">
              {currentUser?.address?.postalCode ? `${currentUser.address.city || 'India'} ${currentUser.address.postalCode}` : 'Gurugram 122001'}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Atta, Dal, Basmati Rice, Ghee, Masale..."
              className="w-full pl-10 pr-24 py-2 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 rounded-xl text-sm transition-all outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* User Account & Cart Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-gray-100 text-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-[10px] text-gray-500 font-medium">Namaste,</div>
                  <div className="text-xs font-bold text-gray-900 truncate max-w-[90px]">
                    {currentUser.displayName.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{currentUser.displayName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigateCustomer('profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigateCustomer('my-orders');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>My Orders</span>
                  </button>
                  {adminUser && (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigateAdmin('admin-dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-amber-700 bg-amber-50/60 hover:bg-amber-100 flex items-center gap-2.5 font-bold"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logoutCustomer();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigateCustomer('login')}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigateCustomer('register')}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile App Install Button */}
          <PWAInstallButton variant="header" />

          {/* Cart Button */}
          <button
            onClick={() => navigateCustomer('cart')}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-all hover:shadow-md"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-emerald-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalCartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left text-xs leading-none">
              <span className="block text-[10px] text-emerald-200">My Cart</span>
              <span className="font-bold text-white">{formatINR(cartTotals.total)}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-2.5 md:hidden">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Atta, Dal, Basmati Rice, Ghee..."
              className="w-full pl-9 pr-16 py-2 bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-lg text-xs outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 bg-emerald-700 text-white text-[11px] font-semibold rounded"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Category Bar */}
      <div className="border-t border-gray-100 bg-gray-50/70 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto py-2 text-xs scrollbar-none font-medium">
          <button
            onClick={() => navigateCustomer('home')}
            className="text-gray-700 hover:text-emerald-700 whitespace-nowrap"
          >
            Home
          </button>
          <button
            onClick={() => navigateCustomer('products')}
            className="text-gray-700 hover:text-emerald-700 whitespace-nowrap"
          >
            All Products
          </button>
          <button
            onClick={() => navigateCustomer('categories')}
            className="text-gray-700 hover:text-emerald-700 whitespace-nowrap font-semibold text-emerald-800"
          >
            Shop By Categories
          </button>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateCustomer('products', { categoryId: cat.id })}
              className="text-gray-600 hover:text-emerald-700 whitespace-nowrap"
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => navigateCustomer('my-orders')}
            className="text-gray-700 hover:text-emerald-700 whitespace-nowrap ml-auto"
          >
            Track Order
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-semibold">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Delivering in Gurugram, Delhi, NCR & major pincodes</span>
          </div>

          {/* Mobile Install App Button */}
          <PWAInstallButton variant="mobile" />

          <button
            onClick={() => { setMobileMenuOpen(false); navigateCustomer('home'); }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-md"
          >
            Home
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigateCustomer('products'); }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-md"
          >
            All Products
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigateCustomer('categories'); }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-md"
          >
            Product Categories
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigateCustomer('cart'); }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-md flex justify-between items-center"
          >
            <span>Shopping Cart</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold">
              {totalCartCount} items
            </span>
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigateCustomer('my-orders'); }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-md"
          >
            My Orders
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigateCustomer('profile'); }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-md"
          >
            My Profile
          </button>
          {adminUser && (
            <button
              onClick={() => { setMobileMenuOpen(false); navigateAdmin('admin-dashboard'); }}
              className="w-full text-left py-2 px-3 text-sm font-semibold text-amber-700 bg-amber-50/60 hover:bg-amber-100 rounded-md flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
