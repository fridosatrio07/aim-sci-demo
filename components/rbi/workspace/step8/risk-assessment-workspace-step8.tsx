"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  GitCompare,
  Lock,
  MessageSquareText,
  ShieldCheck,
  Table2,
  UserCheck,
  Wrench
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRbiData } from "@/lib/rbi-store";
import { cn } from "@/lib/utils";

const technicalCards = [
  { title: "Asset Information", rows: [["Unit", "Production Unit"], ["Service", "Wet Gas Separation"], ["Design Code", "ASME Sec. VIII Div.1"], ["Material", "SA-516 Gr.70"]] },
  { title: "Selected Damage Mechanisms", rows: [["Localized Corrosion", "Governing"], ["General Thinning", "Credible"], ["External Corrosion (CUI)", "Credible"], ["SCC (Chloride SCC)", "Possible"]] },
  { title: "PoF Result", rows: [["Category", "3 (Medium)"], ["Numeric PoF", "3.06E-04 failures/year"], ["PoF Target", "1.00E-03 failures/year"], ["Governing DM", "Localized Corrosion"]] },
  { title: "CoF Result", rows: [["Category", "4 (High)"], ["Area Consequence", "12,500 ft2"], ["Financial Consequence", "USD 1.2M"], ["Injury Consequence", "2.3 (High)"]] },
  { title: "Risk Result", rows: [["Risk Level", "High"], ["Risk Score", "12 / 25"], ["Risk Ranking", "A2"]] },
  { title: "Inspection Recommendation", rows: [["Method", "UT Thickness Mapping / Phased Array UT"], ["Interval", "12 Months"], ["Target Date", "15 May 2026"], ["Effectiveness", "Highly Effective"]] },
  { title: "Mitigation Recommendation", rows: [["Total Actions", "6"], ["High Priority", "3"], ["Risk Reduction", "83%"], ["Closure Target Date", "15 May 2026"]] },
  { title: "Data Confidence", rows: [["Overall Confidence", "82%"], ["Data Quality", "Good"], ["Uncertainty Level", "Medium"]] }
];

const checklist = [
  "Assessment scope and boundary defined",
  "Applicable code and standard identified",
  "Data sources and assumptions documented",
  "Damage mechanism review completed",
  "PoF calculation basis verified",
  "CoF calculation basis verified",
  "Risk target and threshold verified",
  "Inspection effectiveness verified per damage mechanism",
  "Recommended actions linked to risk drivers",
  "Update / revalidation trigger reviewed",
  "MOC / IOW impact reviewed",
  "Calculation snapshot reproducible",
  "Report package complete"
];

const workflow = [
  ["Assessment Created", "Budi Santoso", "12 May 2025 09:15 WIB", "Approved"],
  ["Technical Review", "Arief Wibowo", "12 May 2025 11:20 WIB", "Approved"],
  ["Corrosion / Materials Review", "Rachmat Hidayat", "12 May 2025 13:45 WIB", "Approved"],
  ["Process / Operations Review", "Dwi Lestari", "12 May 2025 15:30 WIB", "Approved"],
  ["Inspection Review", "Agus Setiawan", "12 May 2025 16:40 WIB", "Approved"],
  ["Management Review", "Kurniawan", "12 May 2025 18:05 WIB", "Approved"],
  ["Owner Review", "Putri Ayu", "13 May 2025 09:10 WIB", "In Review"],
  ["Final Approval", "Pending", "Pending", "Pending"]
];

const revisionRows = [
  ["2.1", "12 May 2025", "Budi Santoso", "Mitigation Plan", "v2.0", "v2.1", "Updated action scope", "In Review"],
  ["2.0", "08 May 2025", "Budi Santoso", "PoF Calculation", "v1.1", "v2.0", "New inspection data", "Approved"],
  ["1.1", "30 Apr 2025", "Arief Wibowo", "CoF Inventory", "v1.0", "v1.1", "Inventory updated", "Approved"],
  ["1.0", "29 Apr 2025", "Budi Santoso", "Initial Release", "-", "v1.0", "Initial assessment", "Approved"]
];

