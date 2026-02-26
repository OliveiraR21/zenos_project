import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { KpiGrid } from "@/components/super-admin/kpi-grid";
import { TenantManagementTable } from "@/components/super-admin/tenant-management-table";
import { NikoB2BAlert } from "@/components/super-admin/niko-b2b-alert";
import { ActionEnergyChart } from "@/components/super-admin/action-energy-chart";
import {
  superAdminStats,
  tenants,
  nikoB2BInsight,
  actionEnergyData,
} from "@/lib/data";

export default function SuperAdminPage() {
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
          <NikoB2BAlert insight={nikoB2BInsight} />
          
          <KpiGrid stats={superAdminStats} />

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
             <div className="col-span-12 lg:col-span-4">
                <TenantManagementTable tenants={tenants} />
             </div>
             <div className="col-span-12 lg:col-span-3">
                <ActionEnergyChart data={actionEnergyData} />
             </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
