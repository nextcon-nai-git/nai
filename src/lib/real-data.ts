/**
 * Base de dados real extraída para carga massiva no sistema NextCon.
 * Implementa Hierarquia de Unidades e Vínculo de Exames Ocupacionais.
 */

export const REAL_COMPANIES = [
  // CONTRATOS MASTER (PAIS)
  { id: "CLI_TIMENOW", name: "TIMENOW GESTÃO DE OBRAS LTDA", city: "Vitória", state: "ES", cnpj: "48.865.462/0001-06", segment: "CONSTRUCTION", isParent: true },
  
  // SUBUNIDADES TIME NOW (FILHOS)
  { id: "TN_SOLENIS_IGARASSU", name: "SOLENIS - IGARASSU PE", city: "Igarassu", state: "PE", segment: "INDUSTRY", parentId: "CLI_TIMENOW", address: "ROD PE-041, S/N - KM 6.5, ARARIPE CEP: 53.659-899 - IGARASSU – PE" },
  { id: "TN_AM_VEGA", name: "ARCELORMITTAL VEGA", city: "São Francisco do Sul", state: "SC", segment: "INDUSTRY", parentId: "CLI_TIMENOW", address: "Rodovia Duque de Caxias, s/n - Iperoba, São Francisco do Sul - SC" },
  { id: "TN_NESTLE_CACAPAVA", name: "NESTLE CAÇAPAVA", city: "Caçapava", state: "SP", segment: "INDUSTRY", parentId: "CLI_TIMENOW", address: "Av. Henry Nestle, 1800 - Vila Galvão, Caçapava - SP" },
  { id: "TN_SUZANO_TL", name: "SUZANO TRÊS LAGOAS", city: "Três Lagoas", state: "MS", segment: "INDUSTRY", parentId: "CLI_TIMENOW", address: "ROD BR 158 KM 298, S/N - Três Lagoas - MS" },
  { id: "TN_VALE_SALOBO", name: "VALE - MINA DO SALOBO", city: "Marabá", state: "PA", segment: "INDUSTRY", parentId: "CLI_TIMENOW", address: "Estrada Mina do Salobo, s/n - Marabá - PA" },
  
  // EMPRESAS GERAIS
  { id: "CLI_CONSTRUFAM", name: "CONSTRUFAM ENGENHARIA", city: "Curitiba", state: "PR", segment: "CONSTRUCTION" },
  { id: "CLI_GULA", name: "GULA ALIMENTOS", city: "Curitiba", state: "PR", segment: "INDUSTRY" },
  { id: "CLI_PROMATEC", name: "PROMATEC SERVICOS", city: "Curitiba", state: "PR", segment: "INDUSTRY" },
  { id: "CLI_MONTEC", name: "MONTEC MONTAGENS", city: "Curitiba", state: "PR", segment: "CONSTRUCTION" },
  { id: "CLI_INCORPORADORA", name: "INCORPORADORA GRAN-PARA", city: "Curitiba", state: "PR", segment: "CONSTRUCTION" },
  { id: "CLI_LLM", name: "LLM TERRAPLENAGEM", city: "Curitiba", state: "PR", segment: "CONSTRUCTION" },
  { id: "CLI_BIAVATTI", name: "BIAVATTI LTDA", city: "Curitiba", state: "PR", segment: "GENERAL" },
  { id: "CLI_GIROTECH", name: "GIROTECH TECNOLOGIA", city: "Curitiba", state: "PR", segment: "INDUSTRY" },
  { id: "CLI_PRMAX", name: "PRMAX SERVICOS", city: "Curitiba", state: "PR", segment: "GENERAL" },
  { id: "CLI_CDA", name: "CDA STEEL FABRICACAO", city: "Curitiba", state: "PR", segment: "INDUSTRY" },
  { id: "CLI_VERSUS", name: "VERSUS SEGURANCA", city: "Curitiba", state: "PR", segment: "GENERAL" },
  { id: "CLI_PLM", name: "PLM REFORMAS EM GERAL", city: "Curitiba", state: "PR", segment: "CONSTRUCTION" },
  { id: "CLI_ESSENCIAL", name: "ESCOLA ESSENCIAL VIRTUDES", city: "Curitiba", state: "PR", segment: "GENERAL" },
  { id: "CLI_NXC", name: "NXC SST EMPRESARIAL", city: "Curitiba", state: "PR", segment: "GENERAL" },
  { id: "CLI_NOXI", name: "NOXI QUIMICA", city: "Curitiba", state: "PR", segment: "INDUSTRY" },
  { id: "CLI_CENTRAL_TURBOS", name: "CENTRAL TURBOS PARANA", city: "Curitiba", state: "PR", segment: "INDUSTRY" },
  { id: "CLI_PRIMOR", name: "PRIMOR SERVICOS", city: "Curitiba", state: "PR", segment: "GENERAL" },
];

