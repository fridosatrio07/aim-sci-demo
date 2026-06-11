"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ArrowDownRight, ArrowUpRight, CalendarDays } from "lucide-react";

import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COF_CONTRIBUTORS,
  DATA_QUALITY_COLUMNS,
  DATA_QUALITY_HEATMAP,
  INSPECTION_EFFECTIVENESS_DISTRIBUTION,
  MITIGATION_EFFECTIVENESS,
  POF_CONTRIBUTORS,
  RISK_ANALYTICS_FILTERS,
  RISK_ANALYTICS_KPIS,
  RISK_BAND_LABELS,
  RISK_LEVEL_COLORS,
  RISK_MATRIX_POF_LABELS,
  RISK_MATRIX_ROWS,
  RISK_MATRIX_SUMMARY,
  RISK_TREND,
  SCATTER_POINTS,
  TRIGGERED_RBI_UPDATES,
  type RiskAnalyticsColor,
  type RiskContributor,
  type HighRiskAsset,
  type RiskLevel,
  type Severity
} from "@/lib/risk-analytics-data";
import { useRbiData } from "@/lib/rbi-store";
import { cn } from "@/lib/utils";

const analyticsColorStyles: Record<
  RiskAnalyticsColor,
  { icon: string; ring: string }
> = {
  blue: { icon: "bg-blue-600 text-white", ring: "ring-blue-100 dark:ring-blue-500/20" },
  red: { icon: "bg-red-600 text-white", ring: "ring-red-100 dark:ring-red-500/20" },
  deepRed: { icon: "bg-red-800 text-white", ring: "ring-red-200 dark:ring-red-500/20" },
  orange: { icon: "bg-orange-500 text-white", ring: "ring-orange-100 dark:ring-orange-500/20" },
  purple: { icon: "bg-violet-600 text-white", ring: "ring-violet-100 dark:ring-violet-500/20" },
  green: { icon: "bg-green-600 text-white", ring: "ring-green-100 dark:ring-green-500/20" }
};

const axisTick = { fill: "currentColor", fontSize: 11 };
const chartGrid = "rgba(148, 163, 184, 0.25)";

function riskBadgeClass(level: RiskLevel | "Very Low" | "High" | "Extreme") {
  if (level === "Extreme") return "border-red-300 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200";
  if (level === "Very High") return "border-red-200 bg-red-50 text-red-600 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200";
  if (level === "High") return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/70 dark:bg-orange-950/35 dark:text-orange-200";
  if (level === "Medium") return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/70 dark:bg-yellow-950/30 dark:text-yellow-200";
  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/70 dark:bg-green-950/30 dark:text-green-200";
}

function severityBadgeClass(severity: Severity) {
  if (severity === "High") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
  if (severity === "Medium") return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/35 dark:text-orange-200";
  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
}

function matrixCellColor(rowIndex: number, columnIndex: number) {
  const cof = 5 - rowIndex;
  const pof = columnIndex + 1;
  const score = cof * pof;

  if (score >= 20) return "bg-red-700 text-white";
  if (score >= 15) return "bg-red-500 text-white";
  if (score >= 10) return "bg-orange-400 text-white";
  if (score >= 5) return "bg-yellow-300 text-slate-950";
  return "bg-green-500 text-white";
}

function formatScientific(value: number) {
  return value.toExponential(1).replace("e", "E");
}

