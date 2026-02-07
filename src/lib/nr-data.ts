/**
 * NEXTCON PLATFORM - CÉREBRO NORMATIVO 2026
 * Base de dados técnica avançada para Auditorias de Campo.
 * Foco: Risco de Vida, Saúde Mental e Conformidade eSocial.
 */

export interface ChecklistItem {
  id: string;
  category: string;
  question: string;
  legal_ref: string;
  legal_text?: string;
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
    title: "Gerenciamento de Riscos Ocupacionais (GRO/PGR)",
    items: [
      { 
        id: "1.1", 
        category: "Gestão GRO",
        question: "O PGR está implementado por unidade operacional e contempla todos os riscos (F/Q/B/E/A)?", 
        legal_ref: "1.5.3.1.1",
        legal_text: "A organização deve implementar o gerenciamento de riscos ocupacionais em suas unidades operacionais contemplando perigos físicos, químicos, biológicos, ergonômicos e de acidentes.",
        criticality: "high",
        help_text: "Verificar se o inventário está assinado e se as medições de higiene ocupacional estão anexadas."
      },
      { 
        id: "1.2", 
        category: "Saúde Mental",
        question: "O Inventário de Riscos identifica perigos psicossociais e organizacionais (estresse, sobrecarga, burnout)?", 
        legal_ref: "1.5.3.2.1 (alínea c)",
        legal_text: "A etapa de identificação de perigos deve incluir a análise dos fatores psicossociais e organizacionais que podem causar agravos à saúde.",
        criticality: "critical",
        help_text: "Auditar evidências de avaliações de clima, pulse surveys ou protocolos de gestão de estresse."
      },
      { 
        id: "1.3", 
        category: "Violência e Assédio",
        question: "A empresa possui canal de denúncia anônimo e treinamento anual contra assédio moral e sexual?", 
        legal_ref: "Lei 14.457/22 (Integrada)",
        legal_text: "As organizações devem incluir regras de conduta sobre assédio sexual e outras formas de violência nas normas internas e realizar treinamentos anuais.",
        criticality: "critical",
        help_text: "Item obrigatório para CIPA e PGR. Verificar código de ética e registro de treinamentos realizados."
      },
      { 
        id: "1.4", 
        category: "Direito de Recusa",
        question: "Há evidência de que os trabalhadores foram treinados sobre o direito de interromper atividades de risco?", 
        legal_ref: "1.4.3",
        legal_text: "O trabalhador poderá interromper suas atividades quando constatar uma situação de trabalho onde, a seu ver, envolva um risco grave e iminente.",
        criticality: "critical",
        help_text: "Verificar conteúdo programático da integração ou ordens de serviço."
      }
    ]
  },
  nr05: {
    nr: "NR-05",
    title: "Comissão Interna de Prevenção de Acidentes (CIPA)",
    items: [
      { 
        id: "5.1", 
        category: "Constituição",
        question: "A CIPA está constituída e o processo eleitoral foi realizado conforme o dimensionamento?", 
        legal_ref: "5.4.1",
        legal_text: "A CIPA será constituída por estabelecimento e composta por representantes da organização e dos empregados.",
        criticality: "high",
        help_text: "Conferir ata de eleição, apuração e instalação da comissão atual."
      },
      { 
        id: "5.2", 
        category: "Saúde Mental",
        question: "A CIPA realizou ações de prevenção ao assédio sexual e violência no trabalho no último ano?", 
        legal_ref: "5.3.1 (alínea j)",
        legal_text: "Cabe à CIPA incluir temas referentes à prevenção e ao combate ao assédio sexual e a outras formas de violência no trabalho nas suas atividades.",
        criticality: "critical",
        help_text: "Verificar cronograma da SIPAT e atas de reuniões ordinárias."
      }
    ]
  },
  nr06: {
    nr: "NR-06",
    title: "Equipamentos de Proteção Individual (EPI)",
    items: [
      { 
        id: "6.1", 
        category: "Fornecimento",
        question: "Todos os EPIs possuem CA (Certificado de Aprovação) válido e condizente com o risco?", 
        legal_ref: "6.5.1",
        legal_text: "A organização deve fornecer aos empregados, gratuitamente, EPI adequado ao risco, em perfeito estado de conservação e funcionamento.",
        criticality: "critical",
        help_text: "Consultar sistema do MTE para validar os CAs das amostras em uso."
      },
      { 
        id: "6.2", 
        category: "Registro",
        question: "A entrega do EPI é registrada em sistema biométrico, digital ou ficha física assinada?", 
        legal_ref: "6.6.1 (alínea h)",
        legal_text: "Cabe à organização registrar o fornecimento ao trabalhador, podendo ser adotados sistemas eletrônicos.",
        criticality: "high",
        help_text: "Verificar se o Quiosque Digital Nextcon está sendo usado para prova de entrega."
      }
    ]
  },
  nr07: {
    nr: "NR-07",
    title: "Programa de Controle Médico de Saúde Ocupacional (PCMSO)",
    items: [
      { 
        id: "7.1", 
        category: "Planejamento",
        question: "O PCMSO foi elaborado com base nos riscos identificados no Inventário de Riscos do PGR?", 
        legal_ref: "7.5.1",
        legal_text: "O PCMSO deve ser elaborado considerando os riscos ocupacionais identificados e classificados pelo PGR.",
        criticality: "high",
        help_text: "Se houver 'Ruído' no PGR, deve haver 'Audiometria' no PCMSO."
      },
      { 
        id: "7.2", 
        category: "ASO",
        question: "Os ASOs emitidos contêm todos os exames complementares exigidos para o cargo?", 
        legal_ref: "7.5.19.1",
        legal_text: "O ASO deve conter a indicação de aptidão para a função que o trabalhador exercerá ou exerce.",
        criticality: "critical",
        help_text: "Cruzar dados do ASO com o histórico de exames do módulo 'Controle Médico'."
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
        question: "O Prontuário (PIE) está atualizado e disponível para cargas acima de 75 kW?", 
        legal_ref: "10.2.4",
        legal_text: "Os estabelecimentos com carga instalada superior a 75 kW devem constituir e manter o Prontuário de Instalações Elétricas.",
        criticality: "high",
        help_text: "Verificar diagramas unifilares e relatórios de inspeção técnica."
      },
      { 
        id: "10.2", 
        category: "Proteção",
        question: "As zonas de perigo estão isoladas ou possuem intertravamento para evitar contato?", 
        legal_ref: "10.2.8",
        legal_text: "Devem ser adotadas medidas de proteção coletiva para prevenir o risco de choque elétrico e arco elétrico.",
        criticality: "critical",
        help_text: "Checar quadros elétricos abertos ou fiação exposta."
      },
      { 
        id: "10.3", 
        category: "LOTO",
        question: "O procedimento de Bloqueio e Etiquetagem (Lockout/Tagout) é aplicado rigorosamente?", 
        legal_ref: "10.5.1",
        legal_text: "Somente serão consideradas desenergizadas as instalações liberadas mediante seccionamento e impedimento de reenergização.",
        criticality: "critical",
        help_text: "Observar se há cadeados e etiquetas de aviso em intervenções em andamento."
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
        legal_text: "As zonas de perigo devem possuir sistemas de segurança caracterizados por proteções fixas ou móveis intertravadas.",
        criticality: "critical",
        help_text: "Não deve ser possível acessar partes móveis com a máquina ligada."
      }
    ]
  },
  nr17: {
    nr: "NR-17",
    title: "Ergonomia",
    items: [
      { 
        id: "17.1", 
        category: "Análise Ergonômica",
        question: "Existe AEP (Avaliação Preliminar) para todas as atividades ou AET para casos complexos?", 
        legal_ref: "17.3.1",
        legal_text: "A organização deve realizar a avaliação ergonômica preliminar das situações de trabalho visando identificar perigos.",
        criticality: "high",
        help_text: "Verificar se as recomendações da AET estão no Plano de Ação do PGR."
      },
      { 
        id: "17.2", 
        category: "Carga Cognitiva",
        question: "A organização do trabalho evita sobrecarga mental e pressões excessivas de produção?", 
        legal_ref: "17.4.1",
        legal_text: "A organização do trabalho deve ser adequada às características psicofisiológicas dos trabalhadores e à natureza do trabalho.",
        criticality: "critical",
        help_text: "Auditar indicadores de Burnout no 'Termômetro de Burnout' do sistema."
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
        legal_text: "É obrigatória a instalação de proteção coletiva onde houver risco de queda de trabalhadores ou projeção de materiais.",
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
        legal_text: "A PET deve ser emitida antes do início das atividades pelo Responsável Técnico ou Supervisor.",
        criticality: "critical",
        help_text: "Verificar se os testes de gases foram realizados e registrados na PET."
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
        help_text: "O técnico deve medir se o trabalhador bateria no chão antes do talabarte atuar."
      },
      { 
        id: "35.2", 
        category: "Ancoragem",
        question: "Os pontos de ancoragem possuem projeto e laudo de inspeção anual por PLH?", 
        legal_ref: "35.5.3",
        legal_text: "O sistema de ancoragem deve ser projetado por profissional legalmente habilitado.",
        criticality: "critical",
        help_text: "Exigir o documento de ART do projeto dos olhais de ancoragem."
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
      criticality: "medium",
      help_text: "Verifique a organização de pastas físicas ou digitais."
    }
  ]
});
