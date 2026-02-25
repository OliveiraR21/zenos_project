"use client";

import { useState, useEffect } from 'react';
import type { NikoRoiRiskAlertOutput } from '@/ai/flows/niko-roi-risk-alert';
import { nikoRoiRiskAlert } from '@/ai/flows/niko-roi-risk-alert';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap } from "lucide-react";
import type { Project } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';

interface NikoAlertProps {
  project: Project;
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
          targetGainType: project.targetGain.type,
          targetGainValue: project.targetGain.value,
          dailyCostOfDelay: project.costOfDelay,
          delayedTaskTitle: delayedTask.title,
          delayedTaskResponsible: delayedTask.responsible,
          delayedTaskOriginalDeadline: delayedTask.baselineDeadline.toISOString(),
          delayedTaskNewDeadline: delayedTask.newDeadline.toISOString(),
          projectImpactDays: project.deadlineImpact,
          riskThresholdPercentage: 0.01, // 1% of target gain
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
        <div className="flex items-center space-x-4">
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
      <AlertTitle className="font-headline text-lg text-volt">Niko AI: Significant ROI Risk Detected</AlertTitle>
      <AlertDescription className="text-white">
        {alert.alertMessage}
      </AlertDescription>
    </Alert>
  );
}
