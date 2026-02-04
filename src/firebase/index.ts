
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Singleton SDK instances to prevent internal assertion failures during HMR or multiple calls
let memoizedSdks: ReturnType<typeof getSdks> | undefined;

/**
 * Initializes Firebase and returns the singleton instances of services.
 * Ensures services are only initialized once on the client to avoid "Unexpected state" errors.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Basic initialization for SSR
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getSdks(app);
  }

  // Client-side singleton pattern
  if (!memoizedSdks) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    memoizedSdks = getSdks(app);
  }

  return memoizedSdks;
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
