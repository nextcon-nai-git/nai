'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { MedicalAppointment } from '@/types/schema';

/**
 * Hook para monitoramento da fila de atendimento médico em tempo real.
 * Filtra agendamentos do dia atual e ordena pelo início da espera.
 */
export function useAppointmentsQueue() {
  const db = useFirestore();
  const [data, setData] = useState<MedicalAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) return;

    // Calcula o início e fim do dia de hoje para o filtro
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'agendamentos'),
      where('data_hora', '>=', startOfToday.toISOString()),
      where('data_hora', '<=', endOfToday.toISOString()),
      orderBy('data_hora', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const appointments: MedicalAppointment[] = [];
        snapshot.forEach((doc) => {
          appointments.push({ id: doc.id, ...doc.data() } as MedicalAppointment);
        });
        
        // Ordena em memória por check_in_at para garantir que os que chegaram primeiro apareçam antes
        const sorted = appointments.sort((a, b) => {
          if (!a.check_in_at) return 1;
          if (!b.check_in_at) return -1;
          return new Date(a.check_in_at).getTime() - new Date(b.check_in_at).getTime();
        });

        setData(sorted);
        setLoading(false);
      },
      (err) => {
        console.error("Erro na fila real-time:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  return { data, loading, error };
}