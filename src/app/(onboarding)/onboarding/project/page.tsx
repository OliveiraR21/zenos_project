'use client';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { DollarSign, Zap, Smile, Clock, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useOnboarding } from '@/context/onboarding-context';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const objectives = [
    { id: 'Aumento de Vendas', title: 'Aumentar Vendas', icon: DollarSign, description: 'Foco em receita direta.' },
    { id: 'Redução de Custos', title: 'Reduzir Custos', icon: Zap, description: 'Eficiência de caixa e otimização.' },
    { id: 'Melhoria do NPS', title: 'Melhorar NPS', icon: Smile, description: 'Retenção e satisfação de clientes.' },
    { id: 'Eficiência Operacional', title: 'Ganhar Eficiência', icon: Clock, description: 'Produtividade e automação.' },
];

export default function Step2Project() {
    const router = useRouter();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(onboardingData.projectObjective || null);
    const [gainValue, setGainValue] = useState<number | undefined>(onboardingData.projectGainValue);
    const [deadline, setDeadline] = useState<Date | undefined>(onboardingData.projectGainDeadline);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected && gainValue && deadline) {
            updateOnboardingData({
                projectObjective: selected,
                projectGainValue: gainValue,
                projectGainDeadline: deadline,
            });
            router.push('/onboarding/roles');
        } else {
            // Basic validation feedback
            alert('Por favor, selecione um objetivo e preencha o valor e o prazo do ganho.');
        }
    };

    return (
        <div className="w-full animate-fade-in">
            <h1 className="text-4xl font-bold font-headline mb-4">Qual o seu primeiro grande objetivo?</h1>
            <p className="text-muted-foreground mb-12">Selecione o principal vetor de valor que você quer atacar agora.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {objectives.map((obj) => (
                    <Card
                        key={obj.id}
                        onClick={() => handleSelect(obj.id)}
                        className={cn(
                            "group cursor-pointer transition-all duration-300 border-2 text-left p-6",
                            selected === obj.id ? 'border-volt shadow-2xl scale-105' : 'border-gray-200 hover:border-gray-400 bg-white'
                        )}
                    >
                        <obj.icon className={cn(
                            "w-10 h-10 mb-4 text-gray-400 transition-colors",
                            selected === obj.id ? "text-volt" : "group-hover:text-black"
                        )} />
                        <h3 className="text-xl font-bold font-headline text-black">{obj.title}</h3>
                        <p className="text-sm text-gray-600">{obj.description}</p>
                    </Card>
                ))}
            </div>

            {selected && (
                <div className="mt-12 space-y-6 text-left animate-fade-in">
                     <div>
                        <Label htmlFor="gainValue" className="text-lg">Valor do Ganho (R$)</Label>
                        <Input 
                            id="gainValue" 
                            type="number" 
                            value={gainValue || ''}
                            onChange={(e) => setGainValue(parseFloat(e.target.value))}
                            placeholder="Ex: 500000" 
                            className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black" />
                    </div>
                     <div>
                        <Label className="text-lg d-block mb-2">Prazo Final do Ganho</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal text-base h-12 bg-white border-gray-300 hover:bg-gray-50 text-black",
                                    !deadline && "text-gray-500"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {deadline ? format(deadline, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white">
                            <Calendar
                                mode="single"
                                selected={deadline}
                                onSelect={setDeadline}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}
            
            <Button 
                onClick={handleNext} 
                className="mt-12 w-full max-w-xs text-lg py-6 bg-black text-white hover:bg-gray-800"
                disabled={!selected || !gainValue || !deadline}
            >
                Avançar
            </Button>
        </div>
    );
}
