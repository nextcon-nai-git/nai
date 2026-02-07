/**
 * NEXTCON PLATFORM - CÉREBRO NORMATIVO 2026
 * Base de dados técnica avançada para Auditorias de Campo.
 * Foco: Risco de Vida, Saúde Mental e Conformidade eSocial.
 */

export type CriticalityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface ChecklistItem {
  id: string;
  category: string;
  question: string;
  legal_ref: string;
  legal_text?: string;
  criticality: CriticalityLevel;
  help_text: string;
}

export interface NRChecklist {
  nr: string;
  title: string;
  items: ChecklistItem[];
}

export const NR_CHECKLISTS: Record<string, NRChecklist> = {
  nr01: {
    nr: "NR-01",
    title: "Gerenciamento de Riscos Ocupacionais (GRO/PGR)",
    items: [
      { 
        id: "1.1", 
        category: "Gestão GRO",
        question: "O PGR contempla a caracterização dos processos, ambientes e identificação de perigos de forma individualizada?", 
        legal_ref: "1.5.7.3.2",
        legal_text: "O inventário de riscos ocupacionais deve contemplar a caracterização dos processos e ambientes de trabalho e a identificação dos perigos.",
        criticality: "high",
        help_text: "Verificar se há distinção clara entre GHEs e se todos os perigos foram listados."
      },
      { 
        id: "1.2", 
        category: "Saúde Mental",
        question: "O Inventário de Riscos identifica perigos psicossociais e organizacionais (estresse, sobrecarga, burnout)?", 
        legal_ref: "1.5.3.2.1",
        legal_text: "A etapa de identificação de perigos deve incluir a análise dos fatores psicossociais e organizacionais que podem causar agravos à saúde.",
        criticality: "critical",
        help_text: "Auditar evidências de avaliações de clima ou protocolos de gestão de estresse."
      },
      { 
        id: "1.3", 
        category: "Violência e Assédio",
        question: "A empresa possui canal de denúncia anônimo e treinamento anual contra assédio moral e sexual?", 
        legal_ref: "Lei 14.457/22",
        legal_text: "As organizações devem incluir regras de conduta sobre assédio sexual e outras formas de violência nas normas internas.",
        criticality: "critical",
        help_text: "Item obrigatório para CIPA e PGR. Verificar código de ética."
      }
    ]
  },
  nr10: {
    nr: "NR-10",
    title: "Segurança em Instalações Elétricas",
    items: [
      { 
        id: "10.1", 
        category: "Prontuário",
        question: "O Prontuário das Instalações Elétricas (PIE) está atualizado para cargas acima de 75kW?", 
        legal_ref: "10.2.4",
        legal_text: "Os estabelecimentos com carga instalada superior a 75 kW devem manter o Prontuário de Instalações Elétricas.",
        criticality: "high",
        help_text: "Deve conter diagramas unifilares atualizados."
      },
      { 
        id: "10.2", 
        category: "Proteção",
        question: "As partes vivas das instalações possuem isolamento ou barreiras para impedir contato acidental?", 
        legal_ref: "10.2.8.2",
        legal_text: "Devem ser adotadas medidas de proteção coletiva para prevenir o risco de choque elétrico.",
        criticality: "critical",
        help_text: "Verificar quadros elétricos abertos ou fiação exposta."
      },
      { 
        id: "10.3", 
        category: "LOTO",
        question: "Existe procedimento de bloqueio e sinalização (LOTO) para intervenções?", 
        legal_ref: "10.5.1",
        legal_text: "Somente serão consideradas desenergizadas as instalações elétricas liberadas para trabalho mediante procedimentos apropriados.",
        criticality: "critical",
        help_text: "Verificar cadeados e etiquetas de impedimento."
      }
    ]
  },
  nr12: {
    nr: "NR-12",
    title: "Segurança em Máquinas e Equipamentos",
    items: [
      { 
        id: "12.1", 
        category: "Proteções",
        question: "As zonas de perigo das máquinas possuem proteções fixas ou móveis com intertravamento?", 
        legal_ref: "12.5.1",
        legal_text: "As zonas de perigo das máquinas e equipamentos devem possuir sistemas de segurança.",
        criticality: "critical",
        help_text: "Testar se a máquina para ao abrir a grade de proteção."
      },
      { 
        id: "12.2", 
        category: "Emergência",
        question: "Os dispositivos de parada de emergência estão instalados, sinalizados e acessíveis?", 
        legal_ref: "12.4.1",
        legal_text: "As máquinas devem ser equipadas com um ou mais dispositivos de parada de emergência.",
        criticality: "critical",
        help_text: "Verificar se o botão 'cogumelo' está funcionando."
      }
    ]
  },
  nr35: {
    nr: "NR-35",
    title: "Trabalho em Altura",
    items: [
      { 
        id: "35.1", 
        category: "Planejamento",
        question: "A Análise de Risco (AR) foi emitida antes do início da atividade em altura?", 
        legal_ref: "35.4.5.1",
        legal_text: "Todo trabalho em altura deve ser precedido de Análise de Risco.",
        criticality: "critical",
        help_text: "A AR deve ser específica para o local e assinada por todos."
      },
      { 
        id: "35.2", 
        category: "Ancoragem",
        question: "Os pontos de ancoragem possuem projeto e laudo de inspeção assinado por PLH?", 
        legal_ref: "35.5.3",
        legal_text: "O sistema de ancoragem deve ser projetado por profissional legalmente habilitado.",
        criticality: "critical",
        help_text: "Verificar data da última inspeção anual dos olhais."
      },
      { 
        id: "35.3", 
        category: "Resgate",
        question: "Existe plano de resgate e equipe capacitada no local da atividade?", 
        legal_ref: "35.6.1",
        legal_text: "O empregador deve disponibilizar equipe de emergência para resgate em altura.",
        criticality: "high",
        help_text: "O plano deve considerar o tempo para evitar o trauma de suspensão inerte."
      }
    ]
  }
};

export const getGenericChecklist = (nr: string, title: string): NRChecklist => ({
  nr,
  title,
  items: [
    { 
      id: "g1", 
      category: "Documentação Geral",
      question: "A documentação técnica exigida por esta norma está disponível para fiscalização?", 
      legal_ref: "Geral",
      criticality: "low",
      help_text: "Verifique a organização de pastas físicas ou digitais."
    }
  ]
});