const inspectionPlanRows = [
  ["UT thickness mapping on shell CML", "UT Thickness Mapping", "100%", "Full Circumference", "12 Months", "15 May 2026", "NDT Team", "Planned"],
  ["PAUT on inlet nozzle weld", "Phased Array UT", "100%", "Weld + 50 mm", "12 Months", "15 May 2026", "NDT Team", "Planned"],
  ["Internal visual inspection", "VT", "100%", "Full Internal", "12 Months", "15 May 2026", "Inspection Team", "Planned"],
  ["CUI inspection on insulated shell area", "UT / IR Scan", "100%", "Insulated Area", "12 Months", "12 May 2026", "CUI Team", "Planned"],
  ["Corrosion monitoring probe verification", "Visual / UT", "100%", "All Probes", "12 Months", "01 May 2026", "Process Team", "Planned"]
];

const mitigationRows = [
  ["Remove deposits / clean internal surfaces", "Maintenance", "High", "15 May 2026", "Maintenance Team", "Down PoF", "Planned"],
  ["Local grind and weld repair near inlet nozzle", "Repair", "High", "15 May 2026", "Maintenance Team", "Down PoF", "Planned"],
  ["Corrosion inhibitor review", "Process Control", "Medium", "30 Jun 2025", "Process Team", "Down PoF", "Planned"],
  ["Review PSV and isolation capability", "Engineering", "Medium", "30 Jun 2025", "Process Eng Team", "Down CoF", "Planned"],
  ["Update IOW for chloride and water content", "Process Control", "Medium", "15 May 2025", "Process Team", "Down PoF", "Planned"],
  ["Evaluate FFS if pit depth exceeds limit", "Fitness-for-Service", "Low", "15 May 2026", "Integrity Team", "Down PoF", "Planned"]
];

function badgeClass(tone?: string) {
  if (tone === "green") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (tone === "amber" || tone === "orange") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200";
  if (tone === "purple") return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/30 dark:text-purple-200";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
}

function toneForValue(value: string) {
  if (["Approved", "Compliant", "Complete", "82%", "95%"].includes(value) || value.includes("Good")) return "green";
  if (["High", "Not Acceptable", "In Review", "Request Revision"].includes(value)) return "red";
  if (["Pending", "Medium"].includes(value)) return "amber";
  return "blue";
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

function SummaryRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="space-y-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/45">
          <span className="min-w-0 text-slate-600 dark:text-slate-300">{label}</span>
          <span className="shrink-0 max-w-[160px] text-right font-bold text-slate-950 dark:text-slate-100">{value}</span>
        </div>
      ))}
    </div>
  );
}

