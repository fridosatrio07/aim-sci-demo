"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Eye,
  Factory,
  FileText,
  Gauge,
  Info,
  Layers3,
  ShieldAlert,
  Table2,
  Target,
  TriangleAlert
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ASSET_SUMMARY,
  COMPONENT_BREAKDOWN,
  DATA_COMPLETENESS,
  DATA_QUALITY_INDICATORS,
  DATA_SOURCE_MAP,
  MISSING_INFORMATION,
  REQUIRED_API_581_DATA,
  SNAPSHOT_CARDS,
  TECHNICAL_ASSUMPTIONS,
  type DataQualityIndicator,
  type MissingInformationItem,
  type SnapshotCardData
} from "@/lib/risk-assessment-workspace-step2-data";
import { useRbiData } from "@/lib/rbi-store";
import { cn } from "@/lib/utils";

function SectionTitle({ icon: Icon, title, badge }: { icon: LucideIcon; title: string; badge?: string }) {
  return (
    <CardHeader className="pb-3">
      <CardTitle className="flex min-w-0 items-center gap-2 text-base dark:text-slate-100">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 truncate">{title}</span>
        {badge ? (
          <Badge className="ml-auto shrink-0 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200">
            {badge}
          </Badge>
        ) : null}
      </CardTitle>
    </CardHeader>
  );
}

function FieldGrid({ fields }: { fields: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {fields.map((field) => (
        <div key={field.label} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/45">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{field.label}</p>
          <p className="mt-1 text-sm font-bold leading-5 text-slate-950 dark:text-slate-100">{field.value}</p>
        </div>
      ))}
    </div>
  );
}

function InlineAction({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
      {children}
      <Eye className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function AssetIllustration() {
  return (
    <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-100 p-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(37,99,235,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,.16)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative flex w-full max-w-[280px] items-center justify-center">
        <div className="h-24 w-44 rounded-full border-4 border-blue-500 bg-blue-100 shadow-inner dark:border-blue-400 dark:bg-blue-950" />
        <div className="absolute left-4 h-32 w-6 rounded-full bg-blue-600/80 dark:bg-blue-400/80" />
        <div className="absolute right-4 h-32 w-6 rounded-full bg-blue-600/80 dark:bg-blue-400/80" />
        <div className="absolute -top-7 h-10 w-10 rounded-md border-4 border-blue-500 bg-white dark:border-blue-400 dark:bg-slate-900" />
        <div className="absolute -bottom-7 flex gap-14">
          <span className="h-12 w-2 rounded bg-slate-400 dark:bg-slate-600" />
          <span className="h-12 w-2 rounded bg-slate-400 dark:bg-slate-600" />
        </div>
      </div>
      <div className="absolute bottom-3 left-3 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-bold text-blue-700 backdrop-blur dark:border-blue-900/60 dark:bg-slate-900/80 dark:text-blue-200">
        Pressure Vessel V-101
      </div>
    </div>
  );
}

function AssetSummaryCard() {
  const { state: rbiState } = useRbiData();
  const dynamicFields = [
    { label: "Tag Number", value: rbiState.tagNumber },
    { label: "Asset Name", value: rbiState.assetName },
    { label: "Equipment Type", value: rbiState.equipmentType },
    { label: "Unit", value: rbiState.unit },
    { label: "Service", value: rbiState.service },
    ...ASSET_SUMMARY.fields.filter((field) => !["Tag Number", "Asset Name", "Equipment Type", "Unit", "Service"].includes(field.label))
  ];

  return (
    <Card>
      <SectionTitle icon={Factory} title="Asset Summary" />
      <CardContent>
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <FieldGrid fields={dynamicFields} />
          <AssetIllustration />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ children }: { children: string }) {
  return <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200">{children}</Badge>;
}

function ComponentBreakdownCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={Layers3} title="Component Breakdown" badge="Pressure Boundary" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {[
                  "Component",
                  "Component Type",
                  "Material",
                  "Nominal Thickness (mm)",
                  "Latest Thickness (mm)",
                  "Minimum Required Thickness (mm)",
                  "CA Remaining (mm)",
                  "Design Pressure (barg)",
                  "Design Temperature (°C)",
                  "Inspection Status"
                ].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COMPONENT_BREAKDOWN.map((row) => (
                <tr key={row.component} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-slate-950 dark:text-slate-100">{row.component}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{row.componentType}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">{row.material}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.nominalThickness}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-blue-700 dark:text-blue-300">{row.latestThickness}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.minimumRequiredThickness}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-green-700 dark:text-green-300">{row.corrosionAllowanceRemaining}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.designPressure}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.designTemperature}</td>
                  <td className="whitespace-nowrap px-3 py-3"><StatusBadge>{row.inspectionStatus}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            All thickness are in mm. Minimum required thickness calculated per ASME VIII Div. 1.
          </p>
          <InlineAction onClick={() => onAction("Component map is prepared for future development.")}>View Component Map</InlineAction>
        </div>
      </CardContent>
    </Card>
  );
}

