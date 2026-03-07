'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

/**
 * Interface para os agendamentos da clínica.
 */
export interface Appointment {
  id: string;
  colaborador_id: string;
  colaborador_nome: string;
  data_hora: string;
  check_in_at?: string;
  tipo: 'Admissional' | 'Periódico' | 'Demissional' | 'Mudança de Função' | 'Retorno ao Trabalho';
  status: 'Agendado' | 'Em Espera' | 'Em Atendimento' | 'Concluído';
  check_in_realizado: boolean;
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

    // Define intervalo para o dia atual (00:00 às 23:59)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Consulta agendamentos de hoje ordenados por chegada (check_in_at)
    const q = query(
      collection(db, 'agendamentos'),
      where('data_hora', '>=', startOfToday.toISOString()),
      where('data_hora', '<=', endOfToday.toISOString()),
      orderBy('check_in_at', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointments: Appointment[] = [];
      snapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      
      setData(appointments);
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
