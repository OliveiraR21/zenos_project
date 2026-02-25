import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";

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
        <div className="flex items-center justify-center h-96 border-dashed border-2 border-muted rounded-lg">
          <p className="text-muted-foreground">
            Página de configurações em construção.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
