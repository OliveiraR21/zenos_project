'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMembers } from "@/components/configuracoes/team-members";
import { GeneralSettings } from "@/components/configuracoes/general-settings";
import { BrandingSettings } from "@/components/configuracoes/branding-settings";
import { BillingSettings } from "@/components/configuracoes/billing-settings";

export default function ConfiguracoesPage() {
  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Configurações
          </h1>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        
        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="marca">Marca</TabsTrigger>
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral" className="space-y-4">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="equipe" className="space-y-4">
            <TeamMembers />
          </TabsContent>

           <TabsContent value="marca" className="space-y-4">
            <BrandingSettings />
          </TabsContent>

           <TabsContent value="faturamento" className="space-y-4">
            <BillingSettings />
          </TabsContent>

        </Tabs>
      </div>
    </MainLayout>
  );
}
