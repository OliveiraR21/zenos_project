"use client";

import { useState, useEffect } from 'react';
import type { NikoRoiRiskAlertOutput } from '@/ai/flows/niko-roi-risk-alert';
import { nikoRoiRiskAlert } from '@/ai/flows/niko-roi-risk-alert';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap } from "lucide-react";
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { AnalyzedProject } from '@/lib/project-analysis';

interface NikoAlertProps {
  project: AnalyzedProject;
}

export function NikoAlert({ project }: NikoAlertProps) {
  const [alert, setAlert] = useState<NikoRoiRiskAlertOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRisk = async () => {
      if (!project || !project.atRiskTask) {
        setLoading(false);
        return;
      }

      try {
        const delayedTask = project.atRiskTask;
        const result = await nikoRoiRiskAlert({
          projectName: project.name,
          targetGainType: project.targetGain?.type || 'N/A',
          targetGainValue: project.targetGain?.value || 0,
          dailyCostOfDelay: project.costOfDelay,
          delayedTaskTitle: delayedTask.title,
          delayedTaskResponsible: delayedTask.responsible,
          delayedTaskOriginalDeadline: delayedTask.baselineDeadline,
          delayedTaskNewDeadline: delayedTask.newDeadline,
          projectImpactDays: project.deadlineImpact,
          riskThresholdPercentage: 0.005, // 0.5% of target gain
        });
        setAlert(result);
      } catch (error) {
        console.error("Error checking ROI risk:", error);
        setAlert(null);
      } finally {
        setLoading(false);
      }
    };

    checkRisk();
  }, [project]);

  if (loading) {
    return (
        <div className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
  }

  if (!alert?.hasSignificantRisk) {
    return null;
  }

  return (
    <Alert className="border-volt text-volt bg-volt/5">
      <Zap className="h-5 w-5 !text-volt" />
      <AlertTitle className="font-headline text-lg text-volt">Niko AI: Risco ao Lucro Detectado</AlertTitle>
      <AlertDescription className="text-white mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <span>{alert.alertMessage}</span>
        <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="border-volt text-volt hover:bg-volt hover:text-black">Cobrar Responsável</Button>
            <Button className="bg-volt text-black hover:bg-volt/90">Ajustar Rota</Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
