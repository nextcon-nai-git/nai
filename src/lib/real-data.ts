/**
 * NEXTCON PLATFORM - BASE DE DADOS REAL 2026
 * Fonte única de verdade para faturamento, contratos, clientes, prestadores e atendimentos.
 * Integração Oficial: COCEL (COMPANHIA CAMPOLARGUENSE DE ENERGIA)
 */

export const REAL_COMPANIES = [
  { 
    id: "COCEL_75", 
    name: "COMPANHIA CAMPOLARGUENSE DE ENERGIA - COCEL", 
    cnpj: "75.805.895/0001-30", 
    active: true, 
    risk_degree: 3, 
    segment: "ENERGY", 
    city: "Campo Largo", 
    state: "PR",
    address: "Rua Rui Barbosa, 520"
  },
  { id: "UN_BETA_01", name: "UNIDADE OPERACIONAL BETA", cnpj: "01.208.413/0001-29", active: true, risk_degree: 3, segment: "ENGINEERING", city: "Local", state: "UF" },
  { id: "UN_GAMA_13", name: "UNIDADE OPERACIONAL GAMA", cnpj: "13.419.654/0001-04", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Local", state: "UF" },
  { id: "UN_DELTA_76", name: "UNIDADE INDUSTRIAL DELTA", cnpj: "76.492.701/0011-29", active: true, risk_degree: 3, segment: "INDUSTRY", city: "Local", state: "UF" },
  { id: "UN_EPSILON_32", name: "UNIDADE EDUCACIONAL EPSILON", cnpj: "32.137.571/0001-69", active: true, risk_degree: 1, segment: "EDUCATION", city: "Local", state: "UF" }
];

export const REAL_EMPLOYEES = [
  { id: "COL_COCEL_01", name: "RAFAEL ROGISKI (DIRETOR)", cpf: "000.000.000-00", companyId: "COCEL_75", aso_validade: "2026-12-31", aso_altura_valido: true, treinamento_nr35_valido: true },
  { id: "COL_COCEL_02", name: "OPERADOR DE REDE COCEL", cpf: "111.222.333-44", companyId: "COCEL_75", aso_validade: "2026-08-15", aso_altura_valido: true, treinamento_nr35_valido: true },
  { id: "COL_002", name: "COLABORADOR EXEMPLO B", cpf: "441.932.712-77", companyId: "UN_BETA_01", aso_validade: "2026-12-31", aso_altura_valido: true, treinamento_nr35_valido: true },
  { id: "COL_003", name: "COLABORADOR EXEMPLO C", cpf: "378.454.183-64", companyId: "UN_GAMA_13", aso_validade: "2026-10-15", aso_espaco_confinado_valido: true, treinamento_nr33_valido: true }
];

export const MOCK_NURSING_ATTENDANCES = [
  {
    id: "NATT_COCEL_01",
    employeeId: "COL_COCEL_02",
    employeeName: "OPERADOR DE REDE COCEL",
    companyId: "COCEL_75",
    complaint: "Avaliação de rotina pós-obra.",
    bp_sys: "120",
    bp_dia: "80",
    heart_rate: "72",
    temperature: "36.5",
    spo2: "99",
    conduct: "work",
    medication: "Nenhuma",
    nurseName: "NAI Medical Assistant",
    coren: "123456-TE/PR",
    createdAt: new Date().toISOString()
  }
];

export const REAL_CONTRACTS = [
  { 
    id: "CT_COCEL_2026", 
    companyId: "COCEL_75", 
    companyName: "COCEL - DISTRIBUIÇÃO DE ENERGIA", 
    title: "Termo Aditivo: Gestão SST & eSocial", 
    value: 12794.07, 
    status: "Active",
    annualValue: 153528.84,
    notes: "Ajuste via IPCA 4,4414% - Vigência 24 meses"
  },
  { id: "CT_02", companyId: "UN_BETA_01", companyName: "UNIDADE OPERACIONAL BETA", title: "Gestão Técnica", value: 57100.0, status: "Active" }
];

export const REAL_TRAININGS = [
  {
    id: "TRN_COCEL_01",
    title: "Capacitação NR-10 (Segurança em Elétrica)",
    companyId: "COCEL_75",
    companyName: "COCEL",
    nrs: ["NR-10", "SEP"],
    startDate: "2026-02-15",
    endDate: "2026-02-20",
    totalHours: 40,
    status: "in_progress",
    students: [
      { id: "COL_COCEL_02", name: "OPERADOR DE REDE COCEL", status: "present" }
    ]
  }
];

export const REAL_HIERARCHICAL_DATA = [
  {
    id_cliente: "COCEL_75",
    nome_fantasia: "COCEL",
    razao_social: "COMPANHIA CAMPOLARGUENSE DE ENERGIA",
    total_vidas: 142,
    colaboradores: [
      { id_colaborador: "COL_COCEL_01", name: "RAFAEL ROGISKI", cpf: "000.000.000-00", cargo: "DIRETOR PRESIDENTE" },
      { id_colaborador: "COL_COCEL_02", name: "OPERADOR DE REDE", cpf: "111.222.333-44", cargo: "ELETRICISTA" }
    ]
  }
];
