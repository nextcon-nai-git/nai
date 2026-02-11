'use server';
/**
 * @fileOverview NAI Storage Manager - Inteligência para organização de arquivos.
 * 
 * - extractStorageData: Interpreta comandos de voz/texto para estruturação de pastas.
 * - StorageManagerOutput: Retorna os metadados para execução no cliente.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StorageManagerInputSchema = z.string().describe("Comando para criação de pasta ou organização de arquivos. Ex: 'Crie a pasta do projeto AM_VEGA para o cliente Time Now, CNPJ 01.208.413/0001-29'");

const StorageManagerOutputSchema = z.object({
  cnpjLimpo: z.string().describe("O CNPJ contendo apenas números."),
  nomeProjeto: z.string().describe("O nome do projeto ou subpasta."),
  nomeEmpresa: z.string().describe("O nome da empresa."),
  caminhoStorage: z.string().describe("O caminho completo sugerido para o Storage."),
  placeholderContent: z.string().describe("Conteúdo para o arquivo de informação do projeto."),
});

export type StorageManagerOutput = z.infer<typeof StorageManagerOutputSchema>;

const prompt = ai.definePrompt({
  name: 'storageManagerPrompt',
  input: {schema: z.object({ query: z.string() })},
  output: {schema: StorageManagerOutputSchema},
  prompt: `Você é a NAI, assistente de infraestrutura da NextCon. Sua tarefa é extrair metadados de uma solicitação de organização de arquivos.

SOLICITAÇÃO: {{{query}}}

INSTRUÇÕES:
1. Extraia o CNPJ e limpe-o (mantenha apenas os números).
2. Identifique o nome da empresa solicitante.
3. Identifique o nome do projeto ou subpasta técnica. Se não for informado, use "Geral".
4. Defina o 'caminhoStorage' no padrão: clients/{{cnpjLimpo}}/{{nomeProjeto}}/_info_projeto.txt
5. No 'placeholderContent', crie um resumo profissional do projeto em português, indicando que foi criado via NAI Intelligence.`,
});

export async function extractStorageData(query: string): Promise<StorageManagerOutput> {
  const {output} = await prompt({ query });
  if (!output) throw new Error('A NAI não conseguiu interpretar os dados do cliente para o Storage.');
  return output;
}

ai.defineFlow(
  {
    name: 'storageManagerFlow',
    inputSchema: StorageManagerInputSchema,
    outputSchema: StorageManagerOutputSchema,
  },
  async input => {
    return extractStorageData(input);
  }
);
