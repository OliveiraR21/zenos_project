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

export type Project = {
  id: string;
  name: string;
  sponsor: string;
  responsible: string;
  finalDeadline: Date;
  targetGain: {
    type: "Increased Sales" | "Cost Reduction" | "NPS Improvement" | "Operational Efficiency";
    value: number;
  };
  tasks: Task[];
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
  profitHealth: number; // Percentage
  costOfDelay: number;
  deadlineImpact: number; // in days
  atRiskTask?: Task;
};

const today = new Date();

export const projects: Project[] = [
  {
    id: "PROJ-001",
    name: "Project Alpha: Q3 Platform Launch",
    sponsor: "Sofia Costa",
    responsible: "Ana Oliveira",
    finalDeadline: new Date(today.getFullYear(), today.getMonth() + 2, 15),
    targetGain: {
      type: "Increased Sales",
      value: 150000,
    },
    tasks: [],
    status: "At Risk",
    profitHealth: 75,
    costOfDelay: 500,
    deadlineImpact: 5,
    atRiskTask: {
        id: "TASK-003",
        title: "Backend Integration",
        responsible: "João Pereira",
        baselineDeadline: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        newDeadline: new Date(today.getFullYear(), today.getMonth() + 1, 6),
        completedAt: null,
        dependencies: ["TASK-002"],
    },
  },
  {
    id: "PROJ-002",
    name: "Project Beta: Cost Reduction Initiative",
    sponsor: "Carlos Silva",
    responsible: "Ana Oliveira",
    finalDeadline: new Date(today.getFullYear(), today.getMonth() + 1, 20),
    targetGain: {
      type: "Cost Reduction",
      value: 75000,
    },
    tasks: [],
    status: "On Track",
    profitHealth: 98,
    costOfDelay: 0,
    deadlineImpact: 0,
  },
  {
    id: "PROJ-003",
    name: "Project Gamma: NPS Improvement",
    sponsor: "Sofia Costa",
    responsible: "Ana Oliveira",
    finalDeadline: new Date(today.getFullYear(), today.getMonth() + 3, 1),
    targetGain: {
      type: "NPS Improvement",
      value: 50000,
    },
    tasks: [],
    status: "On Track",
    profitHealth: 95,
    costOfDelay: 0,
    deadlineImpact: 0,
  },
  {
    id: "PROJ-004",
    name: "Project Delta: Operational Efficiency",
    sponsor: "Carlos Silva",
    responsible: "Ana Oliveira",
    finalDeadline: new Date(today.getFullYear(), today.getMonth(), 25),
    targetGain: {
      type: "Operational Efficiency",
      value: 90000,
    },
    tasks: [],
    status: "Completed",
    profitHealth: 100,
    costOfDelay: 0,
    deadlineImpact: 0,
  },
];

export const atRiskProject = projects[0];

export const stats = [
    {
      title: "Total ROI Projection",
      value: "$365,000",
      icon: DollarSign,
      change: "+2.5%",
      changeType: "increase" as "increase" | "decrease",
    },
    {
      title: "Active Projects",
      value: "3",
      icon: FolderKanban,
      change: "+1",
      changeType: "increase" as "increase" | "decrease",
    },
    {
      title: "Projects at Risk",
      value: "1",
      icon: TrendingUp,
      change: "-50%",
      changeType: "decrease" as "increase" | "decrease",
    },
    {
      title: "Team Load",
      value: "85%",
      icon: Users,
      change: "+5%",
      changeType: "increase" as "increase" | "decrease",
    },
];
