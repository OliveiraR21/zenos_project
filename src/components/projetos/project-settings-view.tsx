'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CalendarIcon, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Project, Task } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, writeBatch, doc, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


interface ProjectSettingsViewProps {
    project: Project;
}

export function ProjectSettingsView({ project }: ProjectSettingsViewProps) {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [deadline, setDeadline] = React.useState<Date | undefined>(project.targetGainDeadline ? project.targetGainDeadline : undefined);

    const handleDeleteProject = async () => {
        setIsLoading(true);
        try {
            const batch = writeBatch(firestore);

            // 1. Find all tasks associated with the project
            const tasksQuery = query(collection(firestore, 'tasks'), where('projectId', '==', project.id));
            const tasksSnapshot = await getDocs(tasksQuery);
            
            // 2. Delete all tasks in the batch
            tasksSnapshot.forEach(taskDoc => {
                batch.delete(taskDoc.ref);
            });

            // 3. Delete the project itself
            const projectRef = doc(firestore, 'projects', project.id);
            batch.delete(projectRef);

            // 4. Commit the batch
            await batch.commit();

            toast({
                title: "Projeto excluído!",
                description: `O projeto "${project.name}" e todas as suas tarefas foram removidos.`,
            });

            router.push('/projetos');

        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir projeto',
                description: 'Não foi possível excluir o projeto. Por favor, tente novamente.',
            });
            setIsLoading(false);
        }
    };


    return (
        <div className="grid gap-6 max-w-2xl mx-auto pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Configurações Gerais do Projeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="projectName">Nome do Projeto</Label>
                        <Input id="projectName" defaultValue={project.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="sponsorName">Nome do Sponsor</Label>
                        <Input id="sponsorName" defaultValue={project.sponsorName} />
                    </div>
                     <div className="space-y-2">
                        <Label>Prazo Final do Ganho</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !deadline && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {deadline ? format(deadline, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-background">
                                <Calendar
                                    mode="single"
                                    selected={deadline}
                                    onSelect={setDeadline}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Salvar Alterações</Button>
                </CardFooter>
            </Card>

             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>A exclusão de um projeto é permanente e não pode ser desfeita. Todas as tarefas e dados associados serão perdidos.</CardDescription>
                </CardContent>
                <CardFooter>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isLoading}>
                                {isLoading ? 'Excluindo...' : <><Trash className="mr-2 h-4 w-4" /> Excluir Projeto</>}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto
                                <strong className="font-bold"> {project.name} </strong>
                                e todas as suas tarefas associadas.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive hover:bg-destructive/90">
                                Sim, excluir projeto
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
