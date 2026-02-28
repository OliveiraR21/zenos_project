'use client';
import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import type { Task, User } from '@/lib/data';
import { format, differenceInHours, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bot, Clock, GanttChartSquare } from 'lucide-react';
import { TaskCompletionDialog } from './task-completion-dialog';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNowStrict } from 'date-fns';
import { TaskCommunication } from './task-communication';
import { useUser } from '@/firebase';

interface TaskFocusSheetProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
}

function DependentsWidget({ taskId }: { taskId: string }) {
  // A lógica de busca de dependentes foi removida por complexidade.
  // Em uma app real, isso exigiria uma query no Firestore.
  // const dependents = getDependents(taskId);
  const dependents: User[] = [];

  if (dependents.length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold text-sm mb-2">Quem depende de mim</h4>
      {/* O código para renderizar avatares foi removido pois a lista está vazia */}
    </div>
  );
}

function DeadlineCounter({ deadline }: { deadline: Date }) {
    const hoursLeft = differenceInHours(deadline, new Date());
    const isUrgent = hoursLeft <= 24 && hoursLeft > 0;
    const isOverdue = hoursLeft <= 0;

    return (
        <div className={cn(
            "text-sm p-2 rounded-md flex items-center gap-2 font-medium",
            isUrgent && "bg-volt/20 text-yellow-900 animate-pulse",
            isOverdue ? "bg-red-700 text-red-100" : "bg-muted text-muted-foreground"
        )}>
            <Clock className="w-4 h-4" />
            <span>
                {isOverdue ? "Atrasado há " : "Vence em "}
                {formatDistanceToNowStrict(deadline, { locale: ptBR, addSuffix: isOverdue })}
            </span>
        </div>
    )
}

export function TaskFocusSheet({ task, isOpen, onClose }: TaskFocusSheetProps) {
  const [isCompletionDialogOpen, setCompletionDialogOpen] = React.useState(false);
  const { user } = useUser();

  if (!task) return null;

  const baselineDeadline = parseISO(task.baselineDeadline);
  const newDeadline = parseISO(task.newDeadline);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-lg bg-card text-card-foreground p-0 flex flex-col">
          <Tabs defaultValue="details" className="flex flex-col h-full overflow-hidden">
            <SheetHeader className="p-6 border-b shrink-0">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <GanttChartSquare className="w-4 h-4" />
                    {task.projectName}
                </p>
                <SheetTitle className="text-2xl font-bold font-headline !mt-1">{task.title}</SheetTitle>
                <SheetDescription className="!mt-2">
                    Prazo Original: {format(baselineDeadline, 'dd/MM/yyyy')}
                </SheetDescription>
                 <div className="flex justify-between items-center pt-2">
                    <TabsList>
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        <TabsTrigger value="history">Histórico & Decisões</TabsTrigger>
                    </TabsList>
                    {task.timeline && task.timeline.length > 0 && (
                        <Button variant="outline" size="sm">
                            <Bot className="mr-2" />
                            Resumir Contexto
                        </Button>
                    )}
                </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto bg-background">
                <TabsContent value="details" className="p-6 space-y-6 !mt-0">
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Descrição</h4>
                        <p className="text-muted-foreground">Descrição detalhada da tarefa iria aqui, explicando o que precisa ser feito, critérios de aceite e links para documentação relevante.</p>
                    </div>

                    <DependentsWidget taskId={task.id} />
                </TabsContent>
                <TabsContent value="history" className="!mt-0 h-full p-0">
                    <TaskCommunication task={task} />
                </TabsContent>
            </div>
            <SheetFooter className="p-6 bg-card border-t shrink-0">
              <div className="flex w-full justify-between items-center">
                <DeadlineCounter deadline={newDeadline} />
                <Button 
                    onClick={() => setCompletionDialogOpen(true)}
                    className="bg-volt text-black hover:bg-volt/90 font-bold"
                    disabled={user?.uid !== task.responsibleId}
                >
                    Finalizar Tarefa
                </Button>
              </div>
            </SheetFooter>
          </Tabs>
        </SheetContent>
      </Sheet>
      <TaskCompletionDialog 
        task={task}
        isOpen={isCompletionDialogOpen}
        onClose={() => setCompletionDialogOpen(false)}
        onComplete={() => {
            setCompletionDialogOpen(false);
            onClose();
        }}
      />
    </>
  );
}
