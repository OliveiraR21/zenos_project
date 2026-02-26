'use client';
import * as React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { currentUser, getTasksForUser, getTaskById, Task } from '@/lib/data';
import { BrainCircuit, Check, GanttChartSquare, TriangleAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TaskFocusSheet } from '@/components/tasks/task-focus-sheet';
import { Badge } from '@/components/ui/badge';

function NikoTaskCoach({ criticalTaskCount }: { criticalTaskCount: number }) {
  if (criticalTaskCount === 0) return null;

  return (
    <div className="bg-blue-950/80 border border-blue-800 text-blue-200 rounded-lg p-4 flex items-start gap-4">
      <BrainCircuit className="h-6 w-6 text-blue-400 mt-1 shrink-0" />
      <div>
        <h4 className="font-bold font-headline">Niko: Coach de Performance</h4>
        <p className="text-sm mt-1">
          Você tem {criticalTaskCount} tarefa(s) no caminho crítico hoje. Finalizá-la(s) primeiro irá desbloquear o trabalho de outros membros da equipe. Vamos focar nisso?
        </p>
      </div>
    </div>
  );
}

function TaskItem({ task, onSelectTask }: { task: Task, onSelectTask: (task: Task) => void }) {
    const isOverdue = task.newDeadline < new Date();
    
    return (
        <Card onClick={() => onSelectTask(task)} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                        <GanttChartSquare className="w-3 h-3" />
                        {task.projectName}
                    </p>
                    <h3 className="font-bold mt-1">{task.title}</h3>
                </div>
                {task.isCriticalPath && <Badge variant="destructive">Crítico</Badge>}
            </div>
            <div className="flex items-center justify-end text-xs mt-3">
                 {isOverdue ? (
                    <p className="font-semibold text-red-600 flex items-center gap-1">
                        <TriangleAlert className="w-3 h-3"/>
                        Atrasado há {formatDistanceToNowStrict(task.newDeadline, { locale: ptBR, unit: 'day' })}
                    </p>
                 ) : (
                    <p className="text-gray-600">
                        Vence em {formatDistanceToNowStrict(task.newDeadline, { locale: ptBR })}
                    </p>
                 )}
            </div>
        </Card>
    );
}

export default function TarefasPage() {
  const allUserTasks = getTasksForUser(currentUser.id);
  const completedTaskIds = new Set(allUserTasks.filter(t => t.completedAt).map(t => t.id));

  const isTaskReady = (task: Task) => {
    if (task.dependencies.length === 0) return true;
    const allDependenciesMet = task.dependencies.every(depId => {
      const depTask = getTaskById(depId);
      return depTask?.completedAt !== null;
    });
    return allDependenciesMet;
  }

  const readyTasks = allUserTasks
    .filter(task => isTaskReady(task))
    .sort((a, b) => (a.isCriticalPath === b.isCriticalPath) ? 0 : a.isCriticalPath ? -1 : 1);
  
  const blockedTasks = allUserTasks.filter(task => !isTaskReady(task));
  const criticalTaskCount = readyTasks.filter(t => t.isCriticalPath).length;

  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  return (
    <MainLayout>
      <div className="flex-1 bg-gray-50 text-black">
        <header className="bg-white border-b border-gray-200 p-4 md:p-8">
            <div className="flex items-center justify-between space-y-2 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Minha Linha de Frente
                    </h1>
                    <p className="text-gray-600">Tarefas priorizadas por impacto no resultado.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <UserNav />
                </div>
            </div>
        </header>
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
            <div className="space-y-8">
                <NikoTaskCoach criticalTaskCount={criticalTaskCount} />
                
                <section>
                    <h2 className="text-xl font-bold font-headline flex items-center gap-2">
                        <Check className="text-green-500" />
                        Prontas para Execução ({readyTasks.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {readyTasks.length > 0 ? (
                           readyTasks.map(task => <TaskItem key={task.id} task={task} onSelectTask={setSelectedTask} />)
                        ) : (
                            <p className="text-gray-500 col-span-full">Nenhuma tarefa pronta. Bom trabalho!</p>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold font-headline text-gray-500">
                        Aguardando Liberação ({blockedTasks.length})
                    </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {blockedTasks.length > 0 ? (
                           blockedTasks.map(task => <TaskItem key={task.id} task={task} onSelectTask={setSelectedTask} />)
                        ) : (
                            <p className="text-gray-500 col-span-full">Nenhuma tarefa bloqueada.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
      </div>
      <TaskFocusSheet 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </MainLayout>
  );
}
