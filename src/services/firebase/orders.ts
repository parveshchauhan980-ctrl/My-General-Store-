import { collection, doc, getDocs, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config.ts';
import { handleFirestoreError, OperationType } from './firestoreErrors.ts';
import type { Order, OrderStatus } from '../../types/index.ts';

const COLLECTION_NAME = 'orders';

export async function createOrderInFirebase(order: Order): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping createOrderInFirebase: Guest order, no authenticated Firebase session.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${order.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, order.id);
    await setDoc(docRef, order);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, docPath);
  }
}

export async function fetchCustomerOrdersFromFirebase(customerId: string): Promise<Order[]> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    return [];
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('customerId', '==', customerId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function fetchAllOrdersFromFirebase(): Promise<Order[]> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    return [];
  }

  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTION_NAME);
  }
}

export async function updateOrderStatusInFirebase(orderId: string, status: OrderStatus): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping updateOrderStatusInFirebase: User not authenticated in Firebase.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${orderId}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(docRef, {
      orderStatus: status,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, docPath);
  }
}
