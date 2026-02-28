'use client';
import * as React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, query, where } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/data';

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  tenantId: string;
}

const taskSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  responsibleId: z.string({ required_error: "Selecione um responsável." }),
  newDeadline: z.date({ required_error: "Selecione um prazo." }),
});

export function NewTaskDialog({ isOpen, onClose, projectId, projectName, tenantId }: NewTaskDialogProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    // Fetch users for the assignee dropdown
    const usersQuery = useMemoFirebase(() => {
        if (!tenantId) return null;
        return query(collection(firestore, 'users'), where('tenantId', '==', tenantId));
    }, [firestore, tenantId]);
    const { data: users, isLoading: usersLoading } = useCollection<User>(usersQuery);
    
    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
        },
    });

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        const responsible = users?.find(u => u.id === values.responsibleId);
        if (!responsible) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Responsável não encontrado.' });
            return;
        }

        const newTaskRef = doc(collection(firestore, 'tasks'));
        const newTaskId = newTaskRef.id;

        const newTask = {
            id: newTaskId,
            projectId: projectId,
            projectName: projectName,
            tenantId: tenantId,
            title: values.title,
            responsibleId: values.responsibleId,
            responsible: responsible.name, // Denormalizing name for display
            startDate: new Date().toISOString(),
            baselineDeadline: values.newDeadline.toISOString(),
            newDeadline: values.newDeadline.toISOString(),
            status: 'A Fazer' as const,
            isCriticalPath: false,
            dependencies: [],
            completedAt: null,
            qualityCheck: { prompt: "O critério de aceite foi atendido?" },
            timeline: [],
        };
        
        try {
            await setDoc(newTaskRef, newTask);
            toast({ title: "Tarefa criada!", description: `A tarefa "${values.title}" foi adicionada.` });
            form.reset();
            onClose();
        } catch (error) {
            console.error("Error creating task:", error);
            toast({ variant: 'destructive', title: 'Erro ao criar tarefa', description: 'Não foi possível salvar a tarefa no Firestore.' });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-xl">Nova Tarefa</DialogTitle>
                    <DialogDescription>Adicione uma nova tarefa ao projeto.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título da Tarefa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Desenvolver endpoint de autenticação" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="responsibleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsável</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={usersLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={usersLoading ? "Carregando..." : "Selecione um membro da equipe"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users?.map(user => (
                                                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newDeadline"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Prazo</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: ptBR })
                                                    ) : (
                                                        <span>Escolha uma data</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                            <Button type="submit">Criar Tarefa</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
