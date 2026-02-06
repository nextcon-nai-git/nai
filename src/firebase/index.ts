'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

/**
 * Inicializa os serviços do Firebase de forma resiliente.
 * Garante que o StorageBucket seja explicitamente definido para evitar erros de 'no-default-bucket'.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      // Tenta inicializar via App Hosting (Env Vars)
      firebaseApp = initializeApp();
    } catch (e) {
      // Fallback para o objeto de configuração manual
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    // Força o uso do bucket definido no config para evitar erro de inicialização parcial
    storage: getStorage(firebaseApp, firebaseConfig.storageBucket)
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