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
  Customized,
} from 'recharts';
import { differenceInDays, min, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task } from '@/lib/data';
import { Card } from '../ui/card';

interface GanttChartData {
  id: string;
  name: string;
  startDay: number;
  duration: number;
  isCritical: boolean;
  deadline: string;
  dependencies: string[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-3 text-sm">
          <p className="font-bold font-headline">{data.name}</p>
          <p>Duração: {data.duration} dia(s)</p>
          <p>Prazo: {data.deadline}</p>
          {data.isCritical && <p className="text-volt font-bold">Caminho Crítico</p>}
        </Card>
      );
    }
  
    return null;
  };

const DependencyLines = ({ data, yAxis, xAxis }: any) => {
  if (!yAxis || !xAxis || !data) return null;

  const taskPositions = new Map();
  data.forEach((task: GanttChartData) => {
    taskPositions.set(task.id, {
      xEnd: xAxis.scale(task.startDay + task.duration),
      xStart: xAxis.scale(task.startDay),
      y: yAxis.scale(task.name) + yAxis.bandwidth / 2,
      isCritical: task.isCritical,
    });
  });

  const lines = [];

  for (const task of data) {
    if (task.dependencies) {
      for (const depId of task.dependencies) {
        const predecessor = taskPositions.get(depId);
        const successor = taskPositions.get(task.id);

        if (predecessor && successor) {
          const startX = predecessor.xEnd;
          const startY = predecessor.y;
          const endX = successor.xStart;
          const endY = successor.y;
          
          const elbowX = startX + 10;
          
          const color = predecessor.isCritical ? '#CCFF00' : 'hsl(var(--muted-foreground))';
          const strokeWidth = predecessor.isCritical ? 2 : 1.5;
          const markerId = `arrowhead-${predecessor.isCritical ? 'volt' : 'muted'}`;
          
          lines.push(
            <g key={`${depId}-${task.id}`}>
              <polyline
                points={`${startX},${startY} ${elbowX},${startY} ${elbowX},${endY} ${endX},${endY}`}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                markerEnd={`url(#${markerId})`}
              />
            </g>
          );
        }
      }
    }
  }

  return (
    <g>
      <defs>
        <marker
          id="arrowhead-volt"
          markerWidth="8"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#CCFF00" />
        </marker>
        <marker
          id="arrowhead-muted"
          markerWidth="8"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--muted-foreground))" />
        </marker>
      </defs>
      {lines}
    </g>
  );
};


export function GanttChart({ tasks }: { tasks: Task[] }) {
  const chartData: GanttChartData[] = React.useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const validDates = tasks.map(t => t.startDate).filter(d => d && !isNaN(d.valueOf()));
    if(validDates.length === 0) return [];
    
    const projectStartDate = min(validDates);

    const sortedTasks = [...tasks].sort((a,b) => a.startDate.getTime() - b.startDate.getTime());

    return sortedTasks.map(task => {
        const startDate = task.startDate;
        const endDate = task.newDeadline;
        const startDay = differenceInDays(startDate, projectStartDate);
        const duration = Math.max(1, differenceInDays(endDate, startDate)); // min duration of 1 day

        return {
            id: task.id,
            name: task.title,
            startDay: startDay,
            duration: duration,
            isCritical: task.isCriticalPath,
            deadline: format(endDate, "dd/MM/yyyy", { locale: ptBR }),
            dependencies: task.dependencies || [],
        };
    });
  }, [tasks]);

  return (
    <ResponsiveContainer width="100%" height={tasks.length * 50 + 50}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        barCategoryGap="35%"
      >
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin', 'dataMax + 1']} />
        <YAxis 
            type="category" 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            width={150}
            tick={{ dx: -10 }}
            interval={0}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)'}}/>
        
        <Bar dataKey="startDay" stackId="a" fill="transparent" />
        <Bar dataKey="duration" stackId="a" radius={[4, 4, 4, 4]}>
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isCritical ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />
            ))}
        </Bar>
        <Customized content={<DependencyLines data={chartData} />} />
      </BarChart>
    </ResponsiveContainer>
  );
}
