"use client";

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Database,
  Download,
  FileText,
  Info,
  RefreshCcw,
  ShieldAlert
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecalculationRequiredBadge } from "@/components/rbi/recalculation-required-badge";
import {
  CERTIFICATION_STATUS_REVISED,
  CONSEQUENCE_AXIS,
  DASHBOARD_PAGE_META,
  DOCUMENT_SPOTLIGHT,
  HIGH_PRIORITY_MITIGATION,
  INSPECTION_COMPLETION_TREND,
  INSPECTION_STATUS_SUMMARY,
  LIKELIHOOD_AXIS,
  OVERDUE_INSPECTION_OVERVIEW,
  PENDING_APPROVALS,
  PLO_PLF_STATUS,
  RECENT_ALERTS,
  REGULATORY_GAP_SUMMARY,
  RECOMMENDATION_STATUS_REVISED,
  REQUIRED_OWNER_ACTIONS,
  REVISED_DASHBOARD_KPIS,
  REVISED_RISK_CATEGORIES,
  REVISED_RISK_DISTRIBUTION,
  RISK_MATRIX_MARKERS,
  TOP_CRITICAL_ASSETS,
  UPCOMING_INSPECTIONS,
  WORKFLOW_APPROVAL,
  type ActionPriorityItem,
  type DashboardMetricRow,
  type DonutChartDataset,
  type RecentAlert,
  type RevisedDashboardKpi,
  type RiskLevel,
  type SimpleInspectionRow
} from "@/lib/dashboard-data";
import { useRbiData } from "@/lib/rbi-store";
import { cn } from "@/lib/utils";

const kpiIcons = {
  Database,
  ShieldAlert,
  CalendarClock,
  AlertTriangle,
  BadgeCheck
};

const toneClasses: Record<RevisedDashboardKpi["tone"], string> = {
  blue: "from-blue-700 to-blue-500 text-white",
  green: "from-emerald-600 to-green-500 text-white",
  orange: "from-orange-600 to-amber-500 text-white",
  red: "from-red-600 to-rose-500 text-white",
  purple: "from-violet-700 to-purple-500 text-white"
};

const riskBadgeClasses: Record<string, string> = {
  Extreme: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200",
  High: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/70 dark:bg-orange-950/40 dark:text-orange-200",
  Medium: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200",
  Low: "border-green-200 bg-green-50 text-green-700 dark:border-green-900/70 dark:bg-green-950/40 dark:text-green-200"
};

const metricDotClasses: Record<NonNullable<DashboardMetricRow["tone"]>, string> = {
  green: "bg-green-600",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
  red: "bg-red-600",
  blue: "bg-blue-600",
  slate: "bg-slate-400"
};

