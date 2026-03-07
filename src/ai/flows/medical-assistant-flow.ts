'use server';
/**
 * @fileOverview Agente NAI Medical Assistant - Agente com Tool Calling.
 * 
 * - medicalAssistant - Função que processa dúvidas médicas consultando dados do sistema.
 * - MedicalAssistantInput - Esquema de entrada (mensagem e ID do paciente).
 * - MedicalAssistantOutput - Resposta textual do agente.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase/init';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

const MedicalAssistantInputSchema = z.object({
  mensagemMedico: z.string().describe('A dúvida ou solicitação do médico do trabalho.'),
  pacienteId: z.string().describe('O ID único do colaborador no sistema.'),
});
export type MedicalAssistantInput = z.infer<typeof MedicalAssistantInputSchema>;

export type MedicalAssistantOutput = string;

// --- FERRAMENTAS DO AGENTE ---

/**
 * Ferramenta para buscar códigos CID-10.
 */
const consultarCIDTool = ai.defineTool(
  {
    name: 'consultarCID',
    description: 'Busca o código CID-10 oficial baseado em sintomas ou diagnóstico descrito.',
    inputSchema: z.object({
      termo: z.string().describe('Descrição do sintoma ou doença (ex: dor lombar).'),
    }),
    outputSchema: z.object({
      codigo: z.string(),
      descricao: z.string(),
    }),
  },
  async ({ termo }) => {
    const busca = termo.toLowerCase();
    // Mocks de busca técnica (Em produção, conectaria a uma API de CID)
    if (busca.includes('lombar') || busca.includes('costas')) return { codigo: 'M54.5', descricao: 'Dor lombar baixa' };
    if (busca.includes('esforço') || busca.includes('repetitivo')) return { codigo: 'M75.1', descricao: 'Síndrome do manguito rotador' };
    if (busca.includes('tristeza') || busca.includes('ânimo')) return { codigo: 'F33.2', descricao: 'Transtorno depressivo recorrente' };
    
    return { codigo: 'R68.8', descricao: 'Outros sintomas e sinais gerais especificados' };
  }
);

/**
 * Ferramenta para consultar o histórico real no Firestore.
 */
const buscarHistoricoPacienteTool = ai.defineTool(
  {
    name: 'buscarHistoricoPaciente',
    description: 'Recupera o histórico de ASOs e restrições do paciente no banco de dados.',
    inputSchema: z.object({
      pacienteId: z.string(),
    }),
    outputSchema: z.object({
      ultimoResultado: z.string(),
      dataEmissao: z.string(),
      observacoes: z.string(),
    }),
  },
  async ({ pacienteId }) => {
    const { firestore } = initializeFirebase();
    const asoRef = collection(firestore, 'atendimentos_aso');
    const q = query(
      asoRef, 
      where('employeeId', '==', pacienteId), 
      orderBy('data_emissao', 'desc'), 
      limit(1)
    );
    
    const snap = await getDocs(q);
    if (snap.empty) {
      return { 
        ultimoResultado: 'Nenhum registro anterior', 
        dataEmissao: '---', 
        observacoes: 'Paciente sem histórico no sistema.' 
      };
    }

    const data = snap.docs[0].data();
    return {
      ultimoResultado: data.resultado || 'Apto',
      dataEmissao: data.data_emissao || '---',
      observacoes: data.signature_info ? 'Documento assinado digitalmente.' : 'Aguardando formalização.'
    };
  }
);

// --- FLUXO DO AGENTE ---

const medicalAssistantFlow = ai.defineFlow(
  {
    name: 'medicalAssistantFlow',
    inputSchema: MedicalAssistantInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `Você é a NAI, assistente técnica de elite para médicos do trabalho da Nextcon.
      
      CONTEXTO DO PACIENTE:
      ID: ${input.pacienteId}
      
      SOLICITAÇÃO MÉDICA:
      "${input.mensagemMedico}"
      
      DIRETRIZES:
      1. Se o médico mencionar sintomas, use 'consultarCID' para sugerir o código.
      2. Antes de dar um parecer, use 'buscarHistoricoPaciente' para verificar se há inaptidões prévias.
      3. Seja extremamente profissional, clínico e objetivo.
      4. Sempre mencione que seu parecer deve ser validado pelo médico examinador.`,
      tools: [consultarCIDTool, buscarHistoricoPacienteTool],
    });

    return text;
  }
);

/**
 * Wrapper para chamada via Server Action ou API.
 */
export async function medicalAssistant(input: MedicalAssistantInput): Promise<MedicalAssistantOutput> {
  return medicalAssistantFlow(input);
}
