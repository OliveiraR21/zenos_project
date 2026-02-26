import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type ProjectTableProps = {
  projects: Project[];
};

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    "Em Dia": "default",
    "Em Risco": "destructive",
    "Atrasado": "destructive",
    "Concluído": "secondary",
};

// Volt Tracker component
function VoltTracker({ value, total, type }: { value: number; total: number, type: string }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const isCurrency = type !== 'Melhoria do NPS';
    const formatter = isCurrency ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : new Intl.NumberFormat('pt-BR');

    return (
        <div>
            <div className="w-full h-4 bg-black rounded-full overflow-hidden border border-muted">
                <div 
                    className="h-full bg-volt transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="text-xs text-muted-foreground mt-1.5 text-right">
                <span className="font-bold text-white">{formatter.format(value)}</span> de ganho garantido / <span className="font-bold text-white">{formatter.format(total)}</span> Alvo
            </div>
        </div>
    );
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="font-headline text-2xl font-semibold tracking-tight">
          Ganhos em Espera
        </h3>
      </div>
      <div className="border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Projeto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[300px]">Valor Realizado</TableHead>
              <TableHead className="text-right">Prazo Final do Ganho</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project) => {
                const guaranteedGain = project.targetGain.value * (project.profitHealth / 100);
                return (
                  <TableRow key={project.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                      <div className="font-medium font-headline">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Responsável: {project.responsible}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[project.status] || "outline"}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <VoltTracker value={guaranteedGain} total={project.targetGain.value} type={project.targetGain.type}/>
                    </TableCell>
                    <TableCell className="text-right">
                        <div>{format(project.finalDeadline, "dd 'de' MMM, yyyy", { locale: ptBR })}</div>
                        <div className="text-sm text-muted-foreground">{formatDistanceToNow(project.finalDeadline, { addSuffix: true, locale: ptBR })}</div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum projeto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
