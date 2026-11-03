import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { ProductCard } from '../../components/common/ProductCard.tsx';
import { formatINR } from '../../utils/calculations.ts';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus,
  CheckCircle2,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    navigateCustomer, 
    addToCart, 
    cart, 
    updateCartQuantity 
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  // Find target product or fallback
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Product not found.</p>
        <button
          onClick={() => navigateCustomer('products')}
          className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold"
        >
          View All Products
        </button>
      </div>
    );
  }

  const cartItem = cart.find((item) => item.product.id === product.id);
  const discountPercent = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.minStockAlert;

  // Related items from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

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
    <div className="space-y-10">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <button onClick={() => navigateCustomer('home')} className="hover:text-emerald-700">Home</button>
        <span>/</span>
        <button onClick={() => navigateCustomer('products')} className="hover:text-emerald-700">Products</button>
        <span>/</span>
        <button 
          onClick={() => navigateCustomer('products', { categoryId: product.categoryId })} 
          className="hover:text-emerald-700"
        >
          {product.categoryName}
        </button>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Image */}
        <div className="md:col-span-5 lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-emerald-50/40 border border-gray-100 aspect-square">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getFallbackImage();
              }}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                {discountPercent}% OFF • DMart Price
              </span>
            )}
            {isOutOfStock ? (
              <span className="absolute top-4 right-4 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="absolute top-4 right-4 bg-amber-500 text-white font-bold text-xs px-3 py-1 rounded-full animate-pulse">
                Only {product.stock} units remaining
              </span>
            ) : null}
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Genuine Certified
            </span>
            <span className="text-emerald-700 font-semibold">Fresh Kirana Stock</span>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Brand: {product.brand}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>
            {product.hindiName && (
              <p className="text-sm font-semibold text-emerald-800">
                {product.hindiName}
              </p>
            )}

            {/* Pack Unit */}
            <div className="pt-1">
              <span className="text-xs text-gray-500 block mb-1">Pack Size / Net Quantity:</span>
              <span className="inline-block px-3 py-1 rounded-lg border-2 border-emerald-600 bg-emerald-50 text-emerald-900 text-xs font-bold">
                {product.unit}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="pt-3 pb-2 border-y border-gray-100 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-950">
                  {formatINR(product.price)}
                </span>
                {product.mrp > product.price && (
                  <span className="text-base text-gray-400 line-through">
                    MRP: {formatINR(product.mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save {formatINR(product.mrp - product.price)} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400">Inclusive of all Indian taxes (GST)</p>
            </div>

            {/* Product Description */}
            <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">About This Item</h4>
              <p>{product.description}</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity selector */}
              {!cartItem ? (
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-xs min-w-[32px] text-center text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              {/* Add to Cart button or Cart Stepper */}
              {cartItem ? (
                <div className="flex items-center gap-3 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <div className="flex items-center bg-emerald-700 text-white rounded-lg px-2 py-1.5 shadow-xs">
                    <button
                      onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                      className="p-1 hover:bg-emerald-800 rounded transition-colors"
                      aria-label="Decrease quantity in cart"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-bold text-sm min-w-[28px] text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                      disabled={cartItem.quantity >= product.stock}
                      className="p-1 hover:bg-emerald-800 rounded transition-colors disabled:opacity-40"
                      aria-label="Increase quantity in cart"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-emerald-900">In Cart</span>
                  <button
                    onClick={() => navigateCustomer('cart')}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline ml-2"
                  >
                    View Cart →
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-6 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Shopping Cart'}</span>
                </button>
              )}
            </div>

            {/* Delivery & return features */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Doorstep delivery in 2 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>Easy replacement on package defects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Similar Products from {product.categoryName}</h3>
            <button
              onClick={() => navigateCustomer('products', { categoryId: product.categoryId })}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              See all in {product.categoryName} →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
