'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/context/onboarding-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    sponsorEmail: z.string().email("Por favor, insira um email válido."),
    managerEmail: z.string().email("Por favor, insira um email válido."),
});

type FormData = z.infer<typeof schema>;

export default function Step3Roles() {
    const router = useRouter();
    const { onboardingData, updateOnboardingData } = useOnboarding();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            sponsorEmail: onboardingData.sponsorEmail || '',
            managerEmail: onboardingData.managerEmail || '',
        },
    });

    const onSubmit = (data: FormData) => {
        updateOnboardingData(data);
        router.push('/onboarding/task');
    };

    return (
        <div className="w-full animate-fade-in">
            <h1 className="text-4xl font-bold font-headline mb-4">O Triunvirato B2B</h1>
            <p className="text-muted-foreground mb-12">Projeto sem dono é projeto morto. Defina as responsabilidades chave.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left">
                <div>
                    <Label htmlFor="sponsorEmail" className="text-lg">Sponsor (O Dono do Resultado)</Label>
                    <p className="text-sm text-gray-600 mb-2">Quem será o principal beneficiado e cobrador por este resultado?</p>
                    <Input id="sponsorEmail" type="email" {...register('sponsorEmail')} placeholder="ex: diretor@empresa.com" className="text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black bg-white border-gray-300" />
                     {errors.sponsorEmail && <p className="text-red-500 text-sm mt-1">{errors.sponsorEmail.message}</p>}
                </div>

                <div>
                    <Label htmlFor="managerEmail" className="text-lg">Responsável (O Maestro)</Label>
                    <p className="text-sm text-gray-600 mb-2">Quem vai garantir que a execução aconteça no dia-a-dia?</p>
                    <Input id="managerEmail" type="email" {...register('managerEmail')} placeholder="ex: gerente.projetos@empresa.com" className="text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black bg-white border-gray-300" />
                     {errors.managerEmail && <p className="text-red-500 text-sm mt-1">{errors.managerEmail.message}</p>}
                </div>

                <Button type="submit" className="!mt-12 w-full max-w-xs text-lg py-6 bg-black text-white hover:bg-gray-800 mx-auto flex justify-center">
                    Avançar e Definir Tarefa Crítica
                </Button>
            </form>
        </div>
    );
}
