"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ASSET_REGISTRY_TOTAL, REGISTRY_QUALITY_INSIGHTS } from "@/lib/asset-registry-data";

export function RegistryQualityInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registry Quality Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] 2xl:grid-cols-1">
          <div className="relative h-48 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REGISTRY_QUALITY_INSIGHTS}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={48}
                  outerRadius={76}
                  paddingAngle={2}
                  stroke="none"
                >
                  {REGISTRY_QUALITY_INSIGHTS.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-black text-slate-950 dark:text-slate-100">{ASSET_REGISTRY_TOTAL.toLocaleString()}</p>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Assets</p>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            {REGISTRY_QUALITY_INSIGHTS.map((item) => (
              <div key={item.label} className="flex min-w-0 items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {item.value.toLocaleString()} ({item.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
