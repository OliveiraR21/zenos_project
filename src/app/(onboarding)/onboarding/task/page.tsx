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
import { useOnboarding } from '@/context/onboarding-context';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, collection, writeBatch, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Simple way to generate IDs on client
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  taskName: z.string().min(3, "O nome da tarefa é obrigatório."),
  taskResponsibleEmail: z.string().email("Insira um email válido para o responsável."),
  taskDeadline: z.date({ required_error: "O prazo da tarefa é obrigatório." }),
});

type FormData = z.infer<typeof schema>;

export default function Step4Task() {
    const router = useRouter();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [isLoading, setIsLoading] = React.useState(false);
    
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            taskName: onboardingData.taskName || '',
            taskResponsibleEmail: onboardingData.taskResponsibleEmail || '',
            taskDeadline: onboardingData.taskDeadline || undefined,
        },
    });

    const handleFinish = async (data: FormData) => {
        updateOnboardingData(data);

        // Combine data from context and the final form
        const finalData = { ...onboardingData, ...data };

        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Usuário ou conexão não encontrados.' });
            return;
        }
        if (!finalData.companyName || !finalData.projectObjective) {
             toast({ variant: 'destructive', title: 'Dados incompletos', description: 'Por favor, volte e complete os passos anteriores.' });
            return;
        }

        setIsLoading(true);

        try {
            const batch = writeBatch(firestore);

            // 1. Create Organization
            const orgRef = doc(collection(firestore, 'organizations'));
            const orgId = orgRef.id;
            const newOrg = {
                id: orgId,
                tenantId: orgId, // Explicit tenantId for rules
                name: finalData.companyName,
                slug: finalData.companyName?.toLowerCase().replace(/\s/g, ''),
                customDomain: `${finalData.companyName?.toLowerCase().replace(/\s/g, '')}.zenos.tech`,
                brandingPrimaryColor: finalData.primaryColor || '#000000',
                brandingLogoUrl: finalData.logoUrl || '',
                brandingIsWhiteLabel: false,
                subscriptionPlan: 'Business', // Default plan
                subscriptionStatus: 'active',
                subscriptionNextBilling: addDays(new Date(), 30),
            };
            batch.set(orgRef, newOrg);

            // 2. Create User Profile
            const userRef = doc(firestore, 'users', user.uid);
            const newUserProfile = {
                id: user.uid,
                tenantId: orgId,
                email: user.email,
                name: user.displayName,
                role: 'Admin', // First user is Admin
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
            };
            batch.set(userRef, newUserProfile);

            // 3. Create Project
            const projectRef = doc(collection(firestore, 'projects'));
            const projectId = projectRef.id;
            const newProject = {
                id: projectId,
                tenantId: orgId,
                name: `Projeto de ${finalData.projectObjective}`,
                sponsorName: 'Não definido', // Placeholder
                sponsorEmail: finalData.sponsorEmail,
                managerId: user.uid, // Onboarding user is the first manager
                targetGainType: finalData.projectObjective,
                targetGainValue: finalData.projectGainValue,
                targetGainDeadline: finalData.projectGainDeadline,
                status: 'Em Dia',
            };
            batch.set(projectRef, newProject);
            
            // 4. Create Task
            const taskRef = doc(collection(firestore, 'tasks'));
            const newTaskId = taskRef.id;
            const newTask = {
                id: newTaskId,
                projectId: projectId,
                tenantId: orgId,
                title: data.taskName,
                responsibleId: user.uid, // Placeholder, in real app would resolve email to ID
                responsible: data.taskResponsibleEmail,
                startDate: serverTimestamp(),
                baselineDate: data.taskDeadline,
                currentDeadline: data.taskDeadline,
                completionDate: null,
                dependencies: [],
                isCriticalPath: true, // First task is critical
                status: 'A Fazer',
            };
            batch.set(taskRef, newTask);

            // Commit all writes at once
            await batch.commit();

            toast({ title: "Bem-vindo ao Zenos!", description: "Sua organização e primeiro projeto foram criados." });
            router.push('/'); // Redirect to dashboard

        } catch (error) {
            console.error("Onboarding failed:", error);
            toast({ variant: 'destructive', title: 'Erro na configuração', description: 'Não foi possível salvar seus dados. Verifique suas regras de segurança do Firestore.' });
            setIsLoading(false);
        }
    }

    // A simple function to simulate `addDays`
    const addDays = (date: Date, days: number): Date => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    return (
        <div className="w-full animate-fade-in">
            <h1 className="text-4xl font-bold font-headline mb-4">A Primeira Engrenagem</h1>
             <p className="text-muted-foreground mb-12">
                <Sparkles className="inline-block w-4 h-4 mr-2 text-volt" />
                Todo grande ganho começa com um passo. Qual a primeira tarefa crítica para desbloquear esse resultado?
            </p>
            
            <form onSubmit={handleSubmit(handleFinish)} className="space-y-8 text-left">
                <div>
                    <Label htmlFor="taskName" className="text-lg">Nome da Tarefa Crítica</Label>
                    <Controller
                        name="taskName"
                        control={control}
                        render={({ field }) => (
                            <Input id="taskName" {...field} placeholder="Ex: Validar a API de pagamentos" className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black bg-white border-gray-300" />
                        )}
                    />
                    {errors.taskName && <p className="text-red-500 text-sm mt-1">{errors.taskName.message}</p>}
                </div>

                <div>
                    <Label htmlFor="taskResponsible" className="text-lg">Responsável</Label>
                     <Controller
                        name="taskResponsibleEmail"
                        control={control}
                        render={({ field }) => (
                            <Input id="taskResponsible" type="email" {...field} placeholder="ex: dev.lead@empresa.com" className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black bg-white border-gray-300" />
                        )}
                    />
                     {errors.taskResponsibleEmail && <p className="text-red-500 text-sm mt-1">{errors.taskResponsibleEmail.message}</p>}
                </div>

                <div>
                    <Label className="text-lg d-block mb-2">Prazo da Tarefa</Label>
                    <Controller
                        name="taskDeadline"
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
                    {errors.taskDeadline && <p className="text-red-500 text-sm mt-1">{errors.taskDeadline.message}</p>}
                </div>
                 <Button type="submit" disabled={isLoading} className="!mt-12 w-full max-w-xs text-lg py-6 bg-volt text-black hover:bg-volt/90 mx-auto flex justify-center">
                    {isLoading ? 'Finalizando...' : 'Concluir e Ir para o Dashboard'}
                </Button>
            </form>
        </div>
    );
}
