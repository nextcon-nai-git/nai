'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/**
 * Interface para retorno de erro opcional.
 */
type AuthErrorCallback = (error: any) => void;

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth, onError?: AuthErrorCallback): void {
  signInAnonymously(authInstance).catch((error) => {
    if (onError) onError(error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string,
  onError?: AuthErrorCallback
): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch((error) => {
    if (onError) onError(error);
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string,
  onError?: AuthErrorCallback
): void {
  signInWithEmailAndPassword(authInstance, email, password).catch((error) => {
    if (onError) onError(error);
  });
}
