/**
 * Base de dados técnica para Checklists de NRs (2026).
 * Cada norma contém os itens fundamentais para auditoria em campo.
 */

export interface ChecklistItem {
  id: string;
  question: string;
  legalRef: string;
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
      { id: "1.1", question: "A empresa possui o PGR (Programa de Gerenciamento de Riscos) implementado?", legalRef: "Item 1.5.3.1" },
      { id: "1.2", question: "O inventário de riscos contempla todas as etapas do processo produtivo?", legalRef: "Item 1.5.4.4.1" },
      { id: "1.3", question: "Existe um plano de ação com cronograma de execução das medidas preventivas?", legalRef: "Item 1.5.5.2" },
      { id: "1.4", question: "O PGR é assinado por profissional legalmente habilitado?", legalRef: "Item 1.5.7.2" }
    ]
  },
  nr10: {
    nr: "NR-10",
    title: "Segurança em Instalações Elétricas",
    items: [
      { id: "10.1", question: "O prontuário de instalações elétricas está atualizado e disponível?", legalRef: "Item 10.2.3" },
      { id: "10.2", question: "Os painéis elétricos possuem sinalização de advertência e barreira física?", legalRef: "Item 10.4.1" },
      { id: "10.3", question: "Os trabalhadores possuem treinamento de NR-10 (Básico/SEP) válido?", legalRef: "Item 10.8.8" },
      { id: "10.4", question: "As ferramentas utilizadas são isoladas para a classe de tensão?", legalRef: "Item 10.4.3" }
    ]
  },
  nr35: {
    nr: "NR-35",
    title: "Trabalho em Altura",
    items: [
      { id: "35.1", question: "Os trabalhadores possuem treinamento de NR-35 (Teórico/Prático) válido?", legalRef: "Item 35.4.1" },
      { id: "35.2", question: "A Análise de Risco (AR) foi elaborada e assinada antes do início da atividade?", legalRef: "Item 35.4.5" },
      { id: "35.3", question: "O sistema de proteção contra quedas (SPCQ) está inspecionado e íntegro?", legalRef: "Item 35.5.1" },
      { id: "35.4", question: "A Permissão de Trabalho (PT) foi emitida e afixada no local?", legalRef: "Item 35.4.7" }
    ]
  }
};

// Fallback para NRs ainda não detalhadas no código
export const getGenericChecklist = (nr: string, title: string): NRChecklist => ({
  nr,
  title,
  items: [
    { id: "g1", question: "A documentação técnica da norma está disponível na unidade?", legalRef: "Requisito Geral" },
    { id: "g2", question: "Os colaboradores envolvidos receberam treinamento específico?", legalRef: "Capacitação" },
    { id: "g3", question: "Os equipamentos de proteção (EPI/EPC) estão em conformidade?", legalRef: "Proteção" },
    { id: "g4", question: "O plano de emergência contempla cenários críticos desta NR?", legalRef: "Emergência" }
  ]
});
