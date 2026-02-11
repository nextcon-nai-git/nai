export type Status = 'sent' | 'approved' | 'implementation' | 'started' | 'todo' | 'doing' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'pgr' | 'pcmso' | 'treinamento' | 'vistoria' | 'esocial' | 'comercial';

export interface SSTTask {
  id: string;
  title: string; 
  company: string;
  status: Status;
  priority: Priority;
  type: TaskType;
  dueDate?: Date;
  assigneeAvatar?: string;
}

export const COMMERCIAL_COLUMNS: { id: Status; title: string; color: string }[] = [
  { id: 'sent', title: 'Orçamentos Enviados', color: 'bg-blue-50' },
  { id: 'approved', title: 'Orçamentos Aprovados', color: 'bg-emerald-50' },
  { id: 'implementation', title: 'Implantação Projeto', color: 'bg-purple-50' },
];

export const OPERATIONAL_COLUMNS: { id: Status; title: string; color: string }[] = [
  { id: 'started', title: 'Projeto Iniciado', color: 'bg-indigo-50' },
  { id: 'todo', title: 'A Fazer', color: 'bg-slate-100' },
  { id: 'doing', title: 'Em Andamento', color: 'bg-blue-50' },
  { id: 'review', title: 'Revisão Técnica', color: 'bg-yellow-50' },
  { id: 'done', title: 'Concluído / eSocial', color: 'bg-green-50' },
];

export const KANBAN_COLUMNS = OPERATIONAL_COLUMNS; // Default fallback