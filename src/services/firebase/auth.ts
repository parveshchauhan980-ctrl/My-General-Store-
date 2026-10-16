import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider, isFirebaseConfigured } from './config.ts';
import { handleFirestoreError, OperationType } from './firestoreErrors.ts';
import type { UserProfile, UserRole, AdminUser } from '../../types/index.ts';

// Designated store owner / bootstrap admin email
export const STORE_OWNER_EMAIL = 'parveshchauhan980@gmail.com';

/**
 * Checks whether a given user holds admin role.
 * Verifies against Firestore `/admins/{uid}` OR matching designated store owner email.
 */
export async function checkIsAdmin(uid: string, email?: string | null): Promise<boolean> {
  // Check designated store owner email
  if (email && email.toLowerCase() === STORE_OWNER_EMAIL.toLowerCase()) {
    return true;
  }

  if (!isFirebaseConfigured() || !db) {
    return false;
  }

  try {
    const adminDocRef = doc(db, 'admins', uid);
    const snap = await getDoc(adminDocRef);
    return snap.exists();
  } catch (err) {
    console.error('[Firebase Auth] Failed to verify admin document:', err);
    return false;
  }
}

/**
 * Registers a new customer with Email & Password.
 * Strictly assigns role 'customer'.
 */
export async function registerCustomerWithEmail(
  email: string, 
  pass: string, 
  displayName: string,
  phoneNumber?: string
): Promise<{ user: UserProfile }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName });

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName: displayName || email.split('@')[0],
      phoneNumber: phoneNumber || '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    // Store profile in Firestore /users/{uid}
    const userPath = `users/${cred.user.uid}`;
    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    } catch (fsErr) {
      handleFirestoreError(fsErr, OperationType.WRITE, userPath);
    }

    return { user: newProfile };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    throw new Error(message);
  }
}

/**
 * Signs in customer with Email & Password.
 */
export async function loginCustomerWithEmail(email: string, pass: string): Promise<{ user: UserProfile }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;
    const userPath = `users/${uid}`;

    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return { user: snap.data() as UserProfile };
      }
    } catch (fsErr) {
      handleFirestoreError(fsErr, OperationType.GET, userPath);
    }

    // Default profile if document hasn't been written yet
    const fallbackProfile: UserProfile = {
      uid,
      email: cred.user.email || email,
      displayName: cred.user.displayName || email.split('@')[0],
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', uid), fallbackProfile);
    return { user: fallbackProfile };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sign in failed';
    throw new Error(message);
  }
}

/**
 * Customer Google Sign-In flow (using pre-configured Google OAuth).
 */
export async function signInCustomerWithGoogle(): Promise<{ user: UserProfile }> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const fbUser = result.user;
    const uid = fbUser.uid;
    const userPath = `users/${uid}`;

    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return { user: snap.data() as UserProfile };
      }
    } catch (fsErr) {
      handleFirestoreError(fsErr, OperationType.GET, userPath);
    }

    // Create profile in Firestore
    const profile: UserProfile = {
      uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
      photoURL: fbUser.photoURL || undefined,
      phoneNumber: fbUser.phoneNumber || undefined,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', uid), profile);
    } catch (fsErr) {
      handleFirestoreError(fsErr, OperationType.WRITE, userPath);
    }

    return { user: profile };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Google sign-in failed';
    throw new Error(message);
  }
}

/**
 * Admin Sign-In with Email & Password.
 * Strictest role enforcement: checks that user is an admin.
 * If unauthorized, immediately terminates auth session and rejects.
 */
export async function loginAdminWithEmail(email: string, pass: string): Promise<{ admin: AdminUser }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;

    const isAdmin = await checkIsAdmin(uid, cred.user.email);
    if (!isAdmin) {
      await fbSignOut(auth);
      throw new Error('Access Denied: Your account does not have Store Administrator privileges.');
    }

    // If store owner, bootstrap admin document if it doesn't exist
    if (cred.user.email?.toLowerCase() === STORE_OWNER_EMAIL.toLowerCase()) {
      try {
        await setDoc(doc(db, 'admins', uid), {
          uid,
          email: cred.user.email,
          displayName: cred.user.displayName || 'Store Owner Admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Could not write admin doc:', e);
      }
    }

    const adminUser: AdminUser = {
      uid,
      email: cred.user.email || email,
      displayName: cred.user.displayName || 'Store Administrator',
      role: 'admin',
      permissions: ['ALL_ACCESS']
    };

    return { admin: adminUser };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Admin sign in failed';
    throw new Error(message);
  }
}

/**
 * Admin Sign-In with Google.
 * Strictly verifies admin role before granting access.
 */
export async function loginAdminWithGoogle(): Promise<{ admin: AdminUser }> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const fbUser = result.user;
    const uid = fbUser.uid;

    const isAdmin = await checkIsAdmin(uid, fbUser.email);
    if (!isAdmin) {
      await fbSignOut(auth);
      throw new Error('Access Denied: Your Google account is not registered as a Store Administrator.');
    }

    // Provision admin doc if store owner
    if (fbUser.email?.toLowerCase() === STORE_OWNER_EMAIL.toLowerCase()) {
      try {
        await setDoc(doc(db, 'admins', uid), {
          uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Store Owner',
          role: 'admin',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Could not write admin doc:', e);
      }
    }

    const adminUser: AdminUser = {
      uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || 'Store Administrator',
      photoURL: fbUser.photoURL || undefined,
      role: 'admin',
      permissions: ['ALL_ACCESS']
    };

    return { admin: adminUser };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Admin Google authentication failed';
    throw new Error(message);
  }
}

/**
 * Customer Sign Out flow
 */
export async function logoutCustomer(): Promise<void> {
  await fbSignOut(auth);
}

/**
 * Admin Sign Out flow
 */
export async function logoutAdmin(): Promise<void> {
  await fbSignOut(auth);
}
