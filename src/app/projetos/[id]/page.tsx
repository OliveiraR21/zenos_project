'use client';
import { useParams } from 'next/navigation';
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Project, Task } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanView } from '@/components/projetos/kanban-view';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GanttView } from '@/components/projetos/gantt-view';

function ProjectDetailLoading() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <div className="pt-4">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    )
}

function PlaceholderContent({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-muted rounded-lg">
            <h3 className="text-lg font-medium">Visão de {title} em Construção</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Esta funcionalidade está no nosso roadmap e será implementada em breve.
            </p>
        </div>
    );
}

export default function ProjetoDetalhePage() {
    const params = useParams();
    const projectId = params.id as string;
    const firestore = useFirestore();

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
                                    <TabsTrigger value="escopo">Escopo</TabsTrigger>
                                    <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
                                </TabsList>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Nova Tarefa
                                </Button>
                            </div>
                            <TabsContent value="kanban" className="pt-4">
                                <KanbanView tasks={tasks || []} />
                            </TabsContent>
                            <TabsContent value="gantt">
                               <GanttView tasks={tasks || []} />
                            </TabsContent>
                            <TabsContent value="escopo">
                                <PlaceholderContent title="Escopo (WBS)" />
                            </TabsContent>
                             <TabsContent value="configuracoes">
                                <PlaceholderContent title="Configurações do Projeto" />
                            </TabsContent>
                        </Tabs>
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
