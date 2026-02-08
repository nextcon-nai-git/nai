
/**
 * Utilitário de Hierarquia de Arquivos (LGPD & Compliance)
 * Estratégia: companies > {companyId} > {year} > {docType} > {filename}
 */

export const STORAGE_PATHS = {
  // Documentos Oficiais da Empresa (PGR, PCMSO, LTCAT)
  COMPANY_DOC: (companyId: string, docType: string, filename: string) => {
    const year = new Date().getFullYear();
    return `companies/${companyId}/${year}/${docType}/${filename}`;
  },

  // Prontuários e ASOs (Dados Sensíveis)
  EMPLOYEE_MEDICAL: (companyId: string, employeeId: string, filename: string) => {
    return `companies/${companyId}/employees/${employeeId}/medical/${filename}`;
  },

  // Inspeções de Campo (Checklists JSON)
  FIELD_INSPECTION: (companyId: string, nr: string) => {
    const now = new Date();
    const timestamp = now.getTime();
    return `companies/${companyId}/inspections/${now.getFullYear()}/${nr}_${timestamp}.json`;
  }
};
