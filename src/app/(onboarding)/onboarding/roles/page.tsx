'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Step3Roles() {
    const router = useRouter();

    return (
        <div className="w-full animate-fade-in">
            <h1 className="text-4xl font-bold font-headline mb-4">O Triunvirato B2B</h1>
            <p className="text-muted-foreground mb-12">Projeto sem dono é projeto morto. Defina as responsabilidades chave.</p>
            
            <div className="space-y-8 text-left">
                <div>
                    <Label htmlFor="sponsorEmail" className="text-lg">Sponsor (O Dono do Resultado)</Label>
                    <p className="text-sm text-gray-600 mb-2">Quem será o principal beneficiado e cobrador por este resultado?</p>
                    <Input id="sponsorEmail" type="email" placeholder="ex: diretor@empresa.com" className="text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black bg-white border-gray-300" />
                </div>

                <div>
                    <Label htmlFor="managerEmail" className="text-lg">Responsável (O Maestro)</Label>
                    <p className="text-sm text-gray-600 mb-2">Quem vai garantir que a execução aconteça no dia-a-dia?</p>
                    <Input id="managerEmail" type="email" placeholder="ex: gerente.projetos@empresa.com" className="text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black bg-white border-gray-300" />
                </div>
            </div>

            <Button onClick={() => router.push('/onboarding/task')} className="mt-12 w-full max-w-xs text-lg py-6 bg-black text-white hover:bg-gray-800">
                Avançar e Definir Tarefa Crítica
            </Button>
        </div>
    );
}
