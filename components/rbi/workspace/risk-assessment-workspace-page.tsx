"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  Home,
  Info,
  Plus,
  RefreshCw,
  RotateCw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Target,
  X,
  XCircle
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RiskAssessmentWorkspaceStep2 } from "@/components/rbi/workspace/step2/risk-assessment-workspace-step2";
import { RiskAssessmentWorkspaceStep3 } from "@/components/rbi/workspace/step3/risk-assessment-workspace-step3";
import { RiskAssessmentWorkspaceStep4 } from "@/components/rbi/workspace/step4/risk-assessment-workspace-step4";
import { RiskAssessmentWorkspaceStep5 } from "@/components/rbi/workspace/step5/risk-assessment-workspace-step5";
import { RiskAssessmentWorkspaceStep6 } from "@/components/rbi/workspace/step6/risk-assessment-workspace-step6";
import { RiskAssessmentWorkspaceStep7 } from "@/components/rbi/workspace/step7/risk-assessment-workspace-step7";
import { RiskAssessmentWorkspaceStep8 } from "@/components/rbi/workspace/step8/risk-assessment-workspace-step8";
import {
  ASSESSMENT_INFO,
  METHODOLOGY_BASIS,
  METHODOLOGY_SUBMISSION,
  PLAN_PERIOD,
  RISK_CRITERIA_TARGET,
  SCOPE_BOUNDARY,
  SUPPORTING_DOCUMENTS,
  VALIDATION_STATUS,
  WORKSPACE_STEPS
} from "@/lib/risk-assessment-workspace-data";
import { useRbiData } from "@/lib/rbi-store";
import { isFileProtocol, navigateToAppRoute } from "@/lib/static-navigation";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

function Required() {
  return <span className="text-red-500" aria-label="required">*</span>;
}

function useWorkspaceToast() {
  const [message, setMessage] = useState("");

  function showToast(nextMessage: string) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(""), 2600);
  }

  return { message, showToast };
}

function Toast({ message }: { message: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed right-4 top-[calc(var(--app-header-height)+1rem)] z-50 max-w-[calc(100vw-2rem)] rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800 shadow-lg transition dark:border-blue-500/30 dark:bg-blue-950/80 dark:text-blue-100",
        message ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      )}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

