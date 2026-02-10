
/**
 * NEXTCON PLATFORM - BASE DE DADOS REAL 2026
 * Fonte única de verdade para carga massiva e testes de integração.
 */

export const REAL_COMPANIES = [
  { 
    id: "CLI_NATIVA", 
    name: "NATIVA EMPREENDIMENTOS", 
    city: "Guaratuba", 
    state: "PR", 
    cnpj: "12.345.678/0001-90", 
    segment: "CONSTRUCTION", 
    risk_degree: 3,
    cnae: "41.20-4-00",
    active: true
  },
  { 
    id: "CLI_TIMENOW", 
    name: "TIMENOW GESTÃO DE OBRAS LTDA", 
    city: "Vitória", 
    state: "ES", 
    cnpj: "48.865.462/0001-06", 
    segment: "CONSTRUCTION", 
    isParent: true,
    risk_degree: 3,
    cnae: "41.20-4-00",
    active: true
  },
  { 
    id: "CLI_BRITANIA", 
    name: "BRITÂNIA ELETRODOMÉSTICOS", 
    city: "Curitiba", 
    state: "PR", 
    cnpj: "76.492.701/0001-57", 
    segment: "INDUSTRY",
    parentId: "CLI_TIMENOW",
    risk_degree: 2,
    cnae: "27.51-1-00",
    active: true
  },
  { id: "CLI_BRDE", name: "BRDE", cnpj: "00.000.000/0001-01", active: true, segment: "FINANCIAL" },
  { id: "CLI_GULA", name: "GULA ALIMENTOS", cnpj: "98.765.432/0001-10", active: true, segment: "INDUSTRY" },
];

export const REAL_CONTRACTS = [
  { id: "CT_001", companyId: "CLI_BRDE", companyName: "BRDE", title: "BRDE - Solução 01", value: 85836.0, status: "Conquistado" },
  { id: "CT_002", companyId: "CLI_BRITANIA", companyName: "Britânia Eletrodomésticos", title: "Britânia Eletrodomésticos - Solução 01", value: 0.0, status: "Conquistado" },
  { id: "CT_012", companyId: "CLI_NATIVA", companyName: "NATIVA EMPREENDIMENTOS", title: "Nativa Empreendimentos - Solução 01", value: 88824.0, status: "Conquistado" },
  { id: "CT_017", companyId: "CLI_TIMENOW", companyName: "TIMENOW GESTÃO DE OBRAS LTDA", title: "Time Now - Solução 01", value: 4350.0, status: "Conquistado" },
];

export const REAL_EMPLOYEES = [
  { id: "EMP_NAT_01", name: "MARCOS SILVA", companyId: "CLI_NATIVA", job_role: { title: "Pedreiro", cbo: "7152-10" }, status: "active", cpf: "111.222.333-44" },
  { id: "EMP_NAT_02", name: "ADRIANO SANTOS", companyId: "CLI_NATIVA", job_role: { title: "Servente", cbo: "7170-20" }, status: "active", cpf: "222.333.444-55" },
  { id: "EMP_001", name: "BRUNO GADELHA DA SILVA", companyId: "CLI_BRITANIA", job_role: { title: "Hidrometrista", cbo: "3111-05" }, status: "active", cpf: "123.456.789-00" },
  { id: "EMP_002", name: "JOÃO BESTEL DE DEUS", companyId: "CLI_BRITANIA", job_role: { title: "Técnico de Saneamento", cbo: "3111-10" }, status: "active", cpf: "987.654.321-11" },
];

export const REAL_EXAMS_HISTORY = [
  { employeeName: "BRUNO GADELHA DA SILVA", employeeId: "EMP_001", companyId: "CLI_BRITANIA", date: "2026-02-02", type: "Admissional", provider: "ACRE SST", aso: "OK", s2220: "Transmitido", s2240: "OK" },
  { employeeName: "MARCOS SILVA", employeeId: "EMP_NAT_01", companyId: "CLI_NATIVA", date: "2026-02-05", type: "Periódico", provider: "SQV MATRIZ", aso: "OK", s2220: "Transmitido", s2240: "OK" },
  { employeeName: "ADRIANO SANTOS", employeeId: "EMP_NAT_02", companyId: "CLI_NATIVA", date: "2026-01-10", type: "Periódico", provider: "SQV MATRIZ", aso: "Pendente", s2220: "Aguardando", s2240: "---" },
];

export const REAL_TRAININGS = [
  {
    id: "TRN_NATIVA_01",
    title: "NR-18 Integrada - Construção",
    companyId: "CLI_NATIVA",
    companyName: "NATIVA EMPREENDIMENTOS",
    nrs: ["NR-18", "NR-35"],
    startDate: "2026-02-10",
    endDate: "2026-02-14",
    totalHours: 40,
    modality: "Presencial",
    status: "in_progress",
    students: [
      { id: "EMP_NAT_01", name: "MARCOS SILVA", status: "present" },
      { id: "EMP_NAT_02", name: "ADRIANO SANTOS", status: "present" }
    ]
  }
];

export const DRE_2026_DATA = [
  { month: 'Jan', receita: 99146.50, despesa: 83052.78, lucro: 16093.72 },
  { month: 'Fev', receita: 105000.00, despesa: 85000.00, lucro: 20000.00 }, // Projeção
];

export const DRE_2025_HISTORY = [
  { month: 'Jan', receita: 110000, despesa: 75000, lucro: 35000 },
  { month: 'Fev', receita: 115000, despesa: 78000, lucro: 37000 },
  { month: 'Mar', receita: 120000, despesa: 80000, lucro: 40000 },
  { month: 'Abr', receita: 125000, despesa: 82000, lucro: 43000 },
  { month: 'Mai', receita: 130000, despesa: 85000, lucro: 45000 },
  { month: 'Jun', receita: 128000, despesa: 84000, lucro: 44000 },
  { month: 'Jul', receita: 135000, despesa: 88000, lucro: 47000 },
  { month: 'Ago', receita: 140000, despesa: 90000, lucro: 50000 },
  { month: 'Set', receita: 145000, despesa: 92000, lucro: 53000 },
  { month: 'Out', receita: 150000, despesa: 95000, lucro: 55000 },
  { month: 'Nov', receita: 155000, despesa: 98000, lucro: 57000 },
  { month: 'Dez', receita: 180000, despesa: 110000, lucro: 70000 },
];
