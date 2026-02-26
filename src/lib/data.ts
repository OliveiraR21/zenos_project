import { DollarSign, FolderKanban, TrendingUp, Users, type LucideIcon } from "lucide-react";

export type Task = {
  id: string;
  title: string;
  responsible: string;
  baselineDeadline: Date;
  newDeadline: Date;
  completedAt: Date | null;
  dependencies: string[];
};

export type ProjectStatus = "Em Dia" | "Em Risco" | "Atrasado" | "Concluído";
export type TargetGainType = "Aumento de Vendas" | "Redução de Custos" | "Melhoria do NPS" | "Eficiência Operacional";

export type Project = {
  id: string;
  name: string;
  sponsor: string;
  responsible: string;
  finalDeadline: Date;
  targetGain: {
    type: TargetGainType;
    value: number;
  };
  tasks: Task[];
  status: ProjectStatus;
  profitHealth: number; // Percentage
  costOfDelay: number;
  deadlineImpact: number; // in days
  atRiskTask?: Task;
};

export type Stat = {
    title: string;
    value: string;
    icon: LucideIcon;
    change?: string;
    changeType?: "increase" | "decrease";
};

export const projects: Project[] = [];

export const atRiskProject: Project | undefined = projects.find(p => p.status === 'Em Risco');

export const stats: Stat[] = [];
