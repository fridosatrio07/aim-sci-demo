export interface RiskKpi {
  label: string;
  value: string;
  note: string;
  tone: "green" | "blue" | "amber" | "red" | "purple";
}

export interface RiskTargetRow {
  riskBasis: string;
  currentRisk: string;
  riskTarget: string;
  targetStatus: "Exceeds" | "On Target";
  targetDate: string;
  gap: string;
}

export interface SummaryRow {
  label: string;
  value: string;
  tone?: "green" | "amber" | "red";
}

export interface RiskTrendPoint {
  label: string;
  value: number;
  displayValue: string;
  tone: string;
}

export interface SensitivityRow {
  parameter: string;
  variation: string;
  riskImpact: string;
  sensitivity: "High" | "Medium" | "Low";
}

export interface EvidenceDocument {
  documentName: string;
  type: string;
  version: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface SideCardRow {
  label: string;
  value: string;
  tone?: "green" | "amber" | "red";
}

export const RISK_DETERMINATION_KPIS: RiskKpi[] = [
  { label: "PoF Category", value: "3", note: "Medium", tone: "green" },
  { label: "Numeric PoF", value: "3.06E-04", note: "failures/year", tone: "blue" },
  { label: "CoF Category", value: "4", note: "High", tone: "amber" },
  { label: "Area Consequence", value: "12,500 ft2", note: "Release footprint", tone: "purple" },
  { label: "Financial Consequence", value: "USD 1.2M", note: "Direct + Indirect", tone: "blue" },
  { label: "Calculated Risk Level", value: "High", note: "Requires action", tone: "red" },
  { label: "Risk Ranking", value: "A2", note: "Priority ranking", tone: "red" },
  { label: "Confidence Level", value: "82%", note: "Good", tone: "green" }
];

export const RISK_TARGET_COMPARISON: RiskTargetRow[] = [
  { riskBasis: "Area Risk", currentRisk: "12,500 ft2", riskTarget: "5,000 ft2", targetStatus: "Exceeds", targetDate: "15 May 2026", gap: "-7,500 ft2 (150%)" },
  { riskBasis: "Financial Risk", currentRisk: "USD 1.20 M", riskTarget: "USD 0.50 M", targetStatus: "Exceeds", targetDate: "15 May 2026", gap: "-USD 0.70 M (140%)" },
  { riskBasis: "Safety / Injury Risk", currentRisk: "Single Injury", riskTarget: "No Injury", targetStatus: "Exceeds", targetDate: "15 May 2026", gap: "N/A" },
  { riskBasis: "PoF Target", currentRisk: "3.06E-04", riskTarget: "1.00E-04", targetStatus: "Exceeds", targetDate: "15 May 2026", gap: "+2.06E-04 (206%)" },
  { riskBasis: "DF Target", currentRisk: "7.20", riskTarget: "5.00", targetStatus: "Exceeds", targetDate: "15 May 2026", gap: "+2.20 (44%)" },
  { riskBasis: "Thickness Target", currentRisk: "0.210 in", riskTarget: "0.180 in", targetStatus: "Exceeds", targetDate: "15 May 2026", gap: "+0.030 in (17%)" },
  { riskBasis: "Maximum Inspection Interval Target", currentRisk: "12 Months", riskTarget: "12 Months", targetStatus: "On Target", targetDate: "15 May 2026", gap: "0 Months (0%)" }
];

export const RISK_RESULT_SUMMARY: SummaryRow[] = [
  { label: "PoF Category", value: "3 - Medium", tone: "green" },
  { label: "CoF Category", value: "4 - High", tone: "red" },
  { label: "Risk Level", value: "High", tone: "red" },
  { label: "Risk Score (Matrix Position)", value: "(3,4)" },
  { label: "Numeric Risk Value (PoF x CoF DF)", value: "2.20E-03" },
  { label: "Risk Ranking", value: "A2", tone: "red" },
  { label: "Data Quality", value: "Good (82%)", tone: "green" },
  { label: "Residual Risk Status", value: "Medium (After Mitigation)", tone: "amber" },
  { label: "Acceptability", value: "Not Acceptable / Requires Action", tone: "red" }
];

export const POF_DRIVERS = [
  "Localized corrosion / pitting",
  "High chloride concentration",
  "Inspection coverage limitation",
  "Corrosion rate uncertainty",
  "Coating degradation"
];

export const COF_DRIVERS = [
  "Flammable hydrocarbon release",
  "Partial isolation capability",
  "Production loss",
  "Personnel exposure potential",
  "Ignition potential"
];

export const RISK_TREND: RiskTrendPoint[] = [
  { label: "Baseline Risk\n01 May 2024", value: 1.2e-3, displayValue: "1.20E-03", tone: "#94a3b8" },
  { label: "Previous Assessment\n01 Nov 2024", value: 1.6e-3, displayValue: "1.60E-03", tone: "#3b82f6" },
  { label: "Current Risk\n12 May 2025", value: 2.2e-3, displayValue: "2.20E-03", tone: "#dc2626" },
  { label: "Predicted Plan Date\n15 May 2026", value: 1.8e-3, displayValue: "1.80E-03", tone: "#f97316" },
  { label: "After Mitigation\n15 May 2026", value: 6.5e-4, displayValue: "6.50E-04", tone: "#16a34a" }
];

export const SENSITIVITY_ANALYSIS: SensitivityRow[] = [
  { parameter: "Corrosion Rate", variation: "+/- 50%", riskImpact: "1.10E-03 - 3.30E-03", sensitivity: "High" },
  { parameter: "Inventory", variation: "+/- 50%", riskImpact: "1.30E-03 - 4.10E-03", sensitivity: "High" },
  { parameter: "Isolation Time", variation: "+/- 50%", riskImpact: "1.10E-03 - 2.90E-03", sensitivity: "Medium" },
  { parameter: "Inspection Effectiveness", variation: "+/- 1 Category", riskImpact: "1.10E-03 - 6.00E-03", sensitivity: "High" },
  { parameter: "Cost Basis", variation: "+/- 25%", riskImpact: "1.90E-03 - 2.70E-03", sensitivity: "Low" }
];

export const RISK_EVIDENCE_DOCUMENTS: EvidenceDocument[] = [
  { documentName: "PoF Calculation Details.pdf", type: "Calculation", version: "1.0", lastUpdated: "12 May 2025", updatedBy: "Arief Wibowo" },
  { documentName: "CoF Calculation Details.pdf", type: "Calculation", version: "1.0", lastUpdated: "12 May 2025", updatedBy: "Arief Wibowo" },
  { documentName: "Risk Matrix Justification.pdf", type: "Justification", version: "1.0", lastUpdated: "10 May 2025", updatedBy: "Budi Santoso" },
  { documentName: "Risk Criteria Configuration.pdf", type: "Configuration", version: "2.1", lastUpdated: "05 May 2025", updatedBy: "Rachmat Hidayat" },
  { documentName: "Risk Target Summary.pdf", type: "Report", version: "1.0", lastUpdated: "01 May 2025", updatedBy: "Budi Santoso" }
];

export const TECHNICAL_NOTES = [
  "Risk evaluation performed in accordance with API RP 580 and API RP 581.",
  "Risk targets defined by corporate risk criteria (Rev. 2.1) approved 01 Jan 2025.",
  "Area consequence based on worst credible release (0.50 in hole, vapor cloud fire).",
  "Risk exceeds targets primarily due to high PoF from localized corrosion and limited inspection coverage.",
  "Mitigation plan in development: inhibitor program enhancement, deposit removal, and increased inspection frequency."
];

export const RISK_ACCEPTABILITY: SideCardRow[] = [
  { label: "Risk Status", value: "Not Acceptable", tone: "red" },
  { label: "Risk Target Status", value: "Exceeded", tone: "red" },
  { label: "Action Required", value: "Yes", tone: "red" },
  { label: "Mitigation Required", value: "Yes", tone: "red" },
  { label: "Inspection Enhancement", value: "Yes", tone: "red" }
];

export const RECOMMENDATION_TRIGGER_BASIS: SideCardRow[] = [
  { label: "Risk Target Exceeded", value: "Yes", tone: "green" },
  { label: "PoF > Target", value: "Yes", tone: "green" },
  { label: "DF > Target", value: "Yes", tone: "green" },
  { label: "Inspection Effectiveness < Required", value: "Yes", tone: "green" },
  { label: "Thickness > Target", value: "Yes", tone: "green" },
  { label: "Maximum Interval > Target", value: "No", tone: "green" }
];

export const CODE_CONSTRAINT_CHECKS: SideCardRow[] = [
  { label: "API 580 Compliance", value: "Pass", tone: "green" },
  { label: "API 581 Compliance", value: "Pass", tone: "green" },
  { label: "Company Standard", value: "Pass", tone: "green" },
  { label: "Jurisdiction Requirement", value: "Pass", tone: "green" }
];
