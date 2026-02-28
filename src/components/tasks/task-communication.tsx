'use client';

import React from 'react';
import type { TimelineEvent } from '@/lib/data';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, GitCommit, TriangleAlert, HelpCircle, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { useUser } from '@/firebase';

const intentionMap = {
    'Dúvida': { icon: HelpCircle, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    'Impedimento': { icon: TriangleAlert, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    'Decisão': { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
};

function EventItem({ event }: { event: TimelineEvent }) {
    const Icon = event.type === 'comment' ? (intentionMap[event.intention!]?.icon || MessageSquare) : GitCommit;
    const isSystemEvent = event.type === 'event';
    const author = event.user || { name: 'Sistema Zenos', avatarUrl: '', avatarHint: '' };
    const intentionColor = event.intention === 'Impedimento' || event.intention === 'Decisão' ? 'volt' : 'default';

    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                 <Avatar className="h-8 w-8">
                     {isSystemEvent ? 
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                            <GitCommit className="h-4 w-4 text-muted-foreground" />
                        </span>
                        :
                        <>
                            <AvatarImage src={author.avatarUrl} alt={author.name} data-ai-hint={author.avatarHint} />
                            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                        </>
                     }
                </Avatar>
                <div className="w-px flex-1 bg-border my-2"></div>
            </div>
            <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold">{author.name}</span>
                    <span className="text-muted-foreground">
                        {formatDistanceToNow(parseISO(event.timestamp), { locale: ptBR, addSuffix: true })}
                    </span>
                </div>
                <div className={cn("mt-1 p-3 rounded-lg text-sm", isSystemEvent ? 'bg-muted/50' : 'bg-card border')}>
                    <p>{event.content}</p>
                    {isSystemEvent && event.meta && (
                         <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                            <p className="font-semibold">Motivo: <span className="font-normal">{event.meta.reason}</span></p>
                            <p className="font-semibold capitalize mt-1">{event.meta.field}: <span className="font-normal line-through">{event.meta.oldValue}</span> <ArrowRight className="inline w-3 h-3 mx-1" /> <span className="font-bold">{event.meta.newValue}</span></p>
                        </div>
                    )}
                </div>
                {event.intention && (
                    <Badge variant={intentionColor} className={cn("mt-2 text-xs", 
                        intentionColor === 'volt' && 'bg-volt/20 text-yellow-800 border-volt/50'
                    )}>
                        <Icon className="w-3 h-3 mr-1.5"/>
                        {event.intention}
                    </Badge>
                )}
            </div>
        </div>
    );
}


export function TaskCommunication({ timeline }: { timeline: TimelineEvent[] }) {
    const [comment, setComment] = React.useState('');
    const [activeIntention, setActiveIntention] = React.useState<'Dúvida' | 'Impedimento' | null>(null);
    const { user } = useUser();

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="relative">
                    {timeline.map((event, index) => <EventItem key={index} event={event} />)}
                </div>
            </div>
            <div className="p-4 bg-card border-t">
                 <div className="relative">
                    <Textarea 
                        placeholder={user ? "Adicione um comentário... @ para mencionar" : "Você precisa estar logado para comentar."}
                        className="bg-background pr-24"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={!user}
                    />
                    {user && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" variant={activeIntention === 'Dúvida' ? 'secondary' : 'ghost'} onClick={() => setActiveIntention(activeIntention === 'Dúvida' ? null : 'Dúvida')}>
                                            <HelpCircle className="text-blue-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Marcar como Dúvida</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" variant={activeIntention === 'Impedimento' ? 'secondary' : 'ghost'} onClick={() => setActiveIntention(activeIntention === 'Impedimento' ? null : 'Impedimento')}>
                                            <TriangleAlert className="text-yellow-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Marcar como Impedimento</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                </div>
                <div className="mt-2 flex justify-end items-center">
                    <Button disabled={!comment.trim() || !user}>Enviar</Button>
                </div>
            </div>
        </div>
    );
}
