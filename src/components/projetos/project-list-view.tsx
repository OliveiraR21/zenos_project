'use client';
import Link from 'next/link';
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, GanttChartSquare } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Project } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc } from '@/firebase/firestore/use-doc';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ProjectListLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProjectListView() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  
  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const projectsQuery = useMemoFirebase(() => {
    if (!userProfile?.tenantId) return null;
    return query(collection(firestore, 'projects'), where('tenantId', '==', userProfile.tenantId));
  }, [firestore, userProfile]);
  const { data: projects, isLoading: areProjectsLoading } = useCollection<Project>(projectsQuery);

  const isLoading = isUserLoading || isProfileLoading || areProjectsLoading;

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Projetos
          </h1>
          <div className="flex items-center space-x-2">
            <UserNav />
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Projeto
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <ProjectListLoading />
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Link href={`/projetos/${project.id}`} key={project.id}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <GanttChartSquare className="w-5 h-5 text-primary" />
                        {project.name}
                    </CardTitle>
                    <CardDescription>Sponsor: {project.sponsorName}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="text-sm text-muted-foreground">
                        Prazo do Ganho: {format(new Date(project.targetGainDeadline), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 border-dashed border-2 border-muted rounded-lg">
            <div className="text-center">
                <GanttChartSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Nenhum projeto encontrado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Clique em "Novo Projeto" para começar a gerenciar seus ganhos.
                </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
