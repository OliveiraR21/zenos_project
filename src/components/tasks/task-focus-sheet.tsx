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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Task, getDependents } from '@/lib/data';
import { format, formatDistanceToNowStrict, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, GanttChartSquare, TriangleAlert } from 'lucide-react';
import { TaskCompletionDialog } from './task-completion-dialog';
import { cn } from '@/lib/utils';

interface TaskFocusSheetProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

function DependentsWidget({ taskId }: { taskId: string }) {
  const dependents = getDependents(taskId);

  if (dependents.length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold text-sm mb-2">Quem depende de mim</h4>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
            {dependents.map(user => (
            <Tooltip key={user.id}>
                <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{user.name}</p>
                </TooltipContent>
            </Tooltip>
            ))}
        </TooltipProvider>
      </div>
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
            isOverdue ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
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

  if (!task) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-lg bg-white text-black p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-gray-200">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                    <GanttChartSquare className="w-4 h-4" />
                    {task.projectName}
                </p>
                <SheetTitle className="text-2xl font-bold font-headline !mt-1">{task.title}</SheetTitle>
                <SheetDescription className="!mt-2">
                    Prazo Original: {format(task.baselineDeadline, 'dd/MM/yyyy')}
                </SheetDescription>
            </SheetHeader>
            <div className="p-6 flex-1 space-y-6 overflow-y-auto">
              <div>
                <h4 className="font-semibold text-sm mb-2">Descrição</h4>
                <p className="text-gray-600">Descrição detalhada da tarefa iria aqui, explicando o que precisa ser feito, critérios de aceite e links para documentação relevante.</p>
              </div>

              <DependentsWidget taskId={task.id} />
              
            </div>
            <SheetFooter className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex w-full justify-between items-center">
                <DeadlineCounter deadline={task.newDeadline} />
                <Button 
                    onClick={() => setCompletionDialogOpen(true)}
                    className="bg-volt text-black hover:bg-volt/90 font-bold"
                >
                    Finalizar Tarefa
                </Button>
              </div>
            </SheetFooter>
          </div>
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
