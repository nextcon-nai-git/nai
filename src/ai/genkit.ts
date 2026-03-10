import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

/**
 * @fileOverview Configuração central do motor Genkit 1.x para a Nextcon.
 * Ativa plugins de IA e telemetria do Firebase para monitoramento de fluxos.
 */

// Habilita o rastreamento e telemetria via Firebase (Genkit 1.x)
// Proteção robusta: evita falha crítica se o GcpLogger não encontrar credenciais físicas
const shouldEnableTelemetry = 
  process.env.NODE_ENV === 'production' || 
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON || 
  process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (shouldEnableTelemetry) {
  try {
    enableFirebaseTelemetry();
    console.log("NAI Telemetry: Sistema de monitoramento ativado.");
  } catch (error) {
    // Silencia o erro para permitir o boot do Next.js sem crash caso o arquivo de credenciais esteja ausente
    console.warn("NAI Telemetry: Ignorando inicialização do GcpLogger para evitar crash por falta de arquivo de credenciais. O sistema usará Application Default Credentials (ADC) se disponível.");
  }
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
