import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import type { Product } from '../../types/index.ts';
import { formatINR } from '../../utils/calculations.ts';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateCartQuantity, navigateCustomer } = useStore();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const discountPercent = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.minStockAlert;

  const handleOpenDetails = () => {
    navigateCustomer('product-details', { productId: product.id });
  };

  const getFallbackImage = () => {
    switch (product.categoryId) {
      case 'cat-ghee-oil':
        return 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=600&auto=format&fit=crop&q=80';
      case 'cat-dals':
        return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';
      case 'cat-atta':
        return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
      case 'cat-rice':
        return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80';
      case 'cat-spices':
        return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80';
      case 'cat-snacks':
        return 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80';
      case 'cat-tea':
        return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80';
      case 'cat-dry-fruits':
        return 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80';
      case 'cat-cleaning':
        return 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80';
      case 'cat-personal-care':
        return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';
      default:
        return 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=600&auto=format&fit=crop&q=80';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        {discountPercent > 0 ? (
          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
            {discountPercent}% OFF
          </span>
        ) : <span />}

        {isOutOfStock ? (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
            Only {product.stock} left
          </span>
        ) : null}
      </div>

      {/* Image Container */}
      <button
        onClick={handleOpenDetails}
        className="relative w-full pt-[80%] bg-emerald-50/30 overflow-hidden cursor-pointer"
        aria-label={`View details for ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = getFallbackImage();
          }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </button>

      {/* Product Content */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Brand & Hindi Name */}
        <div className="flex items-center justify-between text-[11px] mb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            {product.brand === 'DMart Premia' && (
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[9px] px-1.5 py-0.2 rounded uppercase">
                Premia
              </span>
            )}
          </div>
          {product.hindiName && (
            <span className="text-gray-500 font-medium text-[11px] truncate max-w-[120px]">
              {product.hindiName}
            </span>
          )}
        </div>

        {/* Product Title */}
        <button
          onClick={handleOpenDetails}
          className="text-left font-bold text-sm text-gray-900 hover:text-emerald-700 line-clamp-2 leading-snug mb-1 transition-colors"
        >
          {product.name}
        </button>

        {/* Pack Unit & Rating */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium text-gray-700">
            {product.unit}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-emerald-950">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
            {product.mrp > product.price && (
              <span className="text-[10px] text-emerald-700 font-bold block leading-none">
                DMart Price • Save {formatINR(product.mrp - product.price)}
              </span>
            )}
          </div>

          {/* Cart Stepper or Add Button */}
          {cartItem ? (
            <div className="flex items-center bg-emerald-700 text-white rounded-lg px-1.5 py-1 shadow-xs">
              <button
                onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                className="p-1 hover:bg-emerald-800 rounded transition-colors"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-bold text-xs min-w-[20px] text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                disabled={cartItem.quantity >= product.stock}
                className="p-1 hover:bg-emerald-800 rounded transition-colors disabled:opacity-40"
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
