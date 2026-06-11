"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  CalendarClock,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Gauge,
  ListChecks,
  ShieldCheck,
  Star,
  Table2
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COMPONENT_TIME_BASIS,
  DAMAGE_FACTOR_ROWS,
  DAMAGE_FACTOR_TOTALS,
  GENERIC_FAILURE_FREQUENCY_ROWS,
  INSPECTION_EFFECTIVENESS,
  MANAGEMENT_SYSTEMS_FACTOR,
  NOTES_ON_POF,
  POF_CALCULATION_FORMULA,
  POF_DRIVERS,
  POF_FORMULA_HELPERS,
  POF_KEY_ASSUMPTIONS,
  POF_RESULT_SUMMARY,
  POF_SELECTION,
  POF_SUPPORTING_DOCUMENTS,
  POF_TECHNICAL_NOTE,
  SELECTED_DAMAGE_MECHANISMS_FOR_POF,
  UNCERTAINTY_IMPACT_ITEMS,
  type SelectedDamageMechanismForPof
} from "@/lib/risk-assessment-workspace-step4-data";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

function Required() {
  return <span className="text-red-500" aria-label="required">*</span>;
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <CardHeader className="pb-3">
      <CardTitle className="flex min-w-0 items-center gap-2 text-base dark:text-slate-100">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 truncate">{title}</span>
      </CardTitle>
      {subtitle ? <p className="pl-11 text-sm font-medium text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </CardHeader>
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

function InfoRows({ fields }: { fields: Array<{ label: string; value: string; tone?: "green" }> }) {
  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div key={field.label} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/45">
          <span className="min-w-0 text-slate-600 dark:text-slate-300">{field.label}</span>
          <span className={cn("shrink-0 text-right font-bold text-slate-950 dark:text-slate-100", field.tone === "green" && "text-green-700 dark:text-green-200")}>
            {field.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function PofSelectionStrip({ onAction }: { onAction: (message: string) => void }) {
  const [values, setValues] = useState(() => Object.fromEntries(POF_SELECTION.map((field) => [field.label, field.value])) as Record<string, string>);

  return (
    <Card>
      <div className="grid min-w-0 gap-3 p-4 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto] xl:items-end">
        {POF_SELECTION.map((field) => (
          <div key={field.label} className="min-w-0 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {field.label} <Required />
            </label>
            <select
              className={fieldClass}
              value={values[field.label]}
              onChange={(event) => setValues((current) => ({ ...current, [field.label]: event.target.value }))}
              aria-label={field.label}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <Button type="button" variant="outline" className="xl:mb-0" onClick={() => onAction("Component and mechanism selection is prepared for future development.")}>
          Change Selection
        </Button>
      </div>
    </Card>
  );
}

function ComponentTimeBasisCard() {
  return (
    <Card>
      <SectionTitle icon={CalendarClock} title="Component & Time Basis" />
      <CardContent>
        <InfoRows fields={COMPONENT_TIME_BASIS.fields} />
      </CardContent>
    </Card>
  );
}

function GffCard() {
  return (
    <Card>
      <SectionTitle icon={Database} title="Generic Failure Frequency (GFF)" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[520px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["GFF Category", "Failures per Year (/yr)", "Source"].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {GENERIC_FAILURE_FREQUENCY_ROWS.map((row) => (
                <tr key={row.category} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-2 font-bold text-slate-950 dark:text-slate-100">{row.category}</td>
                  <td className="px-3 py-2 font-mono text-[11px] font-bold text-blue-700 dark:text-blue-300">{row.failuresPerYear}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">Component Type Basis: Nozzle (ASME VIII Div. 1)</p>
      </CardContent>
    </Card>
  );
}

function ManagementSystemsFactorCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={ShieldCheck} title="Management Systems Factor (FMS)" />
      <CardContent>
        <div className="rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-900/60 dark:bg-green-950/25">
          <p className="text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-200">FMS Value</p>
          <p className="mt-1 text-3xl font-bold text-green-700 dark:text-green-200">{MANAGEMENT_SYSTEMS_FACTOR.value}</p>
        </div>
        <div className="mt-3 space-y-2">
          <InfoRows fields={[
            { label: "Basis", value: MANAGEMENT_SYSTEMS_FACTOR.basis },
            { label: "Last Assessment Date", value: MANAGEMENT_SYSTEMS_FACTOR.lastAssessmentDate }
          ]} />
        </div>
        <InlineAction onClick={() => onAction("Management Systems Factor assessment is prepared for future development.")}>
          View Management Systems Factor Assessment
        </InlineAction>
      </CardContent>
    </Card>
  );
}

function DamageFactorCalculationCard() {
  return (
    <Card>
      <SectionTitle icon={Calculator} title="Damage Factor (DF) Calculation" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[1180px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {[
                  "Damage Mechanism",
                  "DF Type",
                  "Age / Exposure (Years)",
                  "Corrosion Rate / Susceptibility",
                  "Inspection Effectiveness Credit",
                  "DF Current (12 May 2025)",
                  "DF at Plan Date (15 May 2026)",
                  "DF Target",
                  "Governing"
                ].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DAMAGE_FACTOR_ROWS.map((row) => (
                <tr key={row.mechanism} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="min-w-[180px] px-3 py-3 font-bold text-slate-950 dark:text-slate-100">{row.mechanism}</td>
                  <td className="min-w-[130px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.dfType}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.exposureYears}</td>
                  <td className="min-w-[170px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.corrosionRateSusceptibility}</td>
                  <td className="min-w-[170px] px-3 py-3 text-slate-700 dark:text-slate-300">{row.inspectionEffectivenessCredit}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-slate-950 dark:text-slate-100">{row.dfCurrent}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-blue-700 dark:text-blue-300">{row.dfPlanDate}</td>
                  <td className="whitespace-nowrap px-3 py-3">{row.dfTarget}</td>
                  <td className="px-3 py-3">
                    {row.governing ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" aria-label="Governing mechanism" /> : <span className="text-slate-400">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3 sm:grid-cols-3 dark:border-blue-900/50 dark:bg-blue-950/25">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Total Damage Factor (DF-Total)</p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">DF Current: <span className="font-bold text-slate-950 dark:text-slate-100">{DAMAGE_FACTOR_TOTALS.current}</span></p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">DF at Plan Date: <span className="font-bold text-slate-950 dark:text-slate-100">{DAMAGE_FACTOR_TOTALS.planDate}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}

function InspectionEffectivenessCard() {
  return (
    <Card>
      <SectionTitle icon={Gauge} title="Inspection Effectiveness" subtitle="Per Governing Mechanism" />
      <CardContent>
        <InfoRows fields={INSPECTION_EFFECTIVENESS.fields} />
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Confidence Level</span>
            <span className="text-slate-950 dark:text-slate-100">{INSPECTION_EFFECTIVENESS.confidenceLevel}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-green-600 dark:bg-green-400" style={{ width: `${INSPECTION_EFFECTIVENESS.confidenceLevel}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function mechanismBadgeClass(badge: SelectedDamageMechanismForPof["badge"]) {
  if (badge === "Governing") return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/35 dark:text-violet-200";
  if (badge === "Credible") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (badge === "Possible") return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200";
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

function SelectedDamageMechanismsCard() {
  return (
    <Card>
      <SectionTitle icon={ListChecks} title="Selected Damage Mechanisms" />
      <CardContent>
        <div className="space-y-2">
          {SELECTED_DAMAGE_MECHANISMS_FOR_POF.map((item) => (
            <div key={item.label} className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/45">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <span className="min-w-0 flex-1 text-sm font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
              <Badge className={cn("shrink-0", mechanismBadgeClass(item.badge))}>{item.badge}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatScientific(value: number) {
  return value.toExponential(2).replace("e", "E");
}

function PofResultSummaryCard() {
  return (
    <Card>
      <SectionTitle icon={Gauge} title="PoF Result Summary" />
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/25">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-200">Numeric PoF (Current)</p>
            <p className="mt-1 font-mono text-2xl font-bold text-slate-950 dark:text-slate-100">{POF_RESULT_SUMMARY.currentPof}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">failures / year</p>
          </div>
          <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-950/25">
            <p className="text-xs font-bold uppercase tracking-wide text-yellow-800 dark:text-yellow-200">PoF Category</p>
            <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-slate-100">{POF_RESULT_SUMMARY.pofCategory}</p>
          </div>
        </div>
        <div className="h-48 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={POF_RESULT_SUMMARY.trend} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="label" tick={{ fill: "currentColor", fontSize: 10 }} interval={0} />
              <YAxis tick={{ fill: "currentColor", fontSize: 10 }} tickFormatter={(value) => formatScientific(Number(value))} width={58} />
              <Tooltip formatter={(value) => [formatScientific(Number(value)), "PoF"]} />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <InfoRows fields={[
          { label: "Time to PoF Target", value: POF_RESULT_SUMMARY.timeToTarget, tone: "green" },
          { label: "Governing Mechanism", value: POF_RESULT_SUMMARY.governingMechanism }
        ]} />
      </CardContent>
    </Card>
  );
}

function PofCalculationSummaryCard() {
  return (
    <Card>
      <SectionTitle icon={Calculator} title="PoF Calculation Summary" />
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          {POF_CALCULATION_FORMULA.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn("rounded-lg border px-3 py-2", item.final ? "border-blue-200 bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/35" : "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/45")}>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className={cn("mt-1 font-mono text-sm font-bold text-slate-950 dark:text-slate-100", item.final && "text-blue-700 dark:text-blue-200")}>{item.value}</p>
              </div>
              {index < POF_CALCULATION_FORMULA.length - 1 ? <span className="text-lg font-bold text-slate-400">{index === POF_CALCULATION_FORMULA.length - 2 ? "=" : "x"}</span> : null}
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {POF_FORMULA_HELPERS.map((helper) => (
            <p key={helper} className="rounded-md bg-slate-50 px-3 py-2 text-xs font-semibold leading-5 text-slate-600 dark:bg-slate-800/45 dark:text-slate-300">{helper}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DataUncertaintyImpactCard() {
  return (
    <Card>
      <SectionTitle icon={Gauge} title="Data Uncertainty Impact" />
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#16a34a 295deg, rgba(148,163,184,0.25) 0deg)" }}>
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
              <span className="text-xl font-bold text-slate-950 dark:text-slate-100">82%</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Confidence</span>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            {UNCERTAINTY_IMPACT_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
                <span className="shrink-0 font-bold text-slate-950 dark:text-slate-100">{item.value} <span className="text-slate-500 dark:text-slate-400">({item.level})</span></span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function driverColor(impact: number) {
  if (impact >= 30) return "bg-red-600";
  if (impact >= 16) return "bg-orange-500";
  if (impact >= 8) return "bg-yellow-400";
  return "bg-green-500";
}

function TopPofDriversCard() {
  return (
    <Card>
      <SectionTitle icon={Table2} title="Top PoF Drivers" subtitle="Impact on PoF" />
      <CardContent>
        <div className="space-y-3">
          {POF_DRIVERS.map((driver) => (
            <div key={driver.label} className="grid min-w-0 grid-cols-[minmax(0,1fr)_44px] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">{driver.label}</p>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={cn("h-full rounded-full", driverColor(driver.impact))} style={{ width: `${driver.impact}%` }} />
                </div>
              </div>
              <span className="text-right text-sm font-bold text-slate-950 dark:text-slate-100">{driver.impact}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotesOnPofCard() {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Notes on PoF" />
      <CardContent>
        <div className="space-y-2">
          {NOTES_ON_POF.map((note) => (
            <div key={note} className="flex items-start gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-medium leading-6 text-slate-700 dark:bg-slate-800/45 dark:text-slate-300">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TechnicalNotesCard() {
  const [note, setNote] = useState(POF_TECHNICAL_NOTE);

  return (
    <Card>
      <SectionTitle icon={FileText} title="Technical Notes" subtitle="Optional" />
      <CardContent>
        <textarea
          value={note}
          maxLength={1000}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-[120px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          aria-label="PoF technical notes"
        />
        <p className="mt-1 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">{note.length} / 1000</p>
      </CardContent>
    </Card>
  );
}

function KeyAssumptionsCard() {
  return (
    <Card>
      <SectionTitle icon={CheckCircle2} title="Key Assumptions" />
      <CardContent>
        <div className="space-y-2">
          {POF_KEY_ASSUMPTIONS.map((assumption) => (
            <div key={assumption} className="flex items-start gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold leading-6 text-slate-700 dark:bg-slate-800/45 dark:text-slate-300">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-600 dark:text-green-300" aria-hidden="true" />
              <span>{assumption}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SupportingDocumentsCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Supporting Documents" />
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {POF_SUPPORTING_DOCUMENTS.map((document) => (
            <span key={document.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {document.name}
            </span>
          ))}
        </div>
        <Button type="button" variant="outline" className="mt-4" onClick={() => onAction("Supporting document list is prepared for future development.")}>
          View All (6)
        </Button>
      </CardContent>
    </Card>
  );
}

export function RiskAssessmentWorkspaceStep4({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="min-w-0 space-y-4">
      <PofSelectionStrip onAction={onAction} />

      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0 space-y-4">
          <section className="grid min-w-0 gap-4 xl:grid-cols-3" aria-label="PoF basis cards">
            <ComponentTimeBasisCard />
            <GffCard />
            <ManagementSystemsFactorCard onAction={onAction} />
          </section>

          <DamageFactorCalculationCard />
          <InspectionEffectivenessCard />

          <section className="grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-4" aria-label="PoF lower summary cards">
            <PofCalculationSummaryCard />
            <DataUncertaintyImpactCard />
            <TopPofDriversCard />
            <NotesOnPofCard />
          </section>

          <section className="grid min-w-0 gap-4 xl:grid-cols-3" aria-label="PoF notes and supporting documents">
            <TechnicalNotesCard />
            <KeyAssumptionsCard />
            <SupportingDocumentsCard onAction={onAction} />
          </section>
        </main>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-1" aria-label="PoF result side summary">
          <SelectedDamageMechanismsCard />
          <PofResultSummaryCard />
        </aside>
      </div>
    </div>
  );
}
