import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  PaymentRecord, 
  UserProfile, 
  StoreSettings, 
  InventoryLog,
  FirebaseConnectionStatus,
  OrderStatus,
  PaymentStatus
} from '../types/index.ts';
import { 
  initialCategories, 
  initialProducts, 
  initialOrders, 
  initialPayments, 
  initialCustomers, 
  initialStoreSettings 
} from '../services/mockData.ts';
import { getFirebaseConnectionStatus, isFirebaseConfigured, auth, db } from '../services/firebase/config.ts';
import { 
  registerCustomerWithEmail, 
  loginCustomerWithEmail, 
  signInCustomerWithGoogle, 
  loginAdminWithEmail as fbLoginAdminWithEmail, 
  loginAdminWithGoogle as fbLoginAdminWithGoogle, 
  logoutCustomer as fbLogoutCustomer, 
  logoutAdmin as fbLogoutAdmin,
  checkIsAdmin,
  STORE_OWNER_EMAIL
} from '../services/firebase/auth.ts';
import { 
  fetchProductsFromFirebase, 
  saveProductToFirebase, 
  deleteProductFromFirebase, 
  seedProductsToFirebase 
} from '../services/firebase/products.ts';
import { 
  fetchCategoriesFromFirebase, 
  saveCategoryToFirebase, 
  deleteCategoryFromFirebase, 
  seedCategoriesToFirebase 
} from '../services/firebase/categories.ts';
import { 
  createOrderInFirebase, 
  updateOrderStatusInFirebase 
} from '../services/firebase/orders.ts';
import { 
  createPaymentRecordInFirebase, 
  updatePaymentVerificationInFirebase 
} from '../services/firebase/payments.ts';
import { 
  logInventoryChangeToFirebase 
} from '../services/firebase/inventory.ts';
import {
  fetchStoreSettingsFromFirebase,
  saveStoreSettingsToFirebase
} from '../services/firebase/settings.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { calculateCartTotals, CartCalculationResult } from '../utils/calculations.ts';

export type CustomerPage = 
  | 'home' 
  | 'products' 
  | 'categories' 
  | 'product-details' 
  | 'cart' 
  | 'checkout' 
  | 'login' 
  | 'register' 
  | 'my-orders' 
  | 'profile';

export type AdminPage = 
  | 'admin-login' 
  | 'admin-dashboard' 
  | 'admin-products' 
  | 'admin-categories' 
  | 'admin-orders' 
  | 'admin-inventory' 
  | 'admin-customers' 
  | 'admin-payments' 
  | 'admin-reports' 
  | 'admin-settings';

export type ActiveView = 
  | { mode: 'customer'; page: CustomerPage; productId?: string; categoryId?: string }
  | { mode: 'admin'; page: AdminPage };

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Navigation & View
  view: ActiveView;
  navigateCustomer: (page: CustomerPage, options?: { productId?: string; categoryId?: string }) => void;
  navigateAdmin: (page: AdminPage) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;

  // Firebase status
  connectionStatus: FirebaseConnectionStatus;

  // Catalog
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotals: CartCalculationResult;

  // Auth & Profile
  currentUser: UserProfile | null;
  adminUser: UserProfile | null;
  loginCustomer: (email: string, pass: string) => boolean;
  registerCustomer: (email: string, pass: string, name: string, phone?: string) => boolean;
  loginCustomerWithFirebase: (email: string, pass: string) => Promise<boolean>;
  registerCustomerWithFirebase: (email: string, pass: string, name: string, phone?: string) => Promise<boolean>;
  loginCustomerWithGoogle: () => Promise<boolean>;
  logoutCustomer: () => Promise<void>;
  loginAdmin: (passcode: string) => boolean;
  loginAdminWithFirebase: (email: string, pass: string) => Promise<boolean>;
  loginAdminWithGoogle: () => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: { street: string; landmark?: string; city: string; state: string; postalCode: string };
    paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
    paymentTransactionId?: string;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Payments
  payments: PaymentRecord[];
  verifyPayment: (paymentId: string, status: PaymentStatus, notes?: string) => void;

  // Inventory & Audits
  inventoryLogs: InventoryLog[];
  restockProduct: (productId: string, quantityToAdd: number, notes?: string) => void;

  // Customers
  customers: UserProfile[];

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Catalog Synchronization & Reset
  syncCatalogToFirebase: () => Promise<boolean>;
  resetToDMartStock: () => void;

  // Search & Global state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'mgs_store_data_';
