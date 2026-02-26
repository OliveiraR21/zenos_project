import { DollarSign, FolderKanban, TrendingUp, Users, type LucideIcon } from "lucide-react";

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
  }
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
export const users: User[] = [
    { id: 'user-ana', name: 'Ana Oliveira', email: 'ana.oliveira@zenos.co', avatarUrl: 'https://images.unsplash.com/photo-1557053908-4793c484d06f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc3MjAzMjc1MHww&ixlib=rb-4.1.0&q=80&w=1080', avatarHint: 'woman portrait' },
    { id: 'user-carlos', name: 'Carlos Silva', email: 'carlos.silva@zenos.co', avatarUrl: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzE5Mzk5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080', avatarHint: 'man portrait' },
    { id: 'user-sofia', name: 'Sofia Costa', email: 'sofia.costa@zenos.co', avatarUrl: 'https://images.unsplash.com/photo-1598625873873-52f9aefd7d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b21hbiUyMHNtaWxpbmd8ZW58MHx8fHwxNzcxOTQ2NDAzfDA&ixlib=rb-4.1.0&q=80&w=1080', avatarHint: 'woman smiling' },
    { id: 'user-juridico', name: 'Jurídico', email: 'legal@zenos.co', avatarUrl: 'https://placehold.co/100x100/666/fff?text=J', avatarHint: 'department initial' },
    { id: 'user-mariana', name: 'Mariana Lima', email: 'mariana.lima@zenos.co', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', avatarHint: 'woman portrait' },
    { id: 'user-pedro', name: 'Pedro Alves', email: 'pedro.alves@zenos.co', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', avatarHint: 'man smiling' }
];

export const currentUser = users.find(u => u.id === 'user-carlos')!;


// --- Detailed Task Data ---

const zAlphaTasks: Task[] = [
  { id: 'za-1', projectId: 'proj-001', projectName: "Lançamento Plataforma Z-Alpha", title: 'Definir escopo técnico da API', responsible: 'Carlos Silva', responsibleId: 'user-carlos', baselineDeadline: new Date('2024-08-01'), newDeadline: new Date('2024-08-01'), completedAt: new Date('2024-07-30'), dependencies: [], isCriticalPath: true, qualityCheck: { prompt: "A documentação da API foi publicada no Confluence?" } },
  { id: 'za-2', projectId: 'proj-001', projectName: "Lançamento Plataforma Z-Alpha", title: 'Desenvolver endpoints de autenticação', responsible: 'Carlos Silva', responsibleId: 'user-carlos', baselineDeadline: new Date('2024-08-08'), newDeadline: new Date('2024-08-08'), completedAt: null, dependencies: ['za-1'], isCriticalPath: true, qualityCheck: { prompt: "Os testes de integração passaram na pipeline?" } },
  { id: 'za-3', projectId: 'proj-001', projectName: "Lançamento Plataforma Z-Alpha", title: 'Revisão de contratos com fornecedores', responsible: 'Jurídico', responsibleId: 'user-juridico', baselineDeadline: new Date('2024-08-10'), newDeadline: new Date('2024-08-25'), completedAt: null, dependencies: ['za-1'], isCriticalPath: true, qualityCheck: { prompt: "O parecer foi assinado pela diretoria?" } },
  { id: 'za-4', projectId: 'proj-001', projectName: "Lançamento Plataforma Z-Alpha", title: 'Criar interface de login', responsible: 'Mariana Lima', responsibleId: 'user-mariana', baselineDeadline: new Date('2024-08-15'), newDeadline: new Date('2024-08-15'), completedAt: null, dependencies: ['za-2'], isCriticalPath: true, qualityCheck: { prompt: "Os testes de acessibilidade foram aprovados?" } },
];

const costOptTasks: Task[] = [
    { id: 'co-1', projectId: 'proj-002', projectName: "Otimização de Custos Operacionais", title: 'Mapear custos de infraestrutura AWS', responsible: 'Carlos Silva', responsibleId: 'user-carlos', baselineDeadline: new Date('2024-08-20'), newDeadline: new Date('2024-08-20'), completedAt: null, dependencies: [], isCriticalPath: true, qualityCheck: { prompt: "A planilha foi compartilhada com o CFO?" } },
    { id: 'co-2', projectId: 'proj-002', projectName: "Otimização de Custos Operacionais", title: 'Analisar contratos de licença de software', responsible: 'Carlos Silva', responsibleId: 'user-carlos', baselineDeadline: new Date('2024-08-25'), newDeadline: new Date('2024-08-25'), completedAt: null, dependencies: [], isCriticalPath: false, qualityCheck: { prompt: "A lista de softwares subutilizados foi criada?" } },
    { id: 'co-3', projectId: 'proj-002', projectName: "Otimização de Custos Operacionais", title: 'Apresentar plano de otimização', responsible: 'Pedro Alves', responsibleId: 'user-pedro', baselineDeadline: new Date('2024-09-01'), newDeadline: new Date('2024-09-01'), completedAt: null, dependencies: ['co-1', 'co-2'], isCriticalPath: true, qualityCheck: { prompt: "A apresentação foi enviada para o Sponsor?" } },
];

const allTasks = [...zAlphaTasks, ...costOptTasks];


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

export const projects: Project[] = [
  {
    id: "proj-001",
    name: "Lançamento Plataforma Z-Alpha",
    sponsor: "Diretoria",
    responsible: "Ana Oliveira",
    finalDeadline: new Date("2024-10-30T23:59:59"),
    targetGain: {
      type: "Aumento de Vendas",
      value: 150000,
    },
    tasks: zAlphaTasks,
    status: "Em Risco",
    profitHealth: 65,
    costOfDelay: 1200,
    deadlineImpact: 15,
    atRiskTask: zAlphaTasks.find(t => t.id === 'za-3'),
    nikoSummary: "Sponsor, o projeto Lançamento Z-Alpha está com 5 dias de folga no caminho crítico. No entanto, a tarefa 'Aprovação Legal' é o seu atual gargalo. Se for resolvida até amanhã, o ganho de R$ 150k entra no caixa exatamente na data prevista."
  },
  {
    id: "proj-002",
    name: "Otimização de Custos Operacionais",
    sponsor: "CFO",
    responsible: "Carlos Silva",
    finalDeadline: new Date("2024-09-15T23:59:59"),
    targetGain: {
      type: "Redução de Custos",
      value: 75000,
    },
    tasks: costOptTasks,
    status: "Em Dia",
    profitHealth: 90,
    costOfDelay: 0,
    deadlineImpact: 0,
    nikoSummary: "Sponsor, a iniciativa de Otimização de Custos está adiantada. A previsão atual indica uma economia de R$ 5k acima do alvo inicial, com entrega 8 dias antes do prazo."
  },
    {
    id: "proj-003",
    name: "Melhoria NPS Atendimento",
    sponsor: "Head de CX",
    responsible: "Sofia Costa",
    finalDeadline: new Date("2024-11-20T23:59:59"),
    targetGain: {
      type: "Melhoria do NPS",
      value: 15, // represent 15 points in NPS
    },
    tasks: [],
    status: "Em Dia",
    profitHealth: 100,
    costOfDelay: 0,
    deadlineImpact: 0,
    nikoSummary: "Sponsor, a meta de NPS está sendo atingida. As ações de treinamento da equipe de suporte apresentaram resultado imediato, com o NPS subindo 10 pontos nas últimas 2 semanas."
  },
];


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


export const atRiskProject: Project | undefined = projects.find(p => p.status === 'Em Risco');

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
