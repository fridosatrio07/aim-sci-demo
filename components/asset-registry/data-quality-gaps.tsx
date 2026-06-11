"use client";

import { BarChart3, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DATA_QUALITY_GAPS, type DataQualityGap } from "@/lib/asset-registry-data";
import { cn } from "@/lib/utils";

interface DataQualityGapsProps {
  onAction: (message: string) => void;
  items?: DataQualityGap[];
}

const gapStyles: Record<DataQualityGap["color"], string> = {
  red: "border-red-100 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200",
  orange: "border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-200",
  amber: "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200",
  blue: "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200"
};

export function DataQualityGaps({ onAction, items = DATA_QUALITY_GAPS }: DataQualityGapsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Quality Gaps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => onAction(`${item.title} review is prepared for future development.`)}
                className="flex w-full min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700/60 dark:hover:bg-blue-950/20"
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", gapStyles[item.color])}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                  <span className="mt-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.count}</span>
                </span>
                <span className="shrink-0 text-xs font-bold text-slate-600 dark:text-slate-300">({item.percentage})</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full"
          onClick={() => onAction("Data Quality Dashboard is prepared for future development.")}
        >
          <BarChart3 className="h-4 w-4" aria-hidden="true" />
          View Data Quality Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
