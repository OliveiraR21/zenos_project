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
          {/* SponsorNikoSummary Skeleton */}
          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 shrink-0" />
              <div className="w-full space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-11/12" />
              </div>
            </div>
          </div>

          {/* ProjectTable Skeleton */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <Skeleton className="h-7 w-48" />
            </div>
            <div className="border-t">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[300px]"><Skeleton className="h-5 w-20" /></th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"><Skeleton className="h-5 w-20" /></th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[300px]"><Skeleton className="h-5 w-24" /></th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right"><Skeleton className="h-5 w-28 ml-auto" /></th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle">
                          <Skeleton className="h-5 w-40 mb-1.5" />
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="p-4 align-middle"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="p-4 align-middle"><Skeleton className="h-8 w-full" /></td>
                        <td className="p-4 align-middle text-right">
                          <Skeleton className="h-5 w-28 ml-auto mb-1.5" />
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export function DashboardView() {
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
  
  React.useEffect(() => {
    // Wait until user loading is complete
    if (!isUserLoading) {
      // If no user, redirect to login
      if (!user) {
        router.push('/login');
      }
      // If user exists, but no profile in firestore, redirect to onboarding
      else if (!isProfileLoading && !userProfile) {
         router.push('/onboarding');
      }
    }
  }, [isUserLoading, user, isProfileLoading, userProfile, router]);


  const analyzedProjects = React.useMemo<AnalyzedProject[]>(() => {
    if (!projects || !allTasks) return [];
    
    const tasksByProject = allTasks.reduce((acc, task) => {
      if (!acc[task.projectId]) {
        acc[task.projectId] = [];
      }
      acc[task.projectId].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return projects.map(p => analyzeProjectHealth(p, tasksByProject[p.id] || []));
  }, [projects, allTasks]);


  const isLoading = isUserLoading || isProfileLoading || areProjectsLoading || areTasksLoading;

  if (isLoading || !user || !userProfile) {
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
