import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { RbiKpiCard as RbiKpiCardData } from "@/lib/rbi-information-data";
import { cn } from "@/lib/utils";
import { rbiColorStyles } from "@/components/rbi/rbi-style";

interface RbiKpiCardProps {
  item: RbiKpiCardData;
}

export function RbiKpiCard({ item }: RbiKpiCardProps) {
  const Icon = item.icon;
  const TrendIcon = item.trendDirection === "up" ? ArrowUpRight : ArrowDownRight;
  const color = rbiColorStyles[item.color];

  return (
    <Card className="flex min-h-[132px] flex-col justify-between p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">
            {item.title}
          </p>
          <p className="mt-3 text-2xl font-bold leading-none text-slate-950 dark:text-slate-100">
            {item.value}
          </p>
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm ring-4", color.icon, color.ring)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div
        className={cn(
          "mt-4 inline-flex items-center gap-1 text-xs font-semibold",
          item.trendDirection === "up" ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300"
        )}
      >
        <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{item.trend}</span>
      </div>
    </Card>
  );
}
