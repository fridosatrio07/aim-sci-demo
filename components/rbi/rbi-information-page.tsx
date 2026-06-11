 "use client";

import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { MethodologyShortcuts } from "@/components/rbi/methodology-shortcuts";
import { RecalculationRequiredBadge } from "@/components/rbi/recalculation-required-badge";
import { RbiActivitySummary } from "@/components/rbi/rbi-activity-summary";
import { RbiKpiCard } from "@/components/rbi/rbi-kpi-card";
import { RbiQuickAccessCard } from "@/components/rbi/rbi-quick-access-card";
import { RbiRiskProfileCard } from "@/components/rbi/rbi-risk-profile-card";
import { RecentRbiAssessmentsTable } from "@/components/rbi/recent-rbi-assessments-table";
import { Badge } from "@/components/ui/badge";
import { RBI_KPI_CARDS, RBI_QUICK_ACCESS_CARDS } from "@/lib/rbi-information-data";
import { useRbiData } from "@/lib/rbi-store";

export function RbiInformationPage() {
  const { informationSummary, assessments, dataSource, syncMessage } = useRbiData();
  const staleAssessments = assessments.filter((assessment) => assessment.calculationTrace?.recalculationRequired);
  const kpiCards = RBI_KPI_CARDS.map((item) => {
    if (item.title === "Total Assessed Assets") return { ...item, value: informationSummary.totalAssessedAssets.toLocaleString("en-US"), trend: `${informationSummary.totalAssets} assets in portfolio` };
    if (item.title === "High Risk Assets") return { ...item, value: informationSummary.highRiskAssets.toLocaleString("en-US"), trend: "Live from assessment register" };
    if (item.title === "Assets Exceeding Risk Target") return { ...item, value: informationSummary.targetExceeded.toLocaleString("en-US"), trend: "Synchronized target status" };
    if (item.title === "Pending RBI Approval") return { ...item, value: informationSummary.pendingApproval.toLocaleString("en-US"), trend: "Approval workflow queue" };
    if (item.title === "Average Data Confidence") return { ...item, value: `${informationSummary.averageDataConfidence}%`, trend: "Across active assessments" };
    if (item.title === "Inspection Plans Generated from RBI") return { ...item, value: informationSummary.inspectionPlansGenerated.toLocaleString("en-US"), trend: "Generated from recommendations" };
    return item;
  });

  return (
    <div className="min-w-0 space-y-4 overflow-hidden">
      <section className="flex min-w-0 flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Risk-Based Inspection", href: "/risk-based-inspection/rbi-information" },
            { label: "RBI Information" }
          ]}
        />
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
          Risk-Based Inspection
        </p>
        <h1 className="text-2xl font-bold leading-tight text-slate-950 sm:text-3xl dark:text-slate-100">
          RBI Information
        </h1>
      </section>

      <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Badge className={dataSource === "backend" ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200"}>
          {dataSource === "backend" ? "Backend synchronized" : "Offline Prototype Mode"}
        </Badge>
        <span className="text-slate-500 dark:text-slate-400">{syncMessage}</span>
        {staleAssessments.length ? (
          <span className="inline-flex items-center gap-2">
            <RecalculationRequiredBadge trace={staleAssessments[0].calculationTrace} />
            <span>{staleAssessments.length} assessment(s) need recalculation.</span>
          </span>
        ) : null}
      </div>

      <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" aria-label="RBI KPI summary">
        {kpiCards.map((item) => (
          <RbiKpiCard key={item.title} item={item} />
        ))}
      </section>

      <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <div>
            <h2 className="mb-3 text-base font-bold text-slate-950 dark:text-slate-100">RBI Modules</h2>
            <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {RBI_QUICK_ACCESS_CARDS.map((item) => (
                <RbiQuickAccessCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <RecentRbiAssessmentsTable />
        </div>

        <aside className="grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-1">
          <RbiRiskProfileCard />
          <RbiActivitySummary />
          <div className="md:col-span-2 2xl:col-span-1">
            <MethodologyShortcuts />
          </div>
        </aside>
      </section>

    </div>
  );
}
