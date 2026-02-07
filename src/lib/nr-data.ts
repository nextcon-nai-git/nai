/**
 * Base de dados técnica avançada para Checklists de NRs (2026).
 * Foco em itens críticos, conformidade eSocial e segurança de vida.
 */

export interface ChecklistItem {
  id: string;
  category: string;
  question: string;
  legal_ref: string;
  legal_text?: string; // Texto da lei para exibir no app
  criticality: 'critical' | 'high' | 'medium' | 'low';
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
    title: "Gerenciamento de Riscos Ocupacionais",
    items: [
      { 
        id: "1.1", 
        category: "Gerenciamento de Riscos (PGR)",
        question: "O Inventário de Riscos contempla a caracterização dos processos, ambientes e identificação de perigos de forma individualizada?", 
        legal_ref: "1.5.7.3.2",
        legal_text: "O inventário de riscos ocupacionais deve contemplar, no mínimo: a) caracterização dos processos e ambientes de trabalho; b) identificação dos perigos e dos possíveis danos à saúde dos trabalhadores...",
        criticality: "high",
        help_text: "Verificar se há distinção clara entre GHEs e se todos os perigos (físicos, químicos, biológicos, ergonômicos e acidentes) foram listados."
      },
      { 
        id: "1.2", 
        category: "Plano de Ação",
        question: "Existe um cronograma de implementação das medidas de controle com datas e responsáveis definidos?", 
        legal_ref: "1.5.5.2",
        legal_text: "O Plano de Ação deve indicar as medidas de prevenção a serem introduzidas, aprimoradas ou mantidas, com cronograma e formas de acompanhamento.",
        criticality: "high",
        help_text: "O PGR não pode ser estático. Verifique se as datas passadas foram cumpridas."
      },
      { 
        id: "1.3", 
        category: "Direito de Recusa",
        question: "Os trabalhadores foram informados sobre o direito de recusa em situações de risco grave e iminente?", 
        legal_ref: "1.4.3",
        legal_text: "O trabalhador poderá interromper suas atividades quando constatar uma situação de trabalho onde, a seu ver, envolva um risco grave e iminente para a sua vida ou saúde.",
        criticality: "critical",
        help_text: "Verificar evidência em Ordem de Serviço ou treinamento de integração."
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
        legal_text: "Os estabelecimentos com carga instalada superior a 75 kW devem constituir e manter o Prontuário de Instalações Elétricas.",
        criticality: "high",
        help_text: "Obrigatório para cargas acima de 75kW. Deve conter diagramas unifilares atualizados."
      },
      { 
        id: "10.2", 
        category: "Medidas de Controle",
        question: "As partes vivas das instalações elétricas possuem isolamento, barreiras ou invólucros para impedir contato acidental?", 
        legal_ref: "10.2.8.2",
        legal_text: "As medidas de proteção coletiva compreendem, prioritariamente, a desenergização elétrica conforme estabelece esta NR e, na sua impossibilidade, o emprego de tensão de segurança.",
        criticality: "critical",
        help_text: "Verificar quadros elétricos abertos ou fiação exposta. O IP (Índice de Proteção) deve ser adequado."
      },
      { 
        id: "10.3", 
        category: "Bloqueio e Etiquetagem (LOTO)",
        question: "Existe procedimento documentado e materiais para bloqueio e impedimento de reenergização?", 
        legal_ref: "10.5.1",
        legal_text: "Somente serão consideradas desenergizadas as instalações elétricas liberadas para trabalho mediante os procedimentos de seccionamento, impedimento de reenergização e sinalização.",
        criticality: "critical",
        help_text: "Verificar cadeados, garras de bloqueio e etiquetas de sinalização em uso."
      }
    ]
  },
  nr12: {
    nr: "NR-12",
    title: "Máquinas e Equipamentos",
    items: [
      {
        id: "12.1",
        category: "Dispositivos de Emergência",
        question: "As máquinas possuem dispositivos de parada de emergência que permitem a interrupção de movimentos perigosos?",
        legal_ref: "12.4.1",
        legal_text: "As máquinas devem ser equipadas com um ou mais dispositivos de parada de emergência, por meio dos quais possam ser evitadas situações de perigo latentes e existentes.",
        criticality: "critical",
        help_text: "Testar o acionamento do botão cogumelo e verificar se a parada é instantânea."
      },
      {
        id: "12.2",
        category: "Proteções Fixas e Móveis",
        question: "Zonas de perigo possuem proteções físicas que impedem o acesso dos membros superiores/inferiores?",
        legal_ref: "12.5.1",
        legal_text: "As zonas de perigo das máquinas e equipamentos devem possuir sistemas de segurança, caracterizados por proteções fixas, proteções móveis e dispositivos de segurança intertravados.",
        criticality: "critical",
        help_text: "Não deve ser possível burlar a proteção. Distância de segurança conforme NBR ISO 13857."
      },
      {
        id: "12.3",
        category: "Dispositivos de Segurança",
        question: "Sensores e intertravamentos de segurança são monitorados por relés de segurança?",
        legal_ref: "12.5.1.1",
        legal_text: "Os sistemas de segurança devem ser selecionados e instalados de modo a atender as categorias de segurança conforme análise de risco.",
        criticality: "high",
        help_text: "Verificar no painel elétrico a presença de relés de segurança (geralmente amarelos ou vermelhos)."
      }
    ]
  },
  nr18: {
    nr: "NR-18",
    title: "Segurança na Construção Civil",
    items: [
      {
        id: "18.1",
        category: "Gestão SST",
        question: "O PGR (Programa de Gerenciamento de Riscos) está implementado e atualizado no canteiro?",
        legal_ref: "18.4.1",
        legal_text: "É obrigatória a elaboração e a implementação do PGR nos canteiros de obras, contemplando os riscos ocupacionais e suas respectivas medidas de prevenção.",
        criticality: "high",
        help_text: "Verificar se o documento reflete a fase atual da obra."
      },
      {
        id: "18.2",
        category: "Proteção Coletiva",
        question: "As aberturas no piso e as periferias possuem proteção contra queda (guarda-corpo e rodapé)?",
        legal_ref: "18.9.1",
        legal_text: "É obrigatória a instalação de proteção coletiva onde houver risco de queda de trabalhadores ou de projeção de materiais.",
        criticality: "critical",
        help_text: "O guarda-corpo deve ter 1,20m de altura e rodapé de 20cm."
      }
    ]
  },
  nr33: {
    nr: "NR-33",
    title: "Espaços Confinados",
    items: [
      {
        id: "33.1",
        category: "Procedimentos",
        question: "A Permissão de Entrada e Trabalho (PET) é emitida antes de cada entrada?",
        legal_ref: "33.3.3.3",
        legal_text: "A PET deve ser emitida, em três vias, antes do início das atividades, pelo Responsável Técnico ou Supervisor de Entrada.",
        criticality: "critical",
        help_text: "Verificar se a PET está assinada e contém as medições de gases atualizadas."
      },
      {
        id: "33.2",
        category: "Vigilância",
        question: "O Vigia permanece no exterior do espaço confinado durante todo o tempo de trabalho?",
        legal_ref: "33.3.4.1",
        legal_text: "O vigia deve permanecer fora do espaço confinado, junto à entrada, em contato permanente com os trabalhadores autorizados.",
        criticality: "critical",
        help_text: "O vigia não pode realizar outras tarefas ou abandonar o posto."
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
        legal_text: "Todo trabalho em altura deve ser planejado, organizado e executado por trabalhador capacitado e autorizado.",
        criticality: "critical",
        help_text: "A AR deve estar assinada na frente de trabalho. Não aceitar AR genérica de escritório."
      },
      { 
        id: "35.2", 
        category: "Sistema de Ancoragem",
        question: "Os pontos de ancoragem possuem projeto, inspeção e suportam a carga mínima exigida?", 
        legal_ref: "35.5.3",
        legal_text: "O sistema de ancoragem deve ser projetado por profissional legalmente habilitado.",
        criticality: "critical",
        help_text: "Verificar laudo dos pontos de ancoragem assinado por PLH."
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
    }
  ]
});
