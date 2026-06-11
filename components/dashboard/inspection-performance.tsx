"use client";

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InspectionPerformanceData } from "@/lib/dashboard-data";

interface InspectionPerformanceProps {
  performance: InspectionPerformanceData;
  className?: string;
}

export function InspectionPerformance({ performance, className }: InspectionPerformanceProps) {
  const chartData = [
    { name: "On-time", value: performance.value, color: "#16a34a" },
    { name: "Remaining", value: 100 - performance.value, color: "#e2e8f0" }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Inspection Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-36" aria-label={`${performance.value}% ${performance.label}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                startAngle={180}
                endAngle={0}
                cx="50%"
                cy="78%"
                innerRadius="62%"
                outerRadius="88%"
                paddingAngle={1}
                isAnimationActive={false}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-x-0 bottom-1 text-center">
            <p className="text-3xl font-bold text-slate-950">{performance.value}%</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{performance.label}</p>
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold text-slate-600">{performance.target}</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100" aria-hidden="true">
          <div className="h-2 rounded-full bg-green-600" style={{ width: `${performance.value}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}
