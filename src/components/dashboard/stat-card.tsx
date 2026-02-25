import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease";
};

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{value}</div>
        {change && changeType && (
          <p className="text-xs text-muted-foreground flex items-center">
            {changeType === "increase" ? (
              <TrendingUp className="w-4 h-4 mr-1 text-volt" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1 text-destructive" />
            )}
            <span
              className={cn(
                "mr-1",
                changeType === "increase" ? "text-volt" : "text-destructive"
              )}
            >
              {change}
            </span>
            vs last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
