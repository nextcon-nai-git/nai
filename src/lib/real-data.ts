
/**
 * NEXTCON PLATFORM - BASE DE DADOS REAL 2026
 * Fonte única de verdade para carga massiva e testes de integração.
 * Implementa Desnormalização de Cargos e Hierarquia Master/Unidade.
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
  { 
    id: "CLI_GULA", 
    name: "GULA ALIMENTOS", 
    city: "Curitiba", 
    state: "PR", 
    cnpj: "98.765.432/0001-10", 
    segment: "INDUSTRY",
    risk_degree: 2,
    cnae: "10.91-1-01",
    active: true
  },
  { id: "CLI_BRDE", name: "BRDE", cnpj: "00.000.000/0001-01", active: true, segment: "FINANCIAL" },
  { id: "CLI_BRITANIA_B1B2", name: "Britânia Unidade B1/B2", cnpj: "76.492.701/0002-57", active: true, segment: "INDUSTRY" },
  { id: "CLI_BIAVATTI_MAFRA", name: "Clínica Biavatti - Mafra", cnpj: "00.000.000/0001-02", active: true, segment: "HEALTH" },
  { id: "CLI_DWMONTEC", name: "D W MONTEC LTDA", cnpj: "00.000.000/0001-03", active: true, segment: "INDUSTRY" },
  { id: "CLI_KAEX", name: "Kaex Logistica", cnpj: "00.000.000/0001-04", active: true, segment: "LOGISTICS" },
  { id: "CLI_KMINHO", name: "Kminho Engenharia e Empreendimentos", cnpj: "00.000.000/0001-05", active: true, segment: "CONSTRUCTION" },
  { id: "CLI_LATWAN", name: "LatWan", cnpj: "00.000.000/0001-06", active: true, segment: "TECHNOLOGY" },
  { id: "CLI_LVALLE", name: "LValle Engenharia LTDA", cnpj: "00.000.000/0001-07", active: true, segment: "CONSTRUCTION" },
  { id: "CLI_NOXI", name: "NOXI QUIMICA LTDA", cnpj: "00.000.000/0001-08", active: true, segment: "INDUSTRY" },
  { id: "CLI_PREMCELL", name: "Premcell", cnpj: "00.000.000/0001-09", active: true, segment: "INDUSTRY" },
  { id: "CLI_SPRINGER", name: "SPRINGER CARRIER LTDA", cnpj: "00.000.000/0001-10", active: true, segment: "INDUSTRY" },
  { id: "CLI_TRANSP_PRES", name: "Transportadora Presidente", cnpj: "00.000.000/0001-11", active: true, segment: "LOGISTICS" },
];

export const REAL_CONTRACTS = [
  { id: "CT_001", companyId: "CLI_BRDE", companyName: "BRDE", title: "BRDE - Solução 01", value: 85836.0, status: "Conquistado" },
  { id: "CT_002", companyId: "CLI_BRITANIA", companyName: "Britânia Eletrodomésticos", title: "Britânia Eletrodomésticos - Solução 01", value: 0.0, status: "Conquistado" },
  { id: "CT_003", companyId: "CLI_BRITANIA_B1B2", companyName: "Britânia Unidade B1/B2", title: "Britânia Unidade B1/B2 - Solução 01", value: 26778.24, status: "Conquistado" },
  { id: "CT_004", companyId: "CLI_BIAVATTI_MAFRA", companyName: "Clínica Biavatti - Mafra", title: "Clínica Biavatti - Mafra - Solução 01 (1)", value: 38727.76, status: "Conquistado" },
  { id: "CT_005", companyId: "CLI_BIAVATTI_MAFRA", companyName: "Clínica Biavatti - Mafra", title: "Clínica Biavatti - Mafra - Solução 01", value: 692.13, status: "Conquistado" },
  { id: "CT_006", companyId: "CLI_DWMONTEC", companyName: "D W MONTEC LTDA", title: "D W MONTEC LTDA - Solução 01", value: 1909.12, status: "Conquistado" },
  { id: "CT_007", companyId: "CLI_GULA", companyName: "GULA ALIMENTOS", title: "Esquina da Gulla - Solução 01", value: 3405.76, status: "Conquistado" },
  { id: "CT_008", companyId: "CLI_KAEX", companyName: "Kaex Logistica", title: "Kaex Logistica - Solução 01", value: 1000.0, status: "Conquistado" },
  { id: "CT_009", companyId: "CLI_KMINHO", companyName: "Kminho Engenharia e Empreendimentos", title: "Kminho Engenharia e Empreendimentos - Solução 01 (1)", value: 614.13, status: "Conquistado" },
  { id: "CT_010", companyId: "CLI_LATWAN", companyName: "LatWan", title: "LatWan - Solução 01", value: 1376.39, status: "Conquistado" },
  { id: "CT_011", companyId: "CLI_LVALLE", companyName: "LValle Engenharia LTDA", title: "Leandro - Solução 01", value: 31988.1, status: "Conquistado" },
  { id: "CT_012", companyId: "CLI_NATIVA", companyName: "NATIVA EMPREENDIMENTOS", title: "Nativa Empreendimentos - Solução 01", value: 88824.0, status: "Conquistado" },
  { id: "CT_013", companyId: "CLI_NATIVA", companyName: "NATIVA EMPREENDIMENTOS", title: "Nativa Empreendimentos - Solução 01 (1)", value: 5898.72, status: "Conquistado" },
  { id: "CT_014", companyId: "CLI_NOXI", companyName: "NOXI QUIMICA LTDA", title: "Elaine - Solução 01", value: 37275.93, status: "Conquistado" },
  { id: "CT_015", companyId: "CLI_PREMCELL", companyName: "Premcell", title: "Premcell - Solução 01", value: 1640.0, status: "Conquistado" },
  { id: "CT_016", companyId: "CLI_SPRINGER", companyName: "SPRINGER CARRIER LTDA", title: "SPRINGER CARRIER LTDA - Solução 02", value: 4770.45, status: "Conquistado" },
  { id: "CT_017", companyId: "CLI_TIMENOW", companyName: "TIMENOW GESTÃO DE OBRAS LTDA", title: "Time Now - Solução 01", value: 4350.0, status: "Conquistado" },
  { id: "CT_018", companyId: "CLI_TIMENOW", companyName: "TIMENOW GESTÃO DE OBRAS LTDA", title: "Time Now - Solução 01 (Refs)", value: 6691.0, status: "Conquistado" },
  { id: "CT_019", companyId: "CLI_TIMENOW", companyName: "TIMENOW GESTÃO DE OBRAS LTDA", title: "Time Now - Solução (1)", value: 4168.27, status: "Conquistado" },
  { id: "CT_020", companyId: "CLI_TIMENOW", companyName: "TIMENOW GESTÃO DE OBRAS LTDA", title: "Time Now - Solução 01 (2)", value: 9855.64, status: "Conquistado" },
  { id: "CT_021", companyId: "CLI_TRANSP_PRES", companyName: "Transportadora Presidente", title: "Transportadora Presidente - Solução 01", value: 11589.66, status: "Conquistado" },
];

export const REAL_EMPLOYEES = [
  { id: "EMP_NAT_01", name: "MARCOS SILVA", companyId: "CLI_NATIVA", job_role: { id: "ROL_PED", title: "Pedreiro", cbo: "7152-10" }, status: "active", cpf: "111.222.333-44" },
  { id: "EMP_NAT_02", name: "ADRIANO SANTOS", companyId: "CLI_NATIVA", job_role: { id: "ROL_SVP", title: "Servente", cbo: "7170-20" }, status: "active", cpf: "222.333.444-55" },
  { id: "EMP_NAT_03", name: "CARLOS OLIVEIRA", companyId: "CLI_NATIVA", job_role: { id: "ROL_ELE", title: "Eletricista", cbo: "7156-15" }, status: "active", cpf: "333.444.555-66" },
  { id: "EMP_001", name: "BRUNO GADELHA DA SILVA", companyId: "CLI_BRITANIA", job_role: { id: "ROL_HIDRO", title: "Hidrometrista", cbo: "3111-05" }, status: "active", cpf: "123.456.789-00" },
  { id: "EMP_002", name: "JOÃO BESTEL DE DEUS", companyId: "CLI_BRITANIA", job_role: { id: "ROL_TEC", title: "Técnico de Saneamento", cbo: "3111-10" }, status: "active", cpf: "987.654.321-11" },
  { id: "EMP_003", name: "ERICK DE OLIVEIRA HENRIQUE", companyId: "CLI_GULA", job_role: { id: "ROL_PROD", title: "Auxiliar de Produção", cbo: "7843-05" }, status: "active", cpf: "456.789.123-22" }
];

export const REAL_TRAININGS = [
  {
    id: "TRN_NATIVA_01",
    title: "Capacitação NR Integrada - Construção Civil",
    companyId: "CLI_NATIVA",
    companyName: "NATIVA EMPREENDIMENTOS",
    nrs: ["NR-18", "NR-35", "NR-11", "NR-12", "Riscos Psicossociais"],
    startDate: "2026-02-10",
    endDate: "2026-02-14",
    totalHours: 40,
    modality: "Presencial",
    status: "in_progress",
    students: [
      { id: "EMP_NAT_01", name: "MARCOS SILVA", status: "present" },
      { id: "EMP_NAT_02", name: "ADRIANO SANTOS", status: "present" },
      { id: "EMP_NAT_03", name: "CARLOS OLIVEIRA", status: "pending" }
    ]
  }
];

export const REAL_EXAMS_HISTORY = [
  { employeeName: "BRUNO GADELHA DA SILVA", companyId: "CLI_BRITANIA", date: "2026-02-02", type: "AD", provider: "ACRE", aso: "OK", s2220: "OK", s2240: "OK" },
  { employeeName: "ERICK DE OLIVEIRA HENRIQUE", companyId: "CLI_GULA", date: "2026-02-03", type: "PE", provider: "WORKING", aso: "OK", s2220: "OK", s2240: "OK" },
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
