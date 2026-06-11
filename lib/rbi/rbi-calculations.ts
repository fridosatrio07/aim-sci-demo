import type {
  RbiAssessment,
  RbiAsset,
  RbiRiskLevel,
  RbiRiskTargetStatus
} from "@/lib/rbi/rbi-types";

export const RISK_LEVEL_COLORS: Record<RbiRiskLevel, string> = {
  Low: "#16a34a",
  Medium: "#2563eb",
  High: "#f97316",
  "Very High": "#ef4444",
  Extreme: "#b91c1c"
};

export function calculateRiskScore(pofCategory: number, cofCategory: number) {
  return pofCategory * cofCategory;
}

export function calculateRiskLevel(pofCategory: number, cofCategory: number): RbiRiskLevel {
  const score = calculateRiskScore(pofCategory, cofCategory);
  if (score >= 20) return "Extreme";
  if (score >= 15) return "Very High";
  if (score >= 10) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

export function calculateRiskRanking(riskLevel: RbiRiskLevel, criticality: string) {
  const criticalityRank = criticality === "A" ? "A" : criticality === "B" ? "B" : "C";
  const riskRank = riskLevel === "Extreme" ? "1" : riskLevel === "Very High" || riskLevel === "High" ? "2" : riskLevel === "Medium" ? "3" : "4";
  return `${criticalityRank}${riskRank}`;
}

export function parseScientific(value: string) {
  const parsed = Number(value.replace(/,/g, "").replace(/ft2|ft²|USD|M|failures\/year/gi, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatScientific(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0.00E+00";
  return value.toExponential(2).replace("e", "E");
}

export function calculateResidualRisk(pofNumericValue: number, mitigationEffectiveness: number) {
  return pofNumericValue * Math.max(0.05, 1 - mitigationEffectiveness / 100);
}

export function calculateRiskTargetStatus(score: number): RbiRiskTargetStatus {
  if (score >= 10) return "Exceeded";
  if (score >= 8) return "Approaching";
  return "Acceptable";
}

export function calculateDataCompleteness(assessment: RbiAssessment) {
  const mechanismScore = assessment.selectedDamageMechanisms.length > 0 ? 15 : 0;
  const pofScore = assessment.pof.numericValue > 0 ? 20 : 0;
  const cofScore = assessment.cof.areaConsequenceValue > 0 ? 20 : 0;
  const docScore = Math.min(20, assessment.documents.length * 4);
  const recommendationScore = assessment.inspectionPlan.length > 0 ? 15 : 0;
  const approvalScore = assessment.approvalWorkflow.length > 0 ? 10 : 0;
  return Math.min(100, mechanismScore + pofScore + cofScore + docScore + recommendationScore + approvalScore);
}

export function calculateInspectionDueStatus(dateText: string) {
  const date = Date.parse(dateText);
  const now = Date.parse("2025-05-12T00:00:00+07:00");
  if (!Number.isFinite(date)) return "Unknown";
  const days = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Overdue";
  if (days <= 30) return "Due Soon";
  return "On Track";
}

export function calculateRecommendedInspectionDate(riskLevel: RbiRiskLevel, fallbackDate: string) {
  if (riskLevel === "Extreme" || riskLevel === "High" || riskLevel === "Very High") return fallbackDate;
  if (riskLevel === "Medium") return "12 Nov 2026";
  return "12 May 2027";
}

export function calculateRecommendationPriority(riskLevel: RbiRiskLevel, targetStatus: RbiRiskTargetStatus, dueStatus: string) {
  if (riskLevel === "Extreme" || dueStatus === "Overdue") return "Extreme";
  if (riskLevel === "High" || targetStatus === "Exceeded") return "High";
  if (riskLevel === "Medium" || targetStatus === "Approaching") return "Medium";
  return "Low";
}

export function recalculateAssessment(assessment: RbiAssessment, asset?: RbiAsset): RbiAssessment {
  const score = calculateRiskScore(assessment.pof.category, assessment.cof.category);
  const level = calculateRiskLevel(assessment.pof.category, assessment.cof.category);
  const residual = calculateResidualRisk(assessment.pof.numericValue, assessment.recommendation.expectedRiskReduction);
  const targetStatus = calculateRiskTargetStatus(score);

  return {
    ...assessment,
    dataCompleteness: calculateDataCompleteness(assessment),
    riskDetermination: {
      ...assessment.riskDetermination,
      level,
      score,
      ranking: calculateRiskRanking(level, asset?.assetCriticality ?? "A"),
      numericRisk: assessment.pof.numericValue * assessment.cof.areaConsequenceValue,
      numericRiskValue: formatScientific(assessment.pof.numericValue * assessment.cof.areaConsequenceValue),
      residualRisk: formatScientific(residual),
      targetStatus,
      acceptability: targetStatus === "Acceptable" ? "Acceptable" : "Not Acceptable"
    },
    recommendation: {
      ...assessment.recommendation,
      priority: calculateRecommendationPriority(level, targetStatus, calculateInspectionDueStatus(assessment.recommendation.inspectionDate)),
      residualRiskLevel: residual < assessment.pof.numericValue * 0.3 ? "Low" : level,
      inspectionDate: calculateRecommendedInspectionDate(level, assessment.recommendation.inspectionDate)
    },
    lastCalculatedAt: undefined
  } as RbiAssessment;
}

export function calculatePortfolioRiskDistribution(assessments: RbiAssessment[]) {
  const order: RbiRiskLevel[] = ["Extreme", "Very High", "High", "Medium", "Low"];
  const total = Math.max(1, assessments.length);

  return order.map((level) => {
    const value = assessments.filter((assessment) => assessment.riskDetermination.level === level).length;
    return {
      label: level,
      range: level === "Extreme" ? "20-25" : level === "Very High" ? "15-19" : level === "High" ? "10-14" : level === "Medium" ? "5-9" : "0-4",
      value,
      percentage: Math.round((value / total) * 100),
      color: RISK_LEVEL_COLORS[level]
    };
  });
}

export function calculateRegisterSummary(assessments: RbiAssessment[]) {
  return {
    totalAssessments: assessments.length,
    targetExceeded: assessments.filter((item) => item.riskDetermination.targetStatus === "Exceeded").length,
    overdueInspection: assessments.filter((item) => calculateInspectionDueStatus(item.recommendation.inspectionDate) === "Overdue").length,
    revalidationDue: assessments.filter((item) => calculateInspectionDueStatus(item.revalidationDueDate) !== "On Track").length,
    openMitigationActions: assessments.flatMap((item) => item.mitigationActions).filter((item) => item.status !== "Completed").length,
    lowDataConfidence: assessments.filter((item) => item.dataCompleteness < 70).length
  };
}

export function calculateRiskAnalytics(assessments: RbiAssessment[]) {
  const highOrAbove = assessments.filter((item) => ["High", "Very High", "Extreme"].includes(item.riskDetermination.level));
  const extreme = assessments.filter((item) => item.riskDetermination.level === "Extreme");
  const exceeded = assessments.filter((item) => item.riskDetermination.targetStatus === "Exceeded");
  const averageRiskScore = assessments.reduce((sum, item) => sum + item.riskDetermination.score, 0) / Math.max(1, assessments.length);
  const averageReduction = assessments.reduce((sum, item) => sum + item.recommendation.expectedRiskReduction, 0) / Math.max(1, assessments.length);

  return {
    highRiskAssets: highOrAbove.length,
    extremeRiskAssets: extreme.length,
    targetExceeded: exceeded.length,
    revalidationDue: calculateRegisterSummary(assessments).revalidationDue,
    averageRiskScore,
    riskReductionAfterMitigation: averageReduction
  };
}

export function calculateRbiInformationSummary(assessments: RbiAssessment[], assets: RbiAsset[]) {
  const completed = assessments.filter((item) => item.assessmentStatus === "Approved").length;
  const averageCompleteness = assessments.reduce((sum, item) => sum + item.dataCompleteness, 0) / Math.max(1, assessments.length);
  return {
    totalAssessedAssets: new Set(assessments.map((item) => item.assetId)).size,
    totalAssets: assets.length,
    highRiskAssets: assessments.filter((item) => ["High", "Very High", "Extreme"].includes(item.riskDetermination.level)).length,
    targetExceeded: assessments.filter((item) => item.riskDetermination.targetStatus === "Exceeded").length,
    pendingApproval: assessments.filter((item) => item.approvalStatus === "In Review" || item.approvalStatus === "Ready for Approval").length,
    averageDataConfidence: Math.round(averageCompleteness),
    inspectionPlansGenerated: assessments.flatMap((item) => item.inspectionPlan).length,
    completedAssessments: completed
  };
}
