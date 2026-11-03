export type UserRole = 'customer' | 'admin';

export interface UserAddress {
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  address?: UserAddress;
  role: UserRole;
  createdAt?: string;
  photoURL?: string;
}

export interface AdminUser extends UserProfile {
  role: 'admin';
  permissions?: string[];
  adminAssignedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  hindiName?: string;
  slug: string;
  iconName?: string;
  image: string;
  description: string;
  itemCount: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  description: string;
  mrp: number; // Maximum Retail Price in INR (₹)
  price: number; // Selling price in INR (₹)
  unit: string; // e.g. "1 kg", "500 g", "5 L"
  stock: number;
  minStockAlert: number;
  inStock: boolean;
  image: string;
  rating: number;
  reviewCount: number;
  tags?: string[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'placed' 
  | 'confirmed' 
  | 'packing' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking';

export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'rejected' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: UserAddress;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentTransactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  status: PaymentStatus;
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  changeType: 'restock' | 'sale' | 'adjustment' | 'damaged';
  quantityDelta: number;
  previousStock: number;
  newStock: number;
  notes?: string;
  timestamp: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  ownerName?: string;
  ownerEmail?: string;
  phone: string;
  email: string;
  address: string;
  deliveryPincodes: string[];
  freeDeliveryThreshold: number;
  defaultDeliveryFee: number;
  taxRatePercentage: number;
  upiId: string;
  upiName: string;
  upiQrImageUrl?: string;
  upiDisplayMode?: 'dynamic' | 'custom_image' | 'both';
  youpiPgEndpoint?: string;
  openingTime: string;
  closingTime: string;
  isStoreOpen: boolean;
  minOrderAmount: number;
}

export interface FirebaseConnectionStatus {
  isConfigured: boolean;
  projectId?: string;
  statusText: string;
  mode: 'live' | 'architecture_prototype';
}
