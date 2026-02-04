'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Padrão Singleton para evitar o erro "FIRESTORE INTERNAL ASSERTION FAILED"
let memoizedApp: FirebaseApp | undefined;
let memoizedAuth: Auth | undefined;
let memoizedFirestore: Firestore | undefined;
let memoizedStorage: FirebaseStorage | undefined;

/**
 * Inicializa o Firebase garantindo que as instâncias sejam únicas (Singleton).
 * Resolve problemas de asserção interna e conflitos durante o Hot Reload.
 */
export function initializeFirebase() {
  if (!memoizedApp) {
    memoizedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
    memoizedAuth = getAuth(memoizedApp);
    memoizedFirestore = getFirestore(memoizedApp);
    memoizedStorage = getStorage(memoizedApp);
  }

  return {
    firebaseApp: memoizedApp,
    auth: memoizedAuth!,
    firestore: memoizedFirestore!,
    storage: memoizedStorage!
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
