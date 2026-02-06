
/**
 * Utilitário de Hierarquia de Arquivos (LGPD Compliance)
 * Estratégia: Empresa > Funcionário > Categoria > Arquivo
 */

export const STORAGE_PATHS = {
  // Documentos da Empresa (PGR, PCMSO, LTCAT)
  COMPANY_DOCS: (clientId: string, docType: string) => 
    `clients/${clientId}/legal_docs/${docType}/${Date.now()}`,

  // Documentos do Funcionário (ASOs, Prontuários, Fichas EPI)
  EMPLOYEE_FILE: (clientId: string, employeeId: string, category: 'medical' | 'safety' | 'training') => {
    const timestamp = Date.now();
    // Prontuários médicos são marcados para criptografia adicional no bucket
    return `clients/${clientId}/employees/${employeeId}/${category}/${timestamp}`;
  },

  // Evidências de Quiosque (Fotos de entrega de EPI)
  PPE_EVIDENCE: (clientId: string, employeeId: string) => 
    `ppe-kiosk-evidences/${clientId}/${employeeId}/${Date.now()}.png`
};
