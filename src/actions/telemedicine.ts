'use server';

/**
 * @fileOverview Server Action para integração com Google Meet API.
 * Responsável por gerar salas virtuais e salvar agendamentos no Firestore.
 */

import { google } from 'googleapis';
import { initializeFirebase } from '@/firebase/init';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function agendarConsultaMeet(data: {
  pacienteEmail: string;
  medicoEmail: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  tituloConsulta?: string;
}) {
  const { pacienteEmail, medicoEmail, dataHoraInicio, dataHoraFim, tituloConsulta } = data;

  try {
    // 1. Autenticação do Sistema com o Google Cloud (Service Account)
    // Nota: Em produção, as credenciais devem estar em variáveis de ambiente.
    // Ex: credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!)
    const auth = new google.auth.GoogleAuth({
      // No ambiente de prototipagem, assumimos que o arquivo existe ou as envs estão setadas
      scopes: ["https://www.googleapis.com/auth/calendar.events"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // 2. Monta o evento da consulta para gerar link do Meet
    const event = {
      summary: tituloConsulta || "Videoconsulta Nextcon",
      description: "Consulta agendada via plataforma Nextcon Saúde.",
      start: {
        dateTime: dataHoraInicio, // Formato ISO: '2026-03-01T10:00:00-03:00'
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: dataHoraFim, 
        timeZone: "America/Sao_Paulo",
      },
      attendees: [
        { email: medicoEmail },
        { email: pacienteEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: `consulta-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    // 3. Dispara o pedido para o Google Calendar
    const responseGoogle = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1, // Obrigatório para gerar o link do Meet
      requestBody: event,
    });

    // 4. Extrai o link do Google Meet gerado
    const linkDoMeet = responseGoogle.data.hangoutLink;

    if (!linkDoMeet) {
      throw new Error("Não foi possível obter o link do Meet do Google.");
    }

    // 5. Inicializa o Firestore e salva o registro
    const { firestore } = initializeFirebase();
    const docRef = await addDoc(collection(firestore, "agendamentos_telemedicina"), {
      paciente_email: pacienteEmail,
      medico_email: medicoEmail,
      inicio: Timestamp.fromDate(new Date(dataHoraInicio)),
      fim: Timestamp.fromDate(new Date(dataHoraFim)),
      link_meet: linkDoMeet,
      status: "agendada",
      createdAt: Timestamp.now()
    });

    return {
      sucesso: true,
      id_consulta: docRef.id,
      link_meet: linkDoMeet
    };

  } catch (error: any) {
    console.error("Erro na integração Google Meet:", error);
    return {
      sucesso: false,
      mensagem: error.message || "Erro interno ao gerar sala do Meet."
    };
  }
}