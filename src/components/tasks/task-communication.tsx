
'use client';

import React from 'react';
import type { TimelineEvent, User } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, GitCommit, TriangleAlert, HelpCircle, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { currentUser } from '@/lib/data';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';

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
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
                            <GitCommit className="h-4 w-4 text-gray-600" />
                        </span>
                        :
                        <>
                            <AvatarImage src={author.avatarUrl} alt={author.name} data-ai-hint={author.avatarHint} />
                            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                        </>
                     }
                </Avatar>
                <div className="w-px flex-1 bg-gray-200 my-2"></div>
            </div>
            <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold">{author.name}</span>
                    <span className="text-gray-500">
                        {formatDistanceToNow(event.timestamp, { locale: ptBR, addSuffix: true })}
                    </span>
                </div>
                <div className={cn("mt-1 p-3 rounded-lg text-sm", isSystemEvent ? 'bg-gray-100' : 'bg-white border')}>
                    <p>{event.content}</p>
                    {isSystemEvent && event.meta && (
                         <div className="mt-2 text-xs text-gray-600 border-t pt-2">
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


export function TaskCommunication({ timeline, currentUser }: { timeline: TimelineEvent[], currentUser: User }) {
    const [comment, setComment] = React.useState('');
    const [activeIntention, setActiveIntention] = React.useState<'Dúvida' | 'Impedimento' | null>(null);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="relative">
                    {timeline.map((event, index) => <EventItem key={event.id} event={event} />)}
                </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                 <div className="relative">
                    <Textarea 
                        placeholder="Adicione um comentário... @ para mencionar" 
                        className="bg-white pr-24"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
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
                </div>
                <div className="mt-2 flex justify-end items-center">
                    <Button disabled={!comment.trim()}>Enviar</Button>
                </div>
            </div>
        </div>
    );
}

