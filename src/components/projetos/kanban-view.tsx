'use client';
import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '@/lib/data';
import { KanbanColumn } from './kanban-column';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { KanbanCard } from './kanban-card';

const KANBAN_COLUMNS: TaskStatus[] = ["A Fazer", "Em Andamento", "Em Validação", "Concluído"];

interface KanbanViewProps {
    tasks: Task[];
    onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<boolean>;
}

// Draggable card to show in the overlay
function DraggableKanbanCard({ task }: { task: Task }) {
    return (
        <div className="shadow-lg">
            <KanbanCard task={task} />
        </div>
    );
}

export function KanbanView({ tasks, onTaskStatusChange }: KanbanViewProps) {
    const [taskItems, setTaskItems] = useState<Task[]>(tasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    useEffect(() => {
        setTaskItems(tasks);
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        // The task data is passed via the `data` property of useDraggable
        const task = active.data.current?.task as Task;
        setActiveTask(task || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;

        // If not dropped over a valid column, do nothing
        if (!over) return;
        
        const taskId = active.id as string;
        const task = taskItems.find(t => t.id === taskId);
        if (!task) return;

        const originalStatus = task.status;
        const newStatus = over.id as TaskStatus;

        // Only trigger update if dropped in a different column
        if (originalStatus !== newStatus) {
            // Optimistic update
            setTaskItems(prev => prev.map(t => 
                t.id === taskId ? { ...t, status: newStatus } : t
            ));
            
            // Call parent to update Firestore and wait for result
            const success = await onTaskStatusChange(taskId, newStatus);

            // If update failed, rollback the UI change
            if (!success) {
                setTaskItems(prev => prev.map(t => 
                    t.id === taskId ? { ...t, status: originalStatus } : t
                ));
            }
        }
    };

    // Group tasks by status
    const tasksByStatus = KANBAN_COLUMNS.reduce((acc, status) => {
        acc[status] = taskItems.filter(t => t.status === status);
        return acc;
    }, {} as Record<TaskStatus, Task[]>);

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-6 pb-4">
                    {KANBAN_COLUMNS.map(status => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            tasks={tasksByStatus[status] || []}
                        />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
             <DragOverlay>
                {activeTask ? <DraggableKanbanCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
