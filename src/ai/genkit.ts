import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

/**
 * @fileOverview Configuração central do motor Genkit 1.x para a Nextcon.
 * Ativa plugins de IA e telemetria do Firebase para monitoramento de fluxos.
 */

// Habilita o rastreamento e telemetria via Firebase (Genkit 1.x)
// Proteção contra erro de boot: só ativa se não estiver em ambiente de desenvolvimento local sem credenciais
if (process.env.NODE_ENV === 'production' || process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    enableFirebaseTelemetry();
  } catch (error) {
    // Silencia o erro para permitir o boot do Next.js sem crash
    console.warn("NAI Telemetry: Ignorando inicialização do GcpLogger por falta de credenciais físicas.");
  }
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
