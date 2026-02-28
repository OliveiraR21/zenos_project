'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Step4Task() {
    const router = useRouter();
    const [date, setDate] = React.useState<Date>();

    const handleFinish = () => {
        // A lógica para salvar os dados no Firestore seria implementada aqui.
        // Por enquanto, redireciona para o dashboard.
        router.push('/'); // Redirect to dashboard
    }

    return (
        <div className="w-full animate-fade-in">
            <h1 className="text-4xl font-bold font-headline mb-4">A Primeira Engrenagem</h1>
             <p className="text-muted-foreground mb-12">
                <Sparkles className="inline-block w-4 h-4 mr-2 text-volt" />
                Todo grande ganho começa com um passo. Qual a primeira tarefa crítica para desbloquear esse resultado?
            </p>
            
            <div className="space-y-8 text-left">
                <div>
                    <Label htmlFor="taskName" className="text-lg">Nome da Tarefa Crítica</Label>
                    <Input id="taskName" placeholder="Ex: Validar a API de pagamentos" className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black bg-white border-gray-300" />
                </div>

                <div>
                    <Label htmlFor="taskResponsible" className="text-lg">Responsável</Label>
                    <Input id="taskResponsible" placeholder="ex: dev.lead@empresa.com" className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black bg-white border-gray-300" />
                </div>

                <div>
                    <Label className="text-lg d-block mb-2">Prazo da Tarefa</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal text-base h-12 bg-white border-gray-300 hover:bg-gray-50 text-black",
                                !date && "text-gray-500"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <Button onClick={handleFinish} className="mt-12 w-full max-w-xs text-lg py-6 bg-volt text-black hover:bg-volt/90">
                Concluir e Ir para o Dashboard
            </Button>
        </div>
    );
}
