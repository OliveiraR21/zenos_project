'use client';
import type { Task } from '@/lib/data';
import { GanttChartSquare } from 'lucide-react';
import { GanttChart } from './gantt-chart';

interface GanttViewProps {
    tasks: Task[];
}

export function GanttView({ tasks }: GanttViewProps) {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-muted rounded-lg">
                <GanttChartSquare className="w-12 h-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Nenhuma tarefa no projeto</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Adicione tarefas para visualizar o cronograma no gráfico de Gantt.
                </p>
            </div>
        );
    }
    
    return <GanttChart tasks={tasks} />;
}
