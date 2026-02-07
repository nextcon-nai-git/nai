'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { OpsTask, TaskStatus } from '@/types/schema';
import { KANBAN_COLUMNS } from '@/types/kanban';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { createPortal } from 'react-dom';
import { useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoardProps {
  tasks: OpsTask[];
}

export function KanbanBoard({ tasks: initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<OpsTask[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<OpsTask | null>(null);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
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
    const newStatus = over.id as TaskStatus;

    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status === newStatus) return;

    // --- COMPLIANCE GATE (Regra de Negócio NextCon) ---
    if (newStatus === 'done') {
      const checklist = currentTask.checklist || [];
      const pendingMandatory = checklist.filter(item => item.mandatory && !item.checked);
      if (pendingMandatory.length > 0) {
        toast({
          variant: "destructive",
          title: "Compliance Gate Bloqueado",
          description: `Existem ${pendingMandatory.length} itens obrigatórios pendentes para finalizar esta tarefa.`,
        });
        return; // Interrompe o drop
      }
    }

    // Atualiza estado local
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    // Persiste no Firestore
    if (user && db) {
      const taskRef = doc(db, "clients", user.uid, "tasks", taskId);
      updateDocumentNonBlocking(taskRef, { status: newStatus });
      
      // Trigger de Automação
      if (newStatus === 'done') {
        toast({
          title: "Tarefa Finalizada",
          description: "Gatilhando automação de documentos e envio eSocial...",
        });
      }
    }
  }

  return (
    <div className="h-full overflow-hidden">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-6 overflow-x-auto pb-4 scrollbar-thin">
          {KANBAN_COLUMNS.map((col) => (
            <div key={col.id} className="h-full">
               <KanbanColumn
                  id={col.id as TaskStatus}
                  title={col.title}
                  color={col.color}
                  tasks={tasks.filter((t) => t.status === col.id)}
                />
            </div>
          ))}
        </div>

        {typeof document !== 'undefined' && createPortal(
          <DragOverlay adjustScale={true}>
            {activeTask ? (
              <div className="rotate-3 scale-105 opacity-90 cursor-grabbing drop-shadow-2xl">
                  <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
