export type Status = 'todo' | 'doing' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'pgr' | 'pcmso' | 'treinamento' | 'vistoria' | 'esocial';

export interface SSTTask {
  id: string;
  title: string; // Ex: "Renovar PGR Britânia"
  company: string; // Ex: "Britânia Eletrodomésticos"
  status: Status;
  priority: Priority;
  type: TaskType;
  dueDate?: Date;
  assigneeAvatar?: string;
}

export const KANBAN_COLUMNS: { id: Status; title: string; color: string }[] = [
  { id: 'todo', title: 'A Fazer', color: 'bg-slate-100' },
  { id: 'doing', title: 'Em Andamento', color: 'bg-blue-50' },
  { id: 'review', title: 'Revisão Técnica', color: 'bg-yellow-50' },
  { id: 'done', title: 'Concluído / eSocial', color: 'bg-green-50' },
];
