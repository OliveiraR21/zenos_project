'use client';

import React from 'react';
import type { Task, TimelineEvent } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, GitCommit, TriangleAlert, HelpCircle, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

type Intention = 'Comentário' | 'Dúvida' | 'Impedimento' | 'Decisão';

const intentionMap: Record<Intention, { icon: React.ElementType; color: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'volt' }> = {
    'Comentário': { icon: MessageSquare, color: 'text-muted-foreground', variant: 'outline' },
    'Dúvida': { icon: HelpCircle, color: 'text-blue-500', variant: 'secondary' },
    'Impedimento': { icon: TriangleAlert, color: 'text-destructive-foreground', variant: 'destructive' },
    'Decisão': { icon: CheckCircle, color: 'text-primary', variant: 'default' },
};

function EventItem({ event }: { event: TimelineEvent }) {
    const isSystemEvent = event.type === 'event';
    const author = event.user || { name: 'Sistema Zenos', avatarUrl: '', avatarHint: '' };
    
    // Default to 'Comentário' for old data that might not have this field
    const intention = (event.intention || 'Comentário') as Intention;
    const intentionConfig = isSystemEvent ? null : intentionMap[intention];
    const Icon = isSystemEvent ? GitCommit : (intentionConfig?.icon || MessageSquare);

    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                 <Avatar className="h-8 w-8">
                     {isSystemEvent ? 
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                            <Icon className="h-4 w-4 text-muted-foreground" />
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold">{author.name}</span>
                        <span className="text-muted-foreground">
                            {formatDistanceToNow(event.timestamp, { locale: ptBR, addSuffix: true })}
                        </span>
                    </div>
                     {intentionConfig && (
                        <Badge variant={intentionConfig.variant} className="text-xs">
                            <intentionConfig.icon className={cn("w-3 h-3 mr-1.5")} />
                            {intention}
                        </Badge>
                    )}
                </div>
                <div className={cn("mt-2 p-3 rounded-lg text-sm", isSystemEvent ? 'bg-muted/50' : 'bg-card border')}>
                    <p>{event.content}</p>
                    {isSystemEvent && event.meta && (
                         <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                            <p className="font-semibold">Motivo: <span className="font-normal">{event.meta.reason}</span></p>
                            <p className="font-semibold capitalize mt-1">{event.meta.field}: <span className="font-normal line-through">{event.meta.oldValue}</span> <ArrowRight className="inline w-3 h-3 mx-1" /> <span className="font-bold">{event.meta.newValue}</span></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


export function TaskCommunication({ task }: { task: Task }) {
    const [comment, setComment] = React.useState('');
    const [activeIntention, setActiveIntention] = React.useState<Intention>('Comentário');
    const { user } = useUser();
    const firestore = useFirestore();
    const timeline = task.timeline || [];

    const handleCommentSubmit = async () => {
        if (!comment.trim() || !user || !task) return;

        const taskRef = doc(firestore, 'tasks', task.id);

        const newEvent: TimelineEvent = {
            id: new Date().getTime().toString(), // Not ideal for production, but simple for now
            type: 'comment' as const,
            timestamp: new Date(), // This will be converted to a server timestamp by Firestore
            user: {
                id: user.uid,
                name: user.displayName || 'Usuário Anônimo',
                avatarUrl: user.photoURL || '',
                avatarHint: '',
            },
            content: comment,
            intention: activeIntention,
        };

        try {
            await updateDoc(taskRef, {
                timeline: arrayUnion(newEvent)
            });
            setComment('');
            setActiveIntention('Comentário');
        } catch (serverError) {
             const permissionError = new FirestorePermissionError({
                path: taskRef.path,
                operation: 'update',
                requestResourceData: { timeline: `ADD ${newEvent.id}` },
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    };


    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="relative">
                    {timeline.length > 0 ? (
                        timeline.slice().reverse().map((event) => <EventItem key={event.id} event={event} />)
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-10">
                            Nenhum histórico para esta tarefa ainda. Seja o primeiro a adicionar um comentário!
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 bg-card border-t">
                 <div className="mb-3 flex flex-wrap gap-2">
                    {(Object.keys(intentionMap) as Intention[]).map((intention) => {
                        const { icon: Icon, color } = intentionMap[intention];
                        return (
                            <Button
                                key={intention}
                                variant={activeIntention === intention ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveIntention(intention)}
                                className={cn('text-xs transition-all', activeIntention === intention && 'ring-1 ring-ring')}
                            >
                                <Icon className={cn("mr-1.5 h-4 w-4", intentionMap[intention].color)} />
                                {intention}
                            </Button>
                        );
                    })}
                </div>
                <Textarea 
                    placeholder={user ? "Adicione uma atualização..." : "Você precisa estar logado para comentar."}
                    className="bg-background"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={!user}
                />
                <div className="mt-2 flex justify-end items-center">
                    <Button onClick={handleCommentSubmit} disabled={!comment.trim() || !user}>Enviar</Button>
                </div>
            </div>
        </div>
    );
}
