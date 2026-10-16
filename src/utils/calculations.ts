import type { CartItem } from '../types/index.ts';

export interface CartCalculationResult {
  subtotal: number;
  mrpTotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  isFreeDelivery: boolean;
  amountNeededForFreeDelivery: number;
}

/**
 * Calculates cart subtotal, discount against MRP, taxes, delivery fee, and final payable amount.
 */
export function calculateCartTotals(
  items: CartItem[],
  freeDeliveryThreshold: number = 500,
  defaultDeliveryFee: number = 40,
  taxRatePercentage: number = 5
): CartCalculationResult {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const mrpTotal = items.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const discount = Math.max(0, mrpTotal - subtotal);
  
  if (items.length === 0) {
    return {
      subtotal: 0,
      mrpTotal: 0,
      discount: 0,
      tax: 0,
      deliveryFee: 0,
      total: 0,
      isFreeDelivery: false,
      amountNeededForFreeDelivery: freeDeliveryThreshold
    };
  }

  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : defaultDeliveryFee;
  const amountNeededForFreeDelivery = isFreeDelivery ? 0 : freeDeliveryThreshold - subtotal;
  
  // Tax calculated on subtotal (standard Indian GST practice for grocery)
  const tax = Math.round((subtotal * (taxRatePercentage / 100)) * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

  return {
    subtotal,
    mrpTotal,
    discount,
    tax,
    deliveryFee,
    total,
    isFreeDelivery,
    amountNeededForFreeDelivery
  };
}

/**
 * Determines stock inventory status badge.
 */
export function getInventoryStatus(stock: number, minThreshold: number = 5): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= minThreshold) return 'low_stock';
  return 'in_stock';
}

/**
 * Validates whether requested quantity is valid for current stock.
 */
export function validateQuantity(quantity: number, stock: number): { valid: boolean; adjustedQuantity: number } {
  if (quantity <= 0) {
    return { valid: false, adjustedQuantity: 0 };
  }
  if (quantity > stock) {
    return { valid: false, adjustedQuantity: stock };
  }
  return { valid: true, adjustedQuantity: quantity };
}

/**
 * Formats Indian Rupee (INR) amount with commas and ₹ symbol.
 */
export function formatINR(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(rounded);
}
