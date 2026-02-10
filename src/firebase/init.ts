'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

/**
 * Inicializa os serviços do Firebase de forma resiliente.
 * Isolado em arquivo próprio para evitar dependências circulares com o index.ts.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      // Tenta inicializar via App Hosting (Env Vars)
      firebaseApp = initializeApp();
    } catch (e) {
      // Fallback para o objeto de configuração manual
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
