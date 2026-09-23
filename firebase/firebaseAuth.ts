import { getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  initializeAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from 'firebase/auth';
// @ts-ignore - RN-only export; present at runtime (dist/rn/index.rn.d.ts) but not always resolved by the editor's TS server
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // initializeAuth throws if it was already called (e.g. fast refresh) - fall back to the existing instance
  auth = getAuth(app);
}

export const signInWithFirebaseEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return { error };
  }
};

export const sendFirebasePasswordResetEmail = async ({
  email,
}: {
  email: string;
}) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {};
  } catch (error: any) {
    return { error };
  }
};

export const createFirebaseUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return { error };
  }
};

export const signOutFirebase = async () => {
  try {
    await signOut(auth);
    return {};
  } catch (error: any) {
    return { error };
  }
};

export const reauthenticateFirebaseUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return { error: { code: 'auth/user-not-found' } };
    }

    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(currentUser, credential);
    return {};
  } catch (error: any) {
    return { error };
  }
};

export const deleteFirebaseUser = async () => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return { error: { code: 'auth/user-not-found' } };
    }

    await deleteUser(currentUser);
    return { uid: currentUser.uid };
  } catch (error: any) {
    return { error };
  }
};

// mirrors src/components/loginPage/login/firebase-utils.js's errors map
export const firebaseErrors: Record<string, string> = {
  'auth/invalid-credential': 'Incorrect password. Please try again.',
  'auth/invalid-email':
    'We do not have a record of this email. Please create an account, or sign in with Google.',
  'auth/user-not-found':
    'We do not have a record of this email. Please create an account, or sign in with Google.',
  'auth/email-already-in-use':
    'This email is already in use. Please log in using your existing email and password.',
  'auth/missing-password': 'Please enter your password',
  'auth/weak-password':
    'Password should be at least 6 characters. Please enter a stronger password.',
  'auth/wrong-password':
    'This password does not match the one we have on file for this email. Please try again.',
  'auth/requires-recent-login':
    'Please log in again and try deleting your account.',
};

export const GENERIC_AUTH_ERROR =
  "We're sorry, an unknown error has occured. Please contact info@highlandsmusicfestival.ca.";
