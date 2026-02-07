/**
 * Base de dados real extraída para carga massiva no sistema NextCon.
 * Implementa Hierarquia de Unidades (Subpastas) para contratos master como Time Now.
 */

export const REAL_COMPANIES = [
  // --- CLIENTE MASTER: TIME NOW ---
  { 
    id: "CLI_TIMENOW", 
    name: "TIMENOW GESTÃO DE OBRAS LTDA", 
    city: "Vitória", 
    state: "ES",
    cnpj: "48.865.462/0001-06", 
    segment: "CONSTRUCTION", 
    isParent: true,
    updatedAt: new Date().toISOString()
  },
  
  // --- SUBUNIDADES TIME NOW (PASTAS) ---
  { id: "TN_SUZANO_TL", parentId: "CLI_TIMENOW", name: "SUZANO TRÊS LAGOAS", city: "Três Lagoas", state: "MS", address: "ROD BR 158 KM 298, S/N", segment: "INDUSTRY", riskGrade: "3" },
  { id: "TN_SUZANO_JAC", parentId: "CLI_TIMENOW", name: "SUZANO JACAREÍ", city: "Jacareí", state: "SP", address: "Rod. Gen. Euryale de Jesus Zerbine, Km 84", segment: "INDUSTRY" },
  { id: "TN_SUZANO_CER", parentId: "CLI_TIMENOW", name: "SUZANO CERRADO", city: "Ribas do Rio Pardo", state: "MS", address: "Rodovia BR margem direita do Km 617", segment: "INDUSTRY", riskGrade: "3" },
  { id: "TN_VALE_SALOBO", parentId: "CLI_TIMENOW", name: "VALE PARADAS GPPI SALOBO - 15", city: "Marabá", state: "PA", address: "Acampamento 3 Alfa – Floresta Nacional Tapirape", segment: "INDUSTRY" },
  { id: "TN_VALE_PSHIFT", parentId: "CLI_TIMENOW", name: "VALE 13 - POWER SHIFT", city: "Vitória", state: "ES", address: "Avenida Dante Michelini, 5500", segment: "INDUSTRY", cnpj: "33.592.510/0220-42" },
  { id: "TN_VALE_PREDITIVA", parentId: "CLI_TIMENOW", name: "VALE INSPEÇÃO PREDITIVA - 14", city: "Vitória", state: "ES", address: "Avenida Dante Michelini, 5500", segment: "INDUSTRY" },
  { id: "TN_NESTLE_CAC", parentId: "CLI_TIMENOW", name: "NESTLE CAÇAPAVA - SP", city: "Caçapava", state: "SP", address: "AV: Henry Nestle, 1800", segment: "INDUSTRY", riskGrade: "3" },
  { id: "TN_VALE_BRIQUET", parentId: "CLI_TIMENOW", name: "VALE 16 - BRIQUETAGEM VIX", city: "Vitória", state: "ES", address: "Avenida Dante Michelini, 5500", segment: "INDUSTRY" },
  { id: "TN_VPORTS", parentId: "CLI_TIMENOW", name: "VPORTS 01", city: "Vitória", state: "ES", address: "AV GETULIO VARGAS, 556", segment: "GENERAL" },
  { id: "TN_SUZANO_ARA", parentId: "CLI_TIMENOW", name: "SUZANO - ARACRUZ - ES", city: "Aracruz", state: "ES", address: "Rod. Aracruz x Barra do Riacho S/N Km 25", segment: "INDUSTRY" },
  { id: "TN_BAYER_CAM", parentId: "CLI_TIMENOW", name: "BAYER 02 CAMAÇARI BA", city: "Camaçari", state: "BA", address: "Rua Eterno, 5001", segment: "INDUSTRY", riskGrade: "3" },
  { id: "TN_SUZANO_MODAL", parentId: "CLI_TIMENOW", name: "SUZANO 18 - Impl.Terminal Modal", city: "Inocência", state: "MS", address: "Rod MS 316, Km 66", segment: "INDUSTRY" },
  { id: "TN_SUZANO_SAN", parentId: "CLI_TIMENOW", name: "SUZANO 19", city: "Santos", state: "SP", address: "Av. Governador Mário Covas Junior, S/N", segment: "INDUSTRY" },
  { id: "TN_ALCOA_POCOS", parentId: "CLI_TIMENOW", name: "ALCOA - POÇOS DE CALDAS", city: "Poços de Caldas", state: "MG", address: "ROD POCOS DE CALDAS - ANDRADAS KM 10", segment: "INDUSTRY", riskGrade: "3" },
  { id: "TN_ALCOA_JURUTI", parentId: "CLI_TIMENOW", name: "ALCOA - UNIDADE JURUTI - PA", city: "Juruti", state: "PA", address: "LG ENSEADA DO LAGO GRANDE DE JURUTI", segment: "INDUSTRY" },
  { id: "TN_BUNGE_MT", parentId: "CLI_TIMENOW", name: "Bunge - Projeto Caldeira - MT", city: "Rondonópolis", state: "MT", address: "ROD BR 364, SN", segment: "INDUSTRY" },
  { id: "TN_BUNGE_BA", parentId: "CLI_TIMENOW", name: "Bunge - Corporativo - BA", city: "Luis Eduardo Magalhaes", state: "BA", address: "AV DIOCLECIO RAMOS, 1636", segment: "INDUSTRY" },
  { id: "TN_CONTINENTAL", parentId: "CLI_TIMENOW", name: "CONTINENTAL PNEUS", city: "Camaçari", state: "BA", address: "Rod Ba 530 Via Cetrel", segment: "INDUSTRY" },
  { id: "TN_VALE_INSP_PA", parentId: "CLI_TIMENOW", name: "VALE 15 - INSPEÇAO PARA", city: "Marabá", state: "PA", address: "Floresta Nacional Tapirape Aquiri", segment: "INDUSTRY" },
  { id: "TN_VALE_FERROVIA", parentId: "CLI_TIMENOW", name: "VALE – FERROVIA (PA/MA)", city: "São Luis", state: "MA", address: "Av dos Portugueses, S/N", segment: "INDUSTRY" },
  { id: "TN_DOW_PA", parentId: "CLI_TIMENOW", name: "DOW QUIMICOS ( BREU BCO - PA )", city: "Breu Branco", state: "PA", address: "ROD PA 263 KM 35", segment: "INDUSTRY" },
  { id: "TN_DORF", parentId: "CLI_TIMENOW", name: "DORF KETAL BRASIL LTDA", city: "Nova Santa Rita", state: "RS", address: "RUA DA PEDREIRA, 559", segment: "INDUSTRY" },
  { id: "TN_SOLENIS", parentId: "CLI_TIMENOW", name: "SOLENIS - PE", city: "Igarassu", state: "PE", address: "ROD PE-041, S/N", segment: "INDUSTRY" },
  { id: "TN_AM_PECEM", parentId: "CLI_TIMENOW", name: "Arcelormittal-Pecem-CE", city: "Pecem", state: "CE", address: "ROD CE - 085", segment: "INDUSTRY" },
  { id: "TN_VEGA", parentId: "CLI_TIMENOW", name: "Arcellor Mittal Vega", city: "São Francisco do Sul", state: "SC", address: "BR-280, Vega", segment: "INDUSTRY" },

  // --- OUTROS CLIENTES ---
  { id: "CLI037", name: "BRITANIA ELETRODOMESTICOS SA", city: "Joinville", state: "SC", cnpj: "76.492.701/0011-29", segment: "INDUSTRY" },
  { id: "CLI_CONSTRUFAM", name: "CONSTRUFAM ENGENHARIA", city: "Curitiba", state: "PR", segment: "CONSTRUCTION" },
  { id: "CLI_NATIVA", name: "NATIVA EMPREENDIMENTOS", city: "Curitiba", state: "PR", segment: "CONSTRUCTION" }
];

