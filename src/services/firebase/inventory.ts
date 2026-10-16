import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config.ts';
import { handleFirestoreError, OperationType } from './firestoreErrors.ts';
import type { InventoryLog } from '../../types/index.ts';

const COLLECTION_NAME = 'inventory_logs';

export async function logInventoryChangeToFirebase(log: InventoryLog): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping logInventoryChangeToFirebase: No authenticated Firebase admin session.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${log.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, log.id);
    await setDoc(docRef, log);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, docPath);
  }
}

export async function fetchInventoryLogsFromFirebase(): Promise<InventoryLog[]> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    return [];
  }

  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryLog));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTION_NAME);
  }
}
