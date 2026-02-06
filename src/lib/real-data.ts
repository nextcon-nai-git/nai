/**
 * Base de dados real extraída para carga massiva no sistema NEXTCON.
 * Atualizado com Britânia, CONSTRUFAM e NATIVA EMPREENDIMENTOS.
 */

export const REAL_COMPANIES = [
  { 
    id: "CLI037", 
    name: "BRITANIA ELETRODOMESTICOS SA", 
    city: "Joinville", 
    cnpj: "76.492.701/0011-29", 
    segment: "INDUSTRY", 
    address: "PIRABEIRABA, Joinville/SC", 
    phone: "(41) 3218-7700",
    email: "corporativo@britania.com.br"
  },
  { 
    id: "CLI117", 
    name: "BRITANIA ELETRODOMESTICOS SA (ANA SOFIA)", 
    city: "Joinville", 
    cnpj: "76.492.701/0014-71", 
    segment: "INDUSTRY", 
    address: "Joinville/SC",
    phone: "(41) 3218-7700",
    website: "www.britania.com.br" 
  },
  { 
    id: "CLI105", 
    name: "BRITANIA ELETRODOMESTICOS SA (RODRIGO)", 
    city: "Joinville", 
    cnpj: "76.492.701/0007-42", 
    segment: "INDUSTRY", 
    address: "Joinville/SC",
    phone: "(41) 3218-7700",
    website: "www.britania.com.br" 
  },
  {
    id: "CLI_CONSTRUFAM",
    name: "CONSTRUFAM ENGENHARIA E EMPREENDIMENTOS LTDA",
    city: "Curitiba",
    cnpj: "00.000.000/0001-00",
    segment: "CONSTRUCTION",
    address: "Curitiba/PR"
  },
  {
    id: "CLI_NATIVA",
    name: "NATIVA EMPREENDIMENTOS LTDA",
    city: "Curitiba",
    cnpj: "00.000.000/0001-99",
    segment: "CONSTRUCTION",
    address: "Curitiba/PR"
  },
  { id: "CLI129", name: "AC2 CORRETORA DE SEGUROS LTDA", city: "Curitiba", cnpj: "12.345.678/0001-29", segment: "GENERAL" },
];

export const REAL_EMPLOYEES = [
  // Nativa Empreendimentos
  { name: "JOAO SILVA PEDREIRO", companyId: "CLI_NATIVA", jobRole: "PEDREIRO", location: "OBRAS - EDIFÍCIO LAGUNA", admissionDate: "10/01/2024" },
  { name: "JOSE SANTOS AUXILIAR", companyId: "CLI_NATIVA", jobRole: "Servente de Obras", location: "OBRAS - EDIFÍCIO LAGUNA", admissionDate: "15/01/2024" },
  { name: "MARCOS OLIVEIRA PEDREIRO", companyId: "CLI_NATIVA", jobRole: "PEDREIRO", location: "OBRAS - EDIFÍCIO MONACO", admissionDate: "20/02/2024" },
  { name: "RICARDO LIMA SERVENTE", companyId: "CLI_NATIVA", jobRole: "Servente de Obras", location: "OBRAS - EDIFÍCIO MONACO", admissionDate: "22/02/2024" },

  // Britânia
  { name: "SIMONE MARAGNO DOS SANTOS", cpf: "000.000.000-01", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "01/01/2023" },
  { name: "BRUNA FELIX BRANCO", cpf: "000.000.000-02", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "09/07/2024" },
  { name: "HARANTHIA RODRIGUES SOUSA", cpf: "000.000.000-03", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "22/11/2023" },
  { name: "ELIANE VICENTIN", cpf: "000.000.000-04", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "10/05/2022" },
  
  // Construfam
  { id: "0000000012", name: "ADILSON JOSE DE LARA", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", admissionDate: "01/01/2024" },
  { id: "0000000001", name: "ADMERSON MORAES DE OSTI", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", admissionDate: "01/01/2024" },
];

export const REAL_EXPERTISES = [
  {
    id: "PER001",
    companyId: "CLI037",
    date: "2026-02-24T14:20:00",
    employeeName: "Simone Maragno dos Santos",
    value: 378700.08,
    jobRole: "Operador de Produção",
    caseNumber: "0002042-15.2025.5.12.0030",
    disease: "Lesão no Ombro / Manguito Rotador",
    status: "Quesitos Protocolados",
    type: "Médica",
    cid: "M75.1"
  },
  {
    id: "PER011",
    companyId: "CLI037",
    date: "2026-02-10T12:00:00",
    employeeName: "Jessica Gomes dos Santos",
    value: 1252734.93,
    jobRole: "Auxiliar Técnica",
    caseNumber: "0001556-52.2025.5.12.0050",
    disease: "Doença Ocupacional (9 anos)",
    status: "Quesitos Protocolados",
    type: "Médica",
    cid: "M75"
  }
];

export const REAL_EXAMS = [
  { name: "1,2 Ciclohexanodiol na Urina" },
  { name: "Acetilcolinesterase Eritrocitária" },
  { name: "Acuidade Visual - Ortho Rater" },
  { name: "Audiometria Tonal Ocupacional" },
  { name: "Avaliação Ergonômica" },
];