function RbiFilterBar() {
  const defaults = useMemo(
    () => Object.fromEntries(RISK_ANALYTICS_FILTERS.map((filter) => [filter.id, filter.defaultValue])),
    []
  );
  const [values, setValues] = useState<Record<string, string>>(defaults);
  const [message, setMessage] = useState("");

  function handleReset() {
    setValues(defaults);
    setMessage("");
  }

  function handleApply() {
    setMessage("Filters applied in prototype mode.");
    window.setTimeout(() => setMessage(""), 2200);
  }

  return (
    <Card className="p-4">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {RISK_ANALYTICS_FILTERS.map((filter) => (
          <div key={filter.id} className="min-w-0">
            <label htmlFor={`risk-analytics-${filter.id}`} className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{filter.label}</label>
            {filter.type === "date-range" ? (
              <button
                id={`risk-analytics-${filter.id}`}
                type="button"
                className="mt-1 flex h-10 w-full min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-left text-sm font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <CalendarDays className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                <span className="truncate">{values[filter.id]}</span>
              </button>
            ) : (
              <select
                id={`risk-analytics-${filter.id}`}
                className="mt-1 h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={values[filter.id]}
                onChange={(event) => setValues((current) => ({ ...current, [filter.id]: event.target.value }))}
              >
                {filter.options?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-5 text-sm font-semibold text-blue-700 dark:text-blue-300" role="status">{message}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={handleReset}>Reset Filters</Button>
          <Button type="button" onClick={handleApply}>Apply Filters</Button>
        </div>
      </div>
    </Card>
  );
}

function RiskAnalyticsKpiGrid({
  activeRiskLevel,
  summary
}: {
  activeRiskLevel: RiskLevel;
  summary: {
    highRiskAssets: number;
    extremeRiskAssets: number;
    targetExceeded: number;
    revalidationDue: number;
    averageRiskScore: number;
    riskReductionAfterMitigation: number;
  };
}) {
  return (
    <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" aria-label="Risk analytics KPI summary">
      {RISK_ANALYTICS_KPIS.map((item) => {
        const displayValue =
          item.title === "High Risk Assets" ? summary.highRiskAssets.toLocaleString("en-US") :
          item.title === "Extreme Risk Assets" ? summary.extremeRiskAssets.toLocaleString("en-US") :
          item.title === "Assets Exceeding Risk Target" ? summary.targetExceeded.toLocaleString("en-US") :
          item.title === "Revalidation Due" ? summary.revalidationDue.toLocaleString("en-US") :
          item.title === "Average Risk Score" ? `${summary.averageRiskScore.toFixed(1)} / 25` :
          item.title === "Risk Reduction After Mitigation" ? `${Math.round(summary.riskReductionAfterMitigation)}%` :
          item.title === "High Risk Assets" && activeRiskLevel === "Extreme" ? "238" : item.value;
        const Icon = item.icon;
        const TrendIcon = item.trendDirection === "up" ? ArrowUpRight : ArrowDownRight;
        const color = analyticsColorStyles[item.color];

        return (
          <Card key={item.title} className="flex min-h-[132px] flex-col justify-between p-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">{item.title}</p>
                <p className="mt-3 text-2xl font-bold leading-none text-slate-950 dark:text-slate-100">{displayValue}</p>
              </div>
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm ring-4", color.icon, color.ring)}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className={cn("mt-4 inline-flex items-center gap-1 text-xs font-semibold", item.trendDirection === "up" ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300")}>
              <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.trend}
            </div>
          </Card>
        );
      })}
    </section>
  );
}

function Api581RiskMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">API RP 581 Risk Matrix (PoF vs CoF)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_160px]">
          <div className="min-w-0">
            <div className="grid grid-cols-[62px_repeat(5,minmax(0,1fr))] gap-1 text-center text-[10px] font-bold">
              <div className="flex items-end justify-center pb-1 text-slate-500 dark:text-slate-400">CoF</div>
              {RISK_MATRIX_POF_LABELS.map((label) => (
                <div key={label} className="flex min-h-8 items-end justify-center rounded bg-slate-50 px-1 pb-1 leading-tight text-slate-600 dark:bg-slate-800 dark:text-slate-300">{label}</div>
              ))}
              {RISK_MATRIX_ROWS.map((row, rowIndex) => (
                <div key={row.cof} className="contents">
                  <div className="flex min-h-10 items-center justify-end rounded bg-slate-50 px-1.5 text-right leading-tight text-slate-600 dark:bg-slate-800 dark:text-slate-300">{row.cof}</div>
                  {row.values.map((value, columnIndex) => (
                    <div key={`${row.cof}-${columnIndex}`} className={cn("flex min-h-10 items-center justify-center rounded text-xs font-bold shadow-sm", matrixCellColor(rowIndex, columnIndex))}>
                      {value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Probability of Failure (PoF)</p>
          </div>

          <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/45">
            <p className="text-sm font-bold text-slate-950 dark:text-slate-100">Summary</p>
            <div className="mt-2 space-y-1.5">
              {RISK_MATRIX_SUMMARY.map((item) => (
                <div key={item.label} className="flex min-w-0 items-center justify-between gap-2 text-xs">
                  <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="font-bold text-slate-950 dark:text-slate-100">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskDistributionChart({ data }: { data: Array<{ label: string; value: number; percentage: number; color: string }> }) {
  const chartData = data.map((item) => ({ ...item, display: `${item.value} (${item.percentage}%)` }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">Risk Distribution by Risk Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 28, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis dataKey="label" tick={axisTick} interval={0} />
              <YAxis tick={axisTick} label={{ value: "Number of Assets", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "currentColor" } }} />
              <Tooltip cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((item) => <Cell key={item.label} fill={item.color} />)}
                <LabelList dataKey="display" position="top" className="fill-slate-600 text-[11px] font-bold dark:fill-slate-300" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="-mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}: {item.value} ({item.percentage}%)
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PofCofScatterChart() {
  const riskLevels: RiskLevel[] = ["Extreme", "Very High", "High", "Medium", "Low"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">PoF vs CoF Scatter Plot (Asset Risk Profile)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0.8, 5.2]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => ["", "A", "B", "C", "D", "E"][Number(value)] ?? ""}
                tick={axisTick}
                label={{ value: "Probability of Failure (PoF)", position: "insideBottom", offset: -12, style: { fontSize: 11, fill: "currentColor" } }}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[0.8, 5.2]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => String(value)}
                tick={axisTick}
                label={{ value: "Consequence of Failure (CoF)", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "currentColor" } }}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(_, __, props) => [props.payload.tag, props.payload.riskLevel]} />
              {riskLevels.map((level) => (
                <Scatter
                  key={level}
                  name={level}
                  data={SCATTER_POINTS.filter((point) => point.riskLevel === level)}
                  fill={RISK_LEVEL_COLORS[level]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {riskLevels.map((level) => (
            <span key={level} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RISK_LEVEL_COLORS[level] }} />
              {level}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">Risk Trend Over Time (Average Risk Score)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-0">
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RISK_TREND} margin={{ top: 8, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="month" tick={axisTick} interval={1} />
                <YAxis domain={[0, 25]} tick={axisTick} />
                <Tooltip />
                <Line type="monotone" dataKey="averageRiskScore" name="Average Risk Score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
            {RISK_BAND_LABELS.map((band) => (
              <span key={band.label} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: band.color }} />
                {band.label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MitigationEffectivenessChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">Mitigation Effectiveness (Area Risk)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={MITIGATION_EFFECTIVENESS} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis dataKey="month" tick={axisTick} />
              <YAxis yAxisId="risk" tick={axisTick} tickFormatter={(value) => formatScientific(Number(value))} />
              <YAxis yAxisId="percent" orientation="right" tick={axisTick} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value, name) => name === "Risk Reduction (%)" ? [`${value}%`, name] : [formatScientific(Number(value)), name]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="risk" dataKey="preMitigationRisk" name="Pre-Mitigation Risk" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="risk" dataKey="postMitigationRisk" name="Post-Mitigation Risk" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Line yAxisId="percent" type="monotone" dataKey="riskReduction" name="Risk Reduction (%)" stroke="#16a34a" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function HighRiskAssetsTable({ assets }: { assets: HighRiskAsset[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">Top 10 High-Risk Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                <th className="px-3 py-3">#</th>
                <th className="px-3 py-3">Tag Number</th>
                <th className="px-3 py-3">Asset Name</th>
                <th className="px-3 py-3">Unit</th>
                <th className="px-3 py-3">Governing Damage Mechanism</th>
                <th className="px-3 py-3">Risk Score (0-25)</th>
                <th className="px-3 py-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assets.map((asset, index) => (
                <tr key={asset.tagNumber} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-3 font-semibold text-slate-500 dark:text-slate-400">{index + 1}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-blue-700 dark:text-blue-300">{asset.tagNumber}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-950 dark:text-slate-100">{asset.assetName}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{asset.unit}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{asset.damageMechanism}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-slate-950 dark:text-slate-100">{asset.riskScore.toFixed(1)}</td>
                  <td className="whitespace-nowrap px-3 py-3"><Badge className={riskBadgeClass(asset.riskLevel)}>{asset.riskLevel}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskContributorsCard({ title, rows }: { title: string; rows: RiskContributor[] }) {
  const maxImpact = Math.max(...rows.map((row) => row.impact));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.factor} className="grid min-w-0 grid-cols-[24px_minmax(0,1fr)_54px] items-center gap-3">
              <span className="text-xs font-bold text-slate-400">{index + 1}</span>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{row.factor}</p>
                  <p className="shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">{row.averageScore.toFixed(2)}</p>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-blue-600 dark:bg-blue-400" style={{ width: `${(row.impact / maxImpact) * 100}%` }} />
                </div>
              </div>
              <span className="text-right text-sm font-bold text-slate-950 dark:text-slate-100">{row.impact}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function IowMocTriggeredUpdates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">IOW / MOC-Triggered RBI Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                <th className="px-3 py-3">Trigger ID</th>
                <th className="px-3 py-3">Trigger Type</th>
                <th className="px-3 py-3">Asset / Unit</th>
                <th className="px-3 py-3">Detected Date</th>
                <th className="px-3 py-3">Severity</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TRIGGERED_RBI_UPDATES.map((row) => (
                <tr key={row.triggerId} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-blue-700 dark:text-blue-300">{row.triggerId}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{row.triggerType}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-950 dark:text-slate-100">{row.assetUnit}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{row.detectedDate}</td>
                  <td className="whitespace-nowrap px-3 py-3"><Badge className={severityBadgeClass(row.severity)}>{row.severity}</Badge></td>
                  <td className="whitespace-nowrap px-3 py-3"><Badge variant="default">{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function DataQualityHeatmap() {
  const statusClass = {
    Good: "bg-green-500",
    Fair: "bg-yellow-400",
    Poor: "bg-red-500"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">Data Quality Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                <th className="px-2 py-2 text-left">Unit</th>
                {DATA_QUALITY_COLUMNS.map((column) => (
                  <th key={column} className="px-2 py-2 text-center">
                    {column.replace(" Data", "").replace("Consequence", "Conseq.")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DATA_QUALITY_HEATMAP.map((row) => (
                <tr key={row.unit} className="bg-white dark:bg-slate-900">
                  <td className="whitespace-nowrap px-2 py-2 font-bold text-slate-950 dark:text-slate-100">{row.unit}</td>
                  {DATA_QUALITY_COLUMNS.map((column) => (
                    <td key={column} className="px-2 py-2 text-center">
                      <span className={cn("mx-auto flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white", statusClass[row.values[column]])}>
                        {row.values[column][0]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />Good (&ge;90%)</span>
          <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-yellow-400" />Fair (70-89%)</span>
          <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />Poor (&lt;70%)</span>
        </div>
      </CardContent>
    </Card>
  );
}

function InspectionEffectivenessDistribution() {
  const total = INSPECTION_EFFECTIVENESS_DISTRIBUTION.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">Inspection Effectiveness Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 items-center gap-3 sm:grid-cols-[160px_minmax(0,1fr)]">
          <div className="relative h-44 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={INSPECTION_EFFECTIVENESS_DISTRIBUTION} dataKey="value" nameKey="label" innerRadius="58%" outerRadius="82%" paddingAngle={2} stroke="transparent">
                  {INSPECTION_EFFECTIVENESS_DISTRIBUTION.map((item) => <Cell key={item.label} fill={item.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-950 dark:text-slate-100">{total.toLocaleString("en-US")}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Assets</p>
              </div>
            </div>
          </div>
          <div className="self-center space-y-2">
            {INSPECTION_EFFECTIVENESS_DISTRIBUTION.map((item) => (
              <div key={item.label} className="flex min-w-0 items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="min-w-0 flex-1 truncate font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className="shrink-0 font-bold text-slate-950 dark:text-slate-100">{item.percentage}%</span>
                <span className="shrink-0 text-slate-500 dark:text-slate-400">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskAnalyticsPage() {
  const { state: rbiState, assessments, assets, analyticsSummary, riskDistribution } = useRbiData();
  const highRiskAssets: HighRiskAsset[] = assessments
    .filter((assessment) => ["High", "Very High", "Extreme"].includes(assessment.riskDetermination.level))
    .sort((a, b) => b.riskDetermination.score - a.riskDetermination.score)
    .slice(0, 10)
    .map((assessment) => {
      const asset = assets.find((item) => item.id === assessment.assetId);
      return {
        tagNumber: asset?.tagNumber ?? assessment.assetId,
        assetName: asset?.assetName ?? assessment.assetId,
        unit: asset?.unit ?? "-",
        damageMechanism: assessment.selectedDamageMechanisms[0]?.name ?? "Not screened",
        riskScore: assessment.riskDetermination.score,
        riskLevel: assessment.riskDetermination.level === "Extreme" ? "Extreme" : "High"
      };
    });

  return (
    <div className="min-w-0 space-y-4 overflow-hidden">
      <section className="space-y-2">
        <PageBreadcrumb
          items={[
            { label: "Risk-Based Inspection", href: "/risk-based-inspection/rbi-information" },
            { label: "Risk Analytics" }
          ]}
        />
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Risk-Based Inspection</p>
        <h1 className="text-2xl font-bold leading-tight text-slate-950 sm:text-3xl dark:text-slate-100">Risk Analytics</h1>
      </section>

      <RbiFilterBar />
      <RiskAnalyticsKpiGrid activeRiskLevel={rbiState.risk.level} summary={analyticsSummary} />

      <section className="grid min-w-0 items-start gap-4 lg:grid-cols-2 2xl:grid-cols-12" aria-label="Primary risk overview">
        <div className="min-w-0 2xl:col-span-5">
          <Api581RiskMatrix />
        </div>
        <div className="min-w-0 2xl:col-span-3">
          <RiskDistributionChart data={riskDistribution} />
        </div>
        <div className="min-w-0 lg:col-span-2 2xl:col-span-4">
          <PofCofScatterChart />
        </div>
      </section>

      <section className="grid min-w-0 items-start gap-4 lg:grid-cols-2" aria-label="Trend and mitigation analysis">
        <div className="min-w-0">
          <RiskTrendChart />
        </div>
        <div className="min-w-0">
          <MitigationEffectivenessChart />
        </div>
        <div className="min-w-0 lg:col-span-2">
          <HighRiskAssetsTable assets={highRiskAssets} />
        </div>
      </section>

      <section className="grid min-w-0 items-start gap-4 lg:grid-cols-2 2xl:grid-cols-3" aria-label="Risk drivers and RBI triggers">
        <div className="min-w-0">
          <RiskContributorsCard title="Top PoF Contributors" rows={POF_CONTRIBUTORS} />
        </div>
        <div className="min-w-0">
          <RiskContributorsCard title="Top CoF Contributors" rows={COF_CONTRIBUTORS} />
        </div>
        <div className="min-w-0 lg:col-span-2 2xl:col-span-1">
          <IowMocTriggeredUpdates />
        </div>
      </section>

      <section className="grid min-w-0 items-start gap-4 lg:grid-cols-2 xl:grid-cols-12" aria-label="Data quality and inspection effectiveness">
        <div className="min-w-0 xl:col-span-7">
          <DataQualityHeatmap />
        </div>
        <div className="min-w-0 xl:col-span-5">
          <InspectionEffectivenessDistribution />
        </div>
      </section>

    </div>
  );
}
