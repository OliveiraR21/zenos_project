'use client';
import type { Task, TaskStatus } from '@/lib/data';
import { KanbanCard } from './kanban-card';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
    status: TaskStatus;
    tasks: Task[];
    now: number;
}

export function KanbanColumn({ status, tasks, now }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });
    
    const statusColorMap: Record<TaskStatus, string> = {
        "A Fazer": "bg-gray-500",
        "Em Andamento": "bg-blue-500",
        "Em Validação": "bg-purple-500",
        "Concluído": "bg-green-500",
    };

    return (
        <div 
            className="flex flex-col w-80 shrink-0"
        >
            <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${statusColorMap[status]}`}></span>
                <h3 className="font-headline font-medium">{status}</h3>
                <span className="text-sm text-muted-foreground ml-auto">{tasks.length}</span>
            </div>
            <div 
                ref={setNodeRef}
                className={cn(
                    "flex flex-col gap-4 overflow-y-auto h-full pr-2 -mr-2 p-2 rounded-lg transition-colors min-h-[200px]",
                    isOver ? "bg-muted" : "bg-card/50"
                )}
            >
                {tasks.length > 0 ? (
                    tasks.map(task => <KanbanCard key={task.id} task={task} now={now} />)
                ) : (
                    <div className="text-sm text-center text-muted-foreground py-10">
                        Arraste tarefas aqui.
                    </div>
                )}
            </div>
        </div>
    );
}
