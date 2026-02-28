'use client';
import type { Task } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TriangleAlert, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface KanbanCardProps {
    task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
    const isOverdue = parseISO(task.newDeadline) < new Date();
    
    return (
        <Card className="hover:bg-muted/50 cursor-pointer shadow-sm">
            <CardContent className="p-3 space-y-4">
                <p className="font-semibold text-sm leading-snug">{task.title}</p>
                <div className="flex justify-between items-center">
                    <div>
                        {task.isCriticalPath && <Badge variant="destructive">Crítico</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                        {isOverdue ? (
                            <p className="font-semibold text-red-500 flex items-center gap-1 text-xs">
                                <TriangleAlert className="w-3 h-3"/>
                                {formatDistanceToNowStrict(parseISO(task.newDeadline), { locale: ptBR, addSuffix: true })}
                            </p>
                        ) : (
                            <p className="text-muted-foreground text-xs">
                                Vence em {formatDistanceToNowStrict(parseISO(task.newDeadline), { locale: ptBR })}
                            </p>
                        )}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                     <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
                                        {task.responsible?.charAt(0).toUpperCase() || <User className="w-3 h-3" />}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Responsável: {task.responsible}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
