
'use client';

import { useDraggable } from '@dnd-kit/core';
import { OpsTask, Priority, TaskType } from '@/types/schema';
import { 
  AlertCircle, 
  Calendar, 
  FileText, 
  HardHat, 
  ShieldCheck, 
  Clock, 
  Brain,
  CheckSquare,
  Zap,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const TypeIcon = ({ type }: { type: TaskType }) => {
  switch (type) {
    case 'pgr': return <FileText className="w-4 h-4 text-blue-600" />;
    case 'treinamento': return <HardHat className="w-4 h-4 text-orange-600" />;
    case 'esocial': return <Zap className="w-4 h-4 text-purple-600" />;
    case 'pcmso': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    case 'ltcat': return <FileText className="w-4 h-4 text-indigo-600" />;
    case 'iot_check': return <Clock className="w-4 h-4 text-amber-600" />;
    default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const priorityStyles = {
  low: 'border-l-slate-300',
  medium: 'border-l-blue-400',
  high: 'border-l-orange-500',
  critical: 'border-l-red-600 animate-pulse-subtle',
};

function safeFormat(date: any, formatStr: string) {
  if (!date) return "---";
  const d = new Date(date);
  if (!isValid(d)) return "---";
  return format(d, formatStr);
}

export function TaskCard({ task }: { task: OpsTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  const checklist = task.checklist || [];
  const completedChecks = checklist.filter(c => c.checked).length;
  const totalChecks = checklist.length;
  const progress = totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "relative p-4 mb-4 rounded-2xl cursor-grab active:cursor-grabbing group touch-none",
        "glass-panel hover:bg-white/90 hover:scale-[1.02]",
        "border-l-[6px]", 
        priorityStyles[task.priority],
        isDragging ? "opacity-50 rotate-2 scale-105 shadow-2xl" : "opacity-100"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-1.5">
            <TypeIcon type={task.type} />
            {task.type}
          </span>
          <h4 className="text-sm font-black text-primary leading-tight font-headline">
            {task.title}
          </h4>
        </div>
        
        {task.ai_risk_score !== undefined && (
          <div className={cn(
            "size-8 rounded-full flex flex-col items-center justify-center border shadow-inner",
            task.ai_risk_score > 70 ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"
          )}>
            <Brain className={cn("size-3", task.ai_risk_score > 70 ? "text-red-500" : "text-blue-500")} />
            <span className="text-[8px] font-black">{task.ai_risk_score}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="size-5 rounded-md bg-slate-100 flex items-center justify-center">
          <Building2 className="size-3 text-slate-400" />
        </div>
        <span className="text-[10px] font-bold text-slate-500 truncate uppercase">
          {task.companyName || "Unidade Técnica"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
          <span className="flex items-center gap-1">
            <CheckSquare className="size-3" /> 
            Compliance: {completedChecks}/{totalChecks}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1 bg-slate-100" />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/50">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
          <Calendar className="w-3.5 h-3.5" />
          <span>{safeFormat(task.dueDate, 'dd MMM')}</span>
        </div>
        
        <div className="flex -space-x-2">
          <div className="size-6 rounded-full bg-primary ring-2 ring-white flex items-center justify-center text-white text-[8px] font-black border border-white/20">
            NC
          </div>
          {task.autoAction && (
            <div className="size-6 rounded-full bg-accent ring-2 ring-white flex items-center justify-center text-white border border-white/20" title="Automação Ativa">
              <Zap className="size-3 fill-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
