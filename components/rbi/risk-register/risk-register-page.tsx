"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Columns3,
  CopyCheck,
  Download,
  Eye,
  Files,
  Grid2X2,
  List,
  MoreVertical,
  Plus,
  Settings
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecalculationRequiredBadge } from "@/components/rbi/recalculation-required-badge";
import {
  RISK_REGISTER_FILTERS,
  RISK_REGISTER_QUICK_LINKS,
  type ActionStatus,
  type AssessmentStatus,
  type DataQualityItem,
  type RegisterSummaryItem,
  type RiskDistributionItem,
  type RiskLevel,
  type RiskRegisterAssessment,
  type RiskRegisterFilterId,
  type RiskTargetStatus
} from "@/lib/risk-register-data";
import { useRbiData } from "@/lib/rbi-store";
import { calculateInspectionDueStatus } from "@/lib/rbi/rbi-calculations";
import { navigateToAppRoute } from "@/lib/static-navigation";
import { cn } from "@/lib/utils";

function ActionMessage({ message }: { message: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed right-4 top-[calc(var(--app-header-height)+1rem)] z-50 max-w-[calc(100vw-2rem)] rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 shadow-lg transition dark:border-blue-500/30 dark:bg-blue-950/80 dark:text-blue-100",
        message ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      )}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

function usePrototypeMessage() {
  const [message, setMessage] = useState("");

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(""), 2600);
  }

  return { message, showMessage };
}

function PageHeader({ onAction }: { onAction: (message: string) => void }) {
  const router = useRouter();
  const actions = [
    {
      label: "New Risk Assessment",
      icon: Plus,
      variant: "default" as const,
      onClick: () => navigateToAppRoute(router, "/risk-based-inspection/risk-assessment-workspace")
    },
    {
      label: "Export Risk Register",
      icon: Download,
      variant: "outline" as const,
      onClick: () => onAction("Export started in prototype mode.")
    },
    {
      label: "Compare Assessment",
      icon: CopyCheck,
      variant: "outline" as const,
      onClick: () => onAction("Compare Assessment is prepared for future development.")
    },
    {
      label: "Bulk Update",
      icon: Files,
      variant: "outline" as const,
      onClick: () => onAction("Bulk Update is prepared for future development.")
    }
  ];

  return (
    <header className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        <PageBreadcrumb
          items={[
            { label: "Risk-Based Inspection", href: "/risk-based-inspection/rbi-information" },
            { label: "Risk Register" }
          ]}
        />
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Risk-Based Inspection</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-3xl">Risk Register</h1>
      </div>
      <div className="flex min-w-0 flex-wrap gap-2 xl:justify-end">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              type="button"
              variant={action.variant}
              className={cn("min-w-0", action.variant === "default" ? "shadow-sm" : "")}
              onClick={action.onClick}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </header>
  );
}

