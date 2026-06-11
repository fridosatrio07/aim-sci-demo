"use client";

import { ArrowUpRight } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DonutChartDataset } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface DonutChartCardProps {
  dataset: DonutChartDataset;
  className?: string;
}

export function DonutChartCard({ dataset, className }: DonutChartCardProps) {
  const [primaryLabel, ...secondaryLabel] = dataset.centerLabel.split(" ");
  const percentageCenter = primaryLabel.endsWith("%");

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{dataset.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(132px,0.85fr)_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(132px,0.85fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(118px,0.85fr)_minmax(0,1fr)]">
          <div className="relative h-44 min-h-0 sm:h-48 lg:h-44 xl:h-48 2xl:h-40" aria-label={`${dataset.title} donut chart`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === "number" ? value.toLocaleString("en-US") : value,
                    name
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)"
                  }}
                />
                <Pie
                  data={dataset.data}
                  dataKey="value"
                  innerRadius="57%"
                  outerRadius="82%"
                  paddingAngle={2}
                  cornerRadius={3}
                  isAnimationActive={false}
                >
                  {dataset.data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="max-w-[92px] text-center leading-none">
                <span className={cn("block", percentageCenter ? "text-lg font-bold text-slate-950" : "text-xs font-medium text-slate-600")}>
                  {primaryLabel}
                </span>
                {secondaryLabel.length > 0 ? (
                  <span className={cn("mt-1 block", percentageCenter ? "text-xs font-medium text-slate-600" : "text-xl font-bold text-slate-950")}>
                    {secondaryLabel.join(" ")}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center overflow-hidden">
            <div className="space-y-2.5">
              {dataset.data.map((item) => (
                <div key={item.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 text-xs">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate text-slate-600">{item.name}</span>
                  </div>
                  <div className="shrink-0 text-right font-medium leading-4 text-slate-900">
                    <span>{item.value}</span>
                    {item.percentage ? <span className="block text-[11px] text-slate-500">{item.percentage}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            variant="link"
            className={cn("max-w-full justify-end whitespace-normal text-right text-xs leading-4", dataset.actionLabel.length > 24 && "text-right")}
          >
            {dataset.actionLabel}
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
