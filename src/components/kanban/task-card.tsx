'use client';

import { useDraggable } from '@dnd-kit/core';
import { SSTTask } from '@/types/kanban';
import { AlertCircle, Calendar, FileText, HardHat, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';

// Ícone dinâmico baseado no tipo de tarefa
const TypeIcon = ({ type }: { type: SSTTask['type'] }) => {
  switch (type) {
    case 'pgr': return <FileText className="w-4 h-4 text-blue-600" />;
    case 'treinamento': return <HardHat className="w-4 h-4 text-orange-600" />;
    case 'esocial': return <ShieldCheck className="w-4 h-4 text-green-600" />;
    case 'pcmso': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    case 'vistoria': return <Clock className="w-4 h-4 text-amber-600" />;
    default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

// Cor da borda baseada na prioridade
const priorityColor = {
  low: 'border-l-gray-300',
  medium: 'border-l-blue-400',
  high: 'border-l-orange-500',
  critical: 'border-l-red-600',
};

function safeFormat(date: any, formatStr: string) {
  if (!date) return "---";
  const d = new Date(date);
  if (!isValid(d)) return "---";
  return format(d, formatStr);
}

export function TaskCard({ task }: { task: SSTTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "relative p-4 mb-3 rounded-xl cursor-grab active:cursor-grabbing group touch-none",
        "bg-white/80 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-md transition-all duration-200",
        "border-l-4", 
        priorityColor[task.priority],
        isDragging ? "opacity-50 rotate-3 scale-105" : "opacity-100"
      )}
    >
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <TypeIcon type={task.type} />
          {task.type.toUpperCase()}
        </span>
        {task.priority === 'critical' && (
          <span className="animate-pulse w-2 h-2 rounded-full bg-red-500" title="Prioridade Crítica" />
        )}
      </div>

      {/* Título e Empresa */}
      <h4 className="text-sm font-semibold text-slate-800 leading-tight mb-1 line-clamp-2">
        {task.title}
      </h4>
      <p className="text-[10px] text-slate-500 mb-3 font-bold uppercase truncate">{task.company}</p>

      {/* Rodapé do Card */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
          <Calendar className="w-3 h-3" />
          <span>{safeFormat(task.dueDate, 'dd/MMM')}</span>
        </div>
        
        {/* Avatar (Placeholder) */}
        <div className="w-6 h-6 rounded-full bg-[#003366] text-white text-[8px] flex items-center justify-center font-black" title="Responsável">
           NC
        </div>
      </div>
    </div>
  );
}
