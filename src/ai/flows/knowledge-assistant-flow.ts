
'use server';
/**
 * @fileOverview Assistente especializada em Normas Regulamentadoras (NRs) e legislação de SST atualizado para 2026.
 * 
 * - runKnowledgeAssistant - Função que responde dúvidas sobre NRs.
 * - KnowledgeInput - Entrada: Pergunta do usuário.
 * - KnowledgeOutput - Saída: Resposta fundamentada com citações das normas.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KnowledgeInputSchema = z.object({
  query: z.string().describe('A dúvida técnica sobre SST ou NRs.'),
});
export type KnowledgeInput = z.infer<typeof KnowledgeInputSchema>;

const KnowledgeOutputSchema = z.object({
  answer: z.string().describe('Resposta detalhada e técnica.'),
  references: z.array(z.string()).describe('Lista de NRs, itens ou decretos citados.'),
  advice: z.string().describe('Conselho estratégico para a empresa Nextcon.'),
});
export type KnowledgeOutput = z.infer<typeof KnowledgeOutputSchema>;

const prompt = ai.definePrompt({
  name: 'knowledgeAssistantPrompt',
  input: {schema: KnowledgeInputSchema},
  output: {schema: KnowledgeOutputSchema},
  prompt: `Você é a NAI, a assistente técnica de inteligência artificial sênior da empresa Nextcon Saúde Empresarial. 
Sua especialidade é o Direito do Trabalho, Segurança e Saúde Ocupacional (SST) e legislação previdenciária, com foco na base legal atualizada de 2026.

PERGUNTA: {{{query}}}

INSTRUÇÕES:
1. Responda de forma técnica, porém objetiva, considerando as revisões das NRs ocorridas até 2026.
2. Cite sempre o número da NR ou o Decreto correspondente.
3. Se a pergunta for sobre eSocial, mencione os eventos vigentes (S-2210, S-2220, S-2240).
4. No campo 'advice', dê uma dica prática de como a empresa pode aplicar isso para gerar valor ao cliente.
5. Use um tom de autoridade e confiança.`,
});

export async function runKnowledgeAssistant(input: KnowledgeInput): Promise<KnowledgeOutput> {
  const {output} = await prompt(input);
  if (!output) {
    throw new Error('A NAI não pôde processar sua dúvida agora.');
  }
  return output;
}

ai.defineFlow(
  {
    name: 'knowledgeAssistantFlow',
    inputSchema: KnowledgeInputSchema,
    outputSchema: KnowledgeOutputSchema,
  },
  async input => {
    return runKnowledgeAssistant(input);
  }
);
