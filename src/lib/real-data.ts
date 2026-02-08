
/**
 * Base de dados real extraída para carga massiva no sistema NextCon.
 * Implementa Desnormalização de Cargos e Hierarquia de Unidades.
 */

export const REAL_COMPANIES = [
  { 
    id: "CLI_TIMENOW", 
    name: "TIMENOW GESTÃO DE OBRAS LTDA", 
    city: "Vitória", 
    state: "ES", 
    cnpj: "48.865.462/0001-06", 
    segment: "CONSTRUCTION", 
    isParent: true 
  },
  { id: "CLI_CONSTRUFAM", name: "CONSTRUFAM ENGENHARIA", city: "Curitiba", state: "PR", cnpj: "12.345.678/0001-90", segment: "CONSTRUCTION" },
  { id: "CLI_GULA", name: "GULA ALIMENTOS", city: "Curitiba", state: "PR", cnpj: "98.765.432/0001-10", segment: "INDUSTRY" },
];

export const REAL_EMPLOYEES = [
  { 
    id: "EMP_CON_01", 
    name: "BRUNO GADELHA DA SILVA", 
    companyId: "CLI_CONSTRUFAM", 
    job_role: { id: "ROL_HIDRO", title: "Hidrometrista", cbo: "3111-05" },
    status: "active"
  },
  { 
    id: "EMP_CON_02", 
    name: "JOÃO BESTEL DE DEUS", 
    companyId: "CLI_CONSTRUFAM", 
    job_role: { id: "ROL_TEC", title: "Técnico de Saneamento", cbo: "3111-10" },
    status: "active"
  },
  { 
    id: "EMP_GUL_01", 
    name: "ERICK DE OLIVEIRA HENRIQUE", 
    companyId: "CLI_GULA", 
    job_role: { id: "ROL_PROD", title: "Auxiliar de Produção", cbo: "7843-05" },
    status: "active"
  }
];

export const REAL_EXAMS_HISTORY = [
  { employeeName: "BRUNO GADELHA DA SILVA", companyId: "CLI_CONSTRUFAM", date: "2026-02-02", type: "AD", provider: "ACRE", aso: "OK" },
  { employeeName: "ERICK DE OLIVEIRA HENRIQUE", companyId: "CLI_GULA", date: "2026-02-03", type: "PE", provider: "WORKING", aso: "OK" },
];
