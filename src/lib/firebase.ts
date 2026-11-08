import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as ReactNativeAuth from '@firebase/auth';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
export let auth: Auth | null = null;
export let db: Firestore | null = null;

if (isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  if (Platform.OS === 'web') auth = getAuth(app);
  else {
    try {
      const persistence = (ReactNativeAuth as typeof ReactNativeAuth & { getReactNativePersistence(storage: typeof AsyncStorage): unknown }).getReactNativePersistence(AsyncStorage);
      auth = initializeAuth(app, { persistence: persistence as never });
    } catch {
      // Fast Refresh can attempt to initialize the same Auth instance twice.
      auth = getAuth(app);
    }
  }
  db = getFirestore(app);
}

export function requireFirebase() {
  if (!auth || !db) throw new Error('Firebase nije konfiguriran. Kopirajte .env.example u .env i unesite vrijednosti.');
  return { auth, db };
}
