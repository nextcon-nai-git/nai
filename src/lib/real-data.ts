
/**
 * Base de dados real extraída para carga massiva no sistema NEXTCON.
 */

export const REAL_COMPANIES = [
  { id: "CLI129", name: "AC2 CORRETORA DE SEGUROS LTDA", city: "Curitiba", cnpj: "12.345.678/0001-29", segment: "GENERAL" },
  { id: "CLI140", name: "ALKANCE SOLUCOES", city: "Curitiba", cnpj: "12.345.678/0001-40", segment: "INDUSTRY" },
  { id: "CLI013", name: "Andes Negócios Digitais", city: "Curitiba", cnpj: "12.345.678/0001-13", segment: "GENERAL" },
  { id: "CLI116", name: "ANDRE LUIS FRANCA DE NARDE SOCIEDADE INDIVIDUAL DE ADVOCACIA", city: "Curitiba", cnpj: "12.345.678/0001-16", segment: "GENERAL" },
  { id: "CLI024", name: "ATLAS PARANA DESENVOLVIMENTO E ELETROTECNICA LTDA", city: "Curitiba", cnpj: "12.345.678/0001-24", segment: "INDUSTRY" },
  { id: "CLI093", name: "Barabach & Knopp Engenharia e Tecnologia", city: "Curitiba", cnpj: "12.345.678/0001-93", segment: "CONSTRUCTION" },
  { id: "CLI036", name: "BASSETTO,GRAHL E MADUREIRA SOCIEDADE DE ADVOGADOS", city: "Curitiba", cnpj: "12.345.678/0001-36", segment: "GENERAL" },
  { id: "CLI121", name: "BCS APOIO ADMINISTRATIVO LTDA", city: "Curitiba", cnpj: "12.345.678/0001-21", segment: "GENERAL" },
  { id: "CLI001", name: "BERNARDI DISTRIBUIDORA", city: "Curitiba", cnpj: "12.345.678/0001-01", segment: "GENERAL" },
  { id: "CLI014", name: "CDA STEEL FABRICACAO E MONTAGEM LTDA", city: "Curitiba", cnpj: "12.345.678/0001-14", segment: "INDUSTRY" },
  { id: "CLI025", name: "CENTRAL TURBOS PARANA", city: "Curitiba", cnpj: "12.345.678/0001-25", segment: "INDUSTRY" },
  { id: "CLI026", name: "CHARFAV COMERCIO DE MEDICAMENTOS E PERFUMARIA LTDA", city: "Curitiba", cnpj: "12.345.678/0001-26", segment: "HOSPITAL" },
  { id: "CLI064", name: "Clinica Biavatti", city: "Curitiba", cnpj: "12.345.678/0001-64", segment: "HOSPITAL" },
  { id: "CLI124", name: "CONSTRUFAM ENGENHARIA E EMPREENDIMENTOS LTDA", city: "Curitiba", cnpj: "12.345.678/0001-24", segment: "CONSTRUCTION" },
  { id: "CLI125", name: "DE LUCCA MANUTENÇÕES", city: "Curitiba", cnpj: "12.345.678/0001-25", segment: "INDUSTRY" },
  { id: "CLI055", name: "DW Montec", city: "Curitiba", cnpj: "12.345.678/0001-55", segment: "INDUSTRY" },
  { id: "CLI037", name: "METALURGICA SUL LTDA", city: "Curitiba", cnpj: "12.345.678/0001-37", segment: "INDUSTRY" },
];

export const REAL_EMPLOYEES = [
  { name: "ANA ISABELA RIBEIRO CECHETTO", cpf: "497.978.917-84", companyId: "CLI129", jobRole: "Mecânico de Manutenção", ghe: "GHE 03 - Manutenção", admissionDate: "07/10/2025" },
  { name: "LAIZ VIRGINIA DOS SANTOS DAL MEDICO MENDES", cpf: "497.978.917-85", companyId: "CLI129", jobRole: "Mecânico de Manutenção", ghe: "GHE 03 - Manutenção", admissionDate: "07/10/2025" },
  { name: "LARISSA STHEFANI SAES", cpf: "319.767.991-63", companyId: "CLI129", jobRole: "Empilhadeirista", ghe: "GHE 04 - Logística", admissionDate: "09/02/2021" },
  { name: "MARCELLI DE LIMA PEIXOTO", cpf: "199.898.655-50", companyId: "CLI129", jobRole: "Recepcionista", ghe: "GHE 01 - Administrativo", admissionDate: "27/03/2022" },
  { name: "PAULA FERREIRA KUCHANOVICZ", cpf: "750.494.945-90", companyId: "CLI129", jobRole: "Auxiliar de Logística", ghe: "GHE 04 - Logística", admissionDate: "24/05/2023" },
  { name: "ROSELY MUNHOS SCHUINDT DA SILVA", cpf: "961.586.877-77", companyId: "CLI129", jobRole: "Eletricista", ghe: "GHE 03 - Manutenção", admissionDate: "18/01/2022" },
  { name: "SORIANE FLORENCIO SILVA", cpf: "961.586.877-75", companyId: "CLI129", jobRole: "Eletricista", ghe: "GHE 03 - Manutenção", admissionDate: "18/01/2022" },
  { name: "VANESSA DE CASTRO MOREIRA MIRANDA", cpf: "441.932.712-80", companyId: "CLI129", jobRole: "Recepcionista", ghe: "GHE 01 - Administrativo", admissionDate: "22/07/2023" },
  { name: "BRENDA DE FREITAS FERNANDES", cpf: "378.454.183-64", companyId: "CLI140", jobRole: "Auxiliar de Logística", ghe: "GHE 04 - Logística", admissionDate: "30/11/2024" },
  { name: "SIMONE MARAGNO DOS SANTOS", cpf: "000.000.000-01", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "01/01/2023" },
  { name: "BRUNA FELIX BRANCO", cpf: "000.000.000-02", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "09/07/2024" },
  { name: "HARANTHIA RODRIGUES SOUSA", cpf: "000.000.000-03", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "22/11/2023" },
  { name: "ELIANE VICENTIN", cpf: "000.000.000-04", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "10/05/2022" },
  { name: "LEANDRO RAMOS DA SILVA NETO", cpf: "000.000.000-10", companyId: "CLI037", jobRole: "Ajudante de galpão", admissionDate: "10/05/2025" },
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
    cid: "M75.1"
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
    cid: "M54.5"
  },
  {
    id: "PER004",
    companyId: "CLI037",
    date: "2026-02-04T08:20:00",
    employeeName: "Eliane Vicentin",
    value: 308400.00,
    jobRole: "Operador de Produção",
    caseNumber: "0001035-10.2025.5.12.0050",
    disease: "Fascite Plantar, Tendinopatia",
    defenseStrategy: "Nexo Técnico Epidemiológico (Negativo)",
    defenseStrength: "Alta",
    status: "Quesitos Protocolados",
    type: "Ergonômica",
    cid: "M77"
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
    id: "PER010",
    companyId: "CLI037",
    date: "2026-01-27T09:40:00",
    employeeName: "Leandro Ramos da Silva Neto",
    value: 199421.00,
    jobRole: "Ajudante de galpão",
    caseNumber: "0001736-68.2025.5.12.0050",
    disease: "Fratura dos 3º e 4º Metacarpos",
    defenseStrategy: "Inexistência de incapacidade laborativa atual",
    defenseStrength: "Alta",
    status: "Concluído",
    type: "Acidente",
    cid: "S62.3"
  }
];
