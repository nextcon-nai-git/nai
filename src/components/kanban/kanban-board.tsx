'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SSTTask, KANBAN_COLUMNS, Status } from '@/types/kanban';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { createPortal } from 'react-dom';
import { useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface KanbanBoardProps {
  tasks: SSTTask[];
}

export function KanbanBoard({ tasks: initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<SSTTask[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<SSTTask | null>(null);
  const { user } = useUser();
  const db = useFirestore();

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
    const newStatus = over.id as Status;

    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status === newStatus) return;

    // Atualiza estado local para feedback instantâneo
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    // Persiste no Firestore
    if (user && db) {
      const taskRef = doc(db, "clients", user.uid, "tasks", taskId);
      updateDocumentNonBlocking(taskRef, { status: newStatus });
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
                  id={col.id}
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