function SectionTitle({ number, title, info = false }: { number: number; title: string; info?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <CardTitle className="truncate text-base">
        {number}. {title}
      </CardTitle>
      {info ? <Info className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" /> : null}
    </div>
  );
}

function CardLink({ children }: { children: string }) {
  return (
    <Button variant="link" className="h-auto gap-1 p-0 text-xs font-bold">
      {children}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Button>
  );
}

function KpiCard({ item }: { item: RevisedDashboardKpi }) {
  const Icon = kpiIcons[item.icon];

  if (item.circularProgress) {
    return (
      <Card className="min-h-[104px]">
        <CardContent className="flex h-full items-center gap-3 p-3.5">
          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full"
            style={{ background: `conic-gradient(#16a34a ${item.circularProgress * 3.6}deg, #e2e8f0 0deg)` }}
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-bold text-slate-950 dark:bg-slate-900 dark:text-slate-100">
              {item.value}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-4 text-slate-500">{item.title}</p>
            <p className="mt-1 text-sm font-bold text-green-600">{item.status}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-h-[104px]">
      <CardContent className="flex h-full items-center gap-3 p-3.5">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-sm", toneClasses[item.tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-500">{item.title}</p>
          <p className="mt-1 text-2xl font-bold leading-8 text-slate-950">{item.value}</p>
          {item.trend ? <p className={cn("text-xs font-semibold", item.trend.startsWith("-") ? "text-red-600" : "text-green-600")}>{item.trend}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function riskLevel(score: number): RiskLevel {
  if (score >= 17) return "Extreme";
  if (score >= 10) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

function riskCellClass(level: RiskLevel) {
  return {
    Low: "bg-gradient-to-br from-emerald-500 to-green-400",
    Medium: "bg-gradient-to-br from-yellow-400 to-amber-500",
    High: "bg-gradient-to-br from-orange-500 to-orange-600",
    Extreme: "bg-gradient-to-br from-red-500 to-red-700"
  }[level];
}

function RiskMatrixSnapshot() {
  const markerMap = new Map(RISK_MATRIX_MARKERS.map((marker) => [`${marker.likelihood}-${marker.consequence}`, marker]));
  const reversedConsequence = [...CONSEQUENCE_AXIS].reverse();

  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-sm font-bold text-slate-950">Risk Matrix Snapshot</h3>
      <div className="mx-auto max-w-[430px] min-w-0" role="img" aria-label="Compact 5 by 5 RBI risk matrix">
        <div className="mb-1 ml-[58px] grid grid-cols-5 gap-1">
          {LIKELIHOOD_AXIS.map((axis) => (
            <div key={axis.value} className="min-w-0 text-center text-[8px] font-medium leading-3 text-slate-500 sm:text-[9px]">
              <span className="block text-[11px] font-bold text-slate-700">{axis.value}</span>
              <span className="block truncate">{axis.label}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[56px_repeat(5,minmax(0,1fr))] gap-px overflow-hidden rounded-md border border-white bg-white shadow-sm">
          {reversedConsequence.map((consequence) => (
            <div key={consequence.value} className="contents">
              <div className="flex min-h-11 items-center justify-end bg-white pr-1.5 text-right text-[8px] font-medium leading-3 text-slate-500 dark:bg-slate-900">
                <span>
                  <span className="block text-[11px] font-bold text-slate-700">{consequence.value}</span>
                  {consequence.label}
                </span>
              </div>
              {LIKELIHOOD_AXIS.map((likelihood) => {
                const score = consequence.value * likelihood.value;
                const level = riskLevel(score);
                const marker = markerMap.get(`${likelihood.value}-${consequence.value}`);

                return (
                  <div key={`${likelihood.value}-${consequence.value}`} className={cn("relative flex aspect-square min-h-11 items-center justify-center text-white", riskCellClass(level))}>
                    {marker ? (
                      <div className="flex h-8 min-w-8 items-center justify-center rounded-full border border-white/80 bg-white/15 px-1 text-xs font-bold shadow-sm backdrop-blur">
                        {marker.value}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-[56px_1fr] text-[10px] font-bold text-slate-500">
          <span className="text-right">Consequence</span>
          <span className="text-center">Likelihood</span>
        </div>
      </div>
    </div>
  );
}

function MetricsList({ title, rows }: { title: string; rows: DashboardMetricRow[] }) {
  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-sm font-bold text-slate-950">{title}</h3>
      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
        <div className="space-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-2 last:border-0 last:pb-0 dark:border-slate-800">
              <div className="flex min-w-0 items-center gap-2">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", metricDotClasses[row.tone ?? "slate"])} />
                <span className="truncate text-xs font-medium text-slate-600">{row.label}</span>
              </div>
              <span className="text-xs font-bold text-slate-950">{typeof row.value === "number" ? row.value.toLocaleString("en-US") : row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutPanel({ dataset, height = 184 }: { dataset: DonutChartDataset; height?: number }) {
  const [primary, ...secondary] = dataset.centerLabel.split(" ");

  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-sm font-bold text-slate-950">{dataset.title}</h3>
      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(150px,0.8fr)_minmax(0,1fr)] xl:grid-cols-1 2xl:grid-cols-[minmax(150px,0.8fr)_minmax(0,1fr)]">
        <div className="relative min-w-0" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie data={dataset.data} dataKey="value" innerRadius="58%" outerRadius="82%" paddingAngle={2} isAnimationActive={false}>
                {dataset.data.map((item) => (
                  <Cell key={item.name} fill={item.color} stroke="var(--chart-stroke, #fff)" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-xl font-bold leading-6 text-slate-950">{primary}</p>
              {secondary.length ? <p className="text-xs font-semibold text-slate-500">{secondary.join(" ")}</p> : null}
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col justify-center space-y-2">
          {dataset.data.map((item) => (
            <div key={item.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-xs">
              <span className="flex min-w-0 items-center gap-2 text-slate-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </span>
              <span className="text-right font-bold text-slate-950">
                {item.value}
                {item.percentage ? <span className="ml-1 font-medium text-slate-500">({item.percentage})</span> : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskOverview() {
  return (
    <Card className="2xl:col-span-7">
      <CardHeader className="pb-3">
        <SectionTitle number={1} title="Risk Overview" info />
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(320px,1.15fr)_minmax(170px,0.55fr)_minmax(260px,0.9fr)]">
          <RiskMatrixSnapshot />
          <MetricsList title="Risk Categories" rows={REVISED_RISK_CATEGORIES} />
          <DonutPanel dataset={REVISED_RISK_DISTRIBUTION} height={190} />
        </div>
        <div className="mt-4 flex justify-end">
          <CardLink>View Full Risk Register</CardLink>
        </div>
      </CardContent>
    </Card>
  );
}

function CriticalAssetsTable({ assets = TOP_CRITICAL_ASSETS }: { assets?: typeof TOP_CRITICAL_ASSETS }) {
  return (
    <Card className="2xl:col-span-5">
      <CardHeader className="flex-row items-center justify-between gap-3 pb-3">
        <SectionTitle number={2} title="Top 10 Critical Assets" />
        <Button variant="link" className="h-auto shrink-0 p-0 text-xs font-bold">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 dark:bg-slate-950/50">
              <tr>
                {["No.", "Tag Number", "Equipment Name", "Type", "Unit", "Risk Level", "Next Inspection Due"].map((heading) => (
                  <th key={heading} className="border-b border-slate-200 px-3 py-2 font-bold dark:border-slate-800">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={asset.tagNumber} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-3 py-2 text-slate-500">{index + 1}</td>
                  <td className="px-3 py-2 font-bold text-blue-700 dark:text-blue-300">{asset.tagNumber}</td>
                  <td className="px-3 py-2 font-medium text-slate-700">{asset.equipmentName}</td>
                  <td className="px-3 py-2 text-slate-600">{asset.type}</td>
                  <td className="px-3 py-2 text-slate-600">{asset.unit}</td>
                  <td className="px-3 py-2"><span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-bold", riskBadgeClasses[asset.riskLevel])}>{asset.riskLevel}</span></td>
                  <td className={cn("px-3 py-2 font-bold", asset.riskLevel === "Extreme" || asset.riskLevel === "High" ? "text-red-600" : "text-slate-700")}>{asset.nextInspectionDue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex justify-end">
          <CardLink>Go to Asset Registry</CardLink>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniInspectionTable({ title, rows, dateLabel, danger = false }: { title: string; rows: SimpleInspectionRow[]; dateLabel: string; danger?: boolean }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-950">{title}</h3>
        <Button variant="link" className="h-auto p-0 text-xs">View All</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-xs">
          <thead className="text-[11px] text-slate-500">
            <tr>
              <th className="py-2 pr-2">Tag Number</th>
              <th className="py-2 pr-2">Equipment</th>
              <th className="py-2 text-right">{dateLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.tagNumber}-${row.equipment}`} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-2 pr-2 font-bold text-blue-700 dark:text-blue-300">{row.tagNumber}</td>
                <td className="py-2 pr-2 text-slate-600">{row.equipment}</td>
                <td className={cn("py-2 text-right font-bold", danger ? "text-red-600" : "text-slate-700")}>{row.dueDate ?? row.overdueSince}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InspectionTrendChart() {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <h3 className="mb-2 text-sm font-bold text-slate-950">Inspection Completion Trend</h3>
      <div className="h-[220px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={INSPECTION_COMPLETION_TREND} margin={{ left: -18, right: 4, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={0} />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 100]} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="completed" name="Completed" fill="#2563eb" radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="completion" name="Completion %" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function InspectionOverview() {
  return (
    <Card className="2xl:col-span-8">
      <CardHeader className="pb-3">
        <SectionTitle number={3} title="Inspection Overview" info />
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-3 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(280px,1.3fr)_minmax(220px,0.8fr)]">
          <MiniInspectionTable title="Upcoming Inspections" rows={UPCOMING_INSPECTIONS} dateLabel="Due Date" />
          <MiniInspectionTable title="Overdue Inspections" rows={OVERDUE_INSPECTION_OVERVIEW} dateLabel="Overdue Since" danger />
          <InspectionTrendChart />
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <DonutPanel dataset={INSPECTION_STATUS_SUMMARY} height={190} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <CardLink>Go to Inspection Management</CardLink>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertList({ alerts }: { alerts: RecentAlert[] }) {
  const alertTone = {
    critical: "text-red-600",
    warning: "text-orange-500",
    info: "text-blue-600"
  };

  return (
    <div className="min-w-0 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-950">Recent Alerts</h3>
        <Button variant="link" className="h-auto p-0 text-xs">View All</Button>
      </div>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={`${alert.title}-${alert.time}`} className="grid grid-cols-[20px_minmax(0,1fr)_auto] gap-2 rounded-md border border-slate-100 p-2 dark:border-slate-800">
            <AlertTriangle className={cn("mt-0.5 h-4 w-4", alertTone[alert.severity])} aria-hidden="true" />
            <div className="min-w-0">
              <p className={cn("text-xs font-bold", alertTone[alert.severity])}>{alert.title}</p>
              <p className="mt-1 text-xs leading-4 text-slate-600">{alert.asset.replace("Asset: ", "")}</p>
            </div>
            <span className="text-right text-[11px] leading-4 text-slate-500">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationAnomalyStatus() {
  return (
    <Card className="2xl:col-span-4">
      <CardHeader className="pb-3">
        <SectionTitle number={4} title="Recommendations & Anomaly Status" info />
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-3 lg:grid-cols-2 2xl:grid-cols-1">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <DonutPanel dataset={RECOMMENDATION_STATUS_REVISED} height={190} />
          </div>
          <AlertList alerts={RECENT_ALERTS} />
        </div>
        <div className="mt-4 flex justify-end">
          <CardLink>View All Recommendations</CardLink>
        </div>
      </CardContent>
    </Card>
  );
}

function ComplianceOverview() {
  return (
    <Card className="2xl:col-span-6">
      <CardHeader className="pb-3">
        <SectionTitle number={5} title="Compliance Overview" />
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <DonutPanel dataset={PLO_PLF_STATUS} height={170} />
            <div className="mt-2"><CardLink>View PLO / PLF Details</CardLink></div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <DonutPanel dataset={CERTIFICATION_STATUS_REVISED} height={170} />
            <div className="mt-2"><CardLink>View Certifications</CardLink></div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <MetricsList title="Regulatory Gap Summary" rows={REGULATORY_GAP_SUMMARY} />
            <div className="mt-3"><CardLink>View Regulatory Matrix</CardLink></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentWorkflowSection() {
  return (
    <Card className="2xl:col-span-6">
      <CardHeader className="pb-3">
        <SectionTitle number={6} title="Document Spotlight & Workflow Approval" />
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.25fr)]">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-200">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-5 text-slate-950">{DOCUMENT_SPOTLIGHT.fileName}</p>
                <Badge variant="green" className="mt-2">{DOCUMENT_SPOTLIGHT.status}</Badge>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {[
                ["Version", DOCUMENT_SPOTLIGHT.version],
                ["Size", DOCUMENT_SPOTLIGHT.size],
                ["Date", DOCUMENT_SPOTLIGHT.date],
                ["Owner", DOCUMENT_SPOTLIGHT.owner],
                ["Expiry Date", DOCUMENT_SPOTLIGHT.expiryDate]
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="truncate font-bold text-slate-950">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1">Preview Document</Button>
              <Button variant="outline" size="icon" aria-label="Download document">
                <Download className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-950">Workflow & Approval</h3>
            <div className="relative mt-4 grid grid-cols-4 gap-2">
              <div className="absolute left-[12.5%] right-[12.5%] top-4 h-px bg-slate-200 dark:bg-slate-700" />
              {WORKFLOW_APPROVAL.steps.map((step, index) => (
                <div key={step.label} className="relative z-10 flex flex-col items-center text-center">
                  <div className={cn("grid h-8 w-8 place-items-center rounded-full border bg-white text-xs font-bold dark:bg-slate-900", step.status === "completed" ? "border-green-500 text-green-600" : "border-slate-300 text-slate-500")}>
                    {step.status === "completed" ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : index + 1}
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-950">{step.label}</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">{step.label === "Prepared" ? "03 May 2025 | Rizky P." : step.label === "Reviewed" ? "05 May 2025 | Arief W." : step.label === "Approved" ? "08 May 2025 | Dewi L." : "pending"}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
              <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-950">Dewi Lestari</p>
                    <p className="text-xs text-slate-500">Integrity Manager</p>
                  </div>
                  <Badge variant="green">Approved</Badge>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-600">Date: 08 May 2025 14:22</p>
                <p className="text-xs leading-5 text-slate-600">Comment: Approved. Please proceed with implementation.</p>
              </div>
              <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-950">Audit Trail Latest</h4>
                <div className="mt-3 space-y-2 text-[11px] leading-4 text-slate-600">
                  <p><span className="font-bold text-slate-950">Dewi Lestari</span> approved the document</p>
                  <p><span className="font-bold text-slate-950">Arief Wibowo</span> reviewed the document</p>
                  <p><span className="font-bold text-slate-950">Rizky Pratama</span> uploaded the document</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionList({ title, items }: { title: string; items: ActionPriorityItem[] }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-950">{title}</h3>
        <Button variant="link" className="h-auto p-0 text-xs">View All</Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={`${item.type}-${item.title}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-slate-100 p-2 dark:border-slate-800">
            <span className={cn("rounded px-2 py-1 text-[11px] font-bold", item.tone === "red" ? "bg-red-600 text-white" : item.tone === "orange" ? "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-200" : item.tone === "green" ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-200" : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200")}>{item.type}</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-950">{item.title}</p>
              <p className="text-[11px] text-slate-500">{item.meta}</p>
            </div>
            <span className={cn("rounded-md border px-2 py-1 text-[11px] font-bold", item.status === "Overdue" ? riskBadgeClasses.Extreme : item.status === "Due Soon" || item.status === "Under Review" ? riskBadgeClasses.Medium : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-200")}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionPriority() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <SectionTitle number={7} title="Action Priority" />
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-3 lg:grid-cols-3">
          <ActionList title="Pending Approvals" items={PENDING_APPROVALS} />
          <ActionList title="Required Owner Actions" items={REQUIRED_OWNER_ACTIONS} />
          <ActionList title="High Priority Mitigation" items={HIGH_PRIORITY_MITIGATION} />
        </div>
      </CardContent>
    </Card>
  );
}

export function RevisedDashboard() {
  const { assets, assessments, dataSource, syncMessage } = useRbiData();
  const staleAssessment = assessments.find((assessment) => assessment.calculationTrace?.recalculationRequired);
  const dynamicKpis = REVISED_DASHBOARD_KPIS.map((item) => {
    const highRisk = assets.filter((asset) => ["High", "Very High", "Extreme"].includes(asset.currentRiskLevel)).length;
    const overdue = assets.filter((asset) => asset.nextInspectionDue.includes("May 2025")).length;
    const openRecommendations = assessments.reduce((sum, assessment) => sum + assessment.mitigationActions.filter((action) => action.status !== "Completed").length, 0);
    const expiringCertifications = assets.filter((asset) => asset.certificationStatus === "Expiring Soon").length;
    const completeness = Math.round(assets.reduce((sum, asset) => sum + asset.reliabilityDataReadiness, 0) / Math.max(1, assets.length));
    if (item.title === "Total Assets") return { ...item, value: assets.length.toLocaleString("en-US"), trend: "Backend portfolio" };
    if (item.title === "High Risk Assets") return { ...item, value: highRisk.toLocaleString("en-US"), trend: "From synchronized risk levels" };
    if (item.title === "Overdue Inspections") return { ...item, value: overdue.toLocaleString("en-US"), trend: "From registry inspection due dates" };
    if (item.title === "Open Recommendations") return { ...item, value: openRecommendations.toLocaleString("en-US"), trend: "From RBI mitigation actions" };
    if (item.title === "Expiring Certifications") return { ...item, value: expiringCertifications.toLocaleString("en-US"), trend: "From registry certification status" };
    if (item.title === "Data Completeness Score") return { ...item, value: `${completeness}%`, status: completeness >= 85 ? "Good" : completeness >= 70 ? "Fair" : "Needs Review" };
    return item;
  });
  const criticalAssets = assets
    .slice()
    .sort((a, b) => {
      const order = { Extreme: 5, "Very High": 4, High: 3, Medium: 2, Low: 1 } as const;
      return order[b.currentRiskLevel] - order[a.currentRiskLevel];
    })
    .slice(0, 10)
    .map((asset) => ({
      tagNumber: asset.tagNumber,
      equipmentName: asset.assetName,
      type: asset.equipmentType,
      unit: asset.unit,
      riskLevel: asset.currentRiskLevel === "Very High" ? "High" : asset.currentRiskLevel === "Low" ? "Medium" : asset.currentRiskLevel,
      nextInspectionDue: asset.nextInspectionDue
    })) as typeof TOP_CRITICAL_ASSETS;

  return (
    <div className="min-w-0 space-y-3 overflow-hidden pb-5">
      <section className="flex min-w-0 flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-950">{DASHBOARD_PAGE_META.title}</h1>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-slate-600">
            <span>Site: {DASHBOARD_PAGE_META.site}</span>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <span>Last Data Update: {DASHBOARD_PAGE_META.lastDataUpdate}</span>
          </p>
        </div>
        <Button variant="outline" size="icon" aria-label="Refresh dashboard data">
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
        </Button>
      </section>

      <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Badge className={dataSource === "backend" ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200"}>
          {dataSource === "backend" ? "Backend synchronized" : "Prototype fallback"}
        </Badge>
        <span className="text-slate-500 dark:text-slate-400">{syncMessage}</span>
        {staleAssessment ? <RecalculationRequiredBadge trace={staleAssessment.calculationTrace} /> : null}
      </div>

      <section aria-label="Dashboard KPI cards" className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {dynamicKpis.map((item) => (
          <KpiCard key={item.title} item={item} />
        ))}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-3 2xl:grid-cols-12">
        <RiskOverview />
        <CriticalAssetsTable assets={criticalAssets} />
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-3 2xl:grid-cols-12">
        <InspectionOverview />
        <RecommendationAnomalyStatus />
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-3 2xl:grid-cols-12">
        <ComplianceOverview />
        <DocumentWorkflowSection />
      </section>

      <ActionPriority />
    </div>
  );
}
