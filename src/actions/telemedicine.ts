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
    // Tentamos primeiro a variável de string JSON (recomendado para Cloud)
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    let auth;
    if (serviceAccountJson && serviceAccountJson.trim() !== "") {
      try {
        const credentials = JSON.parse(serviceAccountJson);
        auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ["https://www.googleapis.com/auth/calendar.events"],
        });
      } catch (parseError) {
        return {
          sucesso: false,
          mensagem: "Erro de Configuração: O conteúdo de GOOGLE_SERVICE_ACCOUNT_JSON não é um JSON válido."
        };
      }
    } else {
      // Fallback para descoberta automática do Google SDK (procura por google-service-account.json)
      auth = new google.auth.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
      });
    }

    const calendar = google.calendar({ version: "v3", auth });

    // 2. Monta o evento da consulta para gerar link do Meet
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

    // 3. Dispara o pedido para o Google Calendar
    const responseGoogle = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: event,
    });

    // 4. Extrai o link do Google Meet gerado
    const linkDoMeet = responseGoogle.data.hangoutLink;

    if (!linkDoMeet) {
      throw new Error("O Google não retornou um link de Meet. Verifique as permissões da Conta de Serviço.");
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
    
    let mensagemAmigavel = "Erro interno ao gerar sala do Meet.";
    
    // Tratamento específico para erro de arquivo ausente
    if (error.message?.includes("ENOENT") || error.message?.includes("does not exist") || error.message?.includes("could not find the default credentials")) {
      mensagemAmigavel = "Erro de Credenciais: O arquivo 'google-service-account.json' não foi encontrado. Por favor, cole o conteúdo do seu JSON na variável GOOGLE_SERVICE_ACCOUNT_JSON no arquivo .env.";
    } else if (error.message?.includes("API")) {
      mensagemAmigavel = "Erro de API: Verifique se a 'Google Calendar API' está ativa no seu projeto do Google Cloud.";
    } else if (error.message) {
      mensagemAmigavel = error.message;
    }

    return {
      sucesso: false,
      mensagem: mensagemAmigavel
    };
  }
}
