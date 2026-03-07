'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export interface Appointment {
  id: string;
  agendamento_id?: string;
  colaborador_nome: string;
  tipo: string;
  status: 'Agendado' | 'Em Espera' | 'Em Atendimento' | 'Concluído';
  data_hora: string;
  check_in_at?: string;
  companyId: string;
}

/**
 * Hook para monitoramento em tempo real da fila de atendimentos do dia.
 */
export function useAppointmentsQueue() {
  const db = useFirestore();
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) return;

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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointments: Appointment[] = [];
      snapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      
      // Ordena em memória por status de chegada para "Em Espera"
      const sorted = appointments.sort((a, b) => {
        if (a.status === 'Em Espera' && b.status === 'Em Espera') {
          return (a.check_in_at || '') > (b.check_in_at || '') ? 1 : -1;
        }
        return 0;
      });

      setData(sorted);
      setLoading(false);
    }, (err) => {
      console.error("Fila Real-time Error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  return { data, loading, error };
}