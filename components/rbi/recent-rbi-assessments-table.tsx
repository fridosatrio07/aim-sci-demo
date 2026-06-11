"use client";

import Link from "next/link";
import { CheckCircle2, Eye, MoreVertical, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecalculationRequiredBadge } from "@/components/rbi/recalculation-required-badge";
import {
  RBI_RISK_LEGEND,
  type RbiAssessmentStatus,
  type RbiTargetStatus
} from "@/lib/rbi-information-data";
import { useRbiData } from "@/lib/rbi-store";
import { cn } from "@/lib/utils";

function riskVariant(risk: string) {
  if (risk === "Low") return "green";
  if (risk === "Medium") return "yellow";
  if (risk === "Extreme" || risk === "Very High") return "red";
  return "orange";
}

function targetBadgeClass(status: RbiTargetStatus) {
  return status === "Exceeded"
    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
    : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
}

function assessmentStatusClass(status: RbiAssessmentStatus) {
  if (status === "Approved") {
    return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  }
  if (status === "In Progress") {
    return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200";
  }
  if (status === "Under Review") {
    return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/35 dark:text-orange-200";
  }
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

export function RecentRbiAssessmentsTable() {
  const { assessments: storeAssessments, assets } = useRbiData();
  const assessments = storeAssessments.slice(0, 8).map((assessment) => {
    const asset = assets.find((item) => item.id === assessment.assetId);
    return {
      assessmentId: assessment.assessmentId,
      tagNumber: asset?.tagNumber ?? assessment.assetId,
      equipmentType: asset?.equipmentType ?? "Equipment",
      assessmentDate: assessment.assessmentDate,
      pof: assessment.pof.numeric,
      cof: assessment.cof.areaConsequence.replace(" ft2", "").replace(" ft²", ""),
      riskLevel: assessment.riskDetermination.level === "Low" ? "Medium" : assessment.riskDetermination.level === "Very High" || assessment.riskDetermination.level === "Extreme" ? "High" : assessment.riskDetermination.level,
      targetStatus: (assessment.riskDetermination.targetStatus === "Exceeded" ? "Exceeded" : "Acceptable") as RbiTargetStatus,
      assessmentStatus: assessment.assessmentStatus,
      calculationTrace: assessment.calculationTrace ?? asset?.calculationTrace
    };
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base">Recent RBI Assessments</CardTitle>
        <Link href="/risk-based-inspection/risk-register" prefetch={false} className="shrink-0 text-sm font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
          View All Assessments
        </Link>
      </CardHeader>
      <CardContent>
        <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                <th className="px-3 py-3">Assessment ID</th>
                <th className="px-3 py-3">Tag Number</th>
                <th className="px-3 py-3">Equipment Type</th>
                <th className="px-3 py-3">Assessment Date</th>
                <th className="px-3 py-3">PoF (failures/yr)</th>
                <th className="px-3 py-3">CoF (ft²)</th>
                <th className="px-3 py-3">Risk Level</th>
                <th className="px-3 py-3">Risk Target Status</th>
                <th className="px-3 py-3">Assessment Status</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assessments.map((assessment) => (
                <tr key={assessment.assessmentId} className="bg-white transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="whitespace-nowrap px-3 py-3 font-bold text-blue-700 dark:text-blue-300">{assessment.assessmentId}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-950 dark:text-slate-100">{assessment.tagNumber}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{assessment.equipmentType}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{assessment.assessmentDate}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{assessment.pof}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{assessment.cof}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Badge variant={riskVariant(assessment.riskLevel)}>{assessment.riskLevel}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-bold leading-4", targetBadgeClass(assessment.targetStatus))}>
                      {assessment.targetStatus === "Exceeded" ? <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> : <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
                      {assessment.targetStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="space-y-1">
                      <span className={cn("inline-flex rounded-md border px-2 py-1 text-[11px] font-bold leading-4", assessmentStatusClass(assessment.assessmentStatus))}>
                        {assessment.assessmentStatus}
                      </span>
                      <RecalculationRequiredBadge trace={assessment.calculationTrace} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300" aria-label={`View ${assessment.assessmentId}`}>
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300" aria-label={`More actions for ${assessment.assessmentId}`}>
                        <MoreVertical className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {RBI_RISK_LEGEND.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            PoF and CoF calculated using API RP 581 Fourth Edition, January 2025.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