export const REAL_EMPLOYEES = [
  // CONSTRUFAM
  { id: "EMP_CON_01", name: "BRUNO GADELHA DA SILVA", companyId: "CLI_CONSTRUFAM", jobRole: "Hidrometrista" },
  { id: "EMP_CON_02", name: "JOÃO BESTEL DE DEUS", companyId: "CLI_CONSTRUFAM", jobRole: "Técnico" },
  { id: "EMP_CON_03", name: "PAULO HENRIQUE MASTECK", companyId: "CLI_CONSTRUFAM", jobRole: "Operacional" },
  // GULA
  { id: "EMP_GUL_01", name: "ERICK DE OLIVEIRA HENRIQUE", companyId: "CLI_GULA", jobRole: "Produção" },
  { id: "EMP_GUL_02", name: "ANTONIO ROBERTO PEREIRA", companyId: "CLI_GULA", jobRole: "Logística" },
  { id: "EMP_GUL_03", name: "SIDNEY GOMES PERCHIS", companyId: "CLI_GULA", jobRole: "Ajudante" },
  // PROMATEC
  { id: "EMP_PRO_01", name: "LUCIANO GREIN", companyId: "CLI_PROMATEC", jobRole: "Técnico" },
  { id: "EMP_PRO_02", name: "DIEGO RAMOS LEONE", companyId: "CLI_PROMATEC", jobRole: "Manutenção" },
  // MONTEC
  { id: "EMP_MON_01", name: "FELIPE ANDREACI SUEROZ", companyId: "CLI_MONTEC", jobRole: "Montador" },
  { id: "EMP_MON_02", name: "LEONILSON DE OLIVEIRA", companyId: "CLI_MONTEC", jobRole: "Soldador" },
  // BIAVATTI
  { id: "EMP_BIA_01", name: "ANGELICA ALBINA KOVASKI ARAGAO", companyId: "CLI_BIAVATTI", jobRole: "Vendas" },
  { id: "EMP_BIA_02", name: "CAMILA INES BITHENCOURT DE SOUZA", companyId: "CLI_BIAVATTI", jobRole: "Administrativo" },
];

