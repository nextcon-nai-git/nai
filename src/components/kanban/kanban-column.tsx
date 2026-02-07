'use client';

import { useDroppable } from '@dnd-kit/core';
import { SSTTask, Status } from '@/types/kanban';
import { TaskCard } from './task-card';
import { cn } from '@/lib/utils';

interface ColumnProps {
  id: Status;
  title: string;
  tasks: SSTTask[];
  color: string;
}

export function KanbanColumn({ id, title, tasks, color }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col h-full w-full min-w-[280px]">
      {/* Cabeçalho da Coluna */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-[10px] tracking-widest">
          {title}
          <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-mono font-black">
            {tasks.length}
          </span>
        </h3>
      </div>

      {/* Área Droppable */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 rounded-2xl transition-colors duration-200 min-h-[500px]",
          color, // Cor de fundo suave vinda de KANBAN_COLUMNS
          isOver ? "ring-2 ring-primary/20 ring-inset bg-primary/5" : ""
        )}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-[10px] font-black uppercase border-2 border-dashed border-slate-200 rounded-xl gap-2 opacity-40">
            <span>Solte aqui</span>
          </div>
        )}
      </div>
    </div>
  );
}
