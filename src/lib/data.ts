import { DollarSign, FolderKanban, TrendingUp, Users } from "lucide-react";

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

const today = new Date();

export const projects: Project[] = [
  {
    id: "PROJ-001",
    name: "Projeto Alfa: Lançamento da Plataforma T3",
    sponsor: "Sofia Costa",
    responsible: "Ana Oliveira",
    finalDeadline: new Date(today.getFullYear(), today.getMonth() + 2, 15),
    targetGain: {
      type: "Aumento de Vendas",
      value: 150000,
    },
    tasks: [],
    status: "Em Risco",
    profitHealth: 75,
    costOfDelay: 500,
    deadlineImpact: 5,
    atRiskTask: {
        id: "TASK-003",
        title: "Integração do Backend",
        responsible: "João Pereira",
        baselineDeadline: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        newDeadline: new Date(today.getFullYear(), today.getMonth() + 1, 6),
        completedAt: null,
        dependencies: ["TASK-002"],
    },
  },
  {
    id: "PROJ-002",
    name: "Projeto Beta: Iniciativa de Redução de Custos",
    sponsor: "Carlos Silva",
    responsible: "Ana Oliveira",
    finalDeadline: new Date(today.getFullYear(), today.getMonth() + 1, 20),
    targetGain: {
      type: "Redução de Custos",
      value: 75000,
    },
    tasks: [],
    status: "Em Dia",
    profitHealth: 98,
    costOfDelay: 0,
    deadlineImpact: 0,
  },
  {
    id: "PROJ-003",
    name: "Projeto Gama: Melhoria do NPS",
    sponsor: "Sofia Costa",
    responsible: "Ana Oliveira",
    finalDeadline: new Date(today.getFullYear(), today.getMonth() + 3, 1),
    targetGain: {
      type: "Melhoria do NPS",
      value: 50000,
    },
    tasks: [],
    status: "Em Dia",
    profitHealth: 95,
    costOfDelay: 0,
    deadlineImpact: 0,
  },
  {
    id: "PROJ-004",
    name: "Projeto Delta: Eficiência Operacional",
    sponsor: "Carlos Silva",
    responsible: "Ana Oliveira",
    finalDeadline: new Date(today.getFullYear(), today.getMonth(), 25),
    targetGain: {
      type: "Eficiência Operacional",
      value: 90000,
    },
    tasks: [],
    status: "Concluído",
    profitHealth: 100,
    costOfDelay: 0,
    deadlineImpact: 0,
  },
];

export const atRiskProject = projects[0];

export const stats = [
    {
      title: "Projeção Total de ROI",
      value: "R$365.000",
      icon: DollarSign,
      change: "+2.5%",
      changeType: "increase" as "increase" | "decrease",
    },
    {
      title: "Projetos Ativos",
      value: "3",
      icon: FolderKanban,
      change: "+1",
      changeType: "increase" as "increase" | "decrease",
    },
    {
      title: "Projetos em Risco",
      value: "1",
      icon: TrendingUp,
      change: "-50%",
      changeType: "decrease" as "increase" | "decrease",
    },
    {
      title: "Carga da Equipe",
      value: "85%",
      icon: Users,
      change: "+5%",
      changeType: "increase" as "increase" | "decrease",
    },
];
