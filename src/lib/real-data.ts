/**
 * NEXTCON PLATFORM - BASE DE DADOS REAL 2026
 * Fonte única de verdade para faturamento, contratos, clientes, prestadores e atendimentos.
 */

export const REAL_COMPANIES = [
  { id: "51633820000151", name: "NATIVA EMPREENDIMENTOS", cnpj: "51.633.820/0001-51", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Guaratuba", state: "PR" },
  { id: "01208413000129", name: "TIME NOW ENGENHARIA S/A", cnpj: "01.208.413/0001-29", active: true, risk_degree: 3, segment: "ENGINEERING", city: "Vitória", state: "ES" },
  { id: "13419654000104", name: "INCORPORADORA GRAN-PARA LTDA", cnpj: "13.419.654/0001-04", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Curitiba", state: "PR" },
  { id: "76492701001129", name: "BRITANIA ELETRODOMESTICOS SA", cnpj: "76.492.701/0011-29", active: true, risk_degree: 3, segment: "INDUSTRY", city: "Joinville", state: "SC" },
  { id: "32137571000169", name: "ESCOLA ESSENCIAL DE VIRTUDES LTDA", cnpj: "32.137.571/0001-69", active: true, risk_degree: 1, segment: "EDUCATION", city: "Curitiba", state: "PR" },
  { id: "14736446001246", name: "CIS CENTRO INTEGRADO EM SAUDE", cnpj: "14.736.446/0012-46", active: true, risk_degree: 2, segment: "HEALTH", city: "Rio Branco do Sul", state: "PR" },
  { id: "DALL_EMP", name: "DALL EMPREENDIMENTOS", cnpj: "11.306.970/0001-36", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Itajaí", state: "SC" }
];

export const REAL_EMPLOYEES = [
  { id: "COL_JOAO_SILVA", name: "JOÃO SILVA", cpf: "123.456.789-00", companyId: "DALL_EMP", unitId: "ATMOSPHERE", aso_validade: "2026-12-31", aso_altura_valido: true, treinamento_nr35_valido: true },
  { id: "COL1334", name: "Amos Vieira De Souza", cpf: "441.932.712-77", companyId: "CLI001", aso_validade: "2026-12-31", aso_altura_valido: true, treinamento_nr35_valido: true },
  { id: "COL1100", name: "Paola Santiago Dalasuana", cpf: "378.454.183-64", companyId: "CLI001", aso_validade: "2026-10-15", aso_espaco_confinado_valido: true, treinamento_nr33_valido: true },
  { id: "COL1268", name: "Ana Paula Conci Oliveira", cpf: "152.928.837-99", companyId: "32137571000169", aso_validade: "2026-08-20" },
  { id: "COL1022", name: "ALEX OLIVEIRA DA COSTA", cpf: "264.950.432-69", companyId: "51633820000151", aso_validade: "2025-01-01" }
];

export const MOCK_NURSING_ATTENDANCES = [
  {
    id: "NATT_001",
    employeeId: "COL_JOAO_SILVA",
    employeeName: "JOÃO SILVA",
    companyId: "DALL_EMP",
    unitId: "ATMOSPHERE",
    complaint: "Cefaleia intensa e tontura leve.",
    bp_sys: "160",
    bp_dia: "100",
    heart_rate: "92",
    temperature: "36.4",
    spo2: "98",
    conduct: "observation",
    medication: "Aguardando estabilização",
    nurseName: "Téc. Enfermagem Unidade",
    coren: "123456-TE/SC",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

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
  }
];

export const REAL_PROVIDERS = [
  { id: "PRV_01", name: "DR. DANILO LOPES", email: "danilo.lopes@prestador.nai.com.br", role: "DOCTOR", lat: -25.4284, lng: -49.2733 },
  { id: "PRV_02", name: "ENG. FELIPE DELLA BIANCA", email: "felipe.bianca@prestador.nai.com.br", role: "ENGINEER", lat: -25.4284, lng: -49.2733 }
];

export const REAL_CONTRACTS = [
  { id: "CT_NATIVA", companyId: "51633820000151", companyName: "Nativa Empreendimentos", title: "Gestão Full SST", value: 88824.0, status: "Active" },
  { id: "CT_DALL", companyId: "DALL_EMP", companyName: "Dall Empreendimentos", title: "Gestão Corporativa + Obras", value: 57100.0, status: "Active" }
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
