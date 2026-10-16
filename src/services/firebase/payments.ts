import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config.ts';
import { handleFirestoreError, OperationType } from './firestoreErrors.ts';
import type { PaymentRecord, PaymentStatus } from '../../types/index.ts';

const COLLECTION_NAME = 'payments';

export async function createPaymentRecordInFirebase(payment: PaymentRecord): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping createPaymentRecordInFirebase: No authenticated Firebase session.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${payment.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, payment.id);
    await setDoc(docRef, payment);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, docPath);
  }
}

export async function fetchAllPaymentsFromFirebase(): Promise<PaymentRecord[]> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    return [];
  }

  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRecord));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTION_NAME);
  }
}

export async function updatePaymentVerificationInFirebase(
  paymentId: string, 
  status: PaymentStatus, 
  adminName: string,
  notes?: string
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured');
  }
  if (!auth.currentUser) {
    console.warn('[Firebase] Skipping updatePaymentVerificationInFirebase: No authenticated Firebase admin session.');
    return;
  }

  const docPath = `${COLLECTION_NAME}/${paymentId}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, paymentId);
    await updateDoc(docRef, {
      status,
      verifiedBy: adminName,
      verifiedAt: new Date().toISOString(),
      ...(notes ? { notes } : {})
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, docPath);
  }
}
