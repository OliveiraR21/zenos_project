import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import type { NikoB2BInsight } from "@/lib/data";

interface NikoB2BAlertProps {
  insight: NikoB2BInsight | null;
}

export function NikoB2BAlert({ insight }: NikoB2BAlertProps) {
  if (!insight) {
    return (
        <Alert className="border-primary text-primary-foreground bg-primary/10">
          <BrainCircuit className="h-5 w-5 !text-primary" />
          <AlertTitle className="font-headline text-lg text-primary">Niko B2B: Insights</AlertTitle>
          <AlertDescription className="text-foreground">
            <p>Nenhum insight disponível no momento.</p>
          </AlertDescription>
        </Alert>
    )
  }

  return (
    <Alert className="border-primary text-primary-foreground bg-primary/10">
      <BrainCircuit className="h-5 w-5 !text-primary" />
      <AlertTitle className="font-headline text-lg text-primary">Niko B2B: {insight.title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between text-foreground">
        <p>{insight.message}</p>
        {insight.actionable && insight.actionText && (
            <Button size="sm" className="ml-4">{insight.actionText}</Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
