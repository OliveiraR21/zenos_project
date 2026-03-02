'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { useDoc, useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, collection, query, where, updateDoc } from 'firebase/firestore';
import { Project, Task, TaskStatus } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanView } from '@/components/projetos/kanban-view';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GanttView } from '@/components/projetos/gantt-view';
import { NewTaskDialog } from '@/components/projetos/new-task-dialog';
import { useToast } from '@/hooks/use-toast';
import { ScopeView } from '@/components/projetos/scope-view';
import { ProjectSettingsView } from '@/components/projetos/project-settings-view';

function ProjectDetailLoading() {
    return (
        <div className="space-y-4">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between space-y-2">
                <div>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <Skeleton className="h-9 w-9 rounded-full" />
            </div>

            {/* Tabs Skeleton */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-96 rounded-md" />
                <Skeleton className="h-10 w-36" />
            </div>

            {/* Kanban Board Skeleton */}
            <div className="w-full whitespace-nowrap overflow-x-auto pt-4">
                <div className="flex gap-6 pb-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col w-80 shrink-0">
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-8 ml-auto" />
                            </div>
                            <div className="flex flex-col gap-4 p-2 rounded-lg bg-transparent min-h-[200px]">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function ProjetoDetalhePage() {
    const params = useParams();
    const projectId = params.id as string;
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isNewTaskOpen, setNewTaskOpen] = useState(false);

    const projectRef = useMemoFirebase(() => {
        if (!projectId) return null;
        return doc(firestore, 'projects', projectId);
    }, [firestore, projectId]);
    const { data: project, isLoading: isProjectLoading } = useDoc<Project>(projectRef);
    
    const tasksQuery = useMemoFirebase(() => {
        if (!projectId) return null;
        return query(collection(firestore, 'tasks'), where('projectId', '==', projectId));
    }, [firestore, projectId]);
    const { data: tasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);

    const isLoading = isProjectLoading || areTasksLoading;

    const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus): Promise<boolean> => {
        const taskRef = doc(firestore, 'tasks', taskId);
        try {
            await updateDoc(taskRef, { status: newStatus });
            toast({
                title: "Status da tarefa atualizado!",
                description: `A tarefa foi movida para "${newStatus}".`
            });
            return true;
        } catch (serverError) {
             toast({
                variant: "destructive",
                title: "Falha ao atualizar tarefa",
                description: "O status da tarefa não pôde ser salvo. Revertendo.",
            });
            const permissionError = new FirestorePermissionError({
                path: taskRef.path,
                operation: 'update',
                requestResourceData: { status: newStatus },
            });
            errorEmitter.emit('permission-error', permissionError);
            return false;
        }
    };
    
    return (
        <MainLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                {isLoading ? (
                   <ProjectDetailLoading />
                ) : project ? (
                    <>
                        <div className="flex items-start justify-between space-y-2">
                            <div>
                                <p className="text-muted-foreground text-sm">Projeto</p>
                                <h1 className="text-3xl font-bold tracking-tight font-headline">
                                    {project.name}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserNav />
                            </div>
                        </div>

                        <Tabs defaultValue="kanban">
                            <div className="flex justify-between items-center">
                                <TabsList>
                                    <TabsTrigger value="kanban">Kanban</TabsTrigger>
                                    <TabsTrigger value="gantt">Gantt</TabsTrigger>
                                    <TabsTrigger value="escopo">Escopo (WBS)</TabsTrigger>
                                    <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
                                </TabsList>
                                <Button onClick={() => setNewTaskOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Nova Tarefa
                                </Button>
                            </div>
                            <TabsContent value="kanban" className="pt-4">
                                <KanbanView tasks={tasks || []} onTaskStatusChange={handleTaskStatusChange} />
                            </TabsContent>
                            <TabsContent value="gantt">
                               <GanttView tasks={tasks || []} />
                            </TabsContent>
                            <TabsContent value="escopo">
                                <ScopeView />
                            </TabsContent>
                             <TabsContent value="configuracoes">
                                <ProjectSettingsView project={project} />
                            </TabsContent>
                        </Tabs>

                        <NewTaskDialog 
                            isOpen={isNewTaskOpen}
                            onClose={() => setNewTaskOpen(false)}
                            projectId={project.id}
                            projectName={project.name}
                            tenantId={project.tenantId}
                        />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <p>Projeto não encontrado.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
