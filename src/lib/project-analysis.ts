
import type { Task, Project, ProjectStatus } from './data';
import { differenceInDays, parseISO, max } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface AnalyzedProject extends Project {
    tasks?: Task[];
    status: ProjectStatus;
    profitHealth: number; // Percentage
    costOfDelay: number;
    deadlineImpact: number; // in days
    atRiskTask?: Task;
    nikoSummary: string;
    finalDeadline: Date;
};

/**
 * Analyzes a project and its tasks to calculate health metrics.
 * @param project The project to analyze.
 * @param allTasks All tasks belonging to the project.
 * @returns An enriched project object with analysis data.
 */
export function analyzeProjectHealth(project: Project, allTasks: Task[]): AnalyzedProject {
    const projectDeadline = parseISO(project.targetGainDeadline);

    if (!allTasks || allTasks.length === 0) {
        return {
            ...project,
            status: 'Em Dia',
            profitHealth: 100,
            costOfDelay: 0,
            deadlineImpact: 0,
            atRiskTask: undefined,
            nikoSummary: `O projeto "${project.name}" ainda não tem tarefas. Adicione tarefas para iniciar a análise de progresso.`,
            finalDeadline: projectDeadline,
        };
    }

    // Find the latest task deadline, which determines the project's effective end date
    const allDeadlines = allTasks.map(t => parseISO(t.newDeadline));
    const finalDeadline = max(allDeadlines);
    
    // Calculate the impact on the final deadline
    const deadlineImpact = differenceInDays(finalDeadline, projectDeadline);

    let status: ProjectStatus = 'Em Dia';
    let costOfDelay = 0;
    let profitHealth = 100;
    let atRiskTask: Task | undefined;
    let nikoSummary = '';

    const targetGainValue = project.targetGain?.value ?? 0;

    if (deadlineImpact > 0) {
        status = deadlineImpact > 7 ? 'Atrasado' : 'Em Risco';
        
        // Simple cost calculation: The total gain is at risk, spread over an assumed 90-day project lifecycle.
        const dailyLoss = (targetGainValue / 90);
        costOfDelay = dailyLoss * deadlineImpact;
        
        // Health decreases based on the percentage of delay relative to a 90-day project
        profitHealth = Math.max(0, 100 - (deadlineImpact / 90) * 100);

        // Find the most critical at-risk task
        atRiskTask = allTasks
            .filter(t => t.status !== 'Concluído')
            .sort((a, b) => differenceInDays(parseISO(b.newDeadline), parseISO(a.newDeadline)))[0];
        
        nikoSummary = `ATENÇÃO: O projeto "${project.name}" tem um desvio de ${deadlineImpact} dia(s), impactando o ganho de R$ ${targetGainValue.toLocaleString('pt-BR')}. A tarefa "${atRiskTask?.title}" é o principal gargalo atual.`;

    } else {
        status = 'Em Dia';
        const daysAhead = -deadlineImpact;
        nikoSummary = `O projeto "${project.name}" está com ${daysAhead} dia(s) de folga no cronograma. O foco continua sendo a entrega consistente para garantir o ganho de R$ ${targetGainValue.toLocaleString('pt-BR')}.`;
    }

    // Find the task that defines the new deadline to mark it as critical (simplified)
    const criticalTask = allTasks.find(t => parseISO(t.newDeadline).getTime() === finalDeadline.getTime());
    if (criticalTask) {
        (criticalTask as any).isCriticalPath = true; // Mark it for the UI
    }

    return {
        ...project,
        tasks: allTasks,
        status,
        profitHealth,
        costOfDelay,
        deadlineImpact: Math.max(0, deadlineImpact), // Ensure it's not negative
        atRiskTask: status !== 'Em Dia' ? atRiskTask : undefined,
        nikoSummary,
        finalDeadline
    };
}
