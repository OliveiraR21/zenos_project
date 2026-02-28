import { BrainCircuit } from 'lucide-react';
import { AnalyzedProject } from '@/lib/project-analysis';

interface SponsorNikoSummaryProps {
  project: AnalyzedProject | undefined;
}

export function SponsorNikoSummary({ project }: SponsorNikoSummaryProps) {
  if (!project) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground p-6">
             <div className="flex items-center gap-4">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <div>
                    <h3 className="font-headline text-lg text-primary">Niko: Resumo Executivo</h3>
                    <p className="text-muted-foreground">Nenhum projeto ativo para analisar.</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="flex items-center gap-4">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <div>
                <h3 className="font-headline text-lg text-primary">Niko: The Bottom Line</h3>
                <p className="text-foreground mt-1">{project.nikoSummary}</p>
            </div>
        </div>
    </div>
  );
}
