import { StatCard } from "@/components/dashboard/stat-card";
import type { SuperAdminStat } from "@/lib/data";

interface KpiGridProps {
  stats: SuperAdminStat[];
}

export function KpiGrid({ stats }: KpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
          changeType={stat.changeType}
        />
      ))}
    </div>
  );
}
