
import type { Task, Project, ProjectStatus } from './data';
import { differenceInDays, parseISO, max, min, addDays } from 'date-fns';

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
 * Implements the Critical Path Method (CPM) to identify critical tasks.
 * @param tasks The list of all tasks in the project.
 * @returns A new list of tasks with calculated CPM metrics and the `isCriticalPath` flag set correctly.
 */
function analyzeCriticalPath(tasks: Task[]): Task[] {
    if (!tasks || tasks.length === 0) return [];

    interface CPMTask extends Task {
        duration: number;
        earlyStart: number;
        earlyFinish: number;
        lateStart: number;
        lateFinish: number;
        slack: number;
        successors: string[];
    }

    const taskMap = new Map<string, CPMTask>();
    
    // 1. Initialize nodes for CPM calculations
    for (const task of tasks) {
        const duration = Math.max(1, differenceInDays(parseISO(task.newDeadline), parseISO(task.startDate)));
        taskMap.set(task.id, {
            ...task,
            duration,
            earlyStart: 0,
            earlyFinish: 0,
            lateStart: Infinity,
            lateFinish: Infinity,
            slack: 0,
            successors: [],
            isCriticalPath: false, // Reset before calculation
        });
    }

    // 2. Build successor links
    for (const task of taskMap.values()) {
        for (const depId of task.dependencies) {
            if (taskMap.has(depId)) {
                taskMap.get(depId)!.successors.push(task.id);
            }
        }
    }

    // 3. Forward Pass (ES, EF) using topological sort
    const inDegree = new Map<string, number>();
    const queue: string[] = [];
    
    for (const [taskId, task] of taskMap.entries()) {
        const degree = task.dependencies.filter(depId => taskMap.has(depId)).length;
        inDegree.set(taskId, degree);
        if (degree === 0) {
            queue.push(taskId);
        }
    }

    const topologicalOrder: string[] = [];
    while (queue.length > 0) {
        const taskId = queue.shift()!;
        topologicalOrder.push(taskId);
        const task = taskMap.get(taskId)!;

        // Update ES, EF
        const maxPredEF = Math.max(0, ...task.dependencies.map(depId => taskMap.get(depId)?.earlyFinish || 0));
        task.earlyStart = maxPredEF;
        task.earlyFinish = task.earlyStart + task.duration;

        for (const succId of task.successors) {
            const newDegree = inDegree.get(succId)! - 1;
            inDegree.set(succId, newDegree);
            if (newDegree === 0) {
                queue.push(succId);
            }
        }
    }

    // 4. Backward Pass (LS, LF)
    const projectDuration = Math.max(0, ...Array.from(taskMap.values()).map(t => t.earlyFinish));
    
    for (let i = topologicalOrder.length - 1; i >= 0; i--) {
        const taskId = topologicalOrder[i];
        const task = taskMap.get(taskId)!;

        if (task.successors.length === 0) {
            task.lateFinish = projectDuration;
        } else {
            task.lateFinish = Math.min(...task.successors.map(succId => taskMap.get(succId)!.lateStart));
        }
        task.lateStart = task.lateFinish - task.duration;
    }
    
    // 5. Calculate Slack and identify critical path
    for (const task of taskMap.values()) {
        task.slack = task.lateStart - task.earlyStart;
        task.isCriticalPath = task.slack <= 0;
    }

    return Array.from(taskMap.values());
}


/**
 * Analyzes a project and its tasks to calculate health metrics using CPM.
 * @param project The project to analyze.
 * @param allTasks All tasks belonging to the project.
 * @returns An enriched project object with analysis data.
 */
export function analyzeProjectHealth(project: Project, allTasks: Task[]): AnalyzedProject {
    const projectTargetDeadline = parseISO(project.targetGainDeadline);

    if (!allTasks || allTasks.length === 0) {
        return {
            ...project,
            tasks: [],
            status: 'Em Dia',
            profitHealth: 100,
            costOfDelay: 0,
            deadlineImpact: 0,
            atRiskTask: undefined,
            nikoSummary: `O projeto "${project.name}" ainda não tem tarefas. Adicione tarefas para iniciar a análise de progresso.`,
            finalDeadline: projectTargetDeadline,
        };
    }

    // Run the CPM algorithm to get tasks with correct isCriticalPath flags
    const analyzedTasks = analyzeCriticalPath(allTasks);
    
    // Determine the project's actual timeline from CPM results
    const projectStartDates = analyzedTasks.map(t => parseISO(t.startDate)).filter(d => !isNaN(d.getTime()));
    const projectStartDate = projectStartDates.length > 0 ? min(projectStartDates) : new Date();
    const projectEarlyFinishDays = Math.max(0, ...analyzedTasks.map(t => t.earlyFinish));
    const finalDeadline = addDays(projectStartDate, projectEarlyFinishDays);
    
    // Calculate impact based on the real project duration
    const deadlineImpact = differenceInDays(finalDeadline, projectTargetDeadline);

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

        // Find the latest unfinished task ON THE CRITICAL PATH
        atRiskTask = analyzedTasks
            .filter(t => t.isCriticalPath && t.status !== 'Concluído')
            .sort((a, b) => differenceInDays(parseISO(b.newDeadline), parseISO(a.newDeadline)))[0];
        
        // Fallback if no unfinished critical tasks (e.g. project is late but all tasks are done)
        if (!atRiskTask) {
             atRiskTask = analyzedTasks
                .filter(t => t.status !== 'Concluído')
                .sort((a, b) => differenceInDays(parseISO(b.newDeadline), parseISO(a.newDeadline)))[0];
        }

        const taskIdentifier = atRiskTask ? `A tarefa "${atRiskTask.title}"` : "O cronograma geral";
        nikoSummary = `ATENÇÃO: O projeto "${project.name}" tem um desvio de ${deadlineImpact} dia(s), impactando o ganho de R$ ${targetGainValue.toLocaleString('pt-BR')}. ${taskIdentifier} é o principal gargalo atual.`;

    } else {
        status = 'Em Dia';
        const daysAhead = Math.abs(deadlineImpact);
        nikoSummary = `O projeto "${project.name}" está com ${daysAhead} dia(s) de folga no cronograma. O foco continua sendo a entrega consistente para garantir o ganho de R$ ${targetGainValue.toLocaleString('pt-BR')}.`;
    }

    return {
        ...project,
        tasks: analyzedTasks, // Return tasks with the updated isCriticalPath flag
        status,
        profitHealth,
        costOfDelay,
        deadlineImpact: Math.max(0, deadlineImpact),
        atRiskTask: status !== 'Em Dia' ? atRiskTask : undefined,
        nikoSummary,
        finalDeadline
    };
}
