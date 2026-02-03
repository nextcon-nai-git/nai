'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** Inicia login anônimo (não bloqueante). */
export function initiateAnonymousSignIn(authInstance: Auth, onError?: (error: any) => void): void {
  signInAnonymously(authInstance).catch(onError);
}

/** Inicia cadastro por e-mail (não bloqueante). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, onError?: (error: any) => void): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch(onError);
}

/** Inicia login por e-mail (não bloqueante). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, onError?: (error: any) => void): void {
  // Chamada direta para evitar tela de erro do NextJS em caso de falha de credenciais
  signInWithEmailAndPassword(authInstance, email, password).catch((error) => {
    if (onError) {
      onError(error);
    }
  });
}
