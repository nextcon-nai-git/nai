
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
