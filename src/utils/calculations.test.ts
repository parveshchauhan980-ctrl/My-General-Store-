import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals, getInventoryStatus, validateQuantity, formatINR } from './calculations.ts';
import type { Product } from '../types/index.ts';

const mockProductA: Product = {
  id: 'prod-1',
  name: 'Tata Sampann Toor Dal',
  hindiName: 'अरहर दाल',
  brand: 'Tata Sampann',
  categoryId: 'cat-dal',
  categoryName: 'Dals & Pulses',
  description: 'Unpolished Toor Dal',
  mrp: 190,
  price: 165,
  unit: '1 kg',
  stock: 25,
  minStockAlert: 5,
  inStock: true,
  image: 'https://images.unsplash.com/photo-1585994192701-f1a505c8b7be?w=400&q=80',
  rating: 4.8,
  reviewCount: 142,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockProductB: Product = {
  id: 'prod-2',
  name: 'Aashirvaad Superior MP Shudh Chakki Atta',
  hindiName: 'गेहूं का आटा',
  brand: 'Aashirvaad',
  categoryId: 'cat-flour',
  categoryName: 'Atta & Flours',
  description: '100% whole wheat atta',
  mrp: 295,
  price: 260,
  unit: '5 kg',
  stock: 4,
  minStockAlert: 5,
  inStock: true,
  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  rating: 4.9,
  reviewCount: 310,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

test('empty cart calculates to zero totals', () => {
  const result = calculateCartTotals([], 500, 40, 5);
  assert.equal(result.subtotal, 0);
  assert.equal(result.total, 0);
  assert.equal(result.deliveryFee, 0);
  assert.equal(result.isFreeDelivery, false);
});

test('subtotal below free delivery threshold applies delivery fee', () => {
  const items = [{ product: mockProductA, quantity: 2 }]; // 165 * 2 = 330
  const result = calculateCartTotals(items, 500, 40, 5);
  
  assert.equal(result.subtotal, 330);
  assert.equal(result.mrpTotal, 380); // 190 * 2
  assert.equal(result.discount, 50); // 380 - 330
  assert.equal(result.deliveryFee, 40);
  assert.equal(result.isFreeDelivery, false);
  assert.equal(result.amountNeededForFreeDelivery, 170); // 500 - 330
  assert.equal(result.tax, 16.5); // 5% of 330
  assert.equal(result.total, 386.5); // 330 + 40 + 16.5
});

test('subtotal meeting free delivery threshold waives delivery fee', () => {
  const items = [
    { product: mockProductA, quantity: 2 }, // 330
    { product: mockProductB, quantity: 1 }  // 260 => total 590
  ];
  const result = calculateCartTotals(items, 500, 40, 5);
  
  assert.equal(result.subtotal, 590);
  assert.equal(result.deliveryFee, 0);
  assert.equal(result.isFreeDelivery, true);
  assert.equal(result.amountNeededForFreeDelivery, 0);
  assert.equal(result.tax, 29.5); // 5% of 590
  assert.equal(result.total, 619.5); // 590 + 0 + 29.5
});

test('inventory status categorization works correctly', () => {
  assert.equal(getInventoryStatus(0, 5), 'out_of_stock');
  assert.equal(getInventoryStatus(-2, 5), 'out_of_stock');
  assert.equal(getInventoryStatus(3, 5), 'low_stock');
  assert.equal(getInventoryStatus(5, 5), 'low_stock');
  assert.equal(getInventoryStatus(6, 5), 'in_stock');
});

test('quantity validation adjusts excess requests to stock ceiling', () => {
  assert.deepEqual(validateQuantity(3, 10), { valid: true, adjustedQuantity: 3 });
  assert.deepEqual(validateQuantity(15, 10), { valid: false, adjustedQuantity: 10 });
  assert.deepEqual(validateQuantity(0, 10), { valid: false, adjustedQuantity: 0 });
});

test('formatINR formats currency symbol and commas correctly', () => {
  const formatted = formatINR(1250);
  assert.match(formatted, /1,250|1250/);
});
