"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GitCompare,
  Plus,
  RefreshCw,
  ShieldCheck,
  Table2,
  Target,
  Wrench
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const kpiCards = [
  { label: "Recommended Inspection Method", value: "UT Thickness Mapping / Phased Array UT", icon: ClipboardList, tone: "green" },
  { label: "Governing Damage Mechanism", value: "Localized Corrosion / CO2 Corrosion", icon: Target, tone: "purple" },
  { label: "Governing Component", value: "Inlet Nozzle and Shell CML", icon: Table2, tone: "blue" },
  { label: "Required Inspection Effectiveness", value: "Highly Effective (API 581 Category 3)", icon: ShieldCheck, tone: "green" },
  { label: "Recommended Inspection Date", value: "15 May 2026", icon: CalendarDays, tone: "blue" },
  { label: "Trigger Basis", value: "Risk Target and DF Target", icon: Target, tone: "orange" },
  { label: "Inspection Interval", value: "12 Months", icon: CalendarDays, tone: "blue" },
  { label: "Risk Target Date", value: "15 May 2026", icon: CalendarDays, tone: "blue" },
  { label: "Code Maximum Interval Check", value: "Pass (API 510: 12 Months)", icon: CheckCircle2, tone: "green" },
  { label: "Need for FFS", value: "Conditional", icon: AlertTriangle, tone: "red" },
  { label: "Need for Repair", value: "Yes", icon: Wrench, tone: "purple" },
  { label: "Mitigation Required", value: "Yes", icon: RefreshCw, tone: "orange" }
] as const;

const inspectionRows = [
  ["UT thickness mapping on shell CML", "Shell (0-360) CML", "Localized Corrosion", "UT Thickness Mapping", "100%", "Full Circumference", "Highly Effective", "+/- 2 Months", "15 May 2026", "NDT Team", "Planned"],
  ["PAUT on inlet nozzle weld", "Inlet Nozzle Weld (ID/OD)", "Localized Corrosion", "Phased Array UT", "100%", "Weld + 50 mm", "Highly Effective", "+/- 2 Months", "15 May 2026", "NDT Team", "Planned"],
  ["Internal visual inspection", "Inside Vessel", "General Thinning", "VT", "100%", "Full Internal", "Fairly Effective", "+/- 2 Months", "15 May 2026", "Inspection Team", "Planned"],
  ["CUI inspection on insulated shell area", "Shell Insulated Area", "CUI", "UT / IR Scan", "100%", "Insulated Area", "Usually Effective", "+/- 2 Months", "15 May 2026", "CUI Team", "Planned"],
  ["Corrosion monitoring probe verification", "Corrosion Probe Locations", "Corrosion Monitoring", "Visual / UT", "100%", "All Probes", "Fairly Effective", "+/- 1 Month", "01 May 2026", "Process Team", "Planned"]
];

const mitigationRows = [
  ["Maintenance / Cleaning", "Remove deposits / clean internal surfaces", "Corrosion under deposits", "Down PoF (DF)", "High", "15 May 2026", "Maintenance Team", "Inspection Verification", "Planned"],
  ["Repair", "Local grind and weld repair near inlet nozzle", "Localized pitting at weld", "Down PoF (DF)", "High", "15 May 2026", "Maintenance Team", "UT / VT After Repair", "Planned"],
  ["Process Control", "Corrosion inhibitor review and optimization", "Corrosion rate", "Down PoF (DF)", "Medium", "30 Jun 2025", "Process Team", "Chemical Test / Trend", "Planned"],
  ["Engineering", "Review PSV and isolation capability", "High release duration", "Down CoF", "Medium", "30 Jun 2025", "Process Eng Team", "HAZOP / Review Report", "Planned"],
  ["Process Control IOW", "Update IOW for chloride and water content", "High chloride / water", "Down PoF (DF)", "Medium", "15 Jun 2025", "Process Team", "IOW Procedure Update", "Planned"],
  ["Fitness-for-Service (FFS)", "Evaluate FFS if pit depth exceeds limit", "Wall loss uncertainty", "Down PoF (DF)", "Low", "15 May 2026", "Integrity Team", "FFS Assessment", "Planned"]
];

const riskFlow = [
  { label: "Current Risk", value: "High", note: "3.06E-04 failures/year", tone: "red" },
  { label: "Expected Post-Inspection Risk", value: "Medium", note: "1.40E-04 failures/year", tone: "amber" },
  { label: "Expected Post-Mitigation Risk", value: "Low", note: "5.20E-05 failures/year", tone: "green" },
  { label: "Residual Risk", value: "Low", note: "5.20E-05 failures/year", tone: "green" },
  { label: "Risk Reduction", value: "83%", note: "vs Current Risk", tone: "blue" }
];

