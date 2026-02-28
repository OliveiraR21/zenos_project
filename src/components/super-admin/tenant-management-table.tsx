import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Tenant, TenantSubscriptionStatus } from "@/lib/data";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type TenantManagementTableProps = {
  tenants: Tenant[];
  isLoading: boolean;
};

const statusVariant: { [key in TenantSubscriptionStatus]: "default" | "secondary" | "destructive" | "outline" } = {
    "active": "default",
    "pending": "secondary",
    "cancelled": "destructive",
    "read_only": "outline",
};

const statusText: { [key in TenantSubscriptionStatus]: string } = {
    "active": "Ativa",
    "pending": "Pendente",
    "cancelled": "Cancelada",
    "read_only": "Somente Leitura",
};

export function TenantManagementTable({ tenants, isLoading }: TenantManagementTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full">
      <div className="p-6 flex justify-between items-center">
        <h3 className="font-headline text-2xl font-semibold tracking-tight">
          Gestão de Tenants
        </h3>
        <Button variant="outline" size="sm">Ver Todos</Button>
      </div>
      <div className="border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>V.T.M</TableHead>
              <TableHead>Assinatura</TableHead>
              <TableHead>Maturidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : tenants.length > 0 ? (
              tenants.map((tenant) => (
              <TableRow key={tenant.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={tenant.logoUrl} alt={tenant.name} />
                      <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium font-headline">{tenant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {tenant.customDomain}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  R${((tenant.vtm || 0) / 1000000).toFixed(1)}M
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[tenant.subscriptionStatus] || "outline"}>
                    {statusText[tenant.subscriptionStatus]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{tenant.maturity}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum tenant encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
