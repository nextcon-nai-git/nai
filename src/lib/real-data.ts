/**
 * NEXTCON PLATFORM - BASE DE DADOS NEUTRA 2026
 * Fonte única de verdade para faturamento, contratos, clientes, prestadores e atendimentos.
 * Varre e limpa qualquer menção a marcas de terceiros.
 */

export const REAL_COMPANIES = [
  { id: "UN_ALFA_51", name: "UNIDADE OPERACIONAL ALFA", cnpj: "51.633.820/0001-51", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Local", state: "UF" },
  { id: "UN_BETA_01", name: "UNIDADE OPERACIONAL BETA", cnpj: "01.208.413/0001-29", active: true, risk_degree: 3, segment: "ENGINEERING", city: "Local", state: "UF" },
  { id: "UN_GAMA_13", name: "UNIDADE OPERACIONAL GAMA", cnpj: "13.419.654/0001-04", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Local", state: "UF" },
  { id: "UN_DELTA_76", name: "UNIDADE INDUSTRIAL DELTA", cnpj: "76.492.701/0011-29", active: true, risk_degree: 3, segment: "INDUSTRY", city: "Local", state: "UF" },
  { id: "UN_EPSILON_32", name: "UNIDADE EDUCACIONAL EPSILON", cnpj: "32.137.571/0001-69", active: true, risk_degree: 1, segment: "EDUCATION", city: "Local", state: "UF" },
  { id: "UN_ZETA_14", name: "UNIDADE DE SAÚDE ZETA", cnpj: "14.736.446/0012-46", active: true, risk_degree: 2, segment: "HEALTH", city: "Local", state: "UF" }
];

export const REAL_EMPLOYEES = [
  { id: "COL_001", name: "COLABORADOR EXEMPLO A", cpf: "123.456.789-00", companyId: "UN_ALFA_51", aso_validade: "2026-12-31", aso_altura_valido: true, treinamento_nr35_valido: true },
  { id: "COL_002", name: "COLABORADOR EXEMPLO B", cpf: "441.932.712-77", companyId: "UN_BETA_01", aso_validade: "2026-12-31", aso_altura_valido: true, treinamento_nr35_valido: true },
  { id: "COL_003", name: "COLABORADOR EXEMPLO C", cpf: "378.454.183-64", companyId: "UN_GAMA_13", aso_validade: "2026-10-15", aso_espaco_confinado_valido: true, treinamento_nr33_valido: true }
];

export const MOCK_NURSING_ATTENDANCES = [
  {
    id: "NATT_001",
    employeeId: "COL_001",
    employeeName: "COLABORADOR EXEMPLO A",
    companyId: "UN_ALFA_51",
    complaint: "Cefaleia intensa e tontura leve.",
    bp_sys: "160",
    bp_dia: "100",
    heart_rate: "92",
    temperature: "36.4",
    spo2: "98",
    conduct: "observation",
    medication: "Em observação",
    nurseName: "Técnico(a) em Enfermagem",
    coren: "123456-TE/UF",
    createdAt: new Date().toISOString()
  }
];

export const REAL_CONTRACTS = [
  { id: "CT_01", companyId: "UN_ALFA_51", companyName: "UNIDADE OPERACIONAL ALFA", title: "Gestão Full SST", value: 88824.0, status: "Active" },
  { id: "CT_02", companyId: "UN_BETA_01", companyName: "UNIDADE OPERACIONAL BETA", title: "Gestão Técnica", value: 57100.0, status: "Active" }
];

export const REAL_TRAININGS = [
  {
    id: "TRN_001",
    title: "Capacitação NR-18 e NR-35",
    companyId: "UN_ALFA_51",
    companyName: "UNIDADE OPERACIONAL ALFA",
    nrs: ["NR-18", "NR-35"],
    startDate: "2026-02-10",
    endDate: "2026-02-15",
    totalHours: 40,
    status: "in_progress",
    students: [
      { id: "COL_001", name: "COLABORADOR EXEMPLO A", status: "present" }
    ]
  }
];
