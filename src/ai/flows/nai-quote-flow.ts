'use server';
/**
 * @fileOverview NAI Commercial Intelligence - Gerador de Orçamentos via IA.
 * 
 * - generateNaiQuote - Função que analisa as necessidades da empresa e recomenda serviços.
 * - DadosEmpresaInput - O esquema de entrada para os dados da empresa.
 * - OrcamentoOutput - O esquema de saída para o orçamento gerado.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DadosEmpresaInputSchema = z.object({
  nomeEmpresa: z.string(),
  nomeSolicitante: z.string().describe("Nome da pessoa que está pedindo o orçamento"),
  cidade: z.string(),
  estado: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  quantidadeFuncionarios: z.number().describe("Número total de funcionários"),
  grauDeRisco: z.number().min(1).max(4).describe("Grau de Risco da empresa (1 a 4)"),
  necessidades: z.string().describe("O que o cliente pediu (ex: 'Preciso de laudos e exames para uma operadora de saúde')")
});
export type DadosEmpresaInput = z.infer<typeof DadosEmpresaInputSchema>;

const OrcamentoOutputSchema = z.object({
  mensagemIntrodutoria: z.string().describe("Uma saudação amigável da NAI explicando a análise"),
  servicosRecomendados: z.array(
    z.object({
      categoria: z.string().describe("Ex: Auditoria Médica, Programas de Gestão, Laudos Técnicos"),
      nomeServico: z.string().describe("Ex: Consultoria Médica de Autorização"),
      justificativaLegal: z.string().describe("Por que a empresa precisa disso? (Citar a NR ou RN da ANS)"),
      valorEstimado: z.number().describe("Valor sugerido em Reais (R$)")
    })
  ),
  valorTotalMensal: z.number().optional().describe("Se houver taxa mensal (eSocial/Gestão)"),
  valorTotalAvulso: z.number().describe("Soma dos serviços pontuais (Laudos/Programas/Pareceres)"),
  dicaDaNai: z.string().describe("Uma dica extra de segurança ou alerta de multa do eSocial/ANS")
});
export type OrcamentoOutput = z.infer<typeof OrcamentoOutputSchema>;

const quotePrompt = ai.definePrompt({
  name: 'naiQuotePrompt',
  input: { schema: DadosEmpresaInputSchema },
  output: { schema: OrcamentoOutputSchema },
  prompt: `Você é a NAI (Nextcon AI), a inteligência artificial especialista em Saúde, Segurança do Trabalho (SST) e Auditoria Médica da plataforma Nextcon.
Seu objetivo é analisar os dados de uma empresa e montar um orçamento consultivo e vendedor.

DADOS DA EMPRESA E SOLICITANTE:
- Empresa: {{{nomeEmpresa}}}
- Solicitante: {{{nomeSolicitante}}}
- Localização: {{{cidade}}} - {{{estado}}}
- Funcionários: {{{quantidadeFuncionarios}}}
- Grau de Risco: {{{grauDeRisco}}}
- Necessidades Informadas: "{{{necessidades}}}"

REGRAS DE PRECIFICAÇÃO (Baseie-se nisso para gerar valores realistas):
- PGR e PCMSO: Valor base R$ 600 + (R$ 30 * número de funcionários) * multiplicador de risco (Risco 1=1x, Risco 4=2x).
- LTCAT: R$ 800 fixo + R$ 150 por cargo/função diferente estimada.
- Auditoria Médica/Pareceres: R$ 150 a R$ 500 por análise/junta.
- Treinamentos (NR-35, NR-10): Média de R$ 150 a R$ 300 por aluno.
- Gestão de eSocial (Eventos 2210, 2220, 2240): Mensalidade de R$ 20 por funcionário.

PORTFÓLIO DISPONÍVEL:
1. Programas: PGR, PCMSO, PCA, PPR.
2. Laudos: LTCAT, LIP (Insalubridade), LPP (Periculosidade), AET (Ergonomia).
3. Auditoria Médica: Consultoria Médica de Autorização, Segunda Opinião Médica, Junta Médica (RN 424), Consultoria Técnica Retrospectiva, Parecer para Demandas Judiciais, Consultoria OPME.
4. Treinamentos: CIPA, EPI, NR-10, NR-33, NR-35.
5. Gestão: eSocial, Gestão de Afastados.

INSTRUÇÕES:
1. Monte um orçamento estruturado indicando os serviços ESSENCIAIS e OBRIGATÓRIOS para o perfil dessa empresa, além dos que ela pediu.
2. Para operadoras de saúde ou Unimeds, priorize Auditoria Médica e Segunda Opinião.
3. Cite as justificativas legais (NRs ou RNs da ANS).
4. Calcule os totais separando o que é avulso (projetos) do que é mensal (gestão).
5. Use um tom profissional e autoritário. Comece cumprimentando o {{{nomeSolicitante}}}.`,
});

export async function generateNaiQuote(input: DadosEmpresaInput): Promise<OrcamentoOutput> {
  const { output } = await quotePrompt(input);
  if (!output) throw new Error('A NAI não conseguiu gerar o orçamento agora.');
  return output;
}

ai.defineFlow(
  {
    name: 'naiQuoteFlow',
    inputSchema: DadosEmpresaInputSchema,
    outputSchema: OrcamentoOutputSchema,
  },
  async input => {
    return generateNaiQuote(input);
  }
);
