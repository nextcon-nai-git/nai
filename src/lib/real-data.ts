/**
 * NEXTCON PLATFORM - BASE DE DADOS REAL 2026
 * Fonte única de verdade para faturamento, contratos, clientes e prestadores.
 */

export const REAL_COMPANIES = [
  { id: "51633820000151", name: "NATIVA EMPREENDIMENTOS", cnpj: "51.633.820/0001-51", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Guaratuba", state: "PR" },
  { id: "01208413000129", name: "TIME NOW ENGENHARIA S/A", cnpj: "01.208.413/0001-29", active: true, risk_degree: 3, segment: "ENGINEERING", city: "Vitória", state: "ES" },
  { id: "13419654000104", name: "INCORPORADORA GRAN-PARA LTDA", cnpj: "13.419.654/0001-04", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Curitiba", state: "PR" },
  { id: "76492701001129", name: "BRITANIA ELETRODOMESTICOS SA", cnpj: "76.492.701/0011-29", active: true, risk_degree: 3, segment: "INDUSTRY", city: "Joinville", state: "SC" },
  { id: "32137571000169", name: "ESCOLA ESSENCIAL DE VIRTUDES LTDA", cnpj: "32.137.571/0001-69", active: true, risk_degree: 1, segment: "EDUCATION", city: "Curitiba", state: "PR" },
  { id: "14736446001246", name: "CIS CENTRO INTEGRADO EM SAUDE", cnpj: "14.736.446/0012-46", active: true, risk_degree: 2, segment: "HEALTH", city: "Rio Branco do Sul", state: "PR" }
];

// Mapeamento hierárquico fornecido pelo usuário (Amostra para o script)
export const REAL_HIERARCHICAL_DATA = [
  {
    id_cliente: "CLI001",
    nome_fantasia: "BERNARDI DISTRIBUIDORA",
    razao_social: "A BERNARDI DISTRIBUIDORA DE DOCES E BEBIDAS LTDA",
    total_vidas: 2,
    colaboradores: [
      { id_colaborador: "COL1334", nome: "Amos Vieira De Souza", cpf: "441.932.712-77", data_nascimento: "1996-10-04", cargo: null },
      { id_colaborador: "COL1100", nome: "Paola Santiago Dalasuana", cpf: "378.454.183-64", data_nascimento: "2000-05-07", cargo: null }
    ]
  },
  {
    id_cliente: "32137571000169", // Escola Essencial (ID Real)
    nome_fantasia: "ESCOLA ESSENCIAL DE VIRTUDES LTDA",
    razao_social: "ESCOLA ESSENCIAL DE VIRTUDES LTDA.",
    total_vidas: 34,
    colaboradores: [
      { id_colaborador: "COL1268", nome: "Ana Paula Conci Oliveira", cpf: "152.928.837-99", data_nascimento: "2002-10-28", cargo: null },
      { id_colaborador: "COL1713", nome: "Animaria De Amorim", cpf: "378.454.183-67", data_nascimento: "2000-05-07", cargo: null }
    ]
  }
  // ... O script de importação processará a lista completa conforme o padrão acima
];

export const REAL_PROVIDERS = [
  { id: "PRV_01", name: "DR. DANILO LOPES", email: "danilo.lopes@prestador.nai.com.br", role: "DOCTOR", lat: -25.4284, lng: -49.2733 },
  { id: "PRV_02", name: "ENG. FELIPE DELLA BIANCA", email: "felipe.bianca@prestador.nai.com.br", role: "ENGINEER", lat: -25.4284, lng: -49.2733 }
];

export const REAL_CONTRACTS = [
  { id: "CT_NATIVA", companyId: "51633820000151", companyName: "Nativa Empreendimentos", title: "Gestão Full SST", value: 88824.0, status: "Active" },
  { id: "CT_GRANPARA", companyId: "13419654000104", companyName: "Incorporadora Gran-Pará", title: "Gestão Corporativa", value: 142500.0, status: "Active" },
  { id: "CT_TIMENOW", companyId: "01208413000129", companyName: "Time Now Engenharia", title: "Contrato Global", value: 250000.0, status: "Active" }
];

export const DRE_2025_HISTORY = [
  { month: 'Jan', receita: 110000, despesa: 75000, lucro: 35000 },
  { month: 'Fev', receita: 115000, despesa: 78000, lucro: 37000 },
  { month: 'Mar', receita: 120000, despesa: 80000, lucro: 40000 }
];

export const REAL_EXAMS_HISTORY = [
  { companyId: "51633820000151", employeeName: "ALEX OLIVEIRA DA COSTA", date: "2025-01-15", type: "Admissional", provider: "DR. DANILO LOPES", aso: "OK", s2220: "OK" }
];

export const REAL_TRAININGS = [
  {
    id: "TRN_001",
    title: "NR-18: Segurança na Construção Civil",
    companyId: "51633820000151",
    companyName: "Nativa Empreendimentos",
    nrs: ["NR-18", "NR-35"],
    startDate: "2026-02-10",
    endDate: "2026-02-15",
    totalHours: 40,
    status: "in_progress",
    students: [
      { id: "COL1022", name: "ALEX OLIVEIRA DA COSTA", status: "present" }
    ]
  }
];
