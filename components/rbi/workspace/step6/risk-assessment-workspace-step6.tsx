"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle2,
  FileText,
  Gauge,
  Info,
  RotateCw,
  ShieldAlert,
  SlidersHorizontal,
  Table2,
  Target,
  TrendingUp
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CODE_CONSTRAINT_CHECKS,
  COF_DRIVERS,
  POF_DRIVERS,
  RECOMMENDATION_TRIGGER_BASIS,
  RISK_ACCEPTABILITY,
  RISK_DETERMINATION_KPIS,
  RISK_EVIDENCE_DOCUMENTS,
  RISK_RESULT_SUMMARY,
  RISK_TARGET_COMPARISON,
  RISK_TREND,
  SENSITIVITY_ANALYSIS,
  TECHNICAL_NOTES,
  type RiskKpi
} from "@/lib/risk-assessment-workspace-step6-data";
import { useRbiData, type SharedRbiAssessment } from "@/lib/rbi-store";
import { cn } from "@/lib/utils";

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

function badgeClass(tone?: string) {
  if (tone === "green") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200";
  if (tone === "purple") return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/30 dark:text-purple-200";
  if (tone === "blue") return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

function kpiIcon(kpi: RiskKpi) {
  if (kpi.label.includes("PoF")) return Gauge;
  if (kpi.label.includes("CoF") || kpi.label.includes("Consequence")) return Target;
  if (kpi.label.includes("Risk")) return ShieldAlert;
  return CheckCircle2;
}

function RiskKpiCard({ kpi }: { kpi: RiskKpi }) {
  const Icon = kpiIcon(kpi);

  return (
    <Card>
      <CardContent className="flex min-h-[92px] items-center gap-3 p-4">
        <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", badgeClass(kpi.tone))}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300">{kpi.label}</p>
          <p className={cn("mt-1 truncate text-2xl font-bold text-slate-950 dark:text-slate-100", kpi.tone === "red" && "text-red-700 dark:text-red-200")}>{kpi.value}</p>
          <p className={cn("text-xs font-semibold", kpi.tone === "green" ? "text-green-700 dark:text-green-300" : "text-slate-500 dark:text-slate-400")}>{kpi.note}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const matrixRows = [
  { label: "5 Extreme", cells: ["High", "Very High", "Extreme", "Extreme", "Extreme"] },
  { label: "4 Very High", cells: ["Medium", "High", "Very High", "Extreme", "Extreme"] },
  { label: "3 High", cells: ["Low", "Medium", "High", "Very High", "Very High"] },
  { label: "2 Moderate", cells: ["Low", "Low", "Medium", "High", "High"] },
  { label: "1 Low", cells: ["Low", "Low", "Low", "Medium", "Medium"] }
];

const matrixColumns = ["1 Very Low", "2 Low", "3 Medium", "4 High", "5 Very High"];

function riskCellClass(value: string) {
  if (value === "Extreme") return "bg-red-700 text-white";
  if (value === "Very High") return "bg-orange-600 text-white";
  if (value === "High") return "bg-amber-400 text-slate-950";
  if (value === "Medium") return "bg-yellow-200 text-slate-950";
  return "bg-green-600 text-white";
}

function Api581RiskMatrixCard({ tagNumber }: { tagNumber: string }) {
  return (
    <Card>
      <SectionTitle icon={Table2} title="API 581 Risk Matrix (Semi-Quantitative)" />
      <CardContent>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[72px_repeat(5,minmax(54px,1fr))] gap-1">
              <div />
              {matrixColumns.map((column) => (
                <div key={column} className="rounded bg-slate-50 px-1 py-2 text-center text-[10px] font-bold leading-tight text-slate-600 dark:bg-slate-800 dark:text-slate-300">{column}</div>
              ))}
              {matrixRows.map((row, rowIndex) => (
                <div key={row.label} className="contents">
                  <div key={`${row.label}-label`} className="flex items-center justify-center rounded bg-slate-50 px-1 py-2 text-center text-[10px] font-bold leading-tight text-slate-600 dark:bg-slate-800 dark:text-slate-300">{row.label}</div>
                  {row.cells.map((cell, colIndex) => {
                    const isAsset = rowIndex === 1 && colIndex === 2;
                    return (
                      <div key={`${row.label}-${colIndex}`} className={cn("relative flex min-h-[48px] items-center justify-center rounded text-[11px] font-bold", riskCellClass(cell))}>
                        {cell}
                        {isAsset ? (
                          <span className="absolute inset-x-1 top-1/2 mx-auto flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-blue-950 text-[9px] leading-3 text-white shadow-lg">
                            {tagNumber}
                            <br />
                            (3,4)
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/25">
          <p className="text-sm font-bold text-blue-800 dark:text-blue-200">Asset Position: (3,4) = High</p>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Note: Category ranges configured by owner-operator risk criteria.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskTargetComparisonCard({ assessment }: { assessment: SharedRbiAssessment }) {
  const rows = RISK_TARGET_COMPARISON.map((row) => {
    if (row.riskBasis === "Area Risk") return { ...row, currentRisk: assessment.cof.areaConsequence };
    if (row.riskBasis === "Financial Risk") return { ...row, currentRisk: assessment.cof.financialConsequence };
    if (row.riskBasis === "PoF Target") return { ...row, currentRisk: assessment.pof.numeric };
    if (row.riskBasis === "DF Target") return { ...row, currentRisk: assessment.pof.damageFactor };
    return row;
  });

  return (
    <Card>
      <SectionTitle icon={Target} title="Risk Target Comparison" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["Risk Basis", "Current Risk", "Risk Target", "Target Status", "Target Date", "Gap"].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row) => (
                <tr key={row.riskBasis} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-2 font-bold text-slate-950 dark:text-slate-100">{row.riskBasis}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-semibold">{row.currentRisk}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.riskTarget}</td>
                  <td className="px-3 py-2"><Badge className={badgeClass(row.targetStatus === "Exceeds" ? "red" : "green")}>{row.targetStatus}</Badge></td>
                  <td className="whitespace-nowrap px-3 py-2">{row.targetDate}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-bold text-red-700 dark:text-red-300">{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskResultSummaryCard({ assessment }: { assessment: SharedRbiAssessment }) {
  const rows = RISK_RESULT_SUMMARY.map((row) => {
    if (row.label === "PoF Category") return { ...row, value: `${assessment.pof.category} - Medium` };
    if (row.label === "CoF Category") return { ...row, value: `${assessment.cof.category} - High` };
    if (row.label === "Risk Level") return { ...row, value: assessment.risk.level };
    if (row.label === "Numeric Risk Value (PoF x CoF DF)") return { ...row, value: assessment.risk.numericRiskValue };
    if (row.label === "Risk Ranking") return { ...row, value: assessment.risk.ranking };
    if (row.label === "Data Quality") return { ...row, value: `Good (${assessment.dataCompleteness}%)` };
    if (row.label === "Residual Risk Status") return { ...row, value: `Medium (After Mitigation): ${assessment.risk.residualRisk}` };
    if (row.label === "Acceptability") return { ...row, value: assessment.risk.targetStatus === "Exceeded" ? "Not Acceptable / Requires Action" : "Acceptable" };
    return row;
  });

  return (
    <Card>
      <SectionTitle icon={Gauge} title="Risk Result Summary" />
      <CardContent>
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/45">
              <span className="min-w-0 text-slate-600 dark:text-slate-300">{row.label}</span>
              <span className={cn("shrink-0 max-w-[150px] text-right font-bold text-slate-950 dark:text-slate-100", row.tone === "green" && "text-green-700 dark:text-green-200", row.tone === "amber" && "text-amber-700 dark:text-amber-200", row.tone === "red" && "text-red-700 dark:text-red-200")}>{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskDriversCard() {
  return (
    <Card>
      <SectionTitle icon={TrendingUp} title="Risk Drivers" />
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-slate-100">PoF Drivers</p>
            <div className="mt-3 space-y-2">
              {POF_DRIVERS.map((driver) => (
                <p key={driver} className="flex gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />{driver}</p>
              ))}
            </div>
            <Badge className={cn("mt-4", badgeClass("amber"))}>Overall PoF Driver Impact: Medium</Badge>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-slate-100">CoF Drivers</p>
            <div className="mt-3 space-y-2">
              {COF_DRIVERS.map((driver) => (
                <p key={driver} className="flex gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />{driver}</p>
              ))}
            </div>
            <Badge className={cn("mt-4", badgeClass("red"))}>Overall CoF Driver Impact: High</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatScientific(value: number) {
  return value.toExponential(2).replace("e", "E");
}

function RiskTrendCard() {
  return (
    <Card>
      <SectionTitle icon={BarChart3} title="Risk Trend" subtitle="Over time" />
      <CardContent>
        <div className="h-72 min-w-0 text-slate-500 dark:text-slate-300">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RISK_TREND} margin={{ top: 22, right: 10, bottom: 34, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="label" tick={{ fill: "currentColor", fontSize: 10 }} interval={0} />
              <YAxis tick={{ fill: "currentColor", fontSize: 10 }} tickFormatter={(value) => formatScientific(Number(value))} width={62} />
              <Tooltip formatter={(value) => [formatScientific(Number(value)), "Risk"]} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="displayValue" position="top" fill="currentColor" fontSize={10} />
                {RISK_TREND.map((entry) => (
                  <Cell key={entry.label} fill={entry.tone} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function SensitivityAnalysisCard() {
  return (
    <Card>
      <SectionTitle icon={SlidersHorizontal} title="Sensitivity Analysis" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[620px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["Parameter", "Variation", "Risk Impact", "Sensitivity"].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SENSITIVITY_ANALYSIS.map((row) => (
                <tr key={row.parameter} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-2 font-bold text-slate-950 dark:text-slate-100">{row.parameter}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.variation}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px]">{row.riskImpact}</td>
                  <td className="px-3 py-2"><Badge className={badgeClass(row.sensitivity === "High" ? "red" : row.sensitivity === "Medium" ? "amber" : "green")}>{row.sensitivity}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function EvidenceDocumentsCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Evidence / Supporting Documents" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["Document Name", "Type", "Version", "Last Updated", "Updated By"].map((column) => (
                  <th key={column} className="px-3 py-3">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {RISK_EVIDENCE_DOCUMENTS.map((document) => (
                <tr key={document.documentName} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="min-w-[220px] px-3 py-2 font-bold text-blue-700 dark:text-blue-300">{document.documentName}</td>
                  <td className="px-3 py-2">{document.type}</td>
                  <td className="px-3 py-2">{document.version}</td>
                  <td className="whitespace-nowrap px-3 py-2">{document.lastUpdated}</td>
                  <td className="whitespace-nowrap px-3 py-2">{document.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" className="mt-4" onClick={() => onAction("Document list view is prepared for future development.")}>
          View All Documents
        </Button>
      </CardContent>
    </Card>
  );
}

function TechnicalNotesCard() {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Technical Notes" />
      <CardContent>
        <div className="rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
          B / I / U / List / Link / Comment
        </div>
        <div className="rounded-b-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
          <div className="space-y-2">
            {TECHNICAL_NOTES.map((note) => (
              <p key={note} className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{note}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const wizardTabs = ["Explanation", "Acceptability", "Target Alert", "Recommendation Basis", "Code Check"] as const;
type WizardTab = (typeof wizardTabs)[number];

function RiskResultDetailWizard() {
  const [activeTab, setActiveTab] = useState<WizardTab>("Explanation");

  return (
    <Card>
      <SectionTitle icon={Info} title="Risk Result Detail Wizard" />
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {wizardTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={cn(
                "rounded-md border px-3 py-2 text-xs font-bold transition",
                activeTab === tab
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/45">
          {activeTab === "Explanation" ? (
            <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
              The combination of Medium probability of failure and High consequence of failure results in a High risk level. The risk exceeds defined area, financial, and PoF targets, so mitigation and inspection plan enhancement are required before the next acceptance review.
            </p>
          ) : null}

          {activeTab === "Acceptability" ? (
            <div className="space-y-2">
              {RISK_ACCEPTABILITY.map((row) => (
                <div key={row.label} className="flex min-w-0 items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 font-semibold text-slate-600 dark:text-slate-300">{row.label}</span>
                  <Badge className={badgeClass(row.tone)}>{row.value}</Badge>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "Target Alert" ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
              <p className="text-sm font-bold text-red-700 dark:text-red-200">Risk exceeds one or more defined targets.</p>
              <div className="mt-3 space-y-1 text-xs font-semibold leading-5 text-slate-700 dark:text-slate-300">
                <p>Area Risk: 150% above target</p>
                <p>Financial Risk: 140% above target</p>
                <p>PoF: 206% above target</p>
              </div>
            </div>
          ) : null}

          {activeTab === "Recommendation Basis" ? (
            <div className="space-y-2">
              {RECOMMENDATION_TRIGGER_BASIS.map((row) => (
                <div key={row.label} className="flex min-w-0 items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 font-semibold text-slate-600 dark:text-slate-300">{row.label}</span>
                  <Badge className={badgeClass(row.tone)}>{row.value}</Badge>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "Code Check" ? (
            <div className="space-y-2">
              {CODE_CONSTRAINT_CHECKS.map((row) => (
                <div key={row.label} className="flex min-w-0 items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 font-semibold text-slate-600 dark:text-slate-300">{row.label}</span>
                  <Badge className={badgeClass(row.tone)}>{row.value}</Badge>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskAssessmentWorkspaceStep6({ onAction }: { onAction: (message: string) => void }) {
  const { state: rbiState } = useRbiData();
  const kpis = RISK_DETERMINATION_KPIS.map((kpi) => {
    if (kpi.label === "PoF Category") return { ...kpi, value: String(rbiState.pof.category) };
    if (kpi.label === "Numeric PoF") return { ...kpi, value: rbiState.pof.numeric };
    if (kpi.label === "CoF Category") return { ...kpi, value: String(rbiState.cof.category) };
    if (kpi.label === "Area Consequence") return { ...kpi, value: rbiState.cof.areaConsequence };
    if (kpi.label === "Financial Consequence") return { ...kpi, value: rbiState.cof.financialConsequence };
    if (kpi.label === "Calculated Risk Level") return { ...kpi, value: rbiState.risk.level };
    if (kpi.label === "Risk Ranking") return { ...kpi, value: rbiState.risk.ranking };
    if (kpi.label === "Confidence Level") return { ...kpi, value: `${rbiState.dataCompleteness}%` };
    return kpi;
  });

  return (
    <div className="min-w-0 space-y-4">
      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8" aria-label="Risk determination KPI cards">
        {kpis.map((kpi) => (
          <RiskKpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-4">
          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" aria-label="Risk determination primary cards">
            <Api581RiskMatrixCard tagNumber={rbiState.tagNumber} />
            <RiskTargetComparisonCard assessment={rbiState} />
          </section>

          <section className="grid min-w-0 gap-4 xl:grid-cols-2" aria-label="Risk drivers trend and sensitivity">
            <RiskDriversCard />
            <RiskTrendCard />
            <div className="xl:col-span-2">
              <SensitivityAnalysisCard />
            </div>
          </section>

          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]" aria-label="Risk evidence and technical notes">
            <EvidenceDocumentsCard onAction={onAction} />
            <TechnicalNotesCard />
          </section>
        </main>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-1" aria-label="Risk determination side summary">
          <RiskResultSummaryCard assessment={rbiState} />
          <RiskResultDetailWizard />
          <Card>
            <CardContent className="p-4">
              <Button type="button" variant="outline" className="w-full" onClick={() => onAction("Risk recalculation is prepared for future development.")}>
                <RotateCw className="h-4 w-4" aria-hidden="true" />
                Recalculate Risk
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