function AssessmentSummary() {
  const { state } = useRbiData();
  return (
    <Card>
      <SectionTitle icon={ClipboardCheck} title="Assessment Summary" />
      <CardContent>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Assessment ID", state.activeAssessmentId],
            ["Tag Number", state.tagNumber],
            ["Asset Name", state.assetName],
            ["Equipment Type", state.equipmentType],
            ["Assessment Type", "Revalidation"],
            ["Methodology", "API RP 580 Ed.4 + A1 (2025), API RP 581 Ed.4 (Jan 2025)"],
            ["Calculation Library Version", "RBI-CALC-LIB-2025.01"],
            ["Status", "Ready for Approval"],
            ["Version", "2.1"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/45">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TechnicalSummary() {
  return (
    <Card>
      <SectionTitle icon={Table2} title="Technical Summary" />
      <CardContent>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {technicalCards.map((card) => (
            <div key={card.title} className="rounded-lg border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <p className="mb-3 text-sm font-bold text-blue-700 dark:text-blue-300">{card.title}</p>
              <SummaryRows rows={card.rows as Array<[string, string]>} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FinalRiskResult() {
  return (
    <Card className="border-red-200 dark:border-red-900/50">
      <SectionTitle icon={ShieldCheck} title="Final Risk Result" />
      <CardContent>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-9">
          {[
            ["Final Risk Level", "High", "red"],
            ["Numeric PoF", "3.06E-04 failures/year", "blue"],
            ["Numeric CoF", "12,850 ft2 equivalent", "blue"],
            ["Numeric Risk Value", "3.93E-03", "blue"],
            ["Risk Score", "12 / 25", "blue"],
            ["Risk Ranking", "A2", "blue"],
            ["Confidence Level", "82%", "green"],
            ["Risk Acceptability", "Not Acceptable", "red"],
            ["Residual Risk after Mitigation", "5.20E-05 failures/year (Low)", "green"]
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/45">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
              <p className={cn("mt-1 text-sm font-bold", tone === "red" && "text-red-700 dark:text-red-200", tone === "green" && "text-green-700 dark:text-green-200", tone === "blue" && "text-blue-700 dark:text-blue-200")}>{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ComplianceChecklist() {
  return (
    <Card>
      <SectionTitle icon={CheckCircle2} title="API 580 / API 581 Compliance Checklist" />
      <CardContent className="space-y-2">
        {checklist.map((item, index) => (
          <div key={item} className="flex min-w-0 items-center justify-between gap-3 text-sm">
            <span className="min-w-0 font-semibold text-slate-700 dark:text-slate-300">{index + 1}. {item}</span>
            <Badge className={badgeClass("green")}>Compliant</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function WorkflowTimeline() {
  return (
    <Card>
      <SectionTitle icon={UserCheck} title="Approval Workflow" />
      <CardContent>
        <div className="max-w-full overflow-x-auto pb-1">
          <div className="grid min-w-[920px] grid-cols-8 gap-3">
            {workflow.map(([step, owner, date, status], index) => (
              <div key={step} className="relative text-center">
                {index < workflow.length - 1 ? <span className="absolute left-1/2 top-4 h-px w-full bg-slate-200 dark:bg-slate-700" aria-hidden="true" /> : null}
                <span className={cn("relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold", status === "Approved" ? "border-green-500 bg-green-600 text-white" : status === "In Review" ? "border-amber-400 bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200" : "border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900")}>
                  {status === "Approved" ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                <p className="mt-2 text-xs font-bold text-slate-950 dark:text-slate-100">{step}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{owner}</p>
                <p className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">{date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex justify-end text-sm font-bold text-amber-700 dark:text-amber-200">Overall Status: In Review</div>
      </CardContent>
    </Card>
  );
}

function RiskAcceptance() {
  return (
    <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20">
      <SectionTitle icon={AlertTriangle} title="Risk Acceptance" />
      <CardContent>
        <div className="grid min-w-0 gap-3 xl:grid-cols-4">
          <SummaryRows rows={[["Risk Acceptance Required", "Yes"], ["Accepted Risk Level", "High"], ["Acceptance Authority", "Asset Owner (AOL)"], ["Acceptance Expiry Date", "15 May 2026"]]} />
          <div className="rounded-lg border border-amber-200 bg-white p-3 dark:border-amber-900/60 dark:bg-slate-900 xl:col-span-2">
            <p className="text-sm font-bold text-slate-950 dark:text-slate-100">Conditions of Acceptance</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
              <li>Ensure mitigation actions as planned.</li>
              <li>Maintain inspection interval 12 months.</li>
              <li>Maintain corrosion inhibitor program.</li>
              <li>Monitor IOW limits and water content.</li>
            </ul>
          </div>
          <SummaryRows rows={[["Required Mitigation Closure Date", "15 May 2026"], ["Deferral Justification", "N/A"]]} />
        </div>
      </CardContent>
    </Card>
  );
}

function CompactTable({ title, icon: Icon, columns, rows, minWidth }: { title: string; icon: LucideIcon; columns: string[]; rows: string[][]; minWidth: string }) {
  return (
    <Card>
      <SectionTitle icon={Icon} title={title} />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className={cn("w-full border-collapse text-left text-xs", minWidth)}>
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {columns.map((column) => <th key={column} className="whitespace-nowrap px-3 py-3">{column}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row, index) => (
                <tr key={`${row[0]}-${index}`} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`} className={cn("px-3 py-2 text-slate-700 dark:text-slate-300", cellIndex === 0 && "font-bold text-blue-700 dark:text-blue-300")}>
                      {cellIndex === row.length - 1 ? <Badge className={badgeClass(toneForValue(cell))}>{cell}</Badge> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function AssessorStatement() {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Assessor Statement" />
      <CardContent>
        <p className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">
          I certify that this risk assessment has been performed in accordance with API RP 580 and API RP 581 methodology, and that the information provided is true and accurate to the best of my knowledge.
        </p>
        <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
          <SummaryRows rows={[["Digital Signature", "Budi Santoso"]]} />
          <SummaryRows rows={[["Role", "Reliability Engineer"]]} />
          <SummaryRows rows={[["Date", "12 May 2025"]]} />
        </div>
      </CardContent>
    </Card>
  );
}

function CommentsCard() {
  return (
    <Card>
      <SectionTitle icon={MessageSquareText} title="Reviewer / Approver Comments" />
      <CardContent className="grid min-w-0 gap-3 lg:grid-cols-3">
        {[
          ["Technical Reviewer Comment", "Risk assessment is technically sound. Methodology and data are appropriate. Recommend approval.", "Arief Wibowo"],
          ["Owner / Client Comment", "Risk level is acceptable with mitigation plan. Proceed to implement inspection and mitigation as planned.", "Putri Ayu"],
          ["Approval Notes (Final Approver)", "All requirements met. Risk accepted with conditions. Proceed with implementation.", "Putri Ayu"]
        ].map(([title, body, name]) => (
          <div key={title} className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/45">
            <p className="text-sm font-bold text-slate-950 dark:text-slate-100">{title}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{body}</p>
            <p className="mt-3 text-right text-xs font-bold text-blue-700 dark:text-blue-300">- {name}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SideCards() {
  return (
    <>
      <Card>
        <SectionTitle icon={UserCheck} title="Approval Workflow" />
        <CardContent className="space-y-3">
          {workflow.map(([step, owner, date, status], index) => (
            <div key={step} className="flex gap-3">
              <span className={cn("mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold", status === "Approved" ? "border-green-500 bg-green-600 text-white" : status === "In Review" ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-200" : "border-slate-300 text-slate-500")}>{index + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-950 dark:text-slate-100">{step}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{owner}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{date}</p>
                <Badge className={badgeClass(toneForValue(status))}>{status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <SectionTitle icon={ShieldCheck} title="Approval Status" />
        <CardContent>
          <SummaryRows rows={[["Overall Approval Status", "In Review"], ["Next Required Action", "Owner Review"], ["Due Date", "15 May 2025"], ["Days Remaining", "2 days"], ["Escalation", "-"]]} />
        </CardContent>
      </Card>
      <Card>
        <SectionTitle icon={AlertTriangle} title="Open Issues" />
        <CardContent>
          <SummaryRows rows={[["IOW chloride limit documentation missing", "High"], ["PSV test interval record not attached", "Medium"]]} />
        </CardContent>
      </Card>
      <Card>
        <SectionTitle icon={UserCheck} title="Required Sign-Off" />
        <CardContent>
          <SummaryRows rows={[["Asset Owner (AOL)", "Required"], ["Integrity Manager", "Required"], ["HSE Manager", "Required"], ["Operations Manager", "Required"], ["Inspection Manager", "Signed"]]} />
        </CardContent>
      </Card>
      <Card>
        <SectionTitle icon={ClipboardCheck} title="Report Package Completeness" />
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#16a34a 342deg, #f59e0b 342deg 360deg)" }}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-slate-950 dark:bg-slate-900 dark:text-slate-100">95%</div>
            </div>
            <SummaryRows rows={[["Complete", "19 / 20"], ["Partial", "0 / 20"], ["Missing", "1 / 20"]]} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function RiskAssessmentWorkspaceStep8({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
        {[
          ["View Full Calculation Details", FileText],
          ["Preview RBI Report", FileText],
          ["Export RBI Report", Download],
          ["Compare Version", GitCompare],
          ["Lock Calculation Snapshot", Lock]
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

      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-4">
          <AssessmentSummary />
          <TechnicalSummary />
          <FinalRiskResult />
          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
            <ComplianceChecklist />
            <div className="min-w-0 space-y-4">
              <WorkflowTimeline />
              <RiskAcceptance />
            </div>
          </section>
          <section className="grid min-w-0 gap-4 xl:grid-cols-2">
            <CompactTable title="Revision History" icon={FileText} columns={["Version", "Date", "Updated By", "Changed Field", "Previous", "New", "Reason for Change", "Approval Status"]} rows={revisionRows} minWidth="min-w-[900px]" />
            <CompactTable title="Recommended Inspection Plan" icon={Table2} columns={["Inspection Activity", "Method / Technique", "Coverage", "Extent", "Interval", "Target Date", "Responsible Party", "Status"]} rows={inspectionPlanRows} minWidth="min-w-[900px]" />
          </section>
          <CompactTable title="Mitigation and Action Recommendation" icon={Wrench} columns={["Action", "Type", "Priority", "Target Date", "Responsible Party", "Residual Risk Impact", "Status"]} rows={mitigationRows} minWidth="min-w-[980px]" />
          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <AssessorStatement />
            <CommentsCard />
          </section>
        </main>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-1" aria-label="Review and approval sidebar">
          <SideCards />
        </aside>
      </div>
    </div>
  );
}