export const REAL_EXAMS_HISTORY = [
  { employeeName: "BRUNO GADELHA DA SILVA", companyName: "CONSTRUFAM", date: "2026-02-02", type: "AD", provider: "ACRE", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "JOÃO BESTEL DE DEUS", companyName: "CONSTRUFAM", date: "2026-02-03", type: "PE", provider: "ACRE", aso: "pendente", s2220: "pendente", s2240: "pendente" },
  { employeeName: "ERICK DE OLIVEIRA HENRIQUE", companyName: "GULA", date: "2026-02-03", type: "PE", provider: "WORKING", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "ANTONIO ROBERTO PEREIRA", companyName: "GULA", date: "2026-02-03", type: "PE", provider: "WORKING", aso: "pendente", s2220: "pendente", s2240: "pendente" },
  { employeeName: "LUCIANO GREIN", companyName: "PROMATEC", date: "2026-02-03", type: "PE", provider: "WORKING", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "DIEGO RAMOS LEONE", companyName: "PROMATEC", date: "2026-02-03", type: "PE", provider: "WORKING", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "FELIPE ANDREACI SUEROZ", companyName: "MONTEC", date: "2026-02-03", type: "PE", provider: "COLOMBO", aso: "pendente", s2220: "pendente", s2240: "pendente" },
  { employeeName: "JOCEMAR BUENO", companyName: "INCORPORADORA", date: "2026-02-03", type: "AD", provider: "U DA VIT", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "LANA FELES ARRUDA", companyName: "PRIMOR", date: "2026-01-29", type: "AD", provider: "WORKING", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "CRISTIAN PIRES DE LIMA", companyName: "INCORPORADORA", date: "2026-01-23", type: "AD", provider: "N/I", aso: "OK", s2220: "NA", s2240: "NA" },
  { employeeName: "Brenno Gabriel Gomes Tanelo", companyName: "CENTRAL TURBOS", date: "2026-01-19", type: "AD", provider: "N/I", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "Helder Leonei Becker de Souza", companyName: "NATIVA", date: "2026-01-19", type: "PE", provider: "N/I", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "ANGELICA ALBINA KOVASKI ARAGAO", companyName: "BIAVATTI", date: "2026-01-19", type: "PE", provider: "WORKING", aso: "OK", s2220: "pendente", s2240: "pendente" },
  { employeeName: "MARCELON GOMES DA SILVA", companyName: "NXC", date: "2025-10-06", type: "PE", provider: "SQV", aso: "OK", s2220: "OK", s2240: "OK" },
];

export const REAL_EXAMS = [
  { name: "Avaliação Clínica (ASO)" },
  { name: "Audiometria Tonal Ocupacional" },
  { name: "Espirometria" },
  { name: "Eletrocardiograma (ECG)" },
  { name: "Eletroencefalograma (EEG)" },
  { name: "Radiografia de Tórax (Padrão OIT)" },
  { name: "Hemograma Completo" },
  { name: "Glicemia de Jejum" },
  { name: "Avaliação Psicossocial (Trabalho em Altura / Espaço Confinado)" },
  { name: "Acuidade Visual" },
  { name: "Toxicológico (Larga Janela)" },
  { name: "Ácido Hipúrico (Xileno)" },
  { name: "Ácido Metil-Hipúrico (Tolueno)" },
  { name: "Chumbo Sangüíneo" },
  { name: "Colinesterase Plasmática (Agrotóxicos Organofosforados)" },
  { name: "Cádmio Sangüíneo" },
  { name: "Cromo Urinário" },
  { name: "Fenol Urinário (Benzeno)" },
  { name: "Mercúrio Urinário" },
  { name: "Manganês Urinário" },
  { name: "Níquel Urinário" },
  { name: "Ácido Mandélico (Estireno)" },
  { name: "Ácido Trans, Trans-Mucônico (Benzeno)" },
  { name: "Coproporfirina Urinária" },
  { name: "Protoporfirina Zíncica (ZPP)" },
  { name: "Creatinina Urinária" },
  { name: "Acido Tricloroacetico (Tricloroetileno)" },
  { name: "Metanol Urinário" },
  { name: "Carboxihemoglobina (Monóxido de Carbono)" },
  { name: "Metahemoglobina (Anilina/Nitrobenzeno)" },
  { name: "Reticulócitos" },
  { name: "Plaquetas" },
  { name: "Gama-GT" },
  { name: "TGO / TGP" },
  { name: "Ureia e Creatinina" },
  { name: "VDRL" },
  { name: "HBSAG / Anti-HBS" },
  { name: "Anti-HCV" },
  { name: "Parasitológico de Fezes (PPF)" },
  { name: "Coprocultura" },
  { name: "Escarro (Pesquisa de BAAR)" },
];
