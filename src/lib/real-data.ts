/**
 * NEXTCON PLATFORM - BASE DE DADOS REAL 2026
 * Fonte única de verdade para faturamento, contratos, clientes e prestadores.
 * Inclui os clientes ativos e a estrutura de colaboradores cruzada.
 */

export const REAL_COMPANIES = [
  { id: "51633820000151", name: "NATIVA EMPREENDIMENTOS", cnpj: "51.633.820/0001-51", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Guaratuba", state: "PR" },
  { id: "01208413000129", name: "TIME NOW ENGENHARIA S/A", cnpj: "01.208.413/0001-29", active: true, risk_degree: 3, segment: "ENGINEERING", city: "Vitória", state: "ES" },
  { id: "13419654000104", name: "INCORPORADORA GRAN-PARA LTDA", cnpj: "13.419.654/0001-04", active: true, risk_degree: 3, segment: "CONSTRUCTION", city: "Curitiba", state: "PR" },
  { id: "76492701001129", name: "BRITANIA ELETRODOMESTICOS SA", cnpj: "76.492.701/0011-29", active: true, risk_degree: 3, segment: "INDUSTRY", city: "Joinville", state: "SC" },
  { id: "32137571000169", name: "ESCOLA ESSENCIAL DE VIRTUDES LTDA", cnpj: "32.137.571/0001-69", active: true, risk_degree: 1, segment: "EDUCATION", city: "Curitiba", state: "PR" },
  { id: "14736446001246", name: "CIS CENTRO INTEGRADO EM SAUDE", cnpj: "14.736.446/0012-46", active: true, risk_degree: 2, segment: "HEALTH", city: "Rio Branco do Sul", state: "PR" }
];

export const REAL_EMPLOYEES = [
  { id: "COL1022", name: "ALEX OLIVEIRA DA COSTA", companyId: "51633820000151", status: "active", cpf: "264.950.432-69", job_role: { title: "PEDREIRO", cbo: "7152-10" } },
  { id: "COL1021", name: "ANGELICA ALBINA KOVASKI ARAGAO", companyId: "51633820000151", status: "active", cpf: "752.745.917-45", job_role: { title: "AUXILIAR ADM", cbo: "4110-05" } },
  { id: "COL1946", name: "ADAIR DOARTE", companyId: "13419654000104", status: "active", cpf: "730.248.971-82", job_role: { title: "CARPINTEIRO", cbo: "7155-05" } },
  { id: "COL1268", name: "ANA PAULA CONCI OLIVEIRA", companyId: "32137571000169", status: "active", cpf: "152.928.837-99", job_role: { title: "PROFESSORA", cbo: "2312-05" } }
];

export const REAL_PROVIDERS = [
  { id: "PRV_01", name: "DR. DANILO LOPES", email: "danilo.lopes@prestador.nai.com.br", role: "DOCTOR", lat: -25.4284, lng: -49.2733 },
  { id: "PRV_02", name: "ENG. FELIPE DELLA BIANCA", email: "felipe.bianca@prestador.nai.com.br", role: "ENGINEER", lat: -25.4284, lng: -49.2733 }
];

export const REAL_CONTRACTS = [
  { id: "CT_NATIVA", companyId: "51633820000151", companyName: "Nativa Empreendimentos", title: "Gestão Full SST", value: 88824.0, status: "Active" },
  { id: "CT_GRANPARA", companyId: "13419654000104", companyName: "Incorporadora Gran-Pará", title: "Gestão Corporativa", value: 142500.0, status: "Active" },
  { id: "CT_TIMENOW", companyId: "01208413000129", companyName: "Time Now Engenharia", title: "Contrato Global", value: 250000.0, status: "Active" }
];

export const DRE_2025_HISTORY = [
  { month: 'Jan', receita: 110000, despesa: 75000, lucro: 35000 },
  { month: 'Fev', receita: 115000, despesa: 78000, lucro: 37000 },
  { month: 'Mar', receita: 120000, despesa: 80000, lucro: 40000 },
  { month: 'Abr', receita: 125000, despesa: 82000, lucro: 43000 },
  { month: 'Mai', receita: 130000, despesa: 85000, lucro: 45000 },
  { month: 'Jun', receita: 135000, despesa: 88000, lucro: 47000 }
];

export const DRE_2026_DATA = [
  { month: 'Jan', receita: 145000, despesa: 92000, lucro: 53000 },
  { month: 'Fev', receita: 152000, despesa: 95000, lucro: 57000 },
  { month: 'Mar', receita: 160000, despesa: 98000, lucro: 62000 }
];

export const REAL_EXAMS_HISTORY = [
  { companyId: "51633820000151", employeeName: "ALEX OLIVEIRA DA COSTA", date: "2025-01-15", type: "Admissional", provider: "DR. DANILO LOPES", aso: "OK", s2220: "OK" },
  { companyId: "13419654000104", employeeName: "ADAIR DOARTE", date: "2025-02-10", type: "Periódico", provider: "CLINICA SQV", aso: "OK", s2220: "OK" }
];

export const REAL_TRAININGS = [
  {
    id: "TRN_001",
    title: "NR-18: Segurança na Construção Civil",
    companyId: "51633820000151",
    companyName: "Nativa Empreendimentos",
    nrs: ["NR-18", "NR-35"],
    startDate: "2026-02-10",
    endDate: "2026-02-15",
    totalHours: 40,
    status: "in_progress",
    students: [
      { id: "COL1022", name: "ALEX OLIVEIRA DA COSTA", status: "present" }
    ]
  }
];
