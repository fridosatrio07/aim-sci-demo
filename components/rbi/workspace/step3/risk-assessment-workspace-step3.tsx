"use client";

import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Database,
  Eye,
  FileText,
  Gauge,
  GitBranch,
  Info,
  ListChecks,
  RotateCcw,
  ShieldAlert,
  Table2,
  TriangleAlert,
  UserCheck,
  XCircle
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ASSESSMENT_CONTEXT,
  DAMAGE_MECHANISM_SCREENING,
  DAMAGE_MECHANISM_SUMMARY,
  DATA_COMPLETENESS,
  MISSING_INFORMATION,
  MOC_IOW_TRIGGER_STATUS,
  OPERATING_FACTOR_INDICATORS,
  OVERALL_DMR_COMMENT,
  PROCESS_DRIVERS_IOW,
  SCREENING_BASIS,
  SELECTED_DAMAGE_MECHANISMS,
  SPECIALIST_REVIEW_STATUS,
  type ApplicabilityStatus,
  type IowStatus,
  type LevelStatus
} from "@/lib/risk-assessment-workspace-step3-data";
import { cn } from "@/lib/utils";

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  right
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <CardHeader className="pb-3">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-base dark:text-slate-100">{title}</CardTitle>
            {subtitle ? <p className="mt-1 text-sm font-medium leading-5 text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
          </div>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </CardHeader>
  );
}

