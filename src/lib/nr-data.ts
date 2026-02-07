/**
 * Base de dados técnica avançada para Checklists de NRs (2026).
 * Cada norma contém os itens fundamentais com metadados de risco e orientação técnica.
 */

export interface ChecklistItem {
  id: string;
  category: string; // Ex: "Documentação", "Campo", "EPI"
  question: string;
  legal_ref: string; // O item exato da norma. Ex: "10.2.4"
  criticality: 'high' | 'medium' | 'low'; // Para priorizar o plano de ação
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
        category: "Gestão",
        question: "A empresa possui o PGR (Programa de Gerenciamento de Riscos) implementado?", 
        legal_ref: "1.5.3.1",
        criticality: "high",
        help_text: "Verifique se existe o documento físico ou digital assinado e se a data de emissão é inferior a 2 anos."
      },
      { 
        id: "1.2", 
        category: "Campo",
        question: "O inventário de riscos contempla todas as etapas do processo produtivo?", 
        legal_ref: "1.5.4.4.1",
        criticality: "high",
        help_text: "Compare o fluxograma operacional com o inventário. Verifique se existem atividades não mapeadas como limpeza ou manutenção."
      },
      { 
        id: "1.3", 
        category: "Gestão",
        question: "Existe um plano de ação com cronograma de execução das medidas?", 
        legal_ref: "1.5.5.2",
        criticality: "medium",
        help_text: "O plano deve ter data, responsável e status. Itens 'atrasados' devem ter justificativa técnica."
      },
      { 
        id: "1.4", 
        category: "Jurídico",
        question: "O PGR é assinado por profissional legalmente habilitado?", 
        legal_ref: "1.5.7.2",
        criticality: "high",
        help_text: "Verifique o registro no conselho de classe (CREA/CRM) do engenheiro ou médico."
      }
    ]
  },
  nr10: {
    nr: "NR-10",
    title: "Segurança em Instalações Elétricas",
    items: [
      { 
        id: "10.1", 
        category: "Documentação",
        question: "O prontuário de instalações elétricas está atualizado?", 
        legal_ref: "10.2.3",
        criticality: "high",
        help_text: "Deve conter esquemas unifilares, laudo de SPDA e certificações de equipamentos."
      },
      { 
        id: "10.2", 
        category: "Campo",
        question: "Os painéis elétricos possuem sinalização e barreira física?", 
        legal_ref: "10.4.1",
        criticality: "high",
        help_text: "Check se existem partes vivas expostas e se há placa de 'Perigo: Alta Tensão'."
      },
      { 
        id: "10.3", 
        category: "Treinamento",
        question: "Trabalhadores possuem curso de NR-10 válido?", 
        legal_ref: "10.8.8",
        criticality: "high",
        help_text: "Validade de 2 anos. Verifique se o certificado possui conteúdo programático conforme anexo III."
      }
    ]
  },
  nr35: {
    nr: "NR-35",
    title: "Trabalho em Altura",
    items: [
      { 
        id: "35.1", 
        category: "Capacitação",
        question: "Trabalhadores possuem treinamento de NR-35 válido?", 
        legal_ref: "35.4.1",
        criticality: "high",
        help_text: "Curso de 8h mínimo. Verifique a aptidão médica no ASO (Trabalho em Altura)."
      },
      { 
        id: "35.2", 
        category: "Operacional",
        question: "A Análise de Risco (AR) foi elaborada?", 
        legal_ref: "35.4.5",
        criticality: "high",
        help_text: "A AR deve ser específica para o local e dia da atividade, não pode ser genérica."
      },
      { 
        id: "35.3", 
        category: "Equipamento",
        question: "Os EPIs de retenção de queda estão inspecionados?", 
        legal_ref: "35.5.1",
        criticality: "high",
        help_text: "Verifique fitas, costuras e conectores. Busque pelo CA (Certificado de Aprovação) válido."
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
