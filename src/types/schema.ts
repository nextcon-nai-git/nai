
/**
 * NEXTCON PLATFORM - ENTERPRISE SCHEMA 2026
 * Core data structures for the Risk & Life Operating System.
 */

export type RiskCategory = 'fisico' | 'quimico' | 'biologico' | 'ergonomico' | 'acidente';
export type TaskStatus = 'to_review' | 'sent' | 'approved' | 'implementation' | 'started' | 'todo' | 'doing' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'pgr' | 'pcmso' | 'ltcat' | 'treinamento' | 'esocial' | 'iot_check' | 'vistoria' | 'comercial';

export interface RiskCatalog {
  id: string;
  code_esocial: string;
  description: string;
  category: RiskCategory;
  std_consequences: string[];
  std_controls: string[];
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
}

export interface Training {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  nrs: string[];
  startDate: string;
  endDate: string;
  totalHours: number;
  modality: 'Presencial' | 'EAD' | 'Híbrido';
  status: 'planned' | 'in_progress' | 'completed';
  students: {
    id: string;
    name: string;
    status: 'pending' | 'present' | 'certified';
  }[];
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
}

export interface AssetPoint {
  id: string;
  companyId: string;
  type: 'machine' | 'extinguisher' | 'room';
  qrCodeUrl: string;
  lastInspection: string;
  status: 'ok' | 'warning' | 'danger';
  description: string;
}
