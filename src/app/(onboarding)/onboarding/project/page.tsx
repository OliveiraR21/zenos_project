'use client';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { DollarSign, Zap, Smile, Clock, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/context/onboarding-context';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const objectives = [
    { id: 'Aumento de Vendas', title: 'Aumentar Vendas', icon: DollarSign, description: 'Foco em receita direta.' },
    { id: 'Redução de Custos', title: 'Reduzir Custos', icon: Zap, description: 'Eficiência de caixa e otimização.' },
    { id: 'Melhoria do NPS', title: 'Melhorar NPS', icon: Smile, description: 'Retenção e satisfação de clientes.' },
    { id: 'Eficiência Operacional', title: 'Ganhar Eficiência', icon: Clock, description: 'Produtividade e automação.' },
];

const schema = z.object({
    projectObjective: z.string({ required_error: "Por favor, selecione um objetivo." }),
    projectGainValue: z.coerce.number().min(1, "O valor do ganho deve ser maior que zero."),
    projectGainDeadline: z.date({ required_error: "Por favor, selecione um prazo." }),
});

type FormData = z.infer<typeof schema>;

export default function Step2Project() {
    const router = useRouter();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    
    const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            projectObjective: onboardingData.projectObjective || undefined,
            projectGainValue: onboardingData.projectGainValue || undefined,
            projectGainDeadline: onboardingData.projectGainDeadline || undefined,
        },
        mode: 'onChange',
    });

    const selectedObjective = watch('projectObjective');

    const handleNext = (data: FormData) => {
        updateOnboardingData(data);
        router.push('/onboarding/roles');
    };

    return (
        <div className="w-full animate-fade-in">
            <h1 className="text-4xl font-bold font-headline mb-4">Qual o seu primeiro grande objetivo?</h1>
            <p className="text-muted-foreground mb-12">Selecione o principal vetor de valor que você quer atacar agora.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {objectives.map((obj) => (
                    <Card
                        key={obj.id}
                        onClick={() => setValue('projectObjective', obj.id, { shouldValidate: true, shouldDirty: true })}
                        className={cn(
                            "group cursor-pointer transition-all duration-300 border-2 text-left p-6",
                            selectedObjective === obj.id ? 'border-volt shadow-2xl scale-105' : 'border-gray-200 hover:border-gray-400 bg-white'
                        )}
                    >
                        <obj.icon className={cn(
                            "w-10 h-10 mb-4 text-gray-400 transition-colors",
                            selectedObjective === obj.id ? "text-volt" : "group-hover:text-black"
                        )} />
                        <h3 className="text-xl font-bold font-headline text-black">{obj.title}</h3>
                        <p className="text-sm text-gray-600">{obj.description}</p>
                    </Card>
                ))}
            </div>
            {errors.projectObjective && !selectedObjective && <p className="text-red-500 text-sm mt-4">{errors.projectObjective.message}</p>}

            {selectedObjective && (
                <form onSubmit={handleSubmit(handleNext)} className="mt-12 space-y-6 text-left animate-fade-in">
                     <div>
                        <Label htmlFor="gainValue" className="text-lg">Valor do Ganho (R$)</Label>
                        <Controller
                            name="projectGainValue"
                            control={control}
                            render={({ field }) => (
                                <Input 
                                    id="gainValue" 
                                    type="number" 
                                    placeholder="Ex: 500000" 
                                    className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black"
                                    {...field}
                                />
                            )}
                        />
                         {errors.projectGainValue && <p className="text-red-500 text-sm mt-1">{errors.projectGainValue.message}</p>}
                    </div>
                     <div>
                        <Label className="text-lg d-block mb-2">Prazo Final do Ganho</Label>
                         <Controller
                            name="projectGainDeadline"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal text-base h-12 bg-white border-gray-300 hover:bg-gray-50 text-black",
                                            !field.value && "text-gray-500"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.projectGainDeadline && <p className="text-red-500 text-sm mt-1">{errors.projectGainDeadline.message}</p>}
                    </div>
                     <Button 
                        type="submit" 
                        className="!mt-12 w-full max-w-xs text-lg py-6 bg-black text-white hover:bg-gray-800 mx-auto flex"
                        disabled={!isValid}
                    >
                        Avançar
                    </Button>
                </form>
            )}
        </div>
    );
}
