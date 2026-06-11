import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { iconMap } from "@/components/icon-map";
import { Card, CardContent } from "@/components/ui/card";
import type { SummaryKpi } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  item: SummaryKpi;
}

const iconToneClasses: Record<SummaryKpi["iconTone"], string> = {
  blue: "from-blue-700 to-cyan-500 text-white",
  green: "from-emerald-600 to-green-400 text-white",
  yellow: "from-amber-500 to-yellow-400 text-white",
  orange: "from-orange-600 to-amber-400 text-white",
  red: "from-red-600 to-rose-400 text-white",
  cyan: "from-sky-600 to-cyan-400 text-white"
};

const trendToneClasses: Record<SummaryKpi["trend"]["tone"], string> = {
  positive: "text-green-600",
  negative: "text-red-600"
};

export function SummaryCard({ item }: SummaryCardProps) {
  const Icon = iconMap[item.icon];
  const TrendIcon = item.trend.direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="min-h-[104px]">
      <CardContent className="p-3.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-[0_10px_20px_rgba(15,23,42,0.16)]",
              iconToneClasses[item.iconTone]
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium leading-4 text-slate-500">{item.title}</p>
            <p className="mt-1 text-2xl font-bold leading-8 text-slate-950">{item.value}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", trendToneClasses[item.trend.tone])}
                aria-label={`${item.title} trend ${item.trend.value}`}
              >
                <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.trend.value}
              </span>
              <span className="text-[11px] text-slate-500">vs last month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
