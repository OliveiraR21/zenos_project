'use client';
import type { Task, TaskStatus } from '@/lib/data';
import { KanbanColumn } from './kanban-column';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const KANBAN_COLUMNS: TaskStatus[] = ["A Fazer", "Em Andamento", "Em Validação", "Concluído"];

interface KanbanViewProps {
    tasks: Task[];
}

export function KanbanView({ tasks }: KanbanViewProps) {
    // Group tasks by status
    const tasksByStatus = KANBAN_COLUMNS.reduce((acc, status) => {
        acc[status] = tasks.filter(t => t.status === status);
        return acc;
    }, {} as Record<TaskStatus, Task[]>);

    return (
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
    );
}