function InlineAction({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
    >
      {children}
      <Eye className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function applicabilityClass(status: ApplicabilityStatus) {
  if (status === "Applicable") {
    return {
      icon: CheckCircle2,
      className: "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200"
    };
  }
  if (status === "Not Applicable") {
    return {
      icon: XCircle,
      className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200"
    };
  }
  if (status === "Potentially Applicable") {
    return {
      icon: AlertCircle,
      className: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200"
    };
  }
  return {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200"
  };
}

function ApplicabilityBadge({ status }: { status: ApplicabilityStatus }) {
  const style = applicabilityClass(status);
  const Icon = style.icon;

  return (
    <Badge className={cn("gap-1.5 whitespace-nowrap", style.className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status}
    </Badge>
  );
}

function levelClass(level: LevelStatus) {
  if (level === "High") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
  if (level === "Medium") return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
}

function LevelBadge({ level }: { level: LevelStatus }) {
  return <Badge className={cn("whitespace-nowrap", levelClass(level))}>{level}</Badge>;
}

function iowClass(status: IowStatus) {
  if (status === "Within Normal") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (status === "Inside IOW") return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200";
  return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
}

function IowBadge({ status, value }: { status: IowStatus; value: string }) {
  return (
    <span className="flex flex-col gap-1">
      <span className="font-bold text-slate-950 dark:text-slate-100">{value}</span>
      <Badge className={cn("w-fit whitespace-nowrap", iowClass(status))}>{status}</Badge>
    </span>
  );
}

function AssessmentContextStrip() {
  return (
    <Card>
      <div className="grid min-w-0 gap-0 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {ASSESSMENT_CONTEXT.map((field, index) => (
          <div
            key={field.label}
            className={cn(
              "min-w-0 px-4 py-3",
              index > 0 && "border-t border-slate-100 sm:border-l sm:border-t-0 dark:border-slate-800"
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{field.label}</p>
            {field.label === "Assessment Status" ? (
              <Badge className="mt-1 border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200">
                {field.value}
              </Badge>
            ) : (
              <p className="mt-1 truncate text-sm font-bold text-slate-950 dark:text-slate-100">{field.value}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function ScreeningBasisStrip({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <div className="flex min-w-0 flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
          {SCREENING_BASIS.map((field) => {
            const content = (
              <>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{field.label}</p>
                <p className="mt-1 text-sm font-bold leading-5 text-slate-950 dark:text-slate-100">{field.value}</p>
              </>
            );

            if (field.label === "Evidence Document") {
              return (
                <button
                  key={field.label}
                  type="button"
                  onClick={() => onAction("Evidence document preview is prepared for future development.")}
                  className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-left transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-800/45 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/30"
                >
                  {content}
                </button>
              );
            }

            return (
              <div key={field.label} className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/45">
                {content}
              </div>
            );
          })}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onAction("Screening guidance is prepared for future development.")}>
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Guidance
          </Button>
          <Button type="button" variant="outline" onClick={() => onAction("Screening reset is prepared for future development.")}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset Screening
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DamageMechanismScreeningCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle
        icon={ListChecks}
        title="Damage Mechanism Screening"
        subtitle="Select applicable damage mechanisms for this asset."
      />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[620px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["#", "Damage Mechanism", "Applicable", "Action"].map((column) => (
                  <th key={column} className="px-3 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DAMAGE_MECHANISM_SCREENING.map((row, index) => (
                <tr key={row.mechanism} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="w-10 px-3 py-2 font-bold text-slate-400">{index + 1}</td>
                  <td className="px-3 py-2 font-bold text-slate-950 dark:text-slate-100">{row.mechanism}</td>
                  <td className="px-3 py-2">
                    <ApplicabilityBadge status={row.status} />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onAction(`Screening action menu is prepared for ${row.mechanism}.`)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      aria-label={`Open action menu for ${row.mechanism}`}
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SelectedDamageMechanismsCard() {
  return (
    <Card>
      <SectionTitle
        icon={ShieldAlert}
        title="Selected Credible Damage Mechanisms"
        subtitle="Review details for applicable damage mechanisms."
        right={
          <Badge className="gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Based on API 571 categories
          </Badge>
        }
      />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[1180px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {[
                  "#",
                  "Damage Mechanism",
                  "Damage Mode",
                  "Failure Mode",
                  "Affected Component",
                  "Severity",
                  "Susceptibility",
                  "Damage Rate / Basis",
                  "Inspection Evidence",
                  "Comments"
                ].map((column) => (
                  <th key={column} className="px-3 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SELECTED_DAMAGE_MECHANISMS.map((row, index) => (
                <tr key={row.mechanism} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-3 font-bold text-slate-400">{index + 1}</td>
                  <td className="min-w-[150px] px-3 py-3 font-bold text-slate-950 dark:text-slate-100">{row.mechanism}</td>
                  <td className="min-w-[120px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.damageMode}</td>
                  <td className="min-w-[96px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.failureMode}</td>
                  <td className="min-w-[160px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.affectedComponent}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <LevelBadge level={row.severity} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <LevelBadge level={row.susceptibility} />
                  </td>
                  <td className="min-w-[170px] px-3 py-3 font-semibold text-blue-700 dark:text-blue-300">{row.damageRateBasis}</td>
                  <td className="min-w-[180px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.inspectionEvidence}</td>
                  <td className="min-w-[150px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-col gap-2 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <span>Severity & Susceptibility are based on API 581 methodology and process conditions.</span>
          <span className="shrink-0 text-slate-700 dark:text-slate-300">Total Records: {SELECTED_DAMAGE_MECHANISMS.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ProcessDriversIowCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle
        icon={Activity}
        title="Process Drivers and IOW Linkage"
        subtitle="Review critical process variables, operating window, and impact on damage mechanisms."
      />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[1220px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {[
                  "Process Variable",
                  "Normal Range",
                  "IOW Limit",
                  "Critical Limit",
                  "Current Value (12 May 2025)",
                  "Excursion History (Last 90 Days)",
                  "Affected Damage Mechanism",
                  "Required Action"
                ].map((column) => (
                  <th key={column} className="px-3 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PROCESS_DRIVERS_IOW.map((row) => (
                <tr key={row.processVariable} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="min-w-[155px] px-3 py-3 font-bold text-slate-950 dark:text-slate-100">{row.processVariable}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.normalRange}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.iowLimit}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.criticalLimit}</td>
                  <td className="min-w-[130px] px-3 py-3">
                    <IowBadge status={row.currentStatus} value={row.currentValue} />
                  </td>
                  <td className="min-w-[160px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.excursionHistory}</td>
                  <td className="min-w-[170px] px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">{row.affectedDamageMechanism}</td>
                  <td className="min-w-[230px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.requiredAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["Within Normal", "Inside IOW", "Beyond IOW"] as IowStatus[]).map((status) => (
              <Badge key={status} className={cn("whitespace-nowrap", iowClass(status))}>{status}</Badge>
            ))}
          </div>
          <InlineAction onClick={() => onAction("IOW trend dashboard is prepared for future development.")}>View IOW Trend Dashboard</InlineAction>
        </div>
      </CardContent>
    </Card>
  );
}

function OverallDmrCommentsCard() {
  const [comment, setComment] = useState(OVERALL_DMR_COMMENT);

  return (
    <Card>
      <SectionTitle
        icon={FileText}
        title="Overall DMR Comments"
        right={<Info className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />}
      />
      <CardContent>
        <textarea
          value={comment}
          maxLength={1000}
          onChange={(event) => setComment(event.target.value)}
          className="min-h-[118px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          aria-label="Overall DMR comments"
        />
        <p className="mt-1 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">{comment.length} / 1000</p>
      </CardContent>
    </Card>
  );
}

function DataCompletenessCard({ onAction }: { onAction: (message: string) => void }) {
  const readiness = DATA_COMPLETENESS.percentage;

  return (
    <Card>
      <SectionTitle icon={Gauge} title="Data Completeness" />
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(#16a34a ${readiness * 3.6}deg, #f59e0b ${readiness * 3.6}deg 335deg, #ef4444 335deg 360deg)` }}
            aria-label={`Data completeness ${readiness}%`}
          >
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
              <span className="text-xl font-bold text-slate-950 dark:text-slate-100">{readiness}%</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Complete</span>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            {DATA_COMPLETENESS.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
                <span className="font-bold text-slate-950 dark:text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <InlineAction onClick={() => onAction("Data completeness details are prepared for future development.")}>View Details</InlineAction>
      </CardContent>
    </Card>
  );
}

function OperatingFactorIndicatorsCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={Database} title="Operating Factor Indicators" />
      <CardContent>
        <div className="space-y-2">
          {OPERATING_FACTOR_INDICATORS.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 dark:bg-slate-800/45">
              <span className="min-w-0 text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
              <LevelBadge level={item.status} />
            </div>
          ))}
        </div>
        <InlineAction onClick={() => onAction("Operating factor indicators are prepared for future development.")}>View All Indicators</InlineAction>
      </CardContent>
    </Card>
  );
}

function MissingInformationCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex min-w-0 items-center gap-2 text-base dark:text-slate-100">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-200">
            <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">Missing / Incomplete Information</span>
          <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200">8</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {MISSING_INFORMATION.map((item) => (
            <div key={item.item} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/45">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-300" aria-hidden="true" />
              <p className="min-w-0 flex-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{item.item}</p>
              <LevelBadge level={item.priority} />
            </div>
          ))}
        </div>
        <InlineAction onClick={() => onAction("Missing information list is prepared for future development.")}>View All Missing</InlineAction>
      </CardContent>
    </Card>
  );
}

function DamageMechanismSummaryCard() {
  return (
    <Card>
      <SectionTitle icon={Table2} title="Selected Damage Mechanism Summary" />
      <CardContent>
        <div className="space-y-2">
          {DAMAGE_MECHANISM_SUMMARY.map((item) => (
            <div key={item.label} className="rounded-md bg-slate-50 px-3 py-2 dark:bg-slate-800/45">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
              <p
                className={cn(
                  "mt-1 text-sm font-bold leading-5 text-slate-950 dark:text-slate-100",
                  item.tone === "red" && "text-red-700 dark:text-red-200",
                  item.tone === "amber" && "text-yellow-800 dark:text-yellow-200",
                  item.tone === "blue" && "text-blue-700 dark:text-blue-200"
                )}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SpecialistReviewStatusCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={UserCheck} title="Corrosion Specialist Review Status" />
      <CardContent>
        <div className="flex items-start gap-3 rounded-lg border border-yellow-100 bg-yellow-50 p-3 dark:border-yellow-900/60 dark:bg-yellow-950/25">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-white">
            <UserCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/40 dark:text-yellow-200">
              {SPECIALIST_REVIEW_STATUS.reviewStatus}
            </Badge>
            <p className="mt-2 text-sm font-bold text-slate-950 dark:text-slate-100">{SPECIALIST_REVIEW_STATUS.specialist}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{SPECIALIST_REVIEW_STATUS.role}</p>
          </div>
        </div>
        <InlineAction onClick={() => onAction("Corrosion specialist review details are prepared for future development.")}>Review Details</InlineAction>
      </CardContent>
    </Card>
  );
}

function triggerValueClass(tone?: "red" | "amber" | "green") {
  if (tone === "red") return "text-red-700 dark:text-red-200";
  if (tone === "amber") return "text-yellow-800 dark:text-yellow-200";
  if (tone === "green") return "text-green-700 dark:text-green-200";
  return "text-slate-950 dark:text-slate-100";
}

function MocIowTriggerStatusCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={GitBranch} title="MOC / IOW Trigger Status" />
      <CardContent>
        <div className="space-y-2">
          {MOC_IOW_TRIGGER_STATUS.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 dark:bg-slate-800/45">
              <span className="min-w-0 text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
              <span className={cn("shrink-0 text-sm font-bold", triggerValueClass(item.tone))}>{item.value}</span>
            </div>
          ))}
        </div>
        <InlineAction onClick={() => onAction("MOC and IOW triggers are prepared for future development.")}>View Triggers</InlineAction>
      </CardContent>
    </Card>
  );
}

export function RiskAssessmentWorkspaceStep3({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="min-w-0 space-y-4">
      <AssessmentContextStrip />
      <ScreeningBasisStrip onAction={onAction} />

      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0 space-y-4">
          <DamageMechanismScreeningCard onAction={onAction} />
          <SelectedDamageMechanismsCard />
          <ProcessDriversIowCard onAction={onAction} />
          <OverallDmrCommentsCard />
        </main>
        <aside className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-1" aria-label="Damage mechanism review side summary">
          <DataCompletenessCard onAction={onAction} />
          <OperatingFactorIndicatorsCard onAction={onAction} />
          <MissingInformationCard onAction={onAction} />
          <DamageMechanismSummaryCard />
          <SpecialistReviewStatusCard onAction={onAction} />
          <MocIowTriggerStatusCard onAction={onAction} />
        </aside>
      </div>
    </div>
  );
}
