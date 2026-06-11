"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RBI_RISK_PROFILE } from "@/lib/rbi-information-data";

const totalAssets = RBI_RISK_PROFILE.reduce((total, item) => total + item.value, 0);

export function RbiRiskProfileCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Risk Profile Overview</CardTitle>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Based on Area Risk</p>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(180px,0.9fr)_minmax(0,1.1fr)] xl:grid-cols-1 2xl:grid-cols-[minmax(180px,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative h-52 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RBI_RISK_PROFILE}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={2}
                  stroke="transparent"
                >
                  {RBI_RISK_PROFILE.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold leading-none text-slate-950 dark:text-slate-100">
                  {totalAssets.toLocaleString("en-US")}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Total Assets</p>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-2.5 self-center">
            {RBI_RISK_PROFILE.map((item) => (
              <div key={item.label} className="flex min-w-0 items-center gap-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {item.label} <span className="font-medium text-slate-500 dark:text-slate-400">({item.range})</span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-slate-950 dark:text-slate-100">{item.value}</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
