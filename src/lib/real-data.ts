/**
 * NEXTCON PLATFORM - BASE DE DADOS REAL 2026
 * Fonte única de verdade para faturamento, contratos, clientes, prestadores e atendimentos.
 * Integração Oficial: COCEL e NATIVA EMPREENDIMENTOS
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
  { 
    id: "NATIVA_51", 
    name: "NATIVA EMPREENDIMENTOS", 
    cnpj: "51.633.820/0001-51", 
    active: true, 
    risk_degree: 3, 
    segment: "CONSTRUCTION", 
    city: "Guaratuba", 
    state: "PR",
    address: "Avenida Dr João Cândido, 755 - Edifício Laguna"
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
  }
];

export const REAL_EMPLOYEES = [
  { id: "COL_NATIVA_01", name: "CASSIO VINICIUS", cpf: "000.000.000-00", companyId: "NATIVA_51", jobRole: "Engenheiro Civil", status: "active" },
  { id: "COL_COCEL_01", name: "RAFAEL ROGISKI (DIRETOR)", cpf: "000.000.000-00", companyId: "COCEL_75", jobRole: "Presidente", status: "active" },
  { id: "COL_COCEL_02", name: "OPERADOR DE REDE COCEL", cpf: "111.222.333-44", companyId: "COCEL_75", jobRole: "Eletricista", status: "active" }
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

export const REAL_HIERARCHICAL_DATA = [
  {
    id_cliente: "COCEL_75",
    nome_fantasia: "COCEL",
    razao_social: "COMPANHIA CAMPOLARGUENSE DE ENERGIA",
    total_vidas: 142,
    colaboradores: [
      { id_colaborador: "COL_COCEL_01", name: "RAFAEL ROGISKI", cpf: "000.000.000-00", jobTitle: "DIRETOR" }
    ]
  },
  {
    id_cliente: "NATIVA_51",
    nome_fantasia: "NATIVA",
    razao_social: "NATIVA EMPREENDIMENTOS",
    total_vidas: 664,
    colaboradores: [
      { id_colaborador: "COL_NATIVA_01", name: "CASSIO VINICIUS", cpf: "000.000.000-00", jobTitle: "ENGENHEIRO" }
    ]
  }
];
