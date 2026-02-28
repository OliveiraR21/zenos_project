'use client';
import * as React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import type { Task } from '@/lib/data';
import { BrainCircuit, Check, GanttChartSquare, TriangleAlert, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TaskFocusSheet } from '@/components/tasks/task-focus-sheet';
import { Badge } from '@/components/ui/badge';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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
    const isOverdue = parseISO(task.newDeadline) < new Date();
    
    return (
        <Card onClick={() => onSelectTask(task)} className="p-4 cursor-pointer hover:bg-muted transition-colors bg-card text-card-foreground">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <GanttChartSquare className="w-3 h-3" />
                        {task.projectName}
                    </p>
                    <h3 className="font-bold mt-1 text-foreground">{task.title}</h3>
                </div>
                {task.isCriticalPath && <Badge variant="destructive">Crítico</Badge>}
            </div>
            <div className="flex items-center justify-end text-xs mt-3">
                 {isOverdue ? (
                    <p className="font-semibold text-red-600 flex items-center gap-1">
                        <TriangleAlert className="w-3 h-3"/>
                        Atrasado há {formatDistanceToNowStrict(parseISO(task.newDeadline), { locale: ptBR, unit: 'day' })}
                    </p>
                 ) : (
                    <p className="text-muted-foreground">
                        Vence em {formatDistanceToNowStrict(parseISO(task.newDeadline), { locale: ptBR })}
                    </p>
                 )}
            </div>
        </Card>
    );
}

export default function TarefasPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const tasksQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'tasks'), where('responsibleId', '==', user.uid));
  }, [firestore, user]);

  const { data: allUserTasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);
  
  // NOTE: A lógica de 'ready' vs 'blocked' foi simplificada.
  // Uma implementação completa exigiria buscar o status das dependências.
  const readyTasks = allUserTasks
    ?.filter(task => !task.completedAt)
    .sort((a, b) => (a.isCriticalPath === b.isCriticalPath) ? 0 : a.isCriticalPath ? -1 : 1) || [];
  
  const criticalTaskCount = readyTasks.filter(t => t.isCriticalPath).length;

  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const renderContent = () => {
    if (isUserLoading || (user && areTasksLoading)) {
      return (
        <div className="space-y-8">
            <Skeleton className="h-20 w-full" />
            <section>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
            </section>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-muted-foreground/30 rounded-lg">
            <UserIcon className="w-12 h-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Nenhum usuário selecionado</h2>
            <p className="mt-1 text-muted-foreground">Faça login para ver suas tarefas.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
          <NikoTaskCoach criticalTaskCount={criticalTaskCount} />
          
          <section>
              <h2 className="text-xl font-bold font-headline flex items-center gap-2">
                  <Check className="text-green-500" />
                  Minha Fila de Valor ({readyTasks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {readyTasks.length > 0 ? (
                     readyTasks.map(task => <TaskItem key={task.id} task={task} onSelectTask={setSelectedTask} />)
                  ) : (
                      <p className="text-muted-foreground col-span-full">Nenhuma tarefa na sua fila. Bom trabalho!</p>
                  )}
              </div>
          </section>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 text-foreground">
        <header className="bg-card border-b p-4 md:p-8">
            <div className="flex items-center justify-between space-y-2 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Minha Linha de Frente
                    </h1>
                    <p className="text-muted-foreground">Tarefas priorizadas por impacto no resultado.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <UserNav />
                </div>
            </div>
        </header>
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
            {renderContent()}
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
