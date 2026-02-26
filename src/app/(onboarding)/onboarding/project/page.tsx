'use client';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { DollarSign, Zap, Smile, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const objectives = [
    { id: 'revenue', title: 'Aumentar Vendas', icon: DollarSign, description: 'Foco em receita direta.' },
    { id: 'costs', title: 'Reduzir Custos', icon: Zap, description: 'Eficiência de caixa e otimização.' },
    { id: 'nps', title: 'Melhorar NPS', icon: Smile, description: 'Retenção e satisfação de clientes.' },
    { id: 'efficiency', title: 'Ganhar Eficiência', icon: Clock, description: 'Produtividade e automação.' },
];

export default function Step2Project() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // In a real app, you'd likely open a modal here to define value and deadline
        // For this prototype, we'll just go to the next step
        setTimeout(() => router.push('/onboarding/roles'), 300);
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
        </div>
    );
}