function Breadcrumb({ activeStep }: { activeStep: number }) {
  const items = [
    { label: "Risk-Based Inspection", href: "/risk-based-inspection/rbi-information" },
    { label: "Risk Assessment Workspace", href: "/risk-based-inspection/risk-assessment-workspace" }
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
      <Link href="/dashboard" prefetch={false} className="flex items-center gap-1 rounded text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300" aria-label="Dashboard">
        <Home className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
      <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {items.map((item, index) => (
        <span key={item.label} className="flex min-w-0 items-center gap-1">
          <Link
            href={item.href}
            prefetch={false}
            className={cn("truncate hover:text-blue-700 dark:hover:text-blue-300", index === items.length - 1 && "text-blue-700 dark:text-blue-300")}
          >
            {item.label}
          </Link>
          {index < items.length - 1 ? <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
        </span>
      ))}
      <span className="sr-only">Active step {activeStep}</span>
    </nav>
  );
}

function WorkspaceStepper({ activeStep }: { activeStep: number }) {
  const compactLabels: Record<number, string> = {
    1: "Assessment Basis",
    2: "Asset & Operating Info",
    3: "Damage Mechanism Review",
    4: "PoF Evaluation",
    5: "CoF Evaluation",
    6: "Risk & Target",
    7: "Inspection & Mitigation",
    8: "Review & Acceptance"
  };

  return (
    <Card className="overflow-hidden">
      <div className="max-w-full overflow-x-auto px-3 py-4 lg:px-4">
        <ol className="grid min-w-[760px] grid-cols-8 gap-0 lg:min-w-0">
          {WORKSPACE_STEPS.map((step, index) => {
            const active = step.number === activeStep;
            const completed = step.number < activeStep;

            return (
              <li key={step.number} className="relative flex min-w-0 flex-col items-center text-center">
                {index > 0 ? <span className={cn("absolute left-0 top-3.5 h-px w-1/2", completed || active ? "bg-green-300 dark:bg-green-700" : "bg-slate-200 dark:bg-slate-700")} aria-hidden="true" /> : null}
                {index < WORKSPACE_STEPS.length - 1 ? <span className={cn("absolute right-0 top-3.5 h-px w-1/2", completed ? "bg-green-300 dark:bg-green-700" : "bg-slate-200 dark:bg-slate-700")} aria-hidden="true" /> : null}
                <span
                  className={cn(
                    "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold",
                    active
                      ? "border-blue-600 bg-blue-700 text-white shadow-sm shadow-blue-500/20 dark:border-blue-400 dark:bg-blue-500"
                      : completed
                        ? "border-green-500 bg-green-600 text-white dark:border-green-400 dark:bg-green-500"
                      : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  )}
                >
                  {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : step.number}
                </span>
                <span className={cn("mt-2 max-w-[96px] text-[10px] font-bold leading-3 lg:max-w-[108px] lg:text-[11px]", active ? "text-blue-700 dark:text-blue-300" : completed ? "text-green-700 dark:text-green-300" : "text-slate-500 dark:text-slate-400")}>
                  {compactLabels[step.number] ?? step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
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

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {children} {required ? <Required /> : null}
    </label>
  );
}

function SelectControl({ value, options, onChange, ariaLabel }: { value: string; options: string[]; onChange: (value: string) => void; ariaLabel: string }) {
  return (
    <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function SearchField({ value, onChange, ariaLabel }: { value: string; onChange: (value: string) => void; ariaLabel: string }) {
  return (
    <div className="flex min-w-0 gap-2">
      <Input value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel} className="min-w-0 font-semibold" />
      <Button type="button" variant="outline" size="icon" aria-label={`Search ${ariaLabel}`}>
        <Search className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function AssessmentInformationCard() {
  const { state: rbiState, updateAssessment } = useRbiData();
  const [assessmentType, setAssessmentType] = useState(ASSESSMENT_INFO.assessmentType);
  const [assessor, setAssessor] = useState(ASSESSMENT_INFO.assessor);
  const [reviewer, setReviewer] = useState(ASSESSMENT_INFO.reviewer);
  const [clientStatus, setClientStatus] = useState(ASSESSMENT_INFO.clientRepresentativeStatus.value);

  return (
    <Card>
      <SectionTitle icon={FileText} title="Assessment Information" />
      <CardContent>
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <div className="min-w-0 space-y-1.5">
            <FieldLabel required>Assessment ID</FieldLabel>
            <Input value={rbiState.activeAssessmentId} onChange={(event) => updateAssessment({ activeAssessmentId: event.target.value })} className="font-semibold" />
          </div>
          <div className="min-w-0 space-y-2">
            <FieldLabel required>Assessment Type</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {ASSESSMENT_INFO.assessmentTypes.map((type) => (
                <label key={type} className={cn("flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm font-semibold", assessmentType === type ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/50 dark:bg-blue-950/35 dark:text-blue-200" : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300")}>
                  <input type="radio" name="assessmentType" value={type} checked={assessmentType === type} onChange={() => setAssessmentType(type)} className="h-4 w-4 accent-blue-700" />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div className="min-w-0 space-y-1.5">
            <FieldLabel required>Assessment Date</FieldLabel>
            <div className="relative">
              <Input value={rbiState.assessmentDate} onChange={(event) => updateAssessment({ assessmentDate: event.target.value })} className="pr-10 font-semibold" />
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>
          <div className="min-w-0 space-y-1.5">
            <FieldLabel required>Client / Asset Owner Representative</FieldLabel>
            <SelectControl value={clientStatus} options={ASSESSMENT_INFO.clientRepresentativeStatus.options} onChange={setClientStatus} ariaLabel="Client or asset owner representative status" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <FieldLabel required>Assessor</FieldLabel>
            <SearchField value={assessor} onChange={setAssessor} ariaLabel="Assessor" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <FieldLabel required>Reviewer</FieldLabel>
            <SearchField value={reviewer} onChange={setReviewer} ariaLabel="Reviewer" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MethodologyBasisCard() {
  const [values, setValues] = useState({
    rbiProgramStandard: METHODOLOGY_BASIS.rbiProgramStandard.value,
    calculationMethodology: METHODOLOGY_BASIS.calculationMethodology.value,
    calculationMode: METHODOLOGY_BASIS.calculationMode.value,
    cofMethod: METHODOLOGY_BASIS.cofMethod.value,
    internalProcedureVersion: METHODOLOGY_BASIS.internalProcedureVersion,
    calculationLibraryVersion: METHODOLOGY_BASIS.calculationLibraryVersion
  });

  function update(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <Card>
      <SectionTitle icon={Settings} title="Methodology Basis" />
      <CardContent>
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel required>RBI Program Standard</FieldLabel>
            <SelectControl value={values.rbiProgramStandard} options={METHODOLOGY_BASIS.rbiProgramStandard.options} onChange={(value) => update("rbiProgramStandard", value)} ariaLabel="RBI Program Standard" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel required>Calculation Methodology</FieldLabel>
            <SelectControl value={values.calculationMethodology} options={METHODOLOGY_BASIS.calculationMethodology.options} onChange={(value) => update("calculationMethodology", value)} ariaLabel="Calculation Methodology" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel required>Calculation Mode</FieldLabel>
            <SelectControl value={values.calculationMode} options={METHODOLOGY_BASIS.calculationMode.options} onChange={(value) => update("calculationMode", value)} ariaLabel="Calculation Mode" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel required>CoF Method</FieldLabel>
            <SelectControl value={values.cofMethod} options={METHODOLOGY_BASIS.cofMethod.options} onChange={(value) => update("cofMethod", value)} ariaLabel="CoF Method" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel required>Internal RBI Procedure Version</FieldLabel>
            <Input value={values.internalProcedureVersion} onChange={(event) => update("internalProcedureVersion", event.target.value)} className="font-semibold" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel required>Calculation Library Version</FieldLabel>
            <Input value={values.calculationLibraryVersion} onChange={(event) => update("calculationLibraryVersion", event.target.value)} className="font-semibold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComponentList({ title, items, variant }: { title: string; items: string[]; variant: "include" | "exclude" }) {
  const Icon = variant === "include" ? Check : X;
  const color = variant === "include" ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300";

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/45">
      <p className="text-sm font-bold text-slate-950 dark:text-slate-100">{title}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Icon className={cn("h-4 w-4 shrink-0", color)} aria-hidden="true" />
            <span className="min-w-0">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <textarea
        value={value}
        maxLength={500}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[92px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium leading-6 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <p className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400">{value.length} / 500</p>
    </div>
  );
}

function ScopeBoundariesCard() {
  const { state: rbiState, updateAssessment } = useRbiData();
  const [physical, setPhysical] = useState(SCOPE_BOUNDARY.physicalBoundaryDescription);
  const [process, setProcess] = useState(SCOPE_BOUNDARY.processBoundaryDescription);
  const [note, setNote] = useState(SCOPE_BOUNDARY.assessmentScopeNote);

  return (
    <Card>
      <SectionTitle icon={FolderOpen} title="Scope and Boundaries" />
      <CardContent className="space-y-4">
        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <FieldLabel required>Tag Number</FieldLabel>
            <Input value={rbiState.tagNumber} onChange={(event) => updateAssessment({ tagNumber: event.target.value })} className="font-semibold" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel required>Asset Name</FieldLabel>
            <Input value={rbiState.assetName} onChange={(event) => updateAssessment({ assetName: event.target.value })} className="font-semibold" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <FieldLabel required>Equipment Type</FieldLabel>
              <Info className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            </div>
            <SelectControl value={rbiState.equipmentType} options={SCOPE_BOUNDARY.equipmentType.options} onChange={(value) => updateAssessment({ equipmentType: value })} ariaLabel="Equipment Type" />
          </div>
        </div>
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          <ComponentList title="Included Components" items={SCOPE_BOUNDARY.includedComponents} variant="include" />
          <ComponentList title="Excluded Components" items={SCOPE_BOUNDARY.excludedComponents} variant="exclude" />
        </div>
        <TextAreaField required label="Physical Boundary Description" value={physical} onChange={setPhysical} />
        <TextAreaField required label="Process Boundary Description" value={process} onChange={setProcess} />
        <TextAreaField label="Assessment Scope Note (Optional)" value={note} onChange={setNote} />
      </CardContent>
    </Card>
  );
}

function SupportingDocumentsCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={FileText} title="Supporting Documents" />
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                {["#", "Document Type", "Document Title / Description", "Document No.", "Revision", "Last Updated", "Source", "Action"].map((column) => (
                  <th key={column} className="px-2 py-2">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SUPPORTING_DOCUMENTS.map((document, index) => (
                <tr key={document.documentNo} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-2 py-2 font-bold text-slate-400">{index + 1}</td>
                  <td className="max-w-[132px] px-2 py-2 font-semibold text-slate-700 dark:text-slate-300">{document.documentType}</td>
                  <td className="min-w-[190px] px-2 py-2 font-bold text-slate-950 dark:text-slate-100">{document.title}</td>
                  <td className="whitespace-nowrap px-2 py-2 font-mono text-[11px] font-bold text-blue-700 dark:text-blue-300">{document.documentNo}</td>
                  <td className="whitespace-nowrap px-2 py-2">{document.revision}</td>
                  <td className="whitespace-nowrap px-2 py-2">{document.lastUpdated}</td>
                  <td className="max-w-[120px] px-2 py-2">{document.source}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => onAction(`Preview prepared for ${document.documentNo}.`)} className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={`Preview ${document.documentNo}`}>
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => onAction(`Download prepared for ${document.documentNo}.`)} className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={`Download ${document.documentNo}`}>
                        <Download className="h-4 w-4" aria-hidden="true" />
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

function RiskCriteriaCard() {
  const [riskBasis, setRiskBasis] = useState(RISK_CRITERIA_TARGET.riskBasis.value);
  const [matrix, setMatrix] = useState(RISK_CRITERIA_TARGET.riskMatrixConfiguration.value);
  const [authority, setAuthority] = useState(RISK_CRITERIA_TARGET.riskAcceptanceAuthority.value);

  return (
    <Card>
      <SectionTitle icon={Target} title="Risk Criteria and Target" />
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <FieldLabel required>Risk Basis</FieldLabel>
          <SelectControl value={riskBasis} options={RISK_CRITERIA_TARGET.riskBasis.options} onChange={setRiskBasis} ariaLabel="Risk Basis" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel required>Risk Matrix Configuration</FieldLabel>
          <div className="flex gap-2">
            <SelectControl value={matrix} options={RISK_CRITERIA_TARGET.riskMatrixConfiguration.options} onChange={setMatrix} ariaLabel="Risk Matrix Configuration" />
            <Button type="button" variant="outline" size="icon" aria-label="Open risk matrix configuration">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Risk Target <Required /> <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <p className="mt-2 text-sm font-bold text-slate-950 dark:text-slate-100">{RISK_CRITERIA_TARGET.riskTarget}</p>
        </div>
        <div className="space-y-2">
          {RISK_CRITERIA_TARGET.targetParameters.map((item) => (
            <div key={item.label} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/55">
              <span className="min-w-0 text-slate-600 dark:text-slate-300">{item.label}</span>
              <span className="shrink-0 text-right font-bold text-slate-950 dark:text-slate-100">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <FieldLabel required>Risk Acceptance Authority</FieldLabel>
          <SelectControl value={authority} options={RISK_CRITERIA_TARGET.riskAcceptanceAuthority.options} onChange={setAuthority} ariaLabel="Risk Acceptance Authority" />
        </div>
      </CardContent>
    </Card>
  );
}

function PlanPeriodCard() {
  const [targetLogic, setTargetLogic] = useState(PLAN_PERIOD.targetDateLogic.value);
  const [codeConstraint, setCodeConstraint] = useState(PLAN_PERIOD.applicableCodeConstraint.value);

  return (
    <Card>
      <SectionTitle icon={CalendarDays} title="Plan Period" />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InfoTile label="RBI Date" value={PLAN_PERIOD.rbiDate} />
          <InfoTile label="Plan Date" value={PLAN_PERIOD.planDate} />
        </div>
        <div className="space-y-1.5">
          <FieldLabel required>Target Date Logic</FieldLabel>
          <SelectControl value={targetLogic} options={PLAN_PERIOD.targetDateLogic.options} onChange={setTargetLogic} ariaLabel="Target Date Logic" />
        </div>
        <InfoTile label="Turnaround Alignment" value={PLAN_PERIOD.turnaroundAlignment} />
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <FieldLabel required>Applicable Code Constraint</FieldLabel>
            <Info className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          </div>
          <SelectControl value={codeConstraint} options={PLAN_PERIOD.applicableCodeConstraint.options} onChange={setCodeConstraint} ariaLabel="Applicable Code Constraint" />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/45">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold leading-5 text-slate-950 dark:text-slate-100">{value}</p>
    </div>
  );
}

function MethodologySubmissionCard() {
  const readiness = METHODOLOGY_SUBMISSION.overallReadiness;

  return (
    <Card>
      <SectionTitle icon={CheckCircle2} title="Methodology Submission" />
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(#16a34a ${readiness * 3.6}deg, rgba(148,163,184,0.25) 0deg)` }}
            aria-label={`Overall readiness ${readiness}%`}
          >
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white text-center dark:bg-slate-900">
              <span className="text-xl font-bold text-slate-950 dark:text-slate-100">{readiness}%</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Ready</span>
            </div>
          </div>
          <div className="min-w-0">
            <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200">{METHODOLOGY_SUBMISSION.status}</Badge>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{METHODOLOGY_SUBMISSION.description}</p>
          </div>
        </div>
        <div className="space-y-2">
          {METHODOLOGY_SUBMISSION.items.map((item) => (
            <div key={item.label} className="flex min-w-0 items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
                {item.tone ? <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", item.tone === "green" && "bg-green-500", item.tone === "amber" && "bg-yellow-400", item.tone === "red" && "bg-red-500")} /> : <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />}
                {item.label}
              </span>
              <span className="shrink-0 font-bold text-slate-950 dark:text-slate-100">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ValidationStatusCard({ onAction }: { onAction: (message: string) => void }) {
  return (
    <Card>
      <SectionTitle icon={ShieldCheck} title="Methodology Validation Status" />
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-3 dark:border-green-900/60 dark:bg-green-950/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-green-700 dark:text-green-200">{VALIDATION_STATUS.status}</p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{VALIDATION_STATUS.description}</p>
          </div>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={() => onAction("Validation report is prepared for future development.")}>
          View Validation Report
        </Button>
      </CardContent>
    </Card>
  );
}

function StepHeader({ activeStep, onAction }: { activeStep: number; onAction: (message: string) => void }) {
  const title =
    activeStep === 8
      ? "Step 8: Review, Approval & Risk Acceptance"
      : activeStep === 7
      ? "Step 7: Inspection & Mitigation Recommendation"
      : activeStep === 6
      ? "Step 6: Risk Determination & Risk Target"
      : activeStep === 5
      ? "Step 5: Consequence of Failure (CoF) Evaluation"
      : activeStep === 4
      ? "Step 4: Probability of Failure (PoF) Evaluation"
      : activeStep === 3
      ? "Step 3: Damage Mechanism Review"
      : activeStep === 2
        ? "Step 2: Asset, Component & Operating Information"
      : "Step 1: Assessment Basis";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">{title}</h2>
            <Info className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
          </div>
        </div>
        {activeStep === 5 ? (
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
            <Button type="button" variant="outline" onClick={() => onAction("CoF evaluation guidance is prepared for future development.")}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Guidance
              <span className="text-xs font-semibold opacity-75">API RP 581</span>
            </Button>
            <Button type="button" variant="outline" onClick={() => onAction("CoF calculation detail view is prepared for future development.")}>
              <Calculator className="h-4 w-4" aria-hidden="true" />
              View Calculation
              <span className="text-xs font-semibold opacity-75">Details</span>
            </Button>
            <Button type="button" variant="outline" onClick={() => onAction("CoF data refreshed in prototype mode.")}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh Data
            </Button>
          </div>
        ) : activeStep === 4 ? (
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
            <Button type="button" variant="outline" onClick={() => onAction("PoF evaluation guidance is prepared for future development.")}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Guidance
              <span className="text-xs font-semibold opacity-75">API RP 581</span>
            </Button>
            <Button type="button" variant="outline" onClick={() => onAction("Calculation detail view is prepared for future development.")}>
              <Calculator className="h-4 w-4" aria-hidden="true" />
              View Calculation
              <span className="text-xs font-semibold opacity-75">Details</span>
            </Button>
            <Button type="button" variant="outline" onClick={() => onAction("PoF data refreshed in prototype mode.")}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh Data
            </Button>
          </div>
        ) : activeStep === 2 ? (
          <Button type="button" variant="outline" className="shrink-0" onClick={() => onAction("Calculation readiness review is prepared for future development.")}>
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            View Calculation Readiness
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function ActionBar({
  activeStep,
  onAction,
  onPrevious,
  onNext
}: {
  activeStep: number;
  onAction: (message: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (activeStep === 8) {
    return (
      <Card className="border-blue-100 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/20">
        <div className="flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            <Button type="button" onClick={() => onAction("Assessment submitted for review in prototype mode.")}>
              <Send className="h-4 w-4" aria-hidden="true" />
              Submit for Review
            </Button>
            <Button type="button" className="bg-orange-600 hover:bg-orange-700" onClick={() => onAction("Revision request is prepared for future development.")}>
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Request Revision
            </Button>
            <Button type="button" className="bg-red-700 hover:bg-red-800" onClick={() => onAction("Risk assessment rejection is prepared for future development.")}>
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Reject
            </Button>
            <Button type="button" className="bg-green-700 hover:bg-green-800" onClick={() => onAction("Risk assessment approved in prototype mode.")}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Approve
            </Button>
            <Button type="button" variant="outline" onClick={() => onAction("RBI report export started in prototype mode.")}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Export RBI Report
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (activeStep === 7) {
    return (
      <Card className="border-blue-100 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/20">
        <div className="flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button type="button" variant="outline" onClick={() => onAction("Add Mitigation Action is prepared for future development.")}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Mitigation Action
            </Button>
            <Button type="button" variant="outline" onClick={() => onAction("Draft saved in prototype mode.")}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Draft
            </Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button type="button" onClick={() => onAction("Recommendation saved in prototype mode.")}>
              Save Recommendation
            </Button>
            <Button type="button" className="bg-green-700 hover:bg-green-800" onClick={onNext}>
              Continue to Review, Approval & Risk Acceptance
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (activeStep === 6) {
    return (
      <Card className="border-blue-100 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/20">
        <div className="flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button type="button" variant="outline" onClick={() => onAction("Risk result saved in prototype mode.")}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Result
            </Button>
            <Button type="button" variant="outline" onClick={() => onAction("Risk recalculation is prepared for future development.")}>
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Recalculate Risk
            </Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
              <span className="text-xs font-semibold opacity-75">Step 5: CoF Calculation</span>
            </Button>
            <Button type="button" onClick={onNext}>
              Continue to Inspection & Mitigation Recommendation
              <span className="text-xs font-semibold opacity-80">Step 7</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-blue-100 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/20">
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <Button type="button" variant="outline" onClick={() => onAction("Draft saved in prototype mode.")}>
          <Save className="h-4 w-4" aria-hidden="true" />
          Save Draft
        </Button>
        {activeStep === 4 || activeStep === 5 ? <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Draft saved: 12 May 2025 10:30 WIB</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
          <Button type="button" variant="outline" disabled={activeStep === 1} onClick={onPrevious}>
            Previous
          </Button>
          <Button type="button" onClick={onNext}>
            {activeStep === 5 ? "Continue to Risk Determination" : activeStep === 4 ? "Continue to CoF Evaluation" : activeStep === 3 ? "Continue to PoF Evaluation" : "Next"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onAction("Assessment saved for later in prototype mode.")}>
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Save & Continue Later
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function RiskAssessmentWorkspacePage() {
  const { message, showToast } = useWorkspaceToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hashStepParam =
    typeof window !== "undefined" && isFileProtocol()
      ? Number(new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("step"))
      : Number.NaN;
  const stepParam = Number.isFinite(hashStepParam) && hashStepParam > 0 ? hashStepParam : Number(searchParams.get("step"));
  const activeStep = stepParam >= 1 && stepParam <= 8 ? stepParam : 1;

  function goToStep(step: number) {
    const workspacePath = "/risk-based-inspection/risk-assessment-workspace";
    const targetPath = isFileProtocol() ? workspacePath : pathname;
    navigateToAppRoute(router, step === 1 ? targetPath : `${targetPath}?step=${step}`);
  }

  function handlePrevious() {
    if (activeStep > 1) {
      goToStep(activeStep - 1);
    }
  }

  function handleNext() {
    if (activeStep === 1) {
      goToStep(2);
      return;
    }

    if (activeStep >= 2 && activeStep <= 7) {
      goToStep(activeStep + 1);
      return;
    }

    showToast("Assessment workflow is complete in this prototype.");
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 overflow-hidden">
      <Toast message={message} />

      <header className="min-w-0 space-y-2">
        <Breadcrumb activeStep={activeStep} />
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Risk-Based Inspection</p>
        <h1 className="text-2xl font-bold leading-tight text-slate-950 sm:text-3xl dark:text-slate-100">Risk Assessment Workspace</h1>
      </header>

      <WorkspaceStepper activeStep={activeStep} />

      <StepHeader activeStep={activeStep} onAction={showToast} />

      {activeStep === 8 ? (
        <RiskAssessmentWorkspaceStep8 onAction={showToast} />
      ) : activeStep === 7 ? (
        <RiskAssessmentWorkspaceStep7 onAction={showToast} />
      ) : activeStep === 6 ? (
        <RiskAssessmentWorkspaceStep6 onAction={showToast} />
      ) : activeStep === 5 ? (
        <RiskAssessmentWorkspaceStep5 onAction={showToast} />
      ) : activeStep === 4 ? (
        <RiskAssessmentWorkspaceStep4 onAction={showToast} />
      ) : activeStep === 3 ? (
        <RiskAssessmentWorkspaceStep3 onAction={showToast} />
      ) : activeStep === 2 ? (
        <RiskAssessmentWorkspaceStep2 onAction={showToast} />
      ) : (
        <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-4">
            <AssessmentInformationCard />
            <MethodologyBasisCard />
            <ScopeBoundariesCard />
            <SupportingDocumentsCard onAction={showToast} />
          </main>
          <aside className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-1" aria-label="Assessment basis side summary">
            <RiskCriteriaCard />
            <PlanPeriodCard />
            <MethodologySubmissionCard />
            <ValidationStatusCard onAction={showToast} />
          </aside>
        </div>
      )}

      <ActionBar activeStep={activeStep} onAction={showToast} onPrevious={handlePrevious} onNext={handleNext} />
    </div>
  );
}
