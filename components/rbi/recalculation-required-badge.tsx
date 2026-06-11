"use client";

import { RotateCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CalculationTrace } from "@/lib/rbi-store";

export function RecalculationRequiredBadge({ trace }: { trace?: CalculationTrace }) {
  if (!trace?.recalculationRequired) return null;

  return (
    <Badge
      className="inline-flex items-center gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200"
      title={trace.staleReason ?? "Calculation input has changed."}
    >
      <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
      Recalculation Required
    </Badge>
  );
}
