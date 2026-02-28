'use client';

import { BrainCircuit } from 'lucide-react';
import { AnalyzedProject } from '@/lib/project-analysis';
import { useState, useEffect } from 'react';
import { nikoRoiRiskAlert } from '@/ai/flows/niko-roi-risk-alert';
import { Skeleton } from '../ui/skeleton';

interface SponsorNikoSummaryProps {
  project: AnalyzedProject | undefined;
}

export function SponsorNikoSummary({ project }: SponsorNikoSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function generateSummary() {
      // Handle no project case
      if (!project) {
        setSummary("Nenhum projeto ativo para analisar.");
        setIsLoading(false);
        return;
      }
      
      // Handle project with no tasks (uses hardcoded summary from analysis function)
      if (project.nikoSummary) {
        setSummary(project.nikoSummary);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const delayedTask = project.atRiskTask;
        const result = await nikoRoiRiskAlert({
          projectName: project.name,
          targetGainType: project.targetGain?.type || 'N/A',
          targetGainValue: project.targetGain?.value || 0,
          dailyCostOfDelay: project.costOfDelay,
          delayedTaskTitle: delayedTask?.title || 'N/A',
          delayedTaskResponsible: delayedTask?.responsible || 'N/A',
          delayedTaskOriginalDeadline: delayedTask?.baselineDeadline || new Date().toISOString(),
          delayedTaskNewDeadline: delayedTask?.newDeadline || new Date().toISOString(),
          projectImpactDays: project.deadlineImpact,
          daysAhead: project.daysAhead,
          riskThresholdPercentage: 0.005, // 0.5% of target gain
        });
        setSummary(result.alertMessage);
      } catch (error) {
        console.error("Error generating Niko summary:", error);
        setSummary("Não foi possível gerar o resumo da IA no momento.");
      } finally {
        setIsLoading(false);
      }
    }
    
    generateSummary();
  }, [project]);
  
  const renderContent = () => {
      if (isLoading) {
          return <Skeleton className="h-5 w-full max-w-lg" />;
      }
      return <p className="text-foreground mt-1">{summary}</p>;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="flex items-center gap-4">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <div>
                <h3 className="font-headline text-lg text-primary">Niko: The Bottom Line</h3>
                {renderContent()}
            </div>
        </div>
    </div>
  );
}
