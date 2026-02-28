'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export function ScopeView() {
    return (
        <div className="pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Estrutura Analítica do Projeto (EAP/WBS)</CardTitle>
                    <CardDescription>Defina o escopo do seu projeto adicionando tarefas em massa. Uma tarefa por linha.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder={
`Validar API de pagamentos
Desenvolver tela de login
Configurar pipeline de CI/CD
...`
                        }
                        rows={10}
                        className="font-mono text-sm"
                    />
                    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                        <Info className="w-3 h-3" />
                        <span>Você pode atribuir responsáveis e prazos no quadro Kanban após a criação.</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Adicionar Tarefas ao Projeto</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
