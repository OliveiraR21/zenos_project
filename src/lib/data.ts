import type { LucideIcon } from "lucide-react";

// Tipos de dados permanecem para consistência em todo o aplicativo.
// Todos os dados fictícios foram removidos. As informações agora vêm do Firestore.

export type TimelineEvent = {
  id: string;
  type: 'event' | 'comment';
  timestamp: string;
  user?: {
    id: string;
    name: string;
    avatarUrl: string;
    avatarHint: string;
  };
  content: string;
  intention?: 'Comentário' | 'Decisão' | 'Impedimento' | 'Dúvida';
  meta?: {
    field: string;
    oldValue: string;
    newValue: string;
    reason: string;
  };
};

export type TaskStatus = "A Fazer" | "Em Andamento" | "Em Validação" | "Concluído";

export type Task = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  responsible: string; // Name of the responsible person
  responsibleId: string; // ID of the responsible person
  startDate: string;
  baselineDeadline: string;
  newDeadline: string;
  completedAt: string | null;
  dependencies: string[];
  isCriticalPath: boolean;
  status: TaskStatus;
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
  sponsorName: string;
  managerId: string;
  targetGainDeadline: string;
  tenantId: string;
  // Os campos abaixo são exemplos e podem não vir diretamente do Firestore
  // a menos que sejam calculados e armazenados.
  sponsor?: string;
  responsible?: string; // Manager
  finalDeadline?: Date;
  targetGain?: {
    type: TargetGainType;
    value: number;
  };
  tasks?: Task[];
  status?: ProjectStatus;
  profitHealth?: number; // Percentage
  costOfDelay?: number;
  deadlineImpact?: number; // in days
  atRiskTask?: Task;
  nikoSummary?: string;
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
