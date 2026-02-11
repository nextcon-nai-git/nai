
/**
 * NEXTCON PLATFORM - CATÁLOGO COMERCIAL SST 2026
 * Estrutura de precificação dinâmica para orçamentos automáticos.
 */

export interface SSTService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  unit: 'unidade' | 'vida' | 'ponto' | 'hora';
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  services: SSTService[];
}

export const SST_CATALOG: ServiceCategory[] = [
  {
    id: "gestao",
    title: "1. Programas de Gestão",
    icon: "ClipboardCheck",
    services: [
      { id: "pgr", name: "PGR (NR-01)", description: "Programa de Gerenciamento de Riscos", basePrice: 850, unit: 'unidade' },
      { id: "pcmso", name: "PCMSO (NR-07)", description: "Controle Médico de Saúde Ocupacional", basePrice: 650, unit: 'unidade' },
      { id: "pca", name: "PCA", description: "Conservação Auditiva", basePrice: 450, unit: 'unidade' },
      { id: "ppr", name: "PPR", description: "Proteção Respiratória", basePrice: 450, unit: 'unidade' },
    ]
  },
  {
    id: "laudos",
    title: "2. Laudos Técnicos",
    icon: "Scale",
    services: [
      { id: "ltcat", name: "LTCAT", description: "Foco Previdenciário (INSS)", basePrice: 1200, unit: 'unidade' },
      { id: "nr15", name: "Laudo de Insalubridade", description: "NR-15", basePrice: 950, unit: 'unidade' },
      { id: "nr16", name: "Laudo de Periculosidade", description: "NR-16", basePrice: 950, unit: 'unidade' },
      { id: "aet", name: "AET (Ergonomia)", description: "Análise Ergonômica Profunda", basePrice: 1500, unit: 'unidade' },
      { id: "nr12", name: "Apreciação NR-12", description: "Segurança em Máquinas", basePrice: 800, unit: 'unidade' },
    ]
  },
  {
    id: "saude",
    title: "3. Saúde e Medicina",
    icon: "Stethoscope",
    services: [
      { id: "aso", name: "Emissão de ASO", description: "Admissional/Periódico/Demissional", basePrice: 45, unit: 'vida' },
      { id: "audio", name: "Audiometria", description: "Exame complementar", basePrice: 35, unit: 'vida' },
      { id: "lab", name: "Exames Laboratoriais", description: "Checkup completo", basePrice: 85, unit: 'vida' },
    ]
  },
  {
    id: "higiene",
    title: "4. Higiene Ocupacional",
    icon: "Gauge",
    services: [
      { id: "ruido", name: "Dosimetria de Ruído", description: "Medição quantitativa 8h", basePrice: 180, unit: 'ponto' },
      { id: "calor", name: "Avaliação de Calor", description: "IBUTG", basePrice: 250, unit: 'ponto' },
      { id: "quimica", name: "Avaliação Química", description: "Bomba de Amostragem", basePrice: 450, unit: 'ponto' },
    ]
  },
  {
    id: "esocial",
    title: "5. eSocial & Burocracia",
    icon: "Zap",
    services: [
      { id: "s2220", name: "Envio S-2220", description: "Monitoramento de Saúde", basePrice: 15, unit: 'vida' },
      { id: "s2240", name: "Envio S-2240", description: "Condições Ambientais", basePrice: 15, unit: 'vida' },
      { id: "cat", name: "Envio S-2210 (CAT)", description: "Comunicação de Acidente", basePrice: 150, unit: 'unidade' },
    ]
  },
  {
    id: "treinamentos",
    title: "6. Treinamentos (NRs)",
    icon: "GraduationCap",
    services: [
      { id: "nr35", name: "NR-35 (Altura)", description: "Treinamento 8h", basePrice: 250, unit: 'vida' },
      { id: "nr10", name: "NR-10 (Elétrica)", description: "Treinamento 40h", basePrice: 450, unit: 'vida' },
      { id: "cipa", name: "CIPA (Designado)", description: "Formação obrigatória", basePrice: 350, unit: 'unidade' },
    ]
  },
  {
    id: "consultoria",
    title: "7. Consultoria Jurídica",
    icon: "Gavel",
    services: [
      { id: "pericia", name: "Assistência em Perícia", description: "Acompanhamento Técnico", basePrice: 250, unit: 'hora' },
      { id: "sesmt", name: "Terceirização SESMT", description: "Alocação de Profissional", basePrice: 4500, unit: 'unidade' },
    ]
  }
];
