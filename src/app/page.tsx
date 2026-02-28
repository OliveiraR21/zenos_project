import { redirect } from 'next/navigation';
import { ProjectTable } from "@/components/dashboard/project-table";
import { projects, organizationExists } from "@/lib/data";
import { NikoAlert } from "@/components/dashboard/niko-alert";
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { SponsorNikoSummary } from '@/components/dashboard/sponsor-niko-summary';
import { cn } from '@/lib/utils';

export default function DashboardPage() {

  // If the organization doesn't exist, redirect to the onboarding flow.
  // This is a simulation. In a real app, this would check Firestore.
  if (!organizationExists) {
    redirect('/onboarding');
  }

  // Find the most critical project for the summary (at risk, or first one)
  const criticalProject = projects.find(p => p.status === 'Em Risco') || projects[0];
  const atRiskProject = projects.find(p => p.status === 'Em Risco');


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

        <div className={cn("space-y-4 transition-all duration-300", atRiskProject && "rounded-lg border-2 border-volt p-1")}>
          <SponsorNikoSummary project={criticalProject} />
          {atRiskProject && <NikoAlert project={atRiskProject} />}
          <ProjectTable projects={projects} />
        </div>
      </div>
    </MainLayout>
  );
}
