/**
 * Base de dados real extraída para carga massiva no sistema NEXTCON.
 * Atualizado com Britânia Eletrodomésticos SA (CLI037) e todas as perícias reais enviadas.
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
  { id: "CLI129", name: "AC2 CORRETORA DE SEGUROS LTDA", city: "Curitiba", cnpj: "12.345.678/0001-29", segment: "GENERAL" },
  { id: "CLI140", name: "ALKANCE SOLUCOES", city: "Curitiba", cnpj: "12.345.678/0001-40", segment: "INDUSTRY" },
  { id: "CLI013", name: "Andes Negócios Digitais", city: "Curitiba", cnpj: "12.345.678/0001-13", segment: "GENERAL" },
  { id: "CLI014", name: "CDA STEEL FABRICACAO E MONTAGEM LTDA", city: "Curitiba", cnpj: "12.345.678/0001-14", segment: "INDUSTRY" },
];

export const REAL_EMPLOYEES = [
  { name: "SIMONE MARAGNO DOS SANTOS", cpf: "000.000.000-01", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "01/01/2023" },
  { name: "BRUNA FELIX BRANCO", cpf: "000.000.000-02", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "09/07/2024" },
  { name: "HARANTHIA RODRIGUES SOUSA", cpf: "000.000.000-03", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "22/11/2023" },
  { name: "ELIANE VICENTIN", cpf: "000.000.000-04", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "10/05/2022" },
  { name: "MARCELA GESSICA DA SILVA DE AMORIM", cpf: "000.000.000-05", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "12/02/2024" },
  { name: "XIOMARA JOSEFINA LOPEZ SALMERON", cpf: "000.000.000-06", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "15/03/2021" },
  { name: "ASTRID CAROLINA ZAMORA PEREZ", cpf: "000.000.000-07", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "10/01/2024" },
  { name: "LISLAINE REGINA BARBOSA DOS SANTOS", cpf: "000.000.000-08", companyId: "CLI037", jobRole: "Encarregada de Qualidade", admissionDate: "05/05/2020" },
  { name: "ELANE DA SILVA E SILVA", cpf: "000.000.000-09", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "20/12/2025" },
  { name: "LEANDRO RAMOS DA SILVA NETO", cpf: "000.000.000-10", companyId: "CLI037", jobRole: "Ajudante de galpão", admissionDate: "10/05/2025" },
  { name: "JESSICA GOMES DOS SANTOS", cpf: "000.000.000-11", companyId: "CLI037", jobRole: "Auxiliar Técnica", admissionDate: "10/02/2017" },
  { name: "SUELLEN MULLER AMARAL", cpf: "000.000.000-12", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "10/02/2024" },
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
    defenseStrategy: "Doença Degenerativa/Metabólica",
    defenseStrength: "Alta",
    status: "Quesitos Protocolados",
    type: "Médica",
    cid: "M75.1",
    technicalInfo: "Alegação de doença ocupacional. Solicita perícia para apurar redução da capacidade laborativa e nexo causal."
  },
  {
    id: "PER002",
    companyId: "CLI037",
    date: "2026-02-10T09:00:00",
    employeeName: "Bruna Felix Branco",
    value: 125547.48,
    jobRole: "Operador de Produção",
    caseNumber: "0001895-71.2025.5.12.0030",
    disease: "Lesões em Coluna, Pelve e Membros Inferiores",
    defenseStrategy: "Trauma Extralaboral",
    defenseStrength: "Muito Alta",
    status: "Quesitos Protocolados",
    type: "Médica",
    cid: "M54.5",
    technicalInfo: "Discussão sobre contrato de trabalho e condições laborais."
  },
  {
    id: "PER003",
    companyId: "CLI037",
    date: "2026-02-24T10:00:00",
    employeeName: "Haranthia Rodrigues Sousa",
    value: 130000.00,
    jobRole: "Operador de Produção",
    caseNumber: "0002069-20.2025.5.12.0050",
    disease: "Lesão Ocular e Transtornos Psiquiátricos",
    defenseStrategy: "Ausência de Afastamento Imediato",
    defenseStrength: "Média",
    status: "Quesitos Protocolados",
    type: "Médica",
    cid: "R52"
  },
  {
    id: "PER004",
    companyId: "CLI037",
    date: "2026-02-04T08:20:00",
    employeeName: "Eliane Vicentin",
    value: 308400.00,
    jobRole: "Operador de Produção",
    caseNumber: "0001035-10.2025.5.12.0050",
    disease: "Fascite Plantar, Tendinopatia, Bursite",
    defenseStrategy: "Nexo Técnico Epidemiológico (Negativo)",
    defenseStrength: "Alta",
    status: "Quesitos Protocolados",
    type: "Ergonômica",
    cid: "M77"
  },
  {
    id: "PER005",
    companyId: "CLI037",
    date: "2026-02-12T18:30:00",
    employeeName: "Marcela Gessica da Silva de Amorim",
    value: 393000.00,
    jobRole: "Operador de Produção",
    caseNumber: "0002041-93.2025.5.12.0004",
    disease: "Doenças Musculoesqueléticas",
    defenseStrategy: "Doença Constitucional",
    defenseStrength: "Média",
    status: "Quesitos Protocolados",
    type: "Ergonômica",
    cid: "M75"
  },
  {
    id: "PER006",
    companyId: "CLI037",
    date: "2025-11-10T17:00:00",
    employeeName: "Xiomara Josefina Lopez Salmeron",
    value: 88000.00,
    jobRole: "Operador de Produção",
    caseNumber: "0000453-70.2025.5.12.0030",
    disease: "Coluna Cervical, Ombros",
    defenseStrategy: "Fatores Biológicos/Degenerativos",
    defenseStrength: "Muito Alta",
    status: "Concluído",
    type: "Médica",
    cid: "M50"
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
    defenseStrategy: "Doença Multicausal / Degenerativa",
    defenseStrength: "Média",
    status: "Quesitos Protocolados",
    type: "Médica",
    cid: "M75"
  },
  {
    id: "PER012",
    companyId: "CLI037",
    date: "2026-02-10T12:30:00",
    employeeName: "Suellen Muller Amaral",
    value: 55548.00,
    jobRole: "Operador de Produção",
    caseNumber: "0001565-14.2025.5.12.0050",
    disease: "Negligência / Falta EPI",
    defenseStrategy: "Responsabilidade Subjetiva",
    defenseStrength: "Baixa",
    status: "Quesitos Protocolados",
    type: "Médica",
    cid: "M54"
  }
];
