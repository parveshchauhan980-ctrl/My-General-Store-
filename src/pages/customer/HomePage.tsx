import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { ProductCard } from '../../components/common/ProductCard.tsx';
import { CategoryCard } from '../../components/common/CategoryCard.tsx';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  BadgeCheck, 
  Clock, 
  Flame, 
  ShoppingBag,
  Percent
} from 'lucide-react';
import { formatINR } from '../../utils/calculations.ts';

export const HomePage: React.FC = () => {
  const { products, categories, navigateCustomer, settings } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured || p.rating >= 4.8).slice(0, 8);
  const dmartPremiaProducts = products.filter((p) => p.brand === 'DMart Premia').slice(0, 4);
  const bestDalsAndAtta = products.filter((p) => p.categoryId === 'cat-dals' || p.categoryId === 'cat-atta').slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>100% Shudh Desi Kirana & Daily Staples</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Pure & Fresh Kirana, <br />
                <span className="text-emerald-300">Delivered to Your Doorstep</span>
              </h1>
              <p className="text-sm sm:text-base text-emerald-100 max-w-xl font-normal leading-relaxed">
                शुद्ध चक्की आटा, दालें, बासमती चावल, शुद्ध देसी घी और खड़े मसाले • Premium grocery staples delivered fresh at wholesale mandi prices.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateCustomer('products')}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop All Groceries</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateCustomer('categories')}
                className="px-5 py-3 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl border border-emerald-600/50 backdrop-blur-xs transition-all"
              >
                Browse Categories
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-700/60 text-xs">
              <div>
                <p className="font-extrabold text-lg text-amber-300">₹{settings.freeDeliveryThreshold}+</p>
                <p className="text-emerald-200 text-[11px]">Free Home Delivery</p>
              </div>
              <div>
                <p className="font-extrabold text-lg text-emerald-200">2 Hours</p>
                <p className="text-emerald-200 text-[11px]">Express Kirana Slot</p>
              </div>
              <div>
                <p className="font-extrabold text-lg text-emerald-200">100%</p>
                <p className="text-emerald-200 text-[11px]">Genuine Mandi Stock</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                alt="Indian grocery store staples"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs rounded-xl p-3.5 text-gray-900 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Today's Special Deal</span>
                  <p className="text-xs font-bold">Pure Aashirvaad Atta + Toor Dal Combo</p>
                  <p className="text-[11px] text-gray-500">Save extra ₹80 on daily monthly staples</p>
                </div>
                <button
                  onClick={() => navigateCustomer('products')}
                  className="px-3 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition-colors shrink-0"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Categories</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Shop by Daily Essentials
            </h2>
          </div>
          <button
            onClick={() => navigateCustomer('categories')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Bestsellers */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Top Selling Groceries & Daily Needs
            </h2>
          </div>
          <button
            onClick={() => navigateCustomer('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>See All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* DMart Premia Super Saver Spotlight */}
      {dmartPremiaProducts.length > 0 && (
        <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>DMart Exclusive Savings</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                DMart Premia Quality Collection
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
                Highest purity pulses, grains, pure ghee, and dry fruits tested in certified food labs at direct factory pricing.
              </p>
            </div>
            <button
              onClick={() => navigateCustomer('products')}
              className="self-start sm:self-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-xl shadow-lg transition-all"
            >
              Shop DMart Premia
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dmartPremiaProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Atta & Dals Section Banner */}
      <section className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">
              Kitchen Foundation
            </span>
            <h3 className="text-xl font-black text-emerald-950 mt-1">
              Unpolished Dals & Stone-Ground Chakki Atta
            </h3>
            <p className="text-xs text-emerald-800/80 mt-0.5">
              Natural protein, unadulterated nutrients, and softest rotis for your family.
            </p>
          </div>
          <button
            onClick={() => navigateCustomer('products', { categoryId: 'cat-dals' })}
            className="self-start sm:self-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            Explore Dals & Pulses
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestDalsAndAtta.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Indian Store Trust Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">Direct From Mandi & Mills</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              We source directly from farmer producer organizations and trusted brands like Tata Sampann, Aashirvaad, and Amul.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">Same Day Delivery</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Order before 6 PM and get your groceries delivered to your kitchen counter on the very same day.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">True Kirana Pricing</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Get maximum savings with below-MRP wholesale prices on daily sugar, oil, pulses, and spices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
