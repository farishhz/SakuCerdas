import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

const apiKey      = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain  = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId   = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket     = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId       = import.meta.env.VITE_FIREBASE_APP_ID;

/** True only when all required env vars are present */
export const firebaseConfigured =
  Boolean(apiKey && authDomain && projectId && storageBucket && messagingSenderId && appId);

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;

if (firebaseConfigured) {
  try {
    app = initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId });
    _auth = getAuth(app);
  } catch (err) {
    console.error('[Firebase] Initialization failed:', err);
  }
}

export const auth           = _auth;
export const googleProvider = new GoogleAuthProvider();
