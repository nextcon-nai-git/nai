'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** 
 * Inicia login por e-mail (não bloqueante). 
 * Utiliza try/catch interno para evitar que o NextJS intercepte a falha como um erro de runtime não tratado.
 */
export async function initiateEmailSignIn(
  authInstance: Auth, 
  email: string, 
  password: string, 
  onError?: (error: any) => void
): Promise<void> {
  try {
    await signInWithEmailAndPassword(authInstance, email, password);
  } catch (error: any) {
    if (onError) {
      onError(error);
    }
  }
}

/** Inicia login anônimo. */
export function initiateAnonymousSignIn(authInstance: Auth, onError?: (error: any) => void): void {
  signInAnonymously(authInstance).catch(onError);
}

/** Inicia cadastro por e-mail. */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, onError?: (error: any) => void): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch(onError);
}
