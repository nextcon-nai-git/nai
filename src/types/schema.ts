
/**
 * NEXTCON PLATFORM - ENTERPRISE SCHEMA 2026
 * Core data structures for the Risk & Life Operating System.
 */

export type RiskCategory = 'fisico' | 'quimico' | 'biologico' | 'ergonomico' | 'acidente';
export type TaskStatus = 'to_review' | 'sent' | 'approved' | 'implementation' | 'started' | 'todo' | 'doing' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'pgr' | 'pcmso' | 'ltcat' | 'treinamento' | 'esocial' | 'iot_check' | 'vistoria' | 'comercial';

export interface FiscalConfig {
  ibpt_token?: string;
  last_ibpt_update?: string;
  tax_table_version?: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  logoUrl?: string;
  risk_degree: 1 | 2 | 3 | 4;
  cnae: string;
  active: boolean;
  address?: string;
  city?: string;
  state?: string;
  fiscal_config?: FiscalConfig;
}

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  cpf: string;
  sector: string;
  gheId: string;
  admissionDate: string;
  status: 'active' | 'leave' | 'fired';
  jobRole: string;
  riscos: string[];
}

export interface ComplianceItem {
  id: string;
  text: string;
  checked: boolean;
  mandatory: boolean;
}

export interface OpsTask {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  companyId: string;
  companyName: string;
  checklist: ComplianceItem[];
  autoAction?: 'generate_pdf' | 'send_esocial_xml' | 'alert_manager';
  ai_risk_score?: number;
  dueDate: string;
  createdAt: string;
  assigneeId?: string;
  assigneeName?: string;
  origin?: 'commercial_ai' | 'manual_sim' | 'direct';
}

export interface MedicalAppointment {
  id: string;
  colaborador_id: string;
  colaborador_nome: string;
  data_hora: string;
  check_in_at?: string;
  tipo: 'Admissional' | 'Periódico' | 'Demissional' | 'Mudança de Função' | 'Retorno ao Trabalho';
  status: 'Agendado' | 'Em Espera' | 'Em Atendimento' | 'Concluído';
  check_in_realizado: boolean;
  companyId: string;
}

export interface AsoAttendance {
  id: string;
  agendamento_id: string;
  medico_id: string;
  data_emissao: string;
  resultado: 'Apto' | 'Inapto';
  url_documento_signed?: string;
  status_esocial: 'Pendente' | 'Enviado' | 'Erro';
  protocolo_governo?: string;
  employeeName: string;
  companyId: string;
}
