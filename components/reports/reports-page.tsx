"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  CalendarIcon,
  ClipboardList,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  MoreVertical,
  PieChart,
  RefreshCcw,
  Search,
  ShieldCheck
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { aimApi } from "@/lib/api-client";
import {
  GENERATED_REPORT_HISTORY,
  REPORT_FORM_OPTIONS,
  REPORT_TEMPLATES,
  type ReportFormat,
  type ReportHistoryItem,
  type ReportTemplate,
  type ReportTemplateIcon
} from "@/lib/reports-data";
import { cn } from "@/lib/utils";

const templateIcons: Record<ReportTemplateIcon, typeof BarChart3> = {
  BarChart3,
  ShieldCheck,
  ClipboardList,
  CalendarDays,
  AlertTriangle,
  BadgeCheck,
  FileCheck,
  PieChart
};

const templateToneClasses: Record<ReportTemplate["tone"], string> = {
  blue: "from-blue-700 to-blue-500",
  orange: "from-orange-500 to-amber-500",
  green: "from-emerald-600 to-green-500",
  purple: "from-violet-600 to-purple-500",
  red: "from-red-600 to-rose-500",
  teal: "from-teal-600 to-cyan-500",
  indigo: "from-indigo-700 to-blue-700"
};

const formatBadgeClasses: Record<ReportFormat, string> = {
  PDF: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200",
  Excel: "border-green-200 bg-green-50 text-green-700 dark:border-green-900/70 dark:bg-green-950/40 dark:text-green-200",
  CSV: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-200"
};

