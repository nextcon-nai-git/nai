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
      },
      { 
        id: "1.4", 
        category: "Direito de Recusa",
        question: "Há evidência de que os trabalhadores foram treinados sobre o direito de interromper atividades de risco?", 
        legal_ref: "1.4.3",
        legal_text: "O trabalhador poderá interromper suas atividades quando constatar uma situação de trabalho de risco grave e iminente.",
        criticality: "medium",
        help_text: "Verificar conteúdo programático da integração ou ordens de serviço."
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
      }
    ]
  },
  nr12: {
    nr: "NR-12",
    title: "Segurança em Máquinas e Equipamentos",
    items: [
      { 
        id: "12.1", 
        category: "Parada de Emergência",
        question: "Os botões de emergência estão acessíveis, sinalizados e funcionais?", 
        legal_ref: "12.4.1",
        legal_text: "As máquinas devem ser equipadas com um ou mais dispositivos de parada de emergência.",
        criticality: "critical",
        help_text: "Testar o acionamento e verificar se a parada é instantânea."
      },
      { 
        id: "12.2", 
        category: "Proteções",
        question: "Zonas de perigo possuem proteções fixas ou móveis com sensores de segurança?", 
        legal_ref: "12.5.1",
        legal_text: "As zonas de perigo devem possuir sistemas de segurança intertravados.",
        criticality: "critical",
        help_text: "Não deve ser possível acessar partes móveis com a máquina ligada."
      }
    ]
  },
  nr18: {
    nr: "NR-18",
    title: "Segurança na Construção Civil",
    items: [
      { 
        id: "18.1", 
        category: "Proteção de Periferia",
        question: "As periferias e vãos de elevador possuem guarda-corpo e rodapé normatizados?", 
        legal_ref: "18.9.1",
        legal_text: "É obrigatória a instalação de proteção coletiva onde houver risco de queda.",
        criticality: "critical",
        help_text: "Verificar altura de 1,20m para travessão superior e rodapé de 20cm."
      }
    ]
  },
  nr33: {
    nr: "NR-33",
    title: "Espaços Confinados",
    items: [
      { 
        id: "33.1", 
        category: "PET",
        question: "A Permissão de Entrada e Trabalho (PET) é emitida para cada entrada e monitorada pelo vigia?", 
        legal_ref: "33.3.3",
        legal_text: "A PET deve ser emitida antes do início das atividades.",
        criticality: "critical",
        help_text: "Verificar se os testes de gases foram realizados."
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
        question: "A Análise de Risco (AR) contempla a análise da zona livre de queda (ZLQ)?", 
        legal_ref: "35.4.5.1",
        legal_text: "Todo trabalho em altura deve ser precedido de Análise de Risco.",
        criticality: "critical",
        help_text: "Medir se o trabalhador bateria no chão antes do talabarte atuar."
      },
      { 
        id: "35.2", 
        category: "Ancoragem",
        question: "Os pontos de ancoragem possuem projeto e laudo de inspeção anual por PLH?", 
        legal_ref: "35.5.3",
        legal_text: "O sistema de ancoragem deve ser projetado por profissional habilitado.",
        criticality: "critical",
        help_text: "Exigir documento de ART do projeto dos olhais."
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
