import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RBI_ACTIVITY_SUMMARY } from "@/lib/rbi-information-data";
import { cn } from "@/lib/utils";

export function RbiActivitySummary() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">RBI Activity Summary</CardTitle>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">This Month</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {RBI_ACTIVITY_SUMMARY.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/45"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                    item.critical
                      ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <p className="min-w-0 flex-1 text-sm font-semibold leading-5 text-slate-700 dark:text-slate-300">
                  {item.label}
                </p>
                <p
                  className={cn(
                    "shrink-0 text-lg font-bold leading-none",
                    item.critical ? "text-red-600 dark:text-red-300" : "text-slate-950 dark:text-slate-100"
                  )}
                >
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
