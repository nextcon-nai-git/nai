
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

/**
 * @fileOverview Configuração central do motor Genkit 1.x para a Nextcon.
 * Ativa plugins de IA e telemetria do Firebase para monitoramento de fluxos.
 */

// Habilita o rastreamento e telemetria via Firebase (Genkit 1.x)
const shouldEnableTelemetry = 
  process.env.NODE_ENV === 'production' || 
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON || 
  process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (shouldEnableTelemetry) {
  try {
    // Tenta inicializar, mas falha graciosamente se os logs da nuvem estiverem inacessíveis
    enableFirebaseTelemetry();
    console.log("NAI Telemetry: Sistema de monitoramento ativado.");
  } catch (error) {
    console.warn("NAI Telemetry: Aviso de inicialização da telemetria (ignorado para evitar crash).");
  }
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