const CATALOG_STORAGE_VERSION = 'v6_fixed_product_images_accuracy_oil_and_brands';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [view, setView] = useState<ActiveView>({ mode: 'customer', page: 'home' });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Firebase connection
  const [connectionStatus] = useState<FirebaseConnectionStatus>(getFirebaseConnectionStatus());

  // Automatic Migration for new DMart & brand catalog
  const needsCatalogMigration = typeof window !== 'undefined' && 
    localStorage.getItem('mgs_catalog_version') !== CATALOG_STORAGE_VERSION;

  if (needsCatalogMigration) {
    try {
      localStorage.setItem('mgs_catalog_version', CATALOG_STORAGE_VERSION);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}products`, JSON.stringify(initialProducts));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}categories`, JSON.stringify(initialCategories));
    } catch (e) {
      console.warn('[Catalog Migration] notice:', e);
    }
  }

  // Catalog state with persistent hydration
  const [products, setProducts] = useState<Product[]>(() => {
    if (needsCatalogMigration) return initialProducts;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}products`);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (needsCatalogMigration) return initialCategories;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}categories`);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (needsCatalogMigration) {
      return [
        { product: initialProducts[0], quantity: 1 },
        { product: initialProducts[6], quantity: 1 }
      ];
    }
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}cart`);
    return saved ? JSON.parse(saved) : [
      { product: initialProducts[0], quantity: 1 },
      { product: initialProducts[6], quantity: 1 }
    ];
  });

  // Users state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}current_user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}admin_user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [customers, setCustomers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}customers`);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  // Orders & Payments
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}orders`);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}payments`);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  // Inventory logs
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}inventory_logs`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        productId: 'prod-toor-dal',
        productName: 'Tata Sampann Unpolished Toor Dal',
        changeType: 'restock',
        quantityDelta: 20,
        previousStock: 25,
        newStock: 45,
        notes: 'Monthly bulk shipment received from mandi warehouse',
        timestamp: '2026-10-10T11:00:00.000Z'
      }
    ];
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}settings`);
    return saved ? JSON.parse(saved) : initialStoreSettings;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}inventory_logs`, JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}current_user`);
    }
  }, [currentUser]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}admin_user`, JSON.stringify(adminUser));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}admin_user`);
    }
  }, [adminUser]);

  // Synchronize live Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isAdmin = await checkIsAdmin(fbUser.uid, fbUser.email);
        if (isAdmin) {
          const adminProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Store Administrator',
            role: 'admin',
            photoURL: fbUser.photoURL || undefined
          };
          setAdminUser(adminProfile);
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as UserProfile);
          } else {
            const customerProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
              role: isAdmin ? 'admin' : 'customer',
              photoURL: fbUser.photoURL || undefined
            };
            setCurrentUser(customerProfile);
          }
        } catch (e) {
          console.warn('[Firebase Auth] Could not fetch user profile document:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Synchronize live catalog with Firestore (Read-only for public storefront)
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    let isMounted = true;
    const initFirebaseData = async () => {
      try {
        const [remoteProds, remoteCats, remoteSettings] = await Promise.all([
          fetchProductsFromFirebase().catch(() => [] as Product[]),
          fetchCategoriesFromFirebase().catch(() => [] as Category[]),
          fetchStoreSettingsFromFirebase().catch(() => null)
        ]);

        if (!isMounted) return;

        // If remote catalog has records in Firestore, hydrate only if it's the updated catalog
        if (remoteProds && remoteProds.length > 0) {
          const hasLegacyStock = remoteProds.some(p => p.id === 'prod-toor-dal' || p.id === 'prod-atta-5kg');
          if (!hasLegacyStock && remoteProds.length >= 15) {
            setProducts(remoteProds);
          } else {
            console.log('[Firebase Sync] Detected previous legacy stock in Firestore. Keeping complete 36+ DMart & brand catalog.');
          }
        }

        if (remoteCats && remoteCats.length >= 8) {
          setCategories(remoteCats);
        }

        if (remoteSettings) {
          setSettings(remoteSettings);
        }
      } catch (err) {
        console.warn('[Firebase Sync] Notice during catalog fetch:', err);
      }
    };

    initFirebaseData();

    return () => {
      isMounted = false;
    };
  }, []);

  // When an authenticated Store Administrator signs in, if Firestore is completely empty, seed initial catalog
  useEffect(() => {
    if (!adminUser || !auth.currentUser || !isFirebaseConfigured()) return;

    let isMounted = true;
    const autoSeedForAdminIfEmpty = async () => {
      try {
        const prods = await fetchProductsFromFirebase().catch(() => [] as Product[]);
        if (!isMounted) return;
        if (prods.length === 0) {
          await seedProductsToFirebase(products.length > 0 ? products : initialProducts);
          await seedCategoriesToFirebase(categories.length > 0 ? categories : initialCategories);
          await saveStoreSettingsToFirebase(settings);
          console.log('[Firebase] Admin initial catalog & settings seeding completed.');
        }
      } catch (err) {
        console.warn('[Firebase Admin Seed Check] Notice:', err);
      }
    };

    autoSeedForAdminIfEmpty();

    return () => {
      isMounted = false;
    };
  }, [adminUser]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation handlers
  const navigateCustomer = (page: CustomerPage, options?: { productId?: string; categoryId?: string }) => {
    if (options?.productId) setSelectedProductId(options.productId);
    if (options?.categoryId !== undefined) setSelectedCategoryId(options.categoryId);
    setView({
      mode: 'customer',
      page,
      productId: options?.productId || selectedProductId || undefined,
      categoryId: options?.categoryId !== undefined ? options.categoryId : selectedCategoryId || undefined
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateAdmin = (page: AdminPage) => {
    setView({ mode: 'admin', page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      addToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        addToast(`Updated ${product.name} quantity to ${newQty}.`, 'success');
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const addQty = Math.min(product.stock, quantity);
        addToast(`Added ${product.name} to cart.`, 'success');
        return [...prevCart, { product, quantity: addQty }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from cart.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotals = calculateCartTotals(
    cart, 
    settings.freeDeliveryThreshold, 
    settings.defaultDeliveryFee, 
    settings.taxRatePercentage
  );

  // Authentication operations
  const loginCustomerWithFirebase = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const isOwner = cleanEmail === STORE_OWNER_EMAIL.toLowerCase();

    // Check if store owner logging in with master admin password
    if (isOwner && (pass === 'admin123' || pass === 'Admin@123')) {
      const adminProfile: UserProfile = {
        uid: 'admin-super-parvesh',
        email: STORE_OWNER_EMAIL,
        displayName: 'Parvesh Chauhan (Store Admin)',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z'
      };
      setAdminUser(adminProfile);
      setCurrentUser(adminProfile);
      addToast('Administrator privileges verified. Welcome, Parvesh Chauhan!', 'success');
      return true;
    }

    try {
      const res = await loginCustomerWithEmail(email, pass);
      if (isOwner) {
        const adminProfile: UserProfile = { ...res.user, role: 'admin' };
        setAdminUser(adminProfile);
        setCurrentUser(adminProfile);
        addToast(`Administrator privileges verified. Welcome, ${res.user.displayName}!`, 'success');
      } else {
        setCurrentUser(res.user);
        addToast(`Welcome back, ${res.user.displayName}!`, 'success');
      }
      return true;
    } catch (err: unknown) {
      // Graceful fallback for store owner with designated password
      if (isOwner && (pass === 'admin123' || pass === 'Admin@123')) {
        const adminProfile: UserProfile = {
          uid: 'admin-super-parvesh',
          email: STORE_OWNER_EMAIL,
          displayName: 'Parvesh Chauhan (Store Admin)',
          role: 'admin',
          createdAt: '2026-01-01T00:00:00.000Z'
        };
        setAdminUser(adminProfile);
        setCurrentUser(adminProfile);
        addToast('Administrator privileges verified. Welcome, Parvesh Chauhan!', 'success');
        return true;
      }
      const msg = err instanceof Error ? err.message : 'Customer login failed';
      addToast(msg, 'error');
      return false;
    }
  };

  const registerCustomerWithFirebase = async (
    email: string, 
    pass: string, 
    name: string, 
    phone?: string
  ): Promise<boolean> => {
    try {
      const res = await registerCustomerWithEmail(email, pass, name, phone);
      setCurrentUser(res.user);
      addToast(`Account created! Welcome to My General Store, ${res.user.displayName}!`, 'success');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      addToast(msg, 'error');
      return false;
    }
  };

  const loginCustomerWithGoogle = async (): Promise<boolean> => {
    try {
      const res = await signInCustomerWithGoogle();
      const isOwner = res.user.email?.trim().toLowerCase() === STORE_OWNER_EMAIL.toLowerCase();
      if (isOwner) {
        const adminProfile: UserProfile = {
          ...res.user,
          role: 'admin'
        };
        setAdminUser(adminProfile);
        setCurrentUser(adminProfile);
        addToast(`Admin authorized via Google as ${res.user.displayName}!`, 'success');
      } else {
        setCurrentUser(res.user);
        addToast(`Signed in with Google as ${res.user.displayName}!`, 'success');
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      addToast(msg, 'error');
      return false;
    }
  };

  const loginAdminWithFirebase = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fbLoginAdminWithEmail(email, pass);
      setAdminUser(res.admin);
      addToast(`Administrator privileges verified. Welcome, ${res.admin.displayName}!`, 'success');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Admin sign in failed';
      addToast(msg, 'error');
      return false;
    }
  };

  const loginAdminWithGoogle = async (): Promise<boolean> => {
    try {
      const res = await fbLoginAdminWithGoogle();
      setAdminUser(res.admin);
      addToast(`Admin authorized via Google as ${res.admin.displayName}!`, 'success');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Admin Google authentication failed';
      addToast(msg, 'error');
      return false;
    }
  };

  const loginCustomer = (email: string, pass: string): boolean => {
    if (!email || !pass) {
      addToast('Please enter both email and password.', 'error');
      return false;
    }
    const cleanEmail = email.trim().toLowerCase();
    const isOwner = cleanEmail === STORE_OWNER_EMAIL.toLowerCase();
    if (isOwner && (pass === 'admin123' || pass === 'Admin@123')) {
      const adminProfile: UserProfile = {
        uid: 'admin-super-parvesh',
        email: STORE_OWNER_EMAIL,
        displayName: 'Parvesh Chauhan (Store Admin)',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z'
      };
      setAdminUser(adminProfile);
      setCurrentUser(adminProfile);
      addToast('Administrator privileges verified. Welcome, Parvesh Chauhan!', 'success');
      return true;
    }

    const existing = customers.find((c) => c.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      addToast(`Welcome back, ${existing.displayName}!`, 'success');
      return true;
    }
    const newCust: UserProfile = {
      uid: 'cust-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newCust);
    setCustomers((prev) => [...prev, newCust]);
    addToast(`Signed in successfully as ${newCust.displayName}.`, 'success');
    return true;
  };

  const registerCustomer = (email: string, pass: string, name: string, phone?: string): boolean => {
    if (!email || !name || !pass) {
      addToast('Please fill in all required registration fields.', 'error');
      return false;
    }
    const newCust: UserProfile = {
      uid: 'cust-' + Date.now(),
      email,
      displayName: name,
      phoneNumber: phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) => [...prev, newCust]);
    setCurrentUser(newCust);
    addToast(`Account created for ${name}!`, 'success');
    return true;
  };

  const logoutCustomer = async () => {
    try {
      await fbLogoutCustomer();
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    setCurrentUser(null);
    addToast('You have been logged out.', 'info');
  };

  const loginAdmin = (passcode: string): boolean => {
    if (passcode.trim() === 'admin123' || passcode.trim() === 'storeadmin') {
      const admin: UserProfile = {
        uid: 'admin-super-1',
        email: STORE_OWNER_EMAIL,
        displayName: 'Store Manager',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z'
      };
      setAdminUser(admin);
      addToast('Admin authentication verified. Access granted to Store Backoffice.', 'success');
      return true;
    } else {
      addToast('Invalid admin security credentials. Access denied.', 'error');
      return false;
    }
  };

  const logoutAdmin = async () => {
    try {
      await fbLogoutAdmin();
    } catch (e) {
      console.warn('Firebase admin signout warning:', e);
    }
    setAdminUser(null);
    addToast('Admin session terminated.', 'info');
    navigateCustomer('home');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profile };
    setCurrentUser(updated);
    setCustomers((prev) => prev.map((c) => (c.uid === updated.uid ? updated : c)));
    addToast('Profile updated successfully.', 'success');
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProd: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts((prev) => [newProd, ...prev]);

    // Persist to Firebase if configured
    if (isFirebaseConfigured()) {
      saveProductToFirebase(newProd).catch((e) => console.warn('[Firebase] saveProduct notice:', e));
    }

    // Log initial inventory
    const initLog: InventoryLog = {
      id: 'log-' + Date.now(),
      productId: newProd.id,
      productName: newProd.name,
      changeType: 'adjustment',
      quantityDelta: newProd.stock,
      previousStock: 0,
      newStock: newProd.stock,
      notes: 'Initial product stock creation',
      timestamp: new Date().toISOString()
    };
    setInventoryLogs((prev) => [initLog, ...prev]);

    if (isFirebaseConfigured()) {
      logInventoryChangeToFirebase(initLog).catch((e) => console.warn('[Firebase] logInventory notice:', e));
    }

    addToast(`Product "${newProd.name}" added to catalog.`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let updatedProduct: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedProduct = { ...p, ...updates, updatedAt: new Date().toISOString() };
          return updatedProduct;
        }
        return p;
      })
    );

    if (isFirebaseConfigured() && updatedProduct) {
      saveProductToFirebase(updatedProduct).catch((e) => console.warn('[Firebase] updateProduct notice:', e));
    }

    addToast('Product catalog updated.', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isFirebaseConfigured()) {
      deleteProductFromFirebase(id).catch((e) => console.warn('[Firebase] deleteProduct notice:', e));
    }
    addToast('Product removed from catalog.', 'info');
  };

  // Categories CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: 'cat-' + Date.now()
    };
    setCategories((prev) => [...prev, newCat]);
    if (isFirebaseConfigured()) {
      saveCategoryToFirebase(newCat).catch((e) => console.warn('[Firebase] saveCategory notice:', e));
    }
    addToast(`Category "${newCat.name}" added.`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    let updatedCategory: Category | undefined;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          updatedCategory = { ...c, ...updates };
          return updatedCategory;
        }
        return c;
      })
    );
    if (isFirebaseConfigured() && updatedCategory) {
      saveCategoryToFirebase(updatedCategory).catch((e) => console.warn('[Firebase] updateCategory notice:', e));
    }
    addToast('Category updated.', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (isFirebaseConfigured()) {
      deleteCategoryFromFirebase(id).catch((e) => console.warn('[Firebase] deleteCategory notice:', e));
    }
    addToast('Category removed.', 'info');
  };

  // Order creation & status
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: { street: string; landmark?: string; city: string; state: string; postalCode: string };
    paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
    paymentTransactionId?: string;
    notes?: string;
  }): Order => {
    const orderNum = 'MGS-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const orderId = 'ord-' + Date.now();
    
    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNum,
      customerId: currentUser?.uid || 'guest-' + Date.now(),
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      items: [...cart],
      subtotal: cartTotals.subtotal,
      tax: cartTotals.tax,
      deliveryFee: cartTotals.deliveryFee,
      discount: cartTotals.discount,
      total: cartTotals.total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : (orderData.paymentTransactionId ? 'pending' : 'pending'),
      orderStatus: 'placed',
      paymentTransactionId: orderData.paymentTransactionId,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Deduct stock for ordered items and log
    cart.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.product.id) {
            const newStock = Math.max(0, p.stock - item.quantity);
            return {
              ...p,
              stock: newStock,
              inStock: newStock > 0
            };
          }
          return p;
        })
      );

      setInventoryLogs((prev) => [
        {
          id: 'log-' + Date.now() + Math.random().toString().substring(2, 5),
          productId: item.product.id,
          productName: item.product.name,
          changeType: 'sale',
          quantityDelta: -item.quantity,
          previousStock: item.product.stock,
          newStock: Math.max(0, item.product.stock - item.quantity),
          notes: `Deducted for Order ${orderNum}`,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    });

    // Create payment record
    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerId: newOrder.customerId,
      customerName: newOrder.customerName,
      amount: newOrder.total,
      paymentMethod: newOrder.paymentMethod,
      transactionReference: orderData.paymentTransactionId,
      status: 'pending',
      notes: orderData.paymentMethod === 'cod' ? 'Cash on Delivery - rider to collect' : 'Awaiting UPI verification against bank ledger',
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
    setPayments((prev) => [newPayment, ...prev]);

    // Persist order & payment record to Firebase if live
    if (isFirebaseConfigured()) {
      createOrderInFirebase(newOrder).catch((e) => console.warn('[Firebase] createOrder notice:', e));
      createPaymentRecordInFirebase(newPayment).catch((e) => console.warn('[Firebase] createPayment notice:', e));
    }

    clearCart();
    addToast(`Order ${orderNum} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o))
    );
    if (isFirebaseConfigured()) {
      updateOrderStatusInFirebase(orderId, status).catch((e) => console.warn('[Firebase] updateOrderStatus notice:', e));
    }
    addToast(`Order status updated to ${status.replace(/_/g, ' ')}.`, 'success');
  };

  // Payment verification
  const verifyPayment = (paymentId: string, status: PaymentStatus, notes?: string) => {
    const verifiedBy = adminUser?.displayName || 'Store Administrator';
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          return {
            ...p,
            status,
            notes: notes || p.notes,
            verifiedBy,
            verifiedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    if (isFirebaseConfigured()) {
      updatePaymentVerificationInFirebase(paymentId, status, verifiedBy, notes).catch((e) =>
        console.warn('[Firebase] verifyPayment notice:', e)
      );
    }

    // Sync order paymentStatus
    const targetPayment = payments.find((p) => p.id === paymentId);
    if (targetPayment) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === targetPayment.orderId) {
            const updatedOrderStatus = status === 'verified' && o.orderStatus === 'placed' ? 'confirmed' : o.orderStatus;
            if (isFirebaseConfigured()) {
              updateOrderStatusInFirebase(o.id, updatedOrderStatus).catch((e) => console.warn('[Firebase] updateOrder notice:', e));
            }
            return {
              ...o,
              paymentStatus: status,
              orderStatus: updatedOrderStatus,
              updatedAt: new Date().toISOString()
            };
          }
          return o;
        })
      );
    }

    addToast(`Payment marked as ${status}.`, 'success');
  };

  // Restocking inventory
  const restockProduct = (productId: string, quantityToAdd: number, notes?: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const newStock = prod.stock + quantityToAdd;
    const updatedProd: Product = { ...prod, stock: newStock, inStock: true, updatedAt: new Date().toISOString() };

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProd : p))
    );

    const newLog: InventoryLog = {
      id: 'log-' + Date.now(),
      productId: prod.id,
      productName: prod.name,
      changeType: 'restock',
      quantityDelta: quantityToAdd,
      previousStock: prod.stock,
      newStock: newStock,
      notes: notes || 'Warehouse stock replenishment',
      timestamp: new Date().toISOString()
    };

    setInventoryLogs((prev) => [newLog, ...prev]);

    if (isFirebaseConfigured()) {
      saveProductToFirebase(updatedProd).catch((e) => console.warn('[Firebase] restock saveProduct notice:', e));
      logInventoryChangeToFirebase(newLog).catch((e) => console.warn('[Firebase] restock logInventory notice:', e));
    }

    addToast(`Added ${quantityToAdd} units to ${prod.name}. New stock: ${newStock}.`, 'success');
  };

  // Store settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (isFirebaseConfigured() && auth.currentUser) {
      saveStoreSettingsToFirebase(updated).catch((e) => console.warn('[Firebase] Settings save notice:', e));
    }
    addToast('Store settings saved successfully.', 'success');
  };

  // Sync catalog to Firebase (Admin action)
  const syncCatalogToFirebase = async (): Promise<boolean> => {
    if (!isFirebaseConfigured()) {
      addToast('Firebase is not configured.', 'error');
      return false;
    }
    if (!auth.currentUser) {
      addToast('Please sign in as Store Administrator with Google or Email to sync to Firestore.', 'error');
      return false;
    }
    try {
      await Promise.all([
        seedProductsToFirebase(products),
        seedCategoriesToFirebase(categories),
        saveStoreSettingsToFirebase(settings)
      ]);
      addToast('Catalog & Store Details synchronized to Cloud Firestore successfully!', 'success');
      return true;
    } catch (err) {
      console.error('[Firebase Sync Error]', err);
      addToast('Failed to sync catalog. Please ensure your admin permissions are verified.', 'error');
      return false;
    }
  };

  // Reset catalog to DMart supermarket items (Admin & System action)
  const resetToDMartStock = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}products`, JSON.stringify(initialProducts));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}categories`, JSON.stringify(initialCategories));
      localStorage.setItem('mgs_catalog_version', CATALOG_STORAGE_VERSION);
      // Refresh cart to valid products
      setCart([
        { product: initialProducts[0], quantity: 1 },
        { product: initialProducts[6], quantity: 1 }
      ]);
    } catch (err) {
      console.warn('[resetToDMartStock] storage error:', err);
    }
    addToast('Stock reset to complete DMart Premia & top brands catalog (36 items)!', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        view,
        navigateCustomer,
        navigateAdmin,
        selectedProductId,
        setSelectedProductId,
        selectedCategoryId,
        setSelectedCategoryId,
        connectionStatus,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotals,
        currentUser,
        adminUser,
        loginCustomer,
        registerCustomer,
        loginCustomerWithFirebase,
        registerCustomerWithFirebase,
        loginCustomerWithGoogle,
        logoutCustomer,
        loginAdmin,
        loginAdminWithFirebase,
        loginAdminWithGoogle,
        logoutAdmin,
        updateUserProfile,
        orders,
        createOrder,
        updateOrderStatus,
        payments,
        verifyPayment,
        inventoryLogs,
        restockProduct,
        customers,
        settings,
        updateSettings,
        syncCatalogToFirebase,
        resetToDMartStock,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
