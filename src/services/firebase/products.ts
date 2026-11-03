import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config.ts';
import { handleFirestoreError, OperationType } from './firestoreErrors.ts';
import type { Product } from '../../types/index.ts';

const COLLECTION_NAME = 'products';

export async function fetchProductsFromFirebase(): Promise<Product[]> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }

  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTION_NAME);
  }
}

export async function fetchProductByIdFromFirebase(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }

  const docPath = `${COLLECTION_NAME}/${id}`;
  try {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Product;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, docPath);
  }
}

export async function saveProductToFirebase(product: Product): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping saveProductToFirebase: No authenticated Firebase admin session.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${product.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export async function deleteProductFromFirebase(productId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping deleteProductFromFirebase: No authenticated Firebase admin session.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${productId}`;
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
  }
}

export async function seedProductsToFirebase(productsList: Product[], purgeOldStock: boolean = true): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping seedProductsToFirebase: Operation requires an authenticated admin session.');
    return;
  }

  try {
    if (purgeOldStock) {
      const existingSnap = await getDocs(collection(db, COLLECTION_NAME));
      if (!existingSnap.empty) {
        const deleteBatch = writeBatch(db);
        existingSnap.docs.forEach((d) => deleteBatch.delete(d.ref));
        await deleteBatch.commit();
      }
    }

    const batch = writeBatch(db);
    for (const prod of productsList) {
      const docRef = doc(db, COLLECTION_NAME, prod.id);
      batch.set(docRef, prod);
    }
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, COLLECTION_NAME);
  }
}
