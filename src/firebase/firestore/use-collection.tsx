'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * Hook profissional para subscrição em tempo real de coleções Firestore.
 * Suporta consultas globais (Collection Groups) e fornece erros contextuais ricos.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: (CollectionReference<DocumentData> | Query<DocumentData>) | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  const [data, setData] = useState<ResultItemType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (serverError: FirestoreError) => {
        let path = 'collection-group';
        try {
          const anyQuery = memoizedTargetRefOrQuery as any;
          // Tenta extrair o nome do grupo de forma resiliente
          if (anyQuery?._query?.collectionGroup) {
            path = `group:${anyQuery._query.collectionGroup}`;
          } else if (anyQuery?.path) {
            path = anyQuery.path;
          } else if (anyQuery?._query?.path) {
            // Fallback para paths internos do SDK
            path = anyQuery._query.path.canonicalString?.() || 'complex-query';
          }
        } catch (e) {
          path = 'complex-query';
        }

        if (serverError.code === 'permission-denied') {
          try {
            const contextualError = new FirestorePermissionError({
              operation: 'list',
              path: path || 'collection-group',
            } satisfies SecurityRuleContext);

            setError(contextualError);
            // Emitimos o erro para ser capturado pelo Error Boundary Listener
            // Isso aciona o global-error.tsx ou error.tsx mais próximo
            errorEmitter.emit('permission-error', contextualError);
          } catch (e) {
            // Fallback caso a criação do erro contextual falhe (evita crash infinito)
            setError(serverError);
          }
        } else {
          setError(serverError);
        }
        
        setData(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}