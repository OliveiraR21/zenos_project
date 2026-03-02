'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Sparkles } from 'lucide-react';
import { useOnboarding } from '@/context/onboarding-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    companyName: z.string().min(1, "O nome da empresa é obrigatório."),
    logoUrl: z.string().url("Por favor, insira uma URL válida.").optional().or(z.literal('')),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Insira uma cor hexadecimal válida, ex: #2A89D4").optional(),
});

type FormData = z.infer<typeof schema>;

export default function Step1Identity() {
    const router = useRouter();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            companyName: onboardingData.companyName || '',
            logoUrl: onboardingData.logoUrl || '',
            primaryColor: onboardingData.primaryColor || '#000000',
        },
    });

    const companyName = watch('companyName');

    const onSubmit = (data: FormData) => {
        updateOnboardingData(data);
        router.push('/onboarding/project');
    };

    return (
        <div className="w-full animate-fade-in">
            <h1 className="text-4xl font-bold font-headline mb-4">Dê um rosto à sua operação.</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                <Sparkles className="inline-block w-4 h-4 mr-2 text-volt" />
                Configuraremos seu ambiente exclusivo em <span className="font-bold text-black">{companyName.toLowerCase().replace(/\s/g, '') || 'suaempresa'}.zenos.tech</span>. Profissionalismo é a base da confiança B2B.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                <div>
                    <Label htmlFor="companyName" className="text-lg">Nome da Empresa</Label>
                    <Input id="companyName" {...register('companyName')} placeholder="Ex: Acme Inc." className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black" />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                </div>

                <div>
                    <Label className="text-lg">Logo da Empresa</Label>
                     <Input id="logoUrl" {...register('logoUrl')} placeholder="https://exemplo.com/logo.png" className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black" />
                     {errors.logoUrl && <p className="text-red-500 text-sm mt-1">{errors.logoUrl.message}</p>}
                </div>

                <div>
                    <Label className="text-lg">Cor Primária (Opcional)</Label>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="relative">
                            <input type="color" {...register('primaryColor')} className="w-12 h-12 p-0 border-none cursor-pointer appearance-none rounded-md" />
                        </div>
                        <p className="text-sm text-gray-600">O padrão é o Preto Zenos.</p>
                    </div>
                     {errors.primaryColor && <p className="text-red-500 text-sm mt-1">{errors.primaryColor.message}</p>}
                </div>

                <Button type="submit" className="mt-6 w-full max-w-xs mx-auto flex justify-center text-lg py-6 bg-black text-white hover:bg-gray-800">
                    Avançar
                </Button>
            </form>
        </div>
    );
}
