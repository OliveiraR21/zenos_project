"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ActionEnergyChartProps {
    data: { time: string, actions: number }[];
}

const chartConfig = {
    actions: {
        label: "Ações no Sistema",
        color: "hsl(var(--primary))",
    },
    volt: {
        label: "Pico de Ações",
        color: "hsl(var(--volt))",
    }
} satisfies ChartConfig

export function ActionEnergyChart({ data }: ActionEnergyChartProps) {
    const maxActions = Math.max(...data.map(d => d.actions));

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">⚡ Energia de Ação</CardTitle>
                <CardDescription>Atividade do sistema nas últimas 24 horas</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <Tooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="actions" radius={4}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.actions >= maxActions * 0.9 ? "var(--color-volt)" : "var(--color-actions)"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
