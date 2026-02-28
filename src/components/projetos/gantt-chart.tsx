'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { differenceInDays, parseISO, min, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

interface GanttChartData {
  name: string;
  startDay: number;
  duration: number;
  isCritical: boolean;
  deadline: string;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-3 text-sm">
          <p className="font-bold font-headline">{data.name}</p>
          <p>Duração: {data.duration} dia(s)</p>
          <p>Prazo: {data.deadline}</p>
          {data.isCritical && <p className="text-red-500 font-bold">Caminho Crítico</p>}
        </Card>
      );
    }
  
    return null;
  };

export function GanttChart({ tasks }: { tasks: Task[] }) {
  const chartData = React.useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const projectStartDates = tasks.map(t => parseISO(t.startDate));
    const projectStartDate = min(projectStartDates);

    return tasks.map(task => {
        const startDate = parseISO(task.startDate);
        const endDate = parseISO(task.newDeadline);
        const startDay = differenceInDays(startDate, projectStartDate);
        const duration = differenceInDays(endDate, startDate) || 1; // min duration of 1 day

        return {
            name: task.title,
            startDay: startDay,
            duration: duration,
            isCritical: task.isCriticalPath,
            deadline: format(endDate, "dd/MM/yyyy", { locale: ptBR }),
        };
    }).sort((a,b) => a.startDay - b.startDay);
  }, [tasks]);

  return (
    <ResponsiveContainer width="100%" height={tasks.length * 50 + 50}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        barCategoryGap="35%"
      >
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis 
            type="category" 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            width={150}
            tick={{ dx: -10 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)'}}/>
        <Bar dataKey="startDay" stackId="a" fill="transparent" />
        <Bar dataKey="duration" stackId="a" radius={[4, 4, 4, 4]}>
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isCritical ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
