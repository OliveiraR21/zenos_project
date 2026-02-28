'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import type { Project } from '@/lib/data';

interface ProjectSettingsViewProps {
    project: Project;
}

export function ProjectSettingsView({ project }: ProjectSettingsViewProps) {
    const [deadline, setDeadline] = React.useState<Date | undefined>(project.targetGainDeadline ? new Date(project.targetGainDeadline) : undefined);

    return (
        <div className="grid gap-6 max-w-2xl mx-auto pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Configurações Gerais do Projeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="projectName">Nome do Projeto</Label>
                        <Input id="projectName" defaultValue={project.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="sponsorName">Nome do Sponsor</Label>
                        <Input id="sponsorName" defaultValue={project.sponsorName} />
                    </div>
                     <div className="space-y-2">
                        <Label>Prazo Final do Ganho</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !deadline && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {deadline ? format(deadline, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-background">
                                <Calendar
                                    mode="single"
                                    selected={deadline}
                                    onSelect={setDeadline}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Salvar Alterações</Button>
                </CardFooter>
            </Card>

             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>A exclusão de um projeto é permanente e não pode ser desfeita. Todas as tarefas e dados associados serão perdidos.</CardDescription>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive">Excluir Projeto</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
