'use client';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import React from 'react';

import { ProjectTable } from "@/components/dashboard/project-table";
import { NikoAlert } from "@/components/dashboard/niko-alert";
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { SponsorNikoSummary } from '@/components/dashboard/sponsor-niko-summary';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Project, Task } from '@/lib/data';
import { analyzeProjectHealth, AnalyzedProject } from '@/lib/project-analysis';

function DashboardLoading() {
  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </MainLayout>
  )
}

export default function DashboardPage() {
  const router = useRouter();
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

  const tasksQuery = useMemoFirebase(() => {
    if (!userProfile?.tenantId) return null;
    return query(collection(firestore, 'tasks'), where('tenantId', '==', userProfile.tenantId));
  }, [firestore, userProfile]);
  const { data: allTasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);

  const analyzedProjects = React.useMemo<AnalyzedProject[]>(() => {
    if (!projects || !allTasks) return [];
    
    // Group tasks by project
    const tasksByProject = allTasks.reduce((acc, task) => {
      if (!acc[task.projectId]) {
        acc[task.projectId] = [];
      }
      acc[task.projectId].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    // Analyze each project
    return projects.map(p => analyzeProjectHealth(p, tasksByProject[p.id] || []));
  }, [projects, allTasks]);


  const isLoading = isUserLoading || isProfileLoading || areProjectsLoading || areTasksLoading;

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return (
       <MainLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Dashboard Executivo
            </h1>
            <UserNav />
          </div>
          <div className="flex items-center justify-center h-96 border-dashed border-2 border-muted rounded-lg">
            <p className="text-muted-foreground">Por favor, faça login para ver seus projetos.</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!userProfile) {
    router.push('/onboarding');
    return <DashboardLoading />;
  }

  // Find the most critical project for the summary (at risk, or first one)
  const criticalProject = [...analyzedProjects].sort((a, b) => b.deadlineImpact - a.deadlineImpact)[0];
  const atRiskProject = analyzedProjects.find(p => p.status === 'Em Risco' || p.status === 'Atrasado');

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard Executivo
          </h1>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>

        {areProjectsLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        ) : (
          <div className={cn("space-y-4 transition-all duration-300", atRiskProject && "rounded-lg border-2 border-volt p-1")}>
            <SponsorNikoSummary project={criticalProject} />
            {atRiskProject && <NikoAlert project={atRiskProject} />}
            <ProjectTable projects={analyzedProjects || []} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