function RiskRegisterFilters({ onAction }: { onAction: (message: string) => void }) {
  const defaults = useMemo(
    () => Object.fromEntries(RISK_REGISTER_FILTERS.map((filter) => [filter.id, filter.defaultValue])) as Record<RiskRegisterFilterId, string>,
    []
  );
  const [values, setValues] = useState<Record<RiskRegisterFilterId, string>>(defaults);
  const [expanded, setExpanded] = useState(true);

  function clearFilters() {
    setValues(defaults);
  }

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-950 dark:text-slate-100">Advanced Filters</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Filter assessments by asset, risk criteria, lifecycle status, and review ownership.</p>
        </div>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-500 transition-transform dark:text-slate-400", expanded ? "rotate-0" : "-rotate-90")} aria-hidden="true" />
      </button>
      {expanded ? (
        <div className="border-t border-slate-100 px-4 pb-4 pt-4 dark:border-slate-800">
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            {RISK_REGISTER_FILTERS.map((filter) => (
              <div key={filter.id} className="min-w-0">
                <label htmlFor={`risk-register-${filter.id}`} className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {filter.label}
                </label>
                <select
                  id={`risk-register-${filter.id}`}
                  className="mt-1 h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={values[filter.id]}
                  onChange={(event) => setValues((current) => ({ ...current, [filter.id]: event.target.value }))}
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button type="button" onClick={() => onAction("Filters applied in prototype mode.")}>
              Apply Filters
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function categoryBadgeClass(category: number) {
  if (category >= 4) return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
  if (category === 3) return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/35 dark:text-orange-200";
  return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200";
}

function riskLevelClass(level: RiskLevel) {
  if (level === "Extreme") return "border-red-300 bg-red-700 text-white dark:border-red-500/60 dark:bg-red-800 dark:text-white";
  if (level === "Very High") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200";
  if (level === "High") return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/70 dark:bg-orange-950/35 dark:text-orange-200";
  if (level === "Medium") return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/70 dark:bg-yellow-950/30 dark:text-yellow-200";
  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/70 dark:bg-green-950/30 dark:text-green-200";
}

function targetStatusClass(status: RiskTargetStatus) {
  if (status === "Exceeded") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
  if (status === "Approaching") return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/35 dark:text-orange-200";
  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-200";
}

function actionStatusClass(status: ActionStatus) {
  if (status === "Immediate Action") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
  if (status === "Mitigation Planned") return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/35 dark:text-orange-200";
  if (status === "Monitoring Planned") return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/35 dark:text-violet-200";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
}

function assessmentStatusClass(status: AssessmentStatus) {
  if (status === "Approved") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-200";
  if (status === "Under Review") return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/35 dark:text-orange-200";
  if (status === "In Progress") return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/35 dark:text-cyan-200";
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

function RiskTargetBadge({ status }: { status: RiskTargetStatus }) {
  const Icon = status === "Acceptable" ? CheckCircle2 : AlertTriangle;

  return (
    <Badge className={cn("gap-1", targetStatusClass(status))}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {status}
    </Badge>
  );
}

function DateWithOverdue({ date, overdue }: { date: string; overdue: boolean }) {
  return (
    <div className="space-y-1">
      <span className="whitespace-nowrap font-semibold text-slate-800 dark:text-slate-100">{date}</span>
      {overdue ? (
        <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200">Overdue</Badge>
      ) : null}
    </div>
  );
}

function RiskRegisterTable({
  assessments,
  onAction,
  onRecalculate
}: {
  assessments: RiskRegisterAssessment[];
  onAction: (message: string) => void;
  onRecalculate: (assessmentId: string) => void;
}) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Showing 1 to {assessments.length} of {assessments.length} assessments</p>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <select
            aria-label="Rows per page"
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            defaultValue="20"
          >
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
          </select>
          <div className="flex rounded-md border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900" aria-label="View mode">
            <button
              type="button"
              className={cn("flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800", viewMode === "list" && "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200")}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={cn("flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800", viewMode === "grid" && "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200")}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid2X2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => onAction("Column configuration is prepared for future development.")}>
            <Settings className="h-4 w-4" aria-hidden="true" />
            Columns
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="min-w-[2380px] border-collapse text-left text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
            <tr>
              {[
                "Assessment ID",
                "Tag Number",
                "Equipment / Component",
                "Equipment Type",
                "Governing Damage Mechanism",
                "PoF Category",
                "CoF Category",
                "Numeric Risk Value (failure/yr x ft²)",
                "Risk Basis",
                "Risk Level",
                "Risk Target Status",
                "Residual Risk (failure/yr x ft²)",
                "Recommended Inspection Date",
                "Revalidation Due Date",
                "Data Confidence",
                "Assessment Status",
                "Action"
              ].map((column) => (
                <th key={column} scope="col" className="border-b border-slate-100 px-3 py-3 font-bold dark:border-slate-800">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assessments.map((assessment) => (
              <tr key={assessment.assessmentId} className="bg-white align-top transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70">
                <td className="px-3 py-3 font-bold text-blue-700 dark:text-blue-300">{assessment.assessmentId}</td>
                <td className="px-3 py-3 font-bold text-slate-950 dark:text-slate-100">{assessment.tagNumber}</td>
                <td className="max-w-[220px] px-3 py-3 font-semibold text-slate-800 dark:text-slate-100">{assessment.equipmentComponent}</td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{assessment.equipmentType}</td>
                <td className="max-w-[230px] px-3 py-3 text-slate-600 dark:text-slate-300">{assessment.governingDamageMechanism}</td>
                <td className="px-3 py-3">
                  <Badge className={cn("min-w-7 justify-center rounded", categoryBadgeClass(assessment.pofCategory))}>{assessment.pofCategory}</Badge>
                </td>
                <td className="px-3 py-3">
                  <Badge className={cn("min-w-7 justify-center rounded", categoryBadgeClass(assessment.cofCategory))}>{assessment.cofCategory}</Badge>
                </td>
                <td className="px-3 py-3 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-200">{assessment.numericRiskValue}</td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{assessment.riskBasis}</td>
                <td className="px-3 py-3">
                  <Badge className={riskLevelClass(assessment.riskLevel)}>{assessment.riskLevel}</Badge>
                </td>
                <td className="px-3 py-3">
                  <RiskTargetBadge status={assessment.riskTargetStatus} />
                </td>
                <td className="px-3 py-3 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-200">{assessment.residualRisk}</td>
                <td className="px-3 py-3">
                  <DateWithOverdue date={assessment.recommendedInspectionDate} overdue={assessment.recommendedInspectionOverdue} />
                </td>
                <td className="px-3 py-3">
                  <DateWithOverdue date={assessment.revalidationDueDate} overdue={assessment.revalidationOverdue} />
                </td>
                <td className="px-3 py-3">
                  <Badge className={actionStatusClass(assessment.dataConfidence)}>{assessment.dataConfidence}</Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-1">
                    <Badge className={assessmentStatusClass(assessment.assessmentStatus)}>{assessment.assessmentStatus}</Badge>
                    <RecalculationRequiredBadge trace={assessment.calculationTrace} />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    {assessment.calculationTrace?.recalculationRequired ? (
                      <button
                        type="button"
                        onClick={() => onRecalculate(assessment.assessmentId)}
                        className="h-8 rounded border border-amber-200 px-2 text-[11px] font-black text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-950/35"
                      >
                        Recalculate
                      </button>
                    ) : null}
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={`View ${assessment.assessmentId}`}>
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={`More actions for ${assessment.assessmentId}`}>
                      <MoreVertical className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 border-t border-slate-100 px-4 py-4 dark:border-slate-800">
        <div className="grid min-w-0 gap-3 xl:grid-cols-2">
          <LegendGroup title="Risk Level" items={["Low", "Medium", "High", "Very High", "Extreme"]} type="risk" />
          <LegendGroup title="Risk Target Status" items={["Acceptable", "Approaching", "Exceeded"]} type="target" />
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">1 - {assessments.length} of {assessments.length}</p>
          <div className="flex flex-wrap items-center gap-1">
            <PaginationButton label="First page" icon={ChevronFirst} />
            <PaginationButton label="Previous page" icon={ChevronLeft} />
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                className={cn("h-9 min-w-9 rounded-md border px-3 text-sm font-bold", page === 1 ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800")}
              >
                {page}
              </button>
            ))}
            <span className="px-2 text-sm font-bold text-slate-500 dark:text-slate-400">...</span>
            <button type="button" className="h-9 min-w-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">8</button>
            <PaginationButton label="Next page" icon={ChevronRight} />
            <PaginationButton label="Last page" icon={ChevronLast} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function PaginationButton({ label, icon: Icon }: { label: string; icon: typeof ChevronLeft }) {
  return (
    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={label}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function LegendGroup({ title, items, type }: { title: string; items: string[]; type: "risk" | "target" }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/45">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} className={type === "risk" ? riskLevelClass(item as RiskLevel) : targetStatusClass(item as RiskTargetStatus)}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function RegisterSummaryCard({ items }: { items: RegisterSummaryItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">Register Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <SummaryRow key={item.label} item={item} />
        ))}
        <CardLink>View All Summary</CardLink>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ item }: { item: RegisterSummaryItem }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/45">
      <span className="min-w-0 text-sm font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
      <span
        className={cn(
          "shrink-0 text-sm font-bold text-slate-950 dark:text-slate-100",
          item.tone === "red" && "text-red-600 dark:text-red-300",
          item.tone === "orange" && "text-orange-600 dark:text-orange-300"
        )}
      >
        {item.value}
      </span>
    </div>
  );
}

function DonutCard({
  title,
  centerTop,
  centerBottom,
  data,
  link
}: {
  title: string;
  centerTop: string;
  centerBottom: string;
  data: Array<RiskDistributionItem | DataQualityItem>;
  link: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-3 sm:grid-cols-[160px_minmax(0,1fr)] 2xl:grid-cols-1 min-[1760px]:grid-cols-[160px_minmax(0,1fr)]">
          <div className="relative h-44 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius="62%" outerRadius="86%" paddingAngle={2} stroke="none">
                  {data.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} assets`, "Assets"]}
                  contentStyle={{ borderRadius: 8, borderColor: "rgba(148, 163, 184, 0.35)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-slate-950 dark:text-slate-100">{centerTop}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{centerBottom}</span>
            </div>
          </div>
          <div className="min-w-0 space-y-2">
            {data.map((item) => (
              <div key={item.label} className="flex min-w-0 items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="shrink-0 font-bold text-slate-950 dark:text-slate-100">
                  {item.value.toLocaleString()} <span className="font-semibold text-slate-500 dark:text-slate-400">({item.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <CardLink>{link}</CardLink>
      </CardContent>
    </Card>
  );
}

function CardLink({ children }: { children: string }) {
  return (
    <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function QuickLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base dark:text-slate-100">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {RISK_REGISTER_QUICK_LINKS.map((link) => {
          const Icon = link.icon;

          return (
            <button
              key={link.label}
              type="button"
              className="flex w-full min-w-0 items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:bg-blue-950/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-bold text-slate-700 dark:text-slate-200">{link.label}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function RiskRegisterPage() {
  const { message, showMessage } = usePrototypeMessage();
  const { assessments: storeAssessments, assets, registerSummary, riskDistribution, recalculateAssessmentById } = useRbiData();
  const assessments: RiskRegisterAssessment[] = storeAssessments.map((assessment) => {
    const asset = assets.find((item) => item.id === assessment.assetId);
    return {
      assessmentId: assessment.assessmentId,
      tagNumber: asset?.tagNumber ?? assessment.assetId,
      equipmentComponent: `${asset?.assetName ?? assessment.assetId} (${assessment.selectedDamageMechanisms[0]?.name ?? "Governing Component"})`,
      equipmentType: asset?.equipmentType ?? "Equipment",
      governingDamageMechanism: assessment.selectedDamageMechanisms[0]?.name ?? "Not screened",
      pofCategory: assessment.pof.category,
      cofCategory: assessment.cof.category,
      numericRiskValue: assessment.riskDetermination.numericRiskValue,
      riskBasis: assessment.riskTarget.basis,
      riskLevel: assessment.riskDetermination.level,
      riskTargetStatus: assessment.riskDetermination.targetStatus,
      residualRisk: assessment.riskDetermination.residualRisk,
      recommendedInspectionDate: assessment.recommendation.inspectionDate,
      recommendedInspectionOverdue: calculateInspectionDueStatus(assessment.recommendation.inspectionDate) === "Overdue",
      revalidationDueDate: assessment.revalidationDueDate,
      revalidationOverdue: calculateInspectionDueStatus(assessment.revalidationDueDate) === "Overdue",
      dataConfidence: assessment.dataConfidence,
      assessmentStatus: assessment.assessmentStatus,
      calculationTrace: assessment.calculationTrace ?? asset?.calculationTrace
    };
  });
  const summaryItems: RegisterSummaryItem[] = [
    { label: "Total Assessments", value: registerSummary.totalAssessments.toLocaleString("en-US") },
    { label: "Target Exceeded", value: registerSummary.targetExceeded.toLocaleString("en-US"), tone: "red" },
    { label: "Overdue Inspection", value: registerSummary.overdueInspection.toLocaleString("en-US"), tone: "red" },
    { label: "Revalidation Due", value: registerSummary.revalidationDue.toLocaleString("en-US"), tone: "orange" },
    { label: "Open Mitigation Actions", value: registerSummary.openMitigationActions.toLocaleString("en-US"), tone: "orange" },
    { label: "Low Data Confidence (<70%)", value: registerSummary.lowDataConfidence.toLocaleString("en-US"), tone: "red" }
  ];
  const dataQualityDistribution = [
    { label: "High (85-100%)", value: assets.filter((asset) => asset.dataQualityProfile.completeness >= 85).length, color: "#16a34a" },
    { label: "Medium (70-84%)", value: assets.filter((asset) => asset.dataQualityProfile.completeness >= 70 && asset.dataQualityProfile.completeness < 85).length, color: "#f59e0b" },
    { label: "Low (<70%)", value: assets.filter((asset) => asset.dataQualityProfile.completeness < 70).length, color: "#ef4444" }
  ].map((item) => ({ ...item, percentage: Math.round((item.value / Math.max(1, assets.length)) * 100) }));

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 overflow-hidden">
      <ActionMessage message={message} />
      <PageHeader onAction={showMessage} />
      <RiskRegisterFilters onAction={showMessage} />

      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <RiskRegisterTable
            assessments={assessments}
            onAction={showMessage}
            onRecalculate={(assessmentId) => {
              showMessage("Recalculation started from Risk Register.");
              void recalculateAssessmentById(assessmentId).then(() => showMessage("Calculation trace refreshed."));
            }}
          />
        </div>
        <aside className="grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-1" aria-label="Risk register summary cards">
          <RegisterSummaryCard items={summaryItems} />
          <DonutCard
            title="Risk Level Distribution"
            centerTop={storeAssessments.length.toLocaleString("en-US")}
            centerBottom="Assessments"
            data={riskDistribution}
            link="View Distribution Details"
          />
          <DonutCard
            title="Data Quality Overview"
            centerTop={`${Math.round(assets.reduce((sum, asset) => sum + asset.dataQualityProfile.completeness, 0) / Math.max(1, assets.length))}%`}
            centerBottom="Average"
            data={dataQualityDistribution}
            link="View Data Quality Heatmap"
          />
          <QuickLinksCard />
        </aside>
      </div>
    </div>
  );
}
