'use client';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';

import { ProjectTable } from "@/components/dashboard/project-table";
import { NikoAlert } from "@/components/dashboard/niko-alert";
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { SponsorNikoSummary } from '@/components/dashboard/sponsor-niko-summary';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Project } from '@/lib/data';

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

  if (isUserLoading || isProfileLoading) {
    return <DashboardLoading />;
  }

  if (!user) {
     // Em uma app real, provavelmente redirecionaria para uma página de login
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
  const criticalProject = projects?.find(p => p.status === 'Em Risco') || projects?.[0];
  const atRiskProject = projects?.find(p => p.status === 'Em Risco');

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
            <ProjectTable projects={projects || []} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
