import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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


export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="font-headline text-2xl font-semibold tracking-tight">
          Vetores de Projeto
        </h3>
      </div>
      <div className="border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Projeto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Saúde do Lucro</TableHead>
              <TableHead>Impacto no ROI</TableHead>
              <TableHead className="text-right">Prazo Final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project) => (
              <TableRow key={project.id} className="hover:bg-muted/50 cursor-pointer">
                <TableCell>
                  <div className="font-medium font-headline">{project.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Patrocinador: {project.sponsor}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[project.status] || "outline"}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Progress value={project.profitHealth} className={cn("h-2", project.profitHealth < 50 ? "[&>div]:bg-destructive" : "[&>div]:bg-volt")} />
                        <span className={cn("text-sm font-medium", project.profitHealth < 50 ? "text-destructive" : "text-volt")}>{project.profitHealth}%</span>
                    </div>
                </TableCell>
                <TableCell className={cn("font-medium", project.costOfDelay > 0 && "text-volt")}>
                  {project.costOfDelay > 0 ? `R$${project.costOfDelay.toLocaleString('pt-BR')}/dia` : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                    <div>{format(project.finalDeadline, "dd 'de' MMM, yyyy", { locale: ptBR })}</div>
                    <div className="text-sm text-muted-foreground">{formatDistanceToNow(project.finalDeadline, { addSuffix: true, locale: ptBR })}</div>
                </TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum projeto encontrado. Comece clicando em "Novo Projeto".
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
