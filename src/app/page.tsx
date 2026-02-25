import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectTable } from "@/components/dashboard/project-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { projects, stats, atRiskProject } from "@/lib/data";
import { NikoAlert } from "@/components/dashboard/niko-alert";
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard Executivo
          </h1>
          <div className="flex items-center space-x-2">
            <UserNav />
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Projeto
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <NikoAlert project={atRiskProject} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                changeType={stat.changeType}
              />
            ))}
          </div>
          <ProjectTable projects={projects} />
        </div>
      </div>
    </MainLayout>
  );
}
