
'use server';
/**
 * @fileOverview Analisador de conformidade eSocial (S-2240 vs S-2220) usando Gemini.
 * 
 * - runEsocialAudit - Função que audita inconsistências entre riscos e exames.
 * - EsocialAuditInput - Entrada: Lista de riscos e exames encontrados.
 * - EsocialAuditOutput - Saída: Relatório de gaps e impacto jurídico.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EsocialAuditInputSchema = z.object({
  riskList: z.array(z.string()).describe('Lista de perigos/riscos identificados no PGR.'),
  examList: z.array(z.string()).describe('Lista de exames médicos realizados no PCMSO.'),
  sector: z.string().describe('Setor ou GHE analisado.'),
});
export type EsocialAuditInput = z.infer<typeof EsocialAuditInputSchema>;

const EsocialAuditOutputSchema = z.object({
  complianceScore: z.number().describe('Score de conformidade de 0 a 100.'),
  criticalGaps: z.array(z.object({
    description: z.string(),
    legalImpact: z.string(),
    recommendation: z.string(),
  })).describe('Lista de inconsistências críticas encontradas.'),
  aiInsight: z.string().describe('Resumo estratégico da IA para o gestor.'),
});
export type EsocialAuditOutput = z.infer<typeof EsocialAuditOutputSchema>;

export async function runEsocialAudit(input: EsocialAuditInput): Promise<EsocialAuditOutput> {
  return esocialAuditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'esocialAuditPrompt',
  input: {schema: EsocialAuditInputSchema},
  output: {schema: EsocialAuditOutputSchema},
  prompt: `Você é um auditor sênior de SST e eSocial. Analise o cruzamento entre os Riscos do PGR e os Exames do PCMSO para o setor {{{sector}}}.

DADOS:
- Riscos Identificados: {{#each riskList}} - {{{this}}} {{/each}}
- Exames Encontrados: {{#each examList}} - {{{this}}} {{/each}}

INSTRUÇÕES:
1. Identifique se existe algum risco que exige um exame obrigatório pela NR-07 (ex: Ruído exige Audiometria, Poeiras exigem RX Tórax).
2. Se o exame estiver faltando, aponte como "Gap Crítico".
3. Calcule o Score de Compliance (100% se todos os riscos tiverem exames correspondentes).
4. Cite o impacto jurídico (multas eSocial) no campo legalImpact.`,
});

const esocialAuditFlow = ai.defineFlow(
  {
    name: 'esocialAuditFlow',
    inputSchema: EsocialAuditInputSchema,
    outputSchema: EsocialAuditOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
