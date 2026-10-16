import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import type { FirebaseConnectionStatus } from '../../types/index.ts';
import firebaseConfig from '../../../firebase-applet-config.json';

// Initialize Firebase App
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Must use firestoreDatabaseId from firebaseConfig
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth: Auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Test initial connection as per Firebase skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Connection offline. Please verify Firebase project connection.');
    }
  }
}

testConnection();

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.projectId && firebaseConfig.projectId !== 'remixed-project-id');
}

export function getFirebaseConnectionStatus(): FirebaseConnectionStatus {
  if (isFirebaseConfigured()) {
    return {
      isConfigured: true,
      projectId: firebaseConfig.projectId,
      statusText: `Firebase Live Firestore Connected (${firebaseConfig.projectId})`,
      mode: 'live'
    };
  }

  return {
    isConfigured: false,
    projectId: undefined,
    statusText: 'Local Architecture Mode',
    mode: 'architecture_prototype'
  };
}

export { app };
