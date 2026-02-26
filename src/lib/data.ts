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

// --- Super Admin Data Types ---

export type SuperAdminStat = {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease";
};

export type TenantSubscriptionStatus = "active" | "pending" | "cancelled" | "read_only";
export type TenantMaturity = "Autônomo" | "PME" | "Enterprise";

export type Tenant = {
  id: string;
  name: string;
  customDomain: string;
  logoUrl: string;
  subscriptionStatus: TenantSubscriptionStatus;
  maturity: TenantMaturity;
  vtm: number; // Value Under Management
};

export type NikoB2BInsight = {
  id: string;
  title: string;
  message: string;
  actionable: boolean;
  actionText?: string;
};

// --- Data ---

export const projects: Project[] = [];

export const atRiskProject: Project | undefined = projects.find(p => p.status === 'Em Risco');

export const stats: Stat[] = [];

export const superAdminStats: SuperAdminStat[] = [
  {
    title: "V.T.M. (Valor em Gestão)",
    value: "R$12.7M",
    icon: DollarSign,
    change: "+5.2%",
    changeType: "increase",
  },
  {
    title: "M.P.G. (Prazo Médio de Ganho)",
    value: "92 dias",
    icon: TrendingUp,
    change: "-3 dias",
    changeType: "decrease",
  },
  {
    title: "NPS do Ecossistema",
    value: "8.1/10",
    icon: Users,
    change: "+0.4",
    changeType: "increase",
  },
  {
    title: "Tenants Ativos",
    value: "42",
    icon: FolderKanban,
    change: "+2",
    changeType: "increase",
  },
];

export const tenants: Tenant[] = [
  {
    id: "acme-corp",
    name: "Acme Corporation",
    customDomain: "acme.zenos.tech",
    logoUrl: "https://placehold.co/40x40/ccff00/000000?text=A",
    subscriptionStatus: "active",
    maturity: "Enterprise",
    vtm: 4500000,
  },
  {
    id: "bravo-inc",
    name: "Bravo Inc.",
    customDomain: "app.bravocorp.com",
    logoUrl: "https://placehold.co/40x40/2A89D4/FFFFFF?text=B",
    subscriptionStatus: "read_only",
    maturity: "PME",
    vtm: 1200000,
  },
  {
    id: "charlie-solutions",
    name: "Charlie Solutions",
    customDomain: "charlie.zenos.tech",
    logoUrl: "https://placehold.co/40x40/8585EB/FFFFFF?text=C",
    subscriptionStatus: "active",
    maturity: "Autônomo",
    vtm: 350000,
  },
    {
    id: "delta-innovations",
    name: "Delta Innovations",
    customDomain: "delta.zenos.tech",
    logoUrl: "https://placehold.co/40x40/ffffff/000000?text=D",
    subscriptionStatus: "cancelled",
    maturity: "PME",
    vtm: 0,
  },
];

export const nikoB2BInsight: NikoB2BInsight = {
    id: "insight-01",
    title: "Oportunidade de Upsell: Acme Corp",
    message: "A Acme Corp (Enterprise) atingiu 95% do seu V.T.M. com sucesso. O engajamento está alto. É o momento ideal para oferecer o módulo de 'Análise Preditiva de Risco' como um add-on.",
    actionable: true,
    actionText: "Ver Detalhes da Proposta"
};

export const actionEnergyData = [
  { time: "00h", actions: 15 },
  { time: "03h", actions: 10 },
  { time: "06h", actions: 45 },
  { time: "09h", actions: 180 },
  { time: "12h", actions: 220 },
  { time: "15h", actions: 250 },
  { time: "18h", actions: 150 },
  { time: "21h", actions: 80 },
];
