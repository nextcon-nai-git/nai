/**
 * Base de dados técnica avançada para Checklists de NRs (2026).
 * Cada norma contém os itens fundamentais com metadados de risco e orientação técnica.
 */

export interface ChecklistItem {
  id: string;
  category: string; // Ex: "Documentação", "Campo", "EPI"
  question: string;
  legal_ref: string; // O item exato da norma. Ex: "10.2.4"
  criticality: 'critical' | 'high' | 'medium' | 'low'; // Para priorizar o plano de ação
  help_text: string; // Dica para o técnico (O que olhar?)
}

export interface NRChecklist {
  nr: string;
  title: string;
  items: ChecklistItem[];
}

export const NR_CHECKLISTS: Record<string, NRChecklist> = {
  nr01: {
    nr: "NR-01",
    title: "Gerenciamento de Riscos Ocupacionais",
    items: [
      { 
        id: "1.1", 
        category: "Gerenciamento de Riscos (PGR)",
        question: "O Inventário de Riscos contempla a caracterização dos processos, ambientes e identificação de perigos de forma individualizada?", 
        legal_ref: "1.5.7.3.2",
        criticality: "high",
        help_text: "Verificar se há distinção clara entre GHEs e se todos os perigos (físicos, químicos, biológicos, ergonômicos e acidentes) foram listados."
      },
      { 
        id: "1.2", 
        category: "Plano de Ação",
        question: "Existe um cronograma de implementação das medidas de controle com datas e responsáveis definidos?", 
        legal_ref: "1.5.5.2",
        criticality: "high",
        help_text: "O PGR não pode ser estático. Verifique se as datas passadas foram cumpridas."
      },
      { 
        id: "1.3", 
        category: "Direito de Recusa",
        question: "Os trabalhadores foram informados sobre o direito de recusa em situações de risco grave e iminente?", 
        legal_ref: "1.4.3",
        criticality: "medium",
        help_text: "Verificar evidência em Ordem de Serviço ou treinamento de integração."
      },
      { 
        id: "1.4", 
        category: "Consultoria aos Trabalhadores",
        question: "Houve consulta aos trabalhadores na percepção dos riscos ocupacionais para elaboração do PGR?", 
        legal_ref: "1.5.3.3",
        criticality: "medium",
        help_text: "Verificar atas de reunião, CIPA ou formulários de consulta prévia."
      }
    ]
  },
  nr10: {
    nr: "NR-10",
    title: "Segurança em Instalações Elétricas",
    items: [
      { 
        id: "10.1", 
        category: "Prontuário (PIE)",
        question: "O Prontuário das Instalações Elétricas (PIE) está organizado e atualizado dentro da empresa?", 
        legal_ref: "10.2.4",
        criticality: "high",
        help_text: "Obrigatório para cargas acima de 75kW. Deve conter diagramas unifilares atualizados."
      },
      { 
        id: "10.2", 
        category: "Medidas de Controle",
        question: "As partes vivas das instalações elétricas possuem isolamento, barreiras ou invólucros para impedir contato acidental?", 
        legal_ref: "10.2.8.2",
        criticality: "critical",
        help_text: "Verificar quadros elétricos abertos ou fiação exposta. O IP (Índice de Proteção) deve ser adequado."
      },
      { 
        id: "10.3", 
        category: "EPI e EPC",
        question: "As vestimentas de trabalho são adequadas às atividades e possuem proteção contra arco elétrico (ATP)?", 
        legal_ref: "10.2.9.2",
        criticality: "high",
        help_text: "Uniformes 100% algodão não são suficientes para alta tensão. Verificar etiqueta CA e nível de ATPV."
      },
      { 
        id: "10.4", 
        category: "Bloqueio e Etiquetagem (LOTO)",
        question: "Existe procedimento documentado e materiais para bloqueio e impedimento de reenergização?", 
        legal_ref: "10.5.1",
        criticality: "critical",
        help_text: "Verificar cadeados, garras de bloqueio e etiquetas de sinalização em uso."
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
        question: "A Análise de Risco (AR) foi emitida antes do início da atividade, considerando os riscos inerentes e adicionais?", 
        legal_ref: "35.4.5.1",
        criticality: "critical",
        help_text: "A AR deve estar assinada na frente de trabalho. Não aceitar AR genérica de escritório."
      },
      { 
        id: "35.2", 
        category: "Sistema de Ancoragem",
        question: "Os pontos de ancoragem possuem projeto, inspeção e suportam a carga mínima exigida?", 
        legal_ref: "35.5.3",
        criticality: "critical",
        help_text: "Verificar laudo dos pontos de ancoragem (olhais) assinado por PLH (Profissional Legalmente Habilitado)."
      },
      { 
        id: "35.3", 
        category: "Plano de Resgate",
        question: "Existe plano de emergência e equipe capacitada para resgate rápido em caso de suspensão inerte?", 
        legal_ref: "35.6.1",
        criticality: "high",
        help_text: "O trauma de suspensão mata em minutos. O plano não pode ser apenas 'chamar os bombeiros'."
      },
      { 
        id: "35.4", 
        category: "EPI",
        question: "O cinturão de segurança é do tipo paraquedista e o talabarte/trava-quedas é compatível e está inspecionado?", 
        legal_ref: "35.5.5",
        criticality: "high",
        help_text: "Verificar validade do CA e estado de conservação das fitas e costuras."
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
      category: "Geral",
      question: "A documentação técnica da norma está disponível?", 
      legal_ref: "Geral",
      criticality: "medium",
      help_text: "Verifique a disponibilidade física ou digital para consulta dos trabalhadores."
    },
    { 
      id: "g2", 
      category: "Treinamento",
      question: "Os colaboradores envolvidos receberam treinamento?", 
      legal_ref: "Geral",
      criticality: "high",
      help_text: "Consulte a matriz de treinamentos e compare com os registros de presença."
    }
  ]
});
