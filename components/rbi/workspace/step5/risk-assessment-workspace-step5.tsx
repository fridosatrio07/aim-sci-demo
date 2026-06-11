"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Flame,
  Gauge,
  Info,
  ListChecks,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  Table2,
  Waves
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COF_CALCULATION_SUMMARY,
  COF_DATA_UNCERTAINTY,
  COF_NOTES,
  COF_SELECTED_DAMAGE_MECHANISMS,
  COF_SELECTION,
  COF_SUMMARY,
  COF_SUPPORTING_DOCUMENTS,
  CONSEQUENCE_BASIS,
  CONSEQUENCE_SCORE_RADAR,
  CORPORATE_CONSEQUENCE_OVERLAY,
  EVENT_OUTCOMES,
  ISOLATION_DETECTION_MITIGATION,
  LEVEL1_VALIDITY_CHECKS,
  RELEASED_FLUID_INVENTORY,
  RELEASE_SCENARIOS
} from "@/lib/risk-assessment-workspace-step5-data";
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

function toneText(tone?: string) {
  if (tone === "green") return "text-green-700 dark:text-green-200";
  if (tone === "amber") return "text-amber-700 dark:text-amber-200";
  if (tone === "red") return "text-red-700 dark:text-red-200";
  if (tone === "blue") return "text-blue-700 dark:text-blue-200";
  return "text-slate-950 dark:text-slate-100";
}

function badgeClass(tone?: string) {
  if (tone === "green") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200";
  if (tone === "blue") return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

function InfoRows({ fields }: { fields: Array<{ label: string; value: string; tone?: string }> }) {
  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div key={field.label} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/45">
          <span className="min-w-0 text-slate-600 dark:text-slate-300">{field.label}</span>
          <span className={cn("shrink-0 text-right font-bold", toneText(field.tone))}>{field.value}</span>
        </div>
      ))}
    </div>
  );
}

