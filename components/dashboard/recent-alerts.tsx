import { AlertTriangle, FileWarning, Info, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentAlert, Severity } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface RecentAlertsProps {
  alerts: RecentAlert[];
  className?: string;
}

const severityStyles: Record<Severity, { wrapper: string; icon: LucideIcon; label: string }> = {
  critical: {
    wrapper: "border-red-200 bg-red-50 text-red-600",
    icon: AlertTriangle,
    label: "Critical"
  },
  warning: {
    wrapper: "border-orange-200 bg-orange-50 text-orange-600",
    icon: FileWarning,
    label: "Warning"
  },
  info: {
    wrapper: "border-blue-200 bg-blue-50 text-blue-700",
    icon: Info,
    label: "Info"
  }
};

export function RecentAlerts({ alerts, className }: RecentAlertsProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Recent Alerts</CardTitle>
        <Button variant="link" className="text-xs">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100">
          {alerts.map((alert) => {
            const severity = severityStyles[alert.severity];
            const Icon = severity.icon;

            return (
              <article key={`${alert.title}-${alert.time}`} className="grid grid-cols-[28px_minmax(0,1fr)_58px] gap-3 py-3 first:pt-0 last:pb-0">
                <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border", severity.wrapper)}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "truncate text-xs font-bold",
                      alert.severity === "critical" && "text-red-600",
                      alert.severity === "warning" && "text-orange-600",
                      alert.severity === "info" && "text-blue-600"
                    )}
                  >
                    {alert.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-700">{alert.asset.replace("Asset: ", "")}</p>
                </div>
                <span className="shrink-0 text-right text-[11px] leading-4 text-slate-500">{alert.time}</span>
              </article>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