const fileIcons: Record<ReportFormat, typeof FileText> = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  CSV: FileText
};

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
      {children}
      {required ? <span className="ml-1 text-red-500">*</span> : null}
    </label>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  "aria-label": ariaLabel
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  "aria-label": string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-900/50"
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect
}: {
  template: ReportTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = templateIcons[template.icon];

  return (
    <Card className={cn("group flex min-h-[214px] flex-col p-4 text-center transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]", selected && "ring-2 ring-blue-600")}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm">
        <span className={cn("absolute h-14 w-14 rounded-full bg-gradient-to-br", templateToneClasses[template.tone])} aria-hidden="true" />
        <Icon className="relative h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-bold leading-5 text-slate-950">{template.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{template.description}</p>
      <Button type="button" variant={selected ? "default" : "outline"} className="mt-4 w-full" onClick={onSelect}>
        Select
      </Button>
    </Card>
  );
}

function GenerateReportCard({
  selectedType,
  onSelectedTypeChange,
  onGenerated
}: {
  selectedType: string;
  onSelectedTypeChange: (value: string) => void;
  onGenerated: (item: ReportHistoryItem) => void;
}) {
  const [site, setSite] = useState(REPORT_FORM_OPTIONS.sites[0]);
  const [unit, setUnit] = useState(REPORT_FORM_OPTIONS.units[0]);
  const [assetType, setAssetType] = useState(REPORT_FORM_OPTIONS.assetTypes[0]);
  const [riskLevel, setRiskLevel] = useState(REPORT_FORM_OPTIONS.riskLevels[0]);
  const [format, setFormat] = useState<ReportFormat>("PDF");
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleGenerate() {
    setMessage("");

    if (!selectedType) {
      setError("Please select a report type before generating a report.");
      return;
    }

    setError("");
    setMessage("Report generation started in prototype mode.");
    window.alert("Report generation started in prototype mode.");
    onGenerated({
      reportName: `${selectedType.replaceAll(" ", "_")}_Prototype_20250510.${format === "Excel" ? "xlsx" : format.toLowerCase()}`,
      reportType: selectedType,
      generatedBy: "Budi Santoso",
      generatedDate: "10 May 2025 15:00",
      format,
      dateRange: "01/05/2025 - 10/05/2025",
      status: "Completed",
      fileSize: includeAttachments ? "2.80 MB" : "1.24 MB"
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Generate Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-1">
          <div className="space-y-2">
            <FieldLabel required>Report Type</FieldLabel>
            <SelectField
              aria-label="Report Type"
              value={selectedType}
              onChange={onSelectedTypeChange}
              options={REPORT_TEMPLATES.map((template) => template.title)}
              placeholder="Select report type"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel required>Site</FieldLabel>
            <SelectField aria-label="Site" value={site} onChange={setSite} options={REPORT_FORM_OPTIONS.sites} />
          </div>
          <div className="space-y-2">
            <FieldLabel>Unit</FieldLabel>
            <SelectField aria-label="Unit" value={unit} onChange={setUnit} options={REPORT_FORM_OPTIONS.units} />
          </div>
          <div className="space-y-2">
            <FieldLabel>Asset Type</FieldLabel>
            <SelectField aria-label="Asset Type" value={assetType} onChange={setAssetType} options={REPORT_FORM_OPTIONS.assetTypes} />
          </div>
          <div className="space-y-2">
            <FieldLabel>Risk Level</FieldLabel>
            <SelectField aria-label="Risk Level" value={riskLevel} onChange={setRiskLevel} options={REPORT_FORM_OPTIONS.riskLevels} />
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-1">
            <FieldLabel required>Date Range</FieldLabel>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              <CalendarIcon className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <span>01/05/2025</span>
              <span className="text-slate-400">-</span>
              <span>10/05/2025</span>
              <CalendarIcon className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-1">
            <FieldLabel required>Report Format</FieldLabel>
            <div className="flex flex-wrap gap-4">
              {REPORT_FORM_OPTIONS.formats.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="reportFormat"
                    checked={format === item}
                    onChange={() => setFormat(item)}
                    className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-600"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <label className="flex min-w-0 items-start gap-3 md:col-span-2 xl:col-span-1">
            <input
              type="checkbox"
              checked={includeAttachments}
              onChange={(event) => setIncludeAttachments(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
            />
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Include Attachments</span>
              <span className="block text-xs leading-5 text-slate-500">Include supporting documents, charts and evidence if available.</span>
            </span>
          </label>
        </div>

        {error ? <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200">{error}</div> : null}
        {message ? <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-200">{message}</div> : null}

        <Button type="button" className="mt-5 w-full" onClick={handleGenerate}>
          <FileCheck className="h-4 w-4" aria-hidden="true" />
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
}

function ReportHistoryTable({ rows }: { rows: ReportHistoryItem[] }) {
  const [search, setSearch] = useState("");
  const filteredRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => `${row.reportName} ${row.generatedBy}`.toLowerCase().includes(normalized));
  }, [rows, search]);

  return (
    <Card>
      <CardHeader className="flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-base">Generated Report History</CardTitle>
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative min-w-0 flex-1 md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search report name or generated by..." />
          </div>
          <Button type="button" variant="outline" className="shrink-0">
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 dark:bg-slate-950/50">
              <tr>
                {["Report Name", "Report Type", "Generated By", "Generated Date", "Format", "Date Range", "Status", "File Size", "Action"].map((heading) => (
                  <th key={heading} className="border-b border-slate-200 px-3 py-2 font-bold dark:border-slate-800">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const FileIcon = fileIcons[row.format];
                const canDownload = row.status === "Completed";

                return (
                  <tr key={`${row.reportName}-${row.generatedDate}`} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileIcon className={cn("h-4 w-4 shrink-0", row.format === "PDF" ? "text-red-600" : row.format === "Excel" ? "text-green-600" : "text-blue-600")} aria-hidden="true" />
                        <span className="truncate font-bold text-blue-700 dark:text-blue-300">{row.reportName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-700">{row.reportType}</td>
                    <td className="px-3 py-2 text-slate-600">{row.generatedBy}</td>
                    <td className="px-3 py-2 text-slate-600">{row.generatedDate}</td>
                    <td className="px-3 py-2">
                      <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-bold", formatBadgeClasses[row.format])}>{row.format}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{row.dateRange}</td>
                    <td className="px-3 py-2"><Badge variant={row.status === "Completed" ? "green" : "red"}>{row.status}</Badge></td>
                    <td className="px-3 py-2 font-semibold text-slate-700">{row.fileSize}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={!canDownload} aria-label={`Download ${row.reportName}`}>
                          <Download className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label={`More actions for ${row.reportName}`}>
                          <MoreVertical className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-3 text-xs text-slate-600 lg:flex-row lg:items-center lg:justify-between">
          <span>Showing 1 to 8 of 126 reports</span>
          <div className="flex flex-wrap items-center gap-2">
            {["Previous", "1", "2", "3", "4", "5", "...", "16", "Next"].map((item) => (
              <button
                key={item}
                type="button"
                className={cn("rounded-md border border-slate-200 px-3 py-1.5 font-semibold dark:border-slate-700", item === "1" ? "bg-blue-700 text-white" : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800")}
              >
                {item}
              </button>
            ))}
            <select className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" aria-label="Reports per page">
              <option>10 / page</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportsPageContent() {
  const [selectedType, setSelectedType] = useState("");
  const [history, setHistory] = useState<ReportHistoryItem[]>(GENERATED_REPORT_HISTORY);
  const [dataMode, setDataMode] = useState<"loading" | "backend" | "offline">("loading");

  useEffect(() => {
    let mounted = true;
    void aimApi
      .reportHistory()
      .then((response) => {
        if (!mounted) return;
        setHistory(response.items);
        setDataMode("backend");
      })
      .catch(() => {
        if (mounted) setDataMode("offline");
      });
    return () => {
      mounted = false;
    };
  }, []);

  function handleGenerated(item: ReportHistoryItem) {
    setHistory((current) => [item, ...current]);
  }

  return (
    <div className="min-w-0 space-y-4 overflow-hidden pb-5">
      <section className="min-w-0">
        <h1 className="text-2xl font-bold text-slate-950">Reports</h1>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Generate and export reports for asset integrity, inspection, RBI and compliance.
        </p>
      </section>

      <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Badge className={dataMode === "backend" ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200"}>
          {dataMode === "backend" ? "Backend API" : dataMode === "loading" ? "Checking backend" : "Offline Prototype Mode"}
        </Badge>
        <span>{dataMode === "offline" ? "Backend is unavailable; report history is fallback-only legacy data." : "Report history is synchronized from backend documents and report records."}</span>
      </div>

      <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_440px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {REPORT_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={selectedType === template.title}
                  onSelect={() => setSelectedType(template.title)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <GenerateReportCard selectedType={selectedType} onSelectedTypeChange={setSelectedType} onGenerated={handleGenerated} />
      </section>

      <ReportHistoryTable rows={history} />
    </div>
  );
}
