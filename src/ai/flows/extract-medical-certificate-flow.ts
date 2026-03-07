'use server';
/**
 * @fileOverview Fluxo NAI para extração de dados estruturados de atestados médicos.
 * 
 * - extractMedicalCertificate - Função que analisa o texto e extrai entidades.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractCertificateInputSchema = z.object({
  rawText: z.string().describe('O texto bruto extraído do atestado médico (via OCR ou cópia).'),
});

const ExtractCertificateOutputSchema = z.object({
  nomePaciente: z.string().describe('Nome completo do paciente localizado no documento.'),
  cid: z.string().optional().describe('Código CID-10 identificado.'),
  diasAfastamento: z.number().describe('Quantidade de dias de repouso/afastamento recomendados.'),
  dataAtestado: z.string().describe('Data de emissão do atestado (YYYY-MM-DD).'),
});

export type ExtractCertificateOutput = z.infer<typeof ExtractCertificateOutputSchema>;

export async function extractMedicalCertificate(input: { rawText: string }): Promise<ExtractCertificateOutput> {
  return extractMedicalCertificateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractMedicalCertificatePrompt',
  input: {schema: ExtractCertificateInputSchema},
  output: {schema: ExtractCertificateOutputSchema},
  prompt: `Você é a NAI, assistente de inteligência artificial da Nextcon especializada em auditoria de documentos de RH e SST.
Sua missão é ler o texto de um atestado médico e extrair os dados necessários para o lançamento no eSocial.

TEXTO DO ATESTADO:
{{{rawText}}}

INSTRUÇÕES:
1. Identifique o Nome do Paciente em CAIXA ALTA.
2. Identifique o código CID-10 (Ex: M54.5, Z76.3). Se não houver, deixe em branco.
3. Extraia o número de dias de afastamento (Ex: "3 dias", "três dias"). Retorne apenas o número.
4. Formate a data do atestado como string ISO (YYYY-MM-DD).
5. Se houver ambiguidade, priorize a informação que parece mais oficial (carimbos/assinaturas mencionadas).`,
});

const extractMedicalCertificateFlow = ai.defineFlow(
  {
    name: 'extractMedicalCertificateFlow',
    inputSchema: ExtractCertificateInputSchema,
    outputSchema: ExtractCertificateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error('A NAI não conseguiu localizar dados válidos neste atestado.');
    return output;
  }
);