function SnapshotCard({ data, icon: Icon, onAction }: { data: SnapshotCardData; icon: LucideIcon; onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={Icon} title={data.title} />
      <CardContent>
        <div className="space-y-2">
          {data.fields.map((field) => (
            <div key={field.label} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/45">
              <span className="min-w-0 text-slate-600 dark:text-slate-300">{field.label}</span>
              <span className="shrink-0 text-right font-bold text-slate-950 dark:text-slate-100">{field.value}</span>
            </div>
          ))}
        </div>
        <InlineAction onClick={() => onAction(data.actionMessage)}>{data.actionLabel}</InlineAction>
      </CardContent>
    </Card>
  );
}

function TechnicalAssumptionsCard() {
  return (
    <Card>
      <SectionTitle icon={Table2} title="Technical Assumptions" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[980px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["#", "Assumption", "Basis / Justification", "Impact on Assessment", "Data Source", "Added By", "Date Added", "Approval Status"].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TECHNICAL_ASSUMPTIONS.map((row, index) => (
                <tr key={row.assumption} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-3 font-bold text-slate-400">{index + 1}</td>
                  <td className="min-w-[170px] px-3 py-3 font-bold text-slate-950 dark:text-slate-100">{row.assumption}</td>
                  <td className="min-w-[170px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.basis}</td>
                  <td className="max-w-[130px] px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">{row.impact}</td>
                  <td className="max-w-[150px] px-3 py-3 text-blue-700 dark:text-blue-300">{row.dataSource}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.addedBy}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.dateAdded}</td>
                  <td className="whitespace-nowrap px-3 py-3"><StatusBadge>{row.approvalStatus}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          All data shown is for assessment setup purpose and will be used for API RP 581 semi-quantitative risk calculation.
        </p>
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

function priorityClass(priority: MissingInformationItem["priority"]) {
  if (priority === "High") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
  if (priority === "Medium") return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
}

function MissingInformationCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base dark:text-slate-100">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-200">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
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
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.item}</p>
              </div>
              <Badge className={priorityClass(item.priority)}>{item.priority}</Badge>
            </div>
          ))}
        </div>
        <InlineAction onClick={() => onAction("Missing information list is prepared for future development.")}>View All</InlineAction>
      </CardContent>
    </Card>
  );
}

function qualityClass(status: DataQualityIndicator["status"]) {
  if (status === "Good") return { icon: CheckCircle2, color: "text-green-600 dark:text-green-300", badge: "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200" };
  if (status === "Fair") return { icon: AlertCircle, color: "text-yellow-600 dark:text-yellow-300", badge: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200" };
  return { icon: ShieldAlert, color: "text-red-600 dark:text-red-300", badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200" };
}

function DataQualityIndicatorsCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={ClipboardCheck} title="Data Quality Indicators" />
      <CardContent>
        <div className="space-y-2">
          {DATA_QUALITY_INDICATORS.map((item) => {
            const style = qualityClass(item.status);
            const Icon = style.icon;

            return (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 dark:bg-slate-800/45">
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Icon className={cn("h-4 w-4 shrink-0", style.color)} aria-hidden="true" />
                  {item.label}
                </span>
                <Badge className={style.badge}>{item.status}</Badge>
              </div>
            );
          })}
        </div>
        <InlineAction onClick={() => onAction("Data quality report is prepared for future development.")}>View Data Quality Report</InlineAction>
      </CardContent>
    </Card>
  );
}

function DataSourceMapCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={Database} title="Data Source Map" />
      <CardContent>
        <div className="flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {DATA_SOURCE_MAP.map((item) => (
            <span key={item.label} style={{ width: `${item.percentage}%`, backgroundColor: item.color }} title={`${item.label}: ${item.percentage}%`} />
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {DATA_SOURCE_MAP.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="font-bold text-slate-950 dark:text-slate-100">{item.percentage}%</span>
            </div>
          ))}
        </div>
        <InlineAction onClick={() => onAction("Data lineage is prepared for future development.")}>View Data Lineage</InlineAction>
      </CardContent>
    </Card>
  );
}

function UncertaintyImpactCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card className="border-yellow-200 bg-yellow-50/70 dark:border-yellow-900/50 dark:bg-yellow-950/20">
      <SectionTitle icon={TriangleAlert} title="Uncertainty Impact" />
      <CardContent>
        <Badge className="border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/40 dark:text-yellow-200">Moderate</Badge>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">Uncertainty may affect PoF and CoF results.</p>
        <InlineAction onClick={() => onAction("Uncertainty assessment is prepared for future development.")}>View Uncertainty Assessment</InlineAction>
      </CardContent>
    </Card>
  );
}

function RequiredDataCard({ onAction }: { onAction: (message: string) => void }) {
  const percentage = Math.round((REQUIRED_API_581_DATA.complete / REQUIRED_API_581_DATA.total) * 100);

  return (
    <Card>
      <SectionTitle icon={Target} title="Required Data for API RP 581 Calculation" />
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-slate-950 dark:text-slate-100">{REQUIRED_API_581_DATA.complete} / {REQUIRED_API_581_DATA.total}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Required fields ready</p>
          </div>
          <Badge className="border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200">{percentage}%</Badge>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" style={{ width: `${percentage}%` }} />
        </div>
        <InlineAction onClick={() => onAction("Required data list is prepared for future development.")}>View Required Data List</InlineAction>
      </CardContent>
    </Card>
  );
}

export function RiskAssessmentWorkspaceStep2({ onAction }: { onAction: (message: string) => void }) {
  const firstSnapshots = SNAPSHOT_CARDS.slice(0, 3);
  const secondSnapshots = SNAPSHOT_CARDS.slice(3);
  const firstIcons: LucideIcon[] = [FileText, Gauge, Database];
  const secondIcons: LucideIcon[] = [ClipboardCheck, ShieldAlert, Target];

  return (
    <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <main className="min-w-0 space-y-4">
        <AssetSummaryCard />
        <ComponentBreakdownCard onAction={onAction} />
        <section className="grid min-w-0 gap-4 xl:grid-cols-3" aria-label="Design and operating snapshots">
          {firstSnapshots.map((snapshot, index) => (
            <SnapshotCard key={snapshot.title} data={snapshot} icon={firstIcons[index]} onAction={onAction} />
          ))}
        </section>
        <section className="grid min-w-0 gap-4 xl:grid-cols-3" aria-label="History and consequence snapshots">
          {secondSnapshots.map((snapshot, index) => (
            <SnapshotCard key={snapshot.title} data={snapshot} icon={secondIcons[index]} onAction={onAction} />
          ))}
        </section>
        <TechnicalAssumptionsCard />
      </main>
      <aside className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-1" aria-label="Asset information side summary">
        <DataCompletenessCard onAction={onAction} />
        <MissingInformationCard onAction={onAction} />
        <DataQualityIndicatorsCard onAction={onAction} />
        <DataSourceMapCard onAction={onAction} />
        <UncertaintyImpactCard onAction={onAction} />
        <RequiredDataCard onAction={onAction} />
      </aside>
    </div>
  );
}
