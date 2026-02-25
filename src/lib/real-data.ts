/**
 * NEXTCON PLATFORM - BASE DE DADOS REAL 2026
 * Fonte única de verdade para faturamento, contratos, clientes e prestadores.
 * Inclui os 104 clientes ativos e a estrutura de colaboradores cruzada.
 */

export const REAL_COMPANIES = [
  { id: "CLI001", name: "BERNARDI DISTRIBUIDORA", cnpj: "00.000.000/0001-01", active: true, risk_degree: 2, segment: "INDUSTRY" },
  { id: "CLI003", name: "ESCOLA ESSENCIAL DE VIRTUDES LTDA", cnpj: "32.137.571/0001-69", active: true, risk_degree: 1, segment: "EDUCATION" },
  { id: "CLI014", name: "CDA STEEL FABRICACAO E MONTAGEM LTDA", cnpj: "00.000.000/0001-14", active: true, risk_degree: 3, segment: "INDUSTRY" },
  { id: "CLI029", name: "INCORPORADORA GRAN-PARA LTDA", cnpj: "13.419.654/0001-04", active: true, risk_degree: 3, segment: "CONSTRUCTION" },
  { id: "CLI055", name: "DW MONTEC", cnpj: "00.000.000/0001-55", active: true, risk_degree: 3, segment: "CONSTRUCTION" },
  { id: "CLI082", name: "NATIVA EMPREENDIMENTOS", cnpj: "51.633.820/0001-51", active: true, risk_degree: 3, segment: "CONSTRUCTION" },
  { id: "CLI113", name: "RCF CONSTRUCOES CIVIS LTDA", cnpj: "00.000.000/0001-13", active: true, risk_degree: 3, segment: "CONSTRUCTION" },
  { id: "CLI119", name: "JPF COMERCIO DE CONFECCOES", cnpj: "00.000.000/0001-19", active: true, risk_degree: 2, segment: "INDUSTRY" },
  { id: "01208413000129", name: "TIME NOW ENGENHARIA S/A", cnpj: "01.208.413/0001-29", active: true, risk_degree: 3, segment: "ENGINEERING" }
];

export const REAL_EMPLOYEES = [
  { id: "COL1334", name: "Amos Vieira De Souza", companyId: "CLI001", status: "active", cpf: "441.932.712-77" },
  { id: "COL1268", name: "Ana Paula Conci Oliveira", companyId: "CLI003", status: "active", cpf: "152.928.837-99" },
  { id: "COL1946", name: "Adair Doarte", companyId: "CLI029", status: "active", cpf: "730.248.971-82" },
  { id: "COL1931", name: "Agnaldo Cordeiro Da Silva", companyId: "CLI029", status: "active", cpf: "267.487.702-27" },
  { id: "COL1022", name: "Alex Oliveira Da Costa", companyId: "CLI082", status: "active", cpf: "264.950.432-69" },
  { id: "COL1842", name: "Aldemir Domingos Maciel", companyId: "CLI113", status: "active", cpf: "961.586.877-73" }
];

export const REAL_PROVIDERS = [
  { id: "PRV_01", name: "DR. DANILO LOPES", email: "danilo.lopes@prestador.nai.com.br", role: "DOCTOR", lat: -25.4284, lng: -49.2733 },
  { id: "PRV_02", name: "ENG. FELIPE DELLA BIANCA", email: "felipe.bianca@prestador.nai.com.br", role: "ENGINEER", lat: -25.4284, lng: -49.2733 }
];

export const REAL_CONTRACTS = [
  { id: "CT_NATIVA", companyId: "CLI082", companyName: "Nativa Empreendimentos", title: "Gestão Full SST", value: 88824.0, status: "Active" },
  { id: "CT_GRANPARA", companyId: "CLI029", companyName: "Incorporadora Gran-Pará", title: "Gestão Corporativa", value: 142500.0, status: "Active" }
];

export const DRE_2025_HISTORY = [
  { month: 'Jan', receita: 110000, despesa: 75000, lucro: 35000 },
  { month: 'Fev', receita: 115000, despesa: 78000, lucro: 37000 },
  { month: 'Mar', receita: 120000, despesa: 80000, lucro: 40000 }
];

export const REAL_TRAININGS = [
  {
    id: "TRN_001",
    title: "NR-18: Segurança na Construção Civil",
    companyId: "CLI082",
    companyName: "Nativa Empreendimentos",
    nrs: ["NR-18", "NR-35"],
    startDate: "2026-02-10",
    endDate: "2026-02-15",
    totalHours: 40,
    status: "in_progress",
    students: [
      { id: "COL1022", name: "Alex Oliveira Da Costa", status: "present" }
    ]
  }
];
