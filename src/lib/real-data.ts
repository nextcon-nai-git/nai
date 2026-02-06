/**
 * Base de dados real extraída para carga massiva no sistema NEXTCON.
 * Clientes e Colaboradores vinculados por companyId.
 */

export const REAL_COMPANIES = [
  { 
    id: "CLI_TIMENOW", 
    name: "TIMENOW GESTÃO DE OBRAS LTDA", 
    unit: "ArcelorMittal Vega",
    city: "São Francisco do Sul", 
    cnpj: "48.865.462/0001-06", 
    segment: "CONSTRUCTION", 
    address: "BR-280, ArcelorMittal Vega", 
    phone: "(27) 3348-1000",
    email: "contato@timenow.com.br",
    cnae: "4399-1/01",
    riskGrade: "3"
  },
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
    address: "Joinville/SC"
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
  }
];

export const REAL_EMPLOYEES = [
  // --- TIMENOW GESTÃO DE OBRAS (ArcelorMittal Vega) ---
  { name: "ANALISTA ADM MODELO", companyId: "CLI_TIMENOW", jobRole: "Analista Técnico", ghe: "GHE 01 - ADMINISTRATIVO", status: "ACTIVE" },
  { name: "ENGENHEIRO ELETRICO MODELO", companyId: "CLI_TIMENOW", jobRole: "Engenheiro(a) de Projetos", ghe: "GHE 02 - PROJETOS ELÉTRICOS", status: "ACTIVE" },
  { name: "ANALISTA PLANEJAMENTO MODELO", companyId: "CLI_TIMENOW", jobRole: "Analista de Planejamento", ghe: "GHE 03 - GESTÃO DE PROJETOS", status: "ACTIVE" },
  { name: "TECNICO DE CAMPO MODELO", companyId: "CLI_TIMENOW", jobRole: "Técnico de Campo (Elétrico)", ghe: "GHE 04 - FISCALIZAÇÃO", status: "ACTIVE", hazard: "Ruído 90.4 dB", specialRetirement: true },

  // --- BRITÂNIA SA (CLI037) ---
  { name: "SIMONE MARAGNO DOS SANTOS", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "01/01/2023", status: "ACTIVE" },
  { name: "BRUNA FELIX BRANCO", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "09/07/2024", status: "ACTIVE" },
  { name: "HARANTHIA RODRIGUES SOUSA", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "22/11/2023", status: "ACTIVE" },
  { name: "ELIANE VICENTIN", companyId: "CLI037", jobRole: "Operador de Produção", admissionDate: "10/05/2022", status: "ACTIVE" },

  // --- CONSTRUFAM ENGENHARIA (CLI_CONSTRUFAM) ---
  { id: "0000000012", name: "ADILSON JOSE DE LARA", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000001", name: "ADMERSON MORAES DE OSTI", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000021", name: "BRUNO GADELHA DA SILVA", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR DE HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000002", name: "EDERLEI ALVES DA SILVEIRA", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR HIDROMETRIA", status: "ACTIVE" },
  { id: "0000000003", name: "EMANUELLY EDUARDA STRAUB FERREIRA", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR ADMINISTRATIVO", status: "ACTIVE" },
  { id: "0000000013", name: "EVADI FERNANDES", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000018", name: "Felipe Gustavo Ruiz Vicari", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR HIDROMETRIA", status: "ACTIVE" },
  { id: "0000000019", name: "GEOVANI CAVALCANTE SILVA", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR HIDROMETRIA", status: "ACTIVE" },
  { id: "0000000016", name: "Heudrian Giovanni Motta Gonçalves", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000004", name: "JAIR CESAR DE LARA", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000015", name: "JONATHAN BRUNO FERREIRA", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000020", name: "Lucas Miguel Santana Kokot", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR DE HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000010", name: "MARCOS ANTONIO MUNIZ", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR DE HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000014", name: "MARLLON SOUZA PACHECO", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR HIDROMETRIA", status: "ACTIVE" },
  { id: "0000000017", name: "Marlos Moises Ribeiro Martins", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR HIDROMETRIA", status: "ACTIVE" },
  { id: "0000000005", name: "NICAMAQUE DE JESUS AMARAL DA SILVA MENDE", companyId: "CLI_CONSTRUFAM", jobRole: "AUXILIAR HIDROMETRIA", status: "ACTIVE" },
  { id: "0000000011", name: "PAULO HENRIQUE MASTECK", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", status: "ACTIVE" },
  { id: "0000000008", name: "VANDERLAM MUNHOZ", companyId: "CLI_CONSTRUFAM", jobRole: "HIDROMETRISTA", status: "ACTIVE" },

  // --- NATIVA EMPREENDIMENTOS (CLI_NATIVA) ---
  { id: "0000000002", name: "Helder Leonei Becker de Souza", companyId: "CLI_NATIVA", jobRole: "Servente de Obras", location: "OBRAS - EDIFÍCIO LAGUNA", status: "ACTIVE" },
  { id: "0000000001", name: "JOÃO VICTOR NASCIMENTO DE OLIVEIRA", companyId: "CLI_NATIVA", jobRole: "Servente de Obras", location: "OBRAS - EDIFÍCIO MONACO", status: "ACTIVE" },
  { id: "0000000004", name: "Kelvin dos Santos Costa", companyId: "CLI_NATIVA", jobRole: "Servente de Obras", location: "OBRAS - EDIFÍCIO MONACO", status: "ACTIVE" },
  { id: "0000000003", name: "Sidney Gomes Perchis", companyId: "CLI_NATIVA", jobRole: "Servente de Obras", location: "OBRAS - EDIFÍCIO MONACO", status: "ACTIVE" },
  { id: "0000000005", name: "Tiago Alves Santana da Silva", companyId: "CLI_NATIVA", jobRole: "Servente de Obras", location: "OBRAS - EDIFÍCIO MONACO", status: "ACTIVE" },
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
  { name: "Avaliação Clínica (ASO)" },
  { name: "Audiometria Tonal Ocupacional" },
  { name: "Acuidade Visual (Ortho-Rater)" },
  { name: "Espirometria (Prova de Função Pulmonar)" },
  { name: "Eletrocardiograma (ECG)" },
  { name: "Eletroencefalograma (EEG)" },
  { name: "Radiografia de Tórax (Padrão OIT)" },
  { name: "Radiografia de Coluna Lombo-Sacra" },
  { name: "Hemograma Completo com Plaquetas" },
  { name: "Glicemia de Jejum" },
  { name: "Exame Toxicológico (Larga Janela - CNH)" },
  { name: "Avaliação Psicossocial (NR-33 / NR-35)" },
  { name: "Teste de Ishihara (Daltonismo)" },
  { name: "Urina Tipo I (EAS)" },
  { name: "Creatinina Sérica" },
  { name: "TGO / TGP (Transaminases)" },
  { name: "Gamma-GT" },
  { name: "Lipidograma Completo" },
  { name: "Colinesterase Plasmática / Eritrocitária" },
  { name: "Ácido Hipúrico (Urina) - Tolueno" },
  { name: "Ácido Metil-Hipúrico (Urina) - Xilenos" },
  { name: "Ácido Trans, Trans-Mucônico (Urina) - Benzeno" },
  { name: "Ácido Mandélico (Urina) - Estireno" },
  { name: "Fenol na Urina" },
  { name: "Chumbo Inorgânico no Sangue" },
  { name: "Mercúrio na Urina" },
  { name: "Cádmio na Urina" },
  { name: "Manganês na Urina" },
  { name: "Fluoretos na Urina" },
  { name: "Cromo na Urina" },
  { name: "Níquel na Urina" },
  { name: "Carboxihemoglobina (CO)" },
  { name: "Metahemoglobina" },
  { name: "Coprocultura e Coproparasitológico" },
  { name: "VDRL (Sífilis)" },
  { name: "Pesquisa de BAAR (Tuberculose)" },
  { name: "Dinamometria Escapular / Dorsal" },
  { name: "Avaliação Ergonômica Analítica (AET)" },
  { name: "Telerradiografia de Tórax" },
  { name: "Ácido Delta Amino Levulínico (ALA-U)" },
  { name: "Acetona na Urina" }
];
