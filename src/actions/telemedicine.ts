
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
    // 1. Verificação de Credenciais
    // Para funcionar em produção, o arquivo definido em GOOGLE_APPLICATION_CREDENTIALS deve existir
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return {
        sucesso: false,
        mensagem: "Configuração incompleta: O arquivo 'google-service-account.json' não foi localizado na raiz do servidor."
      };
    }

    // 2. Autenticação do Sistema com o Google Cloud (Service Account)
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/calendar.events"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // 3. Monta o evento da consulta para gerar link do Meet
    const event = {
      summary: tituloConsulta || "Videoconsulta Nextcon",
      description: "Consulta agendada via plataforma Nextcon Saúde.",
      start: {
        dateTime: dataHoraInicio,
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

    // 4. Dispara o pedido para o Google Calendar
    // O calendarId "primary" refere-se ao calendário da conta de serviço ou e-mail delegado
    const responseGoogle = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: event,
    });

    // 5. Extrai o link do Google Meet gerado
    const linkDoMeet = responseGoogle.data.hangoutLink;

    if (!linkDoMeet) {
      throw new Error("O Google não retornou um link de Meet. Certifique-se de que a conta de serviço tem permissão para criar conferências.");
    }

    // 6. Inicializa o Firestore e salva o registro
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
    
    let mensagemAmigavel = "Erro interno ao gerar sala do Meet.";
    if (error.message?.includes("credentials") || error.message?.includes("token")) {
      mensagemAmigavel = "Erro de Autenticação: Verifique se o arquivo JSON da Service Account está correto.";
    } else if (error.message?.includes("API")) {
      mensagemAmigavel = "Erro de API: Verifique se a 'Google Calendar API' está ativa no Google Cloud Console.";
    } else if (error.message) {
      mensagemAmigavel = error.message;
    }

    return {
      sucesso: false,
      mensagem: mensagemAmigavel
    };
  }
}