export const REAL_EMPLOYEES = [
  { name: "ANALISTA ADM MODELO", companyId: "TN_VEGA", jobRole: "Analista Técnico", status: "ACTIVE" },
  { name: "TECNICO DE CAMPO MODELO", companyId: "TN_VEGA", jobRole: "Técnico de Campo", status: "ACTIVE" },
  { name: "SIMONE MARAGNO", companyId: "CLI037", jobRole: "Operador de Produção", status: "ACTIVE" },
];

export const REAL_EXPERTISES = [
  { id: "PER001", companyId: "CLI037", date: "2026-02-24T14:20:00", employeeName: "Simone Maragno dos Santos", value: 378700.08, caseNumber: "0002042-15.2025.5.12.0030", disease: "Lesão no Ombro", status: "Quesitos Protocolados", type: "Médica", cid: "M75.1" }
];

export const REAL_EXAMS = [
  { name: "Avaliação Clínica (ASO)" },
  { name: "Audiometria Tonal Ocupacional" },
  { name: "Espirometria" },
  { name: "Eletrocardiograma (ECG)" },
  { name: "Radiografia de Tórax (Padrão OIT)" },
  { name: "Hemograma Completo" },
  { name: "Glicemia de Jejum" },
  { name: "Avaliação Psicossocial" },
  { name: "Acuidade Visual" }
];
