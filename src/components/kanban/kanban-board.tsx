'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SSTTask, KANBAN_COLUMNS, Status } from '@/types/kanban';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { createPortal } from 'react-dom';

// Dados de Exemplo (Mock) - Em produção, isso viria do Firestore
const INITIAL_TASKS: SSTTask[] = [
  { id: '1', title: 'PGR - Britânia Eletrodomésticos', company: 'Britânia', status: 'todo', priority: 'high', type: 'pgr', dueDate: new Date() },
  { id: '2', title: 'Treinamento CIPA Turma 1', company: 'Noxi Quimica', status: 'doing', priority: 'medium', type: 'treinamento', dueDate: new Date() },
  { id: '3', title: 'Envio S-2240 (Admissão)', company: 'Biavatti', status: 'done', priority: 'critical', type: 'esocial', dueDate: new Date() },
  { id: '4', title: 'PCMSO Anual', company: 'MLS Serviços', status: 'review', priority: 'low', type: 'pcmso', dueDate: new Date() },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<SSTTask[]>(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<SSTTask | null>(null);

  // Configuração dos sensores (para funcionar bem em mobile e desktop)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Previne drag acidental ao clicar
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    const currentTask = tasks.find((t) => t.id === taskId);
    if (currentTask?.status === newStatus) return;

    // Atualiza o estado visualmente
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    // Lógica de Negócio Nextcon
    if (newStatus === 'done' && currentTask?.type === 'esocial') {
        // Automação: Iniciando validação do XML eSocial
        console.log("Automação Nextcon: Iniciando validação do XML eSocial...");
    }
  }

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-6 overflow-x-auto pb-4 px-2 snap-x scrollbar-thin">
        {KANBAN_COLUMNS.map((col) => (
          <div key={col.id} className="snap-center h-full">
             <KanbanColumn
                id={col.id}
                title={col.title}
                color={col.color}
                tasks={tasks.filter((t) => t.status === col.id)}
              />
          </div>
        ))}
      </div>

      {/* Overlay: O card flutuante que segue o mouse */}
      {typeof document !== 'undefined' && createPortal(
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 scale-105 opacity-90 cursor-grabbing">
                <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}