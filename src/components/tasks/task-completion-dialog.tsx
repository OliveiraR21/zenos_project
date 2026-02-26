'use client';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import type { Task } from '@/lib/data';

interface TaskCompletionDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function TaskCompletionDialog({ task, isOpen, onClose, onComplete }: TaskCompletionDialogProps) {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = React.useState(false);

  const handleSubmit = () => {
    if (task && isChecked) {
      // Here you would typically update the task state in the database.
      // For this prototype, we'll just show a notification.
      toast({
        title: "Tarefa Finalizada! 🎉",
        description: "Caminho liberado. O próximo responsável foi notificado. É a sua vez.",
      });
      onComplete();
    } else {
        toast({
            variant: "destructive",
            title: "Confirmação necessária",
            description: "Por favor, confirme que o check de qualidade foi realizado.",
        });
    }
  };
  
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white text-black">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Check de Qualidade</DialogTitle>
          <DialogDescription>
            Antes de passar o bastão, confirme o critério de aceite.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <div className="flex items-center space-x-2 rounded-md border p-4">
                <Checkbox 
                    id="quality-check" 
                    checked={isChecked}
                    onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                    className="border-gray-400 data-[state=checked]:bg-volt data-[state=checked]:text-black"
                />
                <Label htmlFor="quality-check" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {task.qualityCheck.prompt}
                </Label>
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-300">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-volt text-black hover:bg-volt/90">
            Passar o Bastão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
