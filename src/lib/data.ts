import { DollarSign, FolderKanban, TrendingUp, Users, type LucideIcon } from "lucide-react";

export type TimelineEvent = {
  id: string;
  type: 'event' | 'comment';
  timestamp: Date;
  user?: {
    id: string;
    name: string;
    avatarUrl: string;
    avatarHint: string;
  };
  content: string;
  intention?: 'Decisão' | 'Impedimento' | 'Dúvida';
  meta?: {
    field: string;
    oldValue: string;
    newValue: string;
    reason: string;
  };
};


export type Task = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  responsible: string; // Name of the responsible person
  responsibleId: string; // ID of the responsible person
  baselineDeadline: Date;
  newDeadline: Date;
  completedAt: Date | null;
  dependencies: string[];
  isCriticalPath: boolean;
  qualityCheck: {
    prompt: string;
  };
  timeline: TimelineEvent[];
};

export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    avatarHint: string;
}

export type ProjectStatus = "Em Dia" | "Em Risco" | "Atrasado" | "Concluído";
export type TargetGainType = "Aumento de Vendas" | "Redução de Custos" | "Melhoria do NPS" | "Eficiência Operacional";

export type Project = {
  id: string;
  name: string;
  sponsor: string;
  responsible: string; // Manager
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
  nikoSummary: string;
};

// --- Mock Users ---
export const users: User[] = [];

export const currentUser: User | undefined = undefined;


// --- Detailed Task Data ---

const zAlphaTasks: Task[] = [];

const costOptTasks: Task[] = [];

const allTasks: Task[] = [];


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

// --- Main Data Export ---

export const projects: Project[] = [];


export function getTaskById(taskId: string): Task | undefined {
    return allTasks.find(t => t.id === taskId);
}

export function getTasksForUser(userId: string): Task[] {
    return allTasks.filter(t => t.responsibleId === userId && t.completedAt === null);
}

export function getDependents(taskId: string): User[] {
    const dependentTasks = allTasks.filter(t => t.dependencies.includes(taskId));
    const responsibleIds = new Set(dependentTasks.map(t => t.responsibleId));
    return users.filter(u => responsibleIds.has(u.id));
}


export const atRiskProject: Project | undefined = undefined;

export const superAdminStats: SuperAdminStat[] = [];

export const tenants: Tenant[] = [];

export const nikoB2BInsight: NikoB2BInsight | null = null;

export const actionEnergyData: { time: string, actions: number }[] = [];