function CofSelectionStrip() {
  const [values, setValues] = useState(() => Object.fromEntries(COF_SELECTION.map((field) => [field.label, field.value])) as Record<string, string>);

  return (
    <Card>
      <div className="grid min-w-0 gap-3 p-4 md:grid-cols-3">
        {COF_SELECTION.map((field) => (
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
      </div>
    </Card>
  );
}

function ReleasedFluidInventoryCard() {
  return (
    <Card>
      <SectionTitle icon={Waves} title="Released Fluid and Inventory" />
      <CardContent>
        <InfoRows fields={RELEASED_FLUID_INVENTORY} />
      </CardContent>
    </Card>
  );
}

function ReleaseScenarioCard() {
  return (
    <Card>
      <SectionTitle icon={Table2} title="Release Scenario" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["#", "Hole Size", "Hole Diameter (mm)", "Release Type", "Release Rate", "Release Mass", "Release Duration", "Continuous / Instantaneous"].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {RELEASE_SCENARIOS.map((row, index) => (
                <tr key={row.holeSize} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-2 font-bold text-slate-400">{index + 1}</td>
                  <td className="px-3 py-2 font-bold text-slate-950 dark:text-slate-100">{row.holeSize}</td>
                  <td className="px-3 py-2">{row.diameter}</td>
                  <td className="px-3 py-2">{row.releaseType}</td>
                  <td className="px-3 py-2 font-mono text-[11px] font-bold text-blue-700 dark:text-blue-300">{row.releaseRate}</td>
                  <td className="px-3 py-2">{row.releaseMass}</td>
                  <td className="px-3 py-2">{row.releaseDuration}</td>
                  <td className="px-3 py-2">{row.continuity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex justify-end text-sm font-bold text-slate-700 dark:text-slate-300">
          Total Probability Weighting <span className="ml-4 text-slate-950 dark:text-slate-100">1.00</span>
        </div>
      </CardContent>
    </Card>
  );
}

function IsolationDetectionMitigationCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={ShieldCheck} title="Isolation & Mitigation" />
      <CardContent>
        <InfoRows fields={ISOLATION_DETECTION_MITIGATION} />
        <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => onAction("Mitigation detail view is prepared for future development.")}>
          View Mitigation Details
        </Button>
      </CardContent>
    </Card>
  );
}

function eventToneClass(tone: string) {
  if (tone === "green") return "border-green-200 bg-green-50/80 dark:border-green-900/60 dark:bg-green-950/25";
  if (tone === "red") return "border-red-200 bg-red-50/80 dark:border-red-900/60 dark:bg-red-950/25";
  if (tone === "orange") return "border-orange-200 bg-orange-50/80 dark:border-orange-900/60 dark:bg-orange-950/25";
  if (tone === "purple") return "border-purple-200 bg-purple-50/80 dark:border-purple-900/60 dark:bg-purple-950/25";
  if (tone === "teal") return "border-teal-200 bg-teal-50/80 dark:border-teal-900/60 dark:bg-teal-950/25";
  if (tone === "blue") return "border-blue-200 bg-blue-50/80 dark:border-blue-900/60 dark:bg-blue-950/25";
  return "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/45";
}

function EventOutcomeModelingCard() {
  return (
    <Card>
      <SectionTitle icon={Flame} title="Event Outcome Modeling (Level 1)" />
      <CardContent>
        <div className="max-w-full overflow-x-auto pb-1">
          <div className="grid min-w-[1040px] grid-cols-10 gap-3">
            {EVENT_OUTCOMES.map((outcome, index) => (
              <div key={outcome.title} className={cn("rounded-lg border p-3", eventToneClass(outcome.tone))}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-200">{index + 1}. {outcome.title}</p>
                  <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                </div>
                <p className="mt-2 min-h-9 text-xs font-semibold leading-5 text-slate-700 dark:text-slate-300">{outcome.subtitle}</p>
                {outcome.probability ? (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Probability</p>
                    <p className="font-mono text-sm font-bold text-slate-950 dark:text-slate-100">{outcome.probability}</p>
                  </div>
                ) : null}
                {outcome.impact ? (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{outcome.impactLabel}</p>
                    <p className="text-sm font-bold text-slate-950 dark:text-slate-100">{outcome.impact}</p>
                  </div>
                ) : null}
                <p className="mt-3 text-[11px] font-medium leading-5 text-slate-500 dark:text-slate-400">{outcome.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CofCalculationSummaryCard() {
  return (
    <Card>
      <SectionTitle icon={Calculator} title="CoF Calculation Summary (Area Risk Basis)" />
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {COF_CALCULATION_SUMMARY.map((metric) => (
            <div key={metric.label} className={cn("rounded-lg border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/45", metric.tone === "red" && "border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/25")}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{metric.label}</p>
              <p className={cn("mt-1 text-lg font-bold text-slate-950 dark:text-slate-100", metric.tone === "red" && "text-red-700 dark:text-red-200")}>{metric.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CorporateConsequenceOverlayCard() {
  return (
    <Card>
      <SectionTitle icon={Radar} title="Corporate Consequence Overlay" />
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {CORPORATE_CONSEQUENCE_OVERLAY.map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/45">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.label}</p>
              <Badge className={cn("mt-2", badgeClass(item.tone))}>{item.value}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotesAssumptionsCard() {
  const [note, setNote] = useState(COF_NOTES);

  return (
    <Card>
      <SectionTitle icon={FileText} title="Notes / Assumptions" />
      <CardContent>
        <textarea
          value={note}
          maxLength={1000}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-[142px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          aria-label="CoF notes and assumptions"
        />
        <p className="mt-1 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">{note.length} / 1000</p>
      </CardContent>
    </Card>
  );
}

function CofSupportingDocumentsCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Supporting Documents" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["Document Name", "Document No.", "Revision", "Last Updated", "Source", "Action"].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COF_SUPPORTING_DOCUMENTS.map((document) => (
                <tr key={document.documentNo} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="min-w-[180px] px-3 py-2 font-bold text-slate-950 dark:text-slate-100">{document.documentName}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] font-bold text-blue-700 dark:text-blue-300">{document.documentNo}</td>
                  <td className="px-3 py-2">{document.revision}</td>
                  <td className="whitespace-nowrap px-3 py-2">{document.lastUpdated}</td>
                  <td className="px-3 py-2">{document.source}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => onAction(`Preview prepared for ${document.documentNo}.`)} aria-label={`Preview ${document.documentNo}`}>
                        <Eye className="h-4 w-4" />
                      </button>
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => onAction(`Download prepared for ${document.documentNo}.`)} aria-label={`Download ${document.documentNo}`}>
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
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

function CofSummaryCard() {
  return (
    <Card>
      <SectionTitle icon={SlidersHorizontal} title="CoF Summary" />
      <CardContent>
        <InfoRows fields={COF_SUMMARY} />
      </CardContent>
    </Card>
  );
}

function ConsequenceScoreOverviewCard() {
  return (
    <Card>
      <SectionTitle icon={Radar} title="Consequence Score Overview" />
      <CardContent>
        <div className="h-56 min-w-0 text-slate-500 dark:text-slate-300">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={CONSEQUENCE_SCORE_RADAR} outerRadius="70%">
              <PolarGrid stroke="rgba(148, 163, 184, 0.35)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "currentColor", fontSize: 9 }} />
              <Tooltip />
              <RechartsRadar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.22} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CofDataUncertaintyCard() {
  return (
    <Card>
      <SectionTitle icon={Gauge} title="Data Uncertainty" />
      <CardContent>
        <div className="space-y-3">
          {COF_DATA_UNCERTAINTY.map((item) => (
            <div key={item.label} className="grid min-w-0 grid-cols-[minmax(0,1fr)_72px] items-center gap-3">
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={cn("h-2 rounded-full", item.level === "Medium" ? "bg-orange-400" : "bg-green-500")} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
              <Badge className={badgeClass(item.level === "Medium" ? "amber" : "green")}>{item.level}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function mechanismBadgeClass(badge: string) {
  if (badge === "Governing") return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
  if (badge === "Credible") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (badge === "Possible") return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200";
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

function CofSelectedDamageMechanismsCard() {
  return (
    <Card>
      <SectionTitle icon={ListChecks} title="Selected Damage Mechanisms" />
      <CardContent>
        <div className="space-y-2">
          {COF_SELECTED_DAMAGE_MECHANISMS.map((item) => (
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

function ConsequenceBasisCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Consequence Basis" />
      <CardContent>
        <InfoRows fields={CONSEQUENCE_BASIS} />
        <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => onAction("Consequence basis detail view is prepared for future development.")}>
          View Basis Details
        </Button>
      </CardContent>
    </Card>
  );
}

function Level1ValidityCheckCard() {
  return (
    <Card>
      <SectionTitle icon={ShieldCheck} title="Level 1 Validity Check" />
      <CardContent>
        <InfoRows fields={LEVEL1_VALIDITY_CHECKS} />
      </CardContent>
    </Card>
  );
}

export function RiskAssessmentWorkspaceStep5({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="min-w-0 space-y-4">
      <CofSelectionStrip />

      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0 space-y-4">
          <section className="grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-3" aria-label="Consequence of failure input cards">
            <ReleasedFluidInventoryCard />
            <ReleaseScenarioCard />
            <IsolationDetectionMitigationCard onAction={onAction} />
          </section>

          <EventOutcomeModelingCard />

          <section className="grid min-w-0 gap-4 xl:grid-cols-2" aria-label="Consequence summary cards">
            <CofCalculationSummaryCard />
            <CorporateConsequenceOverlayCard />
          </section>

          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" aria-label="Consequence notes and documents">
            <NotesAssumptionsCard />
            <CofSupportingDocumentsCard onAction={onAction} />
          </section>
        </main>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-1" aria-label="CoF side summary">
          <CofSummaryCard />
          <ConsequenceScoreOverviewCard />
          <CofDataUncertaintyCard />
          <CofSelectedDamageMechanismsCard />
          <ConsequenceBasisCard onAction={onAction} />
          <Level1ValidityCheckCard />
        </aside>
      </div>
    </div>
  );
}