const recommendationBasis = [
  "High consequence: CoF Category 4 (Area Risk)",
  "Medium likelihood: PoF Category 3 (Localized Corrosion)",
  "Localized pitting observed near inlet nozzle",
  "Risk target will be exceeded within 12 months",
  "Inspection effectiveness required: Highly Effective (Category 3)",
  "API RP 581 semi-quantitative methodology applied"
];

const documents = [
  "PoF Calculation Details.pdf",
  "CoF Calculation Details.pdf",
  "Damage Mechanism Review Summary.pdf",
  "Inspection Effectiveness Justification.pdf",
  "Mitigation Action Justification.pdf"
];

function badgeClass(tone?: string) {
  if (tone === "green") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (tone === "amber" || tone === "orange") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200";
  if (tone === "purple") return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/30 dark:text-purple-200";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <CardHeader className="pb-3">
      <CardTitle className="flex min-w-0 items-center gap-2 text-base dark:text-slate-100">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 truncate">{title}</span>
      </CardTitle>
    </CardHeader>
  );
}

function KpiCard({ item }: { item: (typeof kpiCards)[number] }) {
  const Icon = item.icon;
  return (
    <Card>
      <CardContent className="flex min-h-[96px] items-center gap-3 p-4">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border", badgeClass(item.tone))}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300">{item.label}</p>
          <p className="mt-1 text-sm font-bold leading-5 text-slate-950 dark:text-slate-100">{item.value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactTable({ columns, rows, minWidth }: { columns: string[]; rows: string[][]; minWidth: string }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className={cn("w-full border-collapse text-left text-xs", minWidth)}>
        <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column} className="whitespace-nowrap px-3 py-3">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
              <td className="px-3 py-2 font-bold text-slate-400">{index + 1}</td>
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className={cn("px-3 py-2 text-slate-700 dark:text-slate-300", cellIndex === 0 && "font-bold text-slate-950 dark:text-slate-100")}>
                  {cellIndex === row.length - 1 ? <Badge className={badgeClass(cell === "Planned" ? "blue" : cell)}>{cell}</Badge> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RiskBeforeAfterCard() {
  return (
    <Card>
      <SectionTitle icon={BarChart3} title="Risk Before and After" />
      <CardContent>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {riskFlow.map((item, index) => (
            <div key={item.label} className="relative rounded-lg border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/45">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className={cn("mt-2 text-xl font-bold", item.tone === "red" && "text-red-700 dark:text-red-200", item.tone === "amber" && "text-amber-700 dark:text-amber-200", item.tone === "green" && "text-green-700 dark:text-green-200", item.tone === "blue" && "text-blue-700 dark:text-blue-200")}>{item.value}</p>
              <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{item.note}</p>
              {index < riskFlow.length - 1 ? <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-slate-400 xl:block">-&gt;</span> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationBasisCard() {
  return (
    <Card>
      <SectionTitle icon={CheckCircle2} title="Recommendation Basis" />
      <CardContent className="space-y-2">
        {recommendationBasis.map((item) => (
          <div key={item} className="flex gap-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-600 dark:text-green-300" aria-hidden="true" />
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function NotesCard() {
  const [note, setNote] = useState("Inspection interval based on DF Target of 3.0 and corrosion rate trend.\nCUI inspection aligned with insulation integrity program.\nRepair required for pits > 40% wall loss or > 3.0 mm depth.");
  return (
    <Card>
      <SectionTitle icon={FileText} title="Technical Notes" />
      <CardContent>
        <textarea
          value={note}
          maxLength={1000}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-[112px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          aria-label="Recommendation technical notes"
        />
        <p className="mt-1 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">{note.length} / 1000</p>
      </CardContent>
    </Card>
  );
}

function DocumentsCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Evidence / Supporting Documents" />
      <CardContent>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          {documents.map((document) => (
            <button
              key={document}
              type="button"
              className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-left text-sm font-bold text-blue-700 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-800/45 dark:text-blue-300 dark:hover:bg-blue-950/25"
              onClick={() => onAction(`Preview prepared for ${document}.`)}
            >
              <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{document}</span>
            </button>
          ))}
        </div>
        <Button type="button" variant="outline" className="mt-4" onClick={() => onAction("Document list view is prepared for future development.")}>
          View All Documents (8)
        </Button>
      </CardContent>
    </Card>
  );
}

function SummaryRows({ rows }: { rows: Array<{ label: string; value: string; tone?: string }> }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/45">
          <span className="min-w-0 text-slate-600 dark:text-slate-300">{row.label}</span>
          <span className={cn("shrink-0 max-w-[150px] text-right font-bold text-slate-950 dark:text-slate-100", row.tone === "red" && "text-red-700 dark:text-red-200", row.tone === "green" && "text-green-700 dark:text-green-200", row.tone === "amber" && "text-amber-700 dark:text-amber-200")}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function SideCards() {
  return (
    <>
      <Card>
        <SectionTitle icon={ShieldCheck} title="Risk Result Summary" />
        <CardContent>
          <SummaryRows
            rows={[
              { label: "Risk Basis", value: "Area Risk" },
              { label: "PoF (Current)", value: "3.06E-04 failures/year" },
              { label: "PoF Category", value: "3 (Medium)" },
              { label: "CoF Category", value: "4 (High)", tone: "red" },
              { label: "Risk Level", value: "High", tone: "red" },
              { label: "Risk Score", value: "12" },
              { label: "Risk Ranking", value: "A2" },
              { label: "Data Confidence", value: "82%", tone: "green" },
              { label: "Residual Risk Status", value: "Low", tone: "green" },
              { label: "Acceptability", value: "Not Acceptable", tone: "red" }
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <SectionTitle icon={Target} title="Recommended Action Priority" />
        <CardContent>
          <SummaryRows rows={[{ label: "High Priority", value: "2", tone: "red" }, { label: "Medium Priority", value: "3", tone: "amber" }, { label: "Low Priority", value: "1", tone: "green" }, { label: "Total Actions", value: "6" }]} />
        </CardContent>
      </Card>
      <Card>
        <SectionTitle icon={GitCompare} title="Alternative Inspection Options" />
        <CardContent>
          <CompactTable columns={["#", "Method", "Effectiveness", "Relative Cost", "Risk"]} rows={[["Baseline Plan (Above)", "High", "1.00x", "83%"], ["Phased Array + CF", "High", "1.40x", "86%"], ["UT Mapping Only", "Medium", "0.70x", "62%"]]} minWidth="min-w-[420px]" />
        </CardContent>
      </Card>
      <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20">
        <SectionTitle icon={AlertTriangle} title="Deferral Risk Warning" />
        <CardContent className="space-y-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
          <p>If inspection is deferred beyond target date (15 May 2026):</p>
          <p>Risk target will be exceeded.</p>
          <p>PoF estimated to increase to 6.80E-04 / year.</p>
          <p>Risk level may escalate to <span className="text-red-700 dark:text-red-200">Very High</span>.</p>
        </CardContent>
      </Card>
      <Card>
        <SectionTitle icon={CheckCircle2} title="Code / Jurisdiction Constraint Check" />
        <CardContent>
          <SummaryRows rows={[{ label: "API 510 Maximum Interval", value: "Pass", tone: "green" }, { label: "Local Regulation", value: "Pass", tone: "green" }, { label: "Company RBI Standard", value: "Pass", tone: "green" }, { label: "PSM / RMP Requirement", value: "Pass", tone: "green" }]} />
        </CardContent>
      </Card>
    </>
  );
}

export function RiskAssessmentWorkspaceStep7({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        {[
          ["Generate Inspection Plan", FileText],
          ["Recalculate Recommendation", RefreshCw],
          ["Compare Alternatives", GitCompare],
          ["View API 581 Inspection Effectiveness Table", Table2]
        ].map(([label, Icon]) => {
          const ActionIcon = Icon as LucideIcon;
          return (
            <Button key={label as string} type="button" variant="outline" onClick={() => onAction(`${label} is prepared for future development.`)}>
              <ActionIcon className="h-4 w-4" aria-hidden="true" />
              {label as string}
            </Button>
          );
        })}
      </div>

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5" aria-label="Recommendation KPI cards">
        {kpiCards.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-4">
          <Card>
            <SectionTitle icon={ClipboardList} title="Inspection Plan" />
            <CardContent>
              <CompactTable
                columns={["#", "Inspection Activity", "Target Component / Location", "Damage Mechanism", "NDE Method", "Coverage", "Extent", "Required Effectiveness", "Inspection Window", "Target Date", "Responsible Party", "Status"]}
                rows={inspectionRows}
                minWidth="min-w-[1420px]"
              />
              <Button type="button" variant="ghost" className="mt-3 text-blue-700 dark:text-blue-300" onClick={() => onAction("Add Inspection Activity is prepared for future development.")}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Inspection Activity
              </Button>
            </CardContent>
          </Card>

          <Card>
            <SectionTitle icon={Wrench} title="Mitigation and Engineering Action Plan" />
            <CardContent>
              <CompactTable
                columns={["#", "Action Type", "Action / Description", "Risk Driver Addressed", "Expected Risk Reduction", "Priority", "Target Date", "Responsible Party", "Verification Method", "Status"]}
                rows={mitigationRows}
                minWidth="min-w-[1160px]"
              />
              <Button type="button" variant="ghost" className="mt-3 text-blue-700 dark:text-blue-300" onClick={() => onAction("Add Mitigation / Engineering Action is prepared for future development.")}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Mitigation / Engineering Action
              </Button>
            </CardContent>
          </Card>

          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
            <RiskBeforeAfterCard />
            <RecommendationBasisCard />
          </section>

          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <NotesCard />
            <DocumentsCard onAction={onAction} />
          </section>
        </main>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-1" aria-label="Inspection and mitigation sidebar">
          <SideCards />
        </aside>
      </div>
    </div>
  );
}
