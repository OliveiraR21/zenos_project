'use client';
import * as React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { KpiGrid } from "@/components/super-admin/kpi-grid";
import { TenantManagementTable } from "@/components/super-admin/tenant-management-table";
import type { SuperAdminStat, Tenant, Project } from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { DollarSign, FolderKanban, Users, TrendingUp } from 'lucide-react';

export function SuperAdminView() {
  const firestore = useFirestore();

  const tenantsQuery = useMemoFirebase(() => collection(firestore, 'organizations'), [firestore]);
  const { data: tenants, isLoading: tenantsLoading } = useCollection<Tenant>(tenantsQuery);

  const projectsQuery = useMemoFirebase(() => collection(firestore, 'projects'), [firestore]);
  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

  const superAdminStats: SuperAdminStat[] = React.useMemo(() => {
    if (!projects || !tenants) return [
      { title: "V.T.G. (Valor Total Gerido)", value: "...", icon: DollarSign },
      { title: "Tenants Ativos", value: "...", icon: Users },
      { title: "Projetos Ativos", value: "...", icon: FolderKanban },
      { title: "NPS do Ecossistema", value: "...", icon: TrendingUp },
    ];

    const totalValue = projects.reduce((acc, p) => acc + p.targetGain.value, 0);
    const activeProjects = projects.filter(p => p.status !== 'Concluído').length;
    const activeTenants = tenants.filter(t => t.subscriptionStatus === 'active').length;

    return [
      {
        title: "V.T.G. (Valor Total Gerido)",
        value: `R$ ${(totalValue / 1000000).toFixed(2)}M`,
        icon: DollarSign,
      },
      {
        title: "Tenants Ativos",
        value: activeTenants.toString(),
        icon: Users,
      },
      {
        title: "Projetos Ativos",
        value: activeProjects.toString(),
        icon: FolderKanban,
      },
      {
        title: "NPS do Ecossistema",
        value: "92", // Este valor ainda seria simulado ou viria de outra fonte
        icon: TrendingUp,
        change: "+1.2%",
        changeType: "increase",
      },
    ];
  }, [projects, tenants]);

  return (
    <MainLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Super Admin Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>

        <div className="space-y-6">
          <KpiGrid stats={superAdminStats} />
          <TenantManagementTable tenants={tenants || []} isLoading={tenantsLoading} />
        </div>
      </div>
    </MainLayout>
  );
}
