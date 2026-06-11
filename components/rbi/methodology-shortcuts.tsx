import { ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { METHODOLOGY_SHORTCUTS } from "@/lib/rbi-information-data";

export function MethodologyShortcuts() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Methodology Shortcuts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {METHODOLOGY_SHORTCUTS.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                className="group flex w-full min-w-0 items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-blue-700 dark:bg-slate-800 dark:text-blue-300">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-200">
                    {item.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-700 dark:group-hover:text-blue-300" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
