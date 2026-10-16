import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config.ts';
import { handleFirestoreError, OperationType } from './firestoreErrors.ts';
import type { Category } from '../../types/index.ts';

const COLLECTION_NAME = 'categories';

export async function fetchCategoriesFromFirebase(): Promise<Category[]> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }

  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTION_NAME);
  }
}

export async function saveCategoryToFirebase(category: Category): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping saveCategoryToFirebase: No authenticated Firebase admin session.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${category.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, category.id);
    await setDoc(docRef, category, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export async function deleteCategoryFromFirebase(categoryId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping deleteCategoryFromFirebase: No authenticated Firebase admin session.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${categoryId}`;
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, categoryId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
  }
}

export async function seedCategoriesToFirebase(categoriesList: Category[]): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping seedCategoriesToFirebase: Operation requires an authenticated admin session.');
    return;
  }

  try {
    const batch = writeBatch(db);
    for (const cat of categoriesList) {
      const docRef = doc(db, COLLECTION_NAME, cat.id);
      batch.set(docRef, cat, { merge: true });
    }
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, COLLECTION_NAME);
  }
}
