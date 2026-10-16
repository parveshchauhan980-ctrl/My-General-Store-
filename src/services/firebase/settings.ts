import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config.ts';
import { handleFirestoreError, OperationType } from './firestoreErrors.ts';
import type { StoreSettings } from '../../types/index.ts';
import { initialStoreSettings } from '../mockData.ts';

const SETTINGS_DOC_ID = 'store_config';

/**
 * Fetches store settings from Firestore /settings/store_config
 */
export async function fetchStoreSettingsFromFirebase(): Promise<StoreSettings | null> {
  if (!isFirebaseConfigured() || !db) {
    return null;
  }

  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as StoreSettings;
    }
    return null;
  } catch (error) {
    console.warn('[Firebase] Could not fetch store settings, falling back to local:', error);
    return null;
  }
}

/**
 * Saves store settings to Firestore. Requires authenticated admin.
 */
export async function saveStoreSettingsToFirebase(settings: StoreSettings): Promise<boolean> {
  if (!isFirebaseConfigured() || !db || !auth.currentUser) {
    return false;
  }

  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser.email || auth.currentUser.uid
    }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings');
    return false;
  }
}
