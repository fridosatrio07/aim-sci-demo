/**
 * Fallback-only legacy mock data.
 * Runtime Risk Analytics summaries should come from backend-synchronized RBI data.
 */
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CalendarClock,
  Gauge,
  ShieldAlert,
  TrendingDown
} from "lucide-react";

export type RiskAnalyticsColor = "blue" | "red" | "deepRed" | "orange" | "purple" | "green";
export type RiskLevel = "Low" | "Medium" | "High" | "Very High" | "Extreme";
export type Severity = "Low" | "Medium" | "High";

export interface RiskAnalyticsFilter {
  id: string;
  label: string;
  defaultValue: string;
  options?: string[];
  type?: "select" | "date-range";
}

export interface RiskAnalyticsKpiCard {
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: LucideIcon;
  color: RiskAnalyticsColor;
}

export interface RiskMatrixRow {
  cof: string;
  values: number[];
}

export interface RiskDistributionItem {
  label: RiskLevel | "Very Low";
  value: number;
  percentage: number;
  color: string;
}

export interface ScatterPoint {
  id: string;
  x: number;
  y: number;
  riskLevel: RiskLevel;
  tag: string;
}

export interface RiskTrendPoint {
  month: string;
  averageRiskScore: number;
}

export interface MitigationEffectivenessPoint {
  month: string;
  preMitigationRisk: number;
  postMitigationRisk: number;
  riskReduction: number;
}

export interface HighRiskAsset {
  tagNumber: string;
  assetName: string;
  unit: string;
  damageMechanism: string;
  riskScore: number;
  riskLevel: "High" | "Extreme";
}

export interface RiskContributor {
  factor: string;
  averageScore: number;
  impact: number;
}

export interface TriggeredRbiUpdate {
  triggerId: string;
  triggerType: string;
  assetUnit: string;
  detectedDate: string;
  severity: Severity;
  status: "Open";
}

export interface DataQualityHeatmapRow {
  unit: string;
  values: Record<string, "Good" | "Fair" | "Poor">;
}

export interface InspectionEffectivenessItem {
  label: string;
  percentage: number;
  value: number;
  color: string;
}

export const RISK_LEVEL_COLORS: Record<string, string> = {
  "Very Low": "#22c55e",
  Low: "#16a34a",
  Medium: "#facc15",
  High: "#f97316",
  "Very High": "#ef4444",
  Extreme: "#b91c1c"
};

export const RISK_ANALYTICS_FILTERS: RiskAnalyticsFilter[] = [
  {
    id: "projectSite",
    label: "Project / Site",
    defaultValue: "SPM-01 Instalasi Stasiun Pengumpul Minyak Demo Facility",
    options: ["SPM-01 Instalasi Stasiun Pengumpul Minyak Demo Facility"]
  },
  {
    id: "unit",
    label: "Unit",
    defaultValue: "All Units",
    options: ["All Units", "Production Unit", "Injection Unit", "Storage Unit", "Gas Treatment Unit", "Utilities Unit"]
  },
  {
    id: "equipmentType",
    label: "Equipment Type",
    defaultValue: "All Types",
    options: ["All Types", "Pressure Vessel", "Storage Tank", "Piping", "Pump", "Heat Exchanger", "Boiler"]
  },
  {
    id: "damageMechanism",
    label: "Damage Mechanism",
    defaultValue: "All Mechanisms",
    options: ["All Mechanisms", "Localized Corrosion", "External Corrosion", "CUI", "Erosion-Corrosion", "Sulfide Stress Cracking", "Internal Corrosion", "Fatigue"]
  },
  {
    id: "riskLevel",
    label: "Risk Level",
    defaultValue: "All",
    options: ["All", "Low", "Medium", "High", "Very High", "Extreme"]
  },
  {
    id: "assessmentPeriod",
    label: "Assessment Period",
    defaultValue: "01 Jan 2025 - 12 May 2025",
    type: "date-range"
  },
  {
    id: "riskBasis",
    label: "Risk Basis",
    defaultValue: "Area Risk (ft²-yr)",
    options: ["Area Risk (ft²-yr)", "Financial Risk", "Safety Risk", "Environmental Risk"]
  }
];

export const RISK_ANALYTICS_KPIS: RiskAnalyticsKpiCard[] = [
  {
    title: "High Risk Assets",
    value: "237",
    trend: "19% vs last period",
    trendDirection: "up",
    icon: ShieldAlert,
    color: "red"
  },
  {
    title: "Extreme Risk Assets",
    value: "78",
    trend: "6% vs last period",
    trendDirection: "up",
    icon: ShieldAlert,
    color: "deepRed"
  },
  {
    title: "Assets Exceeding Risk Target",
    value: "38",
    trend: "12% vs last period",
    trendDirection: "up",
    icon: AlertTriangle,
    color: "orange"
  },
  {
    title: "Revalidation Due",
    value: "96",
    trend: "8% vs last period",
    trendDirection: "up",
    icon: CalendarClock,
    color: "purple"
  },
  {
    title: "Average Risk Score",
    value: "12.6 / 25",
    trend: "3% vs last period",
    trendDirection: "down",
    icon: Gauge,
    color: "blue"
  },
  {
    title: "Risk Reduction After Mitigation",
    value: "21%",
    trend: "5% vs last period",
    trendDirection: "up",
    icon: TrendingDown,
    color: "green"
  }
];

export const RISK_MATRIX_POF_LABELS = ["A Very Low", "B Low", "C Medium", "D High", "E Very High"];

export const RISK_MATRIX_ROWS: RiskMatrixRow[] = [
  { cof: "5 Extreme", values: [0, 1, 5, 18, 54] },
  { cof: "4 Very High", values: [1, 4, 11, 35, 27] },
  { cof: "3 High", values: [5, 16, 28, 45, 17] },
  { cof: "2 Medium", values: [12, 27, 37, 25, 8] },
  { cof: "1 Low", values: [22, 38, 36, 12, 3] }
];

export const RISK_MATRIX_SUMMARY = [
  { label: "Total Assets", value: "1,248", color: "#64748b" },
  { label: "Extreme (20-25)", value: "78", color: RISK_LEVEL_COLORS.Extreme },
  { label: "Very High (15-19)", value: "102", color: RISK_LEVEL_COLORS["Very High"] },
  { label: "High (10-14)", value: "237", color: RISK_LEVEL_COLORS.High },
  { label: "Medium (5-9)", value: "436", color: RISK_LEVEL_COLORS.Medium },
  { label: "Low (0-4)", value: "425", color: RISK_LEVEL_COLORS.Low }
];

export const RISK_DISTRIBUTION: RiskDistributionItem[] = [
  { label: "Very Low", value: 72, percentage: 6, color: "#22c55e" },
  { label: "Low", value: 425, percentage: 34, color: "#16a34a" },
  { label: "Medium", value: 436, percentage: 35, color: "#facc15" },
  { label: "High", value: 237, percentage: 19, color: "#f97316" },
  { label: "Extreme", value: 78, percentage: 6, color: "#b91c1c" }
];

export const SCATTER_POINTS: ScatterPoint[] = [
  { id: "V-101", x: 4.6, y: 4.8, riskLevel: "Extreme", tag: "V-101" },
  { id: "E-201", x: 4.1, y: 4.5, riskLevel: "Extreme", tag: "E-201" },
  { id: "T-501", x: 3.8, y: 4.2, riskLevel: "Extreme", tag: "T-501" },
  { id: "P-301A/B", x: 4.2, y: 3.4, riskLevel: "High", tag: "P-301A/B" },
  { id: "E-102", x: 3.5, y: 3.8, riskLevel: "High", tag: "E-102" },
  { id: "P-102", x: 3.7, y: 3.5, riskLevel: "High", tag: "P-102" },
  { id: "E-301", x: 2.9, y: 3.6, riskLevel: "High", tag: "E-301" },
  { id: "T-201", x: 3.1, y: 3.1, riskLevel: "Medium", tag: "T-201" },
  { id: "P-201A/B", x: 2.6, y: 3.4, riskLevel: "Medium", tag: "P-201A/B" },
  { id: "V-305", x: 2.2, y: 2.8, riskLevel: "Medium", tag: "V-305" },
  { id: "PL-101", x: 2.1, y: 2.3, riskLevel: "Medium", tag: "PL-101" },
  { id: "P-401", x: 1.6, y: 2.1, riskLevel: "Low", tag: "P-401" },
  { id: "TK-04", x: 1.3, y: 1.8, riskLevel: "Low", tag: "TK-04" }
];

export const RISK_TREND: RiskTrendPoint[] = [
  { month: "Jul 2024", averageRiskScore: 14.2 },
  { month: "Aug 2024", averageRiskScore: 14.6 },
  { month: "Sep 2024", averageRiskScore: 15.0 },
  { month: "Oct 2024", averageRiskScore: 15.8 },
  { month: "Nov 2024", averageRiskScore: 15.2 },
  { month: "Dec 2024", averageRiskScore: 14.3 },
  { month: "Jan 2025", averageRiskScore: 13.9 },
  { month: "Feb 2025", averageRiskScore: 13.5 },
  { month: "Mar 2025", averageRiskScore: 13.3 },
  { month: "May 2025", averageRiskScore: 12.6 }
];

export const MITIGATION_EFFECTIVENESS: MitigationEffectivenessPoint[] = [
  { month: "Dec 2024", preMitigationRisk: 2.4e-5, postMitigationRisk: 1.6e-5, riskReduction: 33 },
  { month: "Jan 2025", preMitigationRisk: 2.0e-5, postMitigationRisk: 1.4e-5, riskReduction: 32 },
  { month: "Feb 2025", preMitigationRisk: 1.8e-5, postMitigationRisk: 1.2e-5, riskReduction: 33 },
  { month: "Mar 2025", preMitigationRisk: 1.6e-5, postMitigationRisk: 1.1e-5, riskReduction: 32 },
  { month: "Apr 2025", preMitigationRisk: 1.4e-5, postMitigationRisk: 1.0e-5, riskReduction: 31 },
  { month: "May 2025", preMitigationRisk: 1.0e-5, postMitigationRisk: 8.0e-6, riskReduction: 20 }
];

export const HIGH_RISK_ASSETS: HighRiskAsset[] = [
  { tagNumber: "V-101", assetName: "Production Separator", unit: "Production Unit", damageMechanism: "Localized Corrosion (CO₂)", riskScore: 21.3, riskLevel: "Extreme" },
  { tagNumber: "E-201", assetName: "Reboiler", unit: "Production Unit", damageMechanism: "CUI", riskScore: 19.8, riskLevel: "Extreme" },
  { tagNumber: "T-501", assetName: "Storage Tank", unit: "Storage Unit", damageMechanism: "External Corrosion", riskScore: 18.7, riskLevel: "Extreme" },
  { tagNumber: "P-301A/B", assetName: "Centrifugal Pump", unit: "Injection Unit", damageMechanism: "Erosion-Corrosion", riskScore: 16.9, riskLevel: "High" },
  { tagNumber: "E-102", assetName: "Heat Exchanger (TB)", unit: "Production Unit", damageMechanism: "Sulfide Stress Cracking", riskScore: 16.6, riskLevel: "High" },
  { tagNumber: "P-102", assetName: "Piping Circuit", unit: "Injection Unit", damageMechanism: "Internal Corrosion", riskScore: 15.8, riskLevel: "High" },
  { tagNumber: "E-301", assetName: "Glycol Contactor", unit: "Test Separator Unit", damageMechanism: "Localized Corrosion", riskScore: 14.7, riskLevel: "High" },
  { tagNumber: "T-201", assetName: "Condensate Tank", unit: "Gas Treatment Unit", damageMechanism: "CUI", riskScore: 14.6, riskLevel: "High" },
  { tagNumber: "P-201A/B", assetName: "Booster Pump", unit: "Injection Unit", damageMechanism: "External Corrosion", riskScore: 14.2, riskLevel: "High" }
];

export const POF_CONTRIBUTORS: RiskContributor[] = [
  { factor: "Corrosion (Internal)", averageScore: 0.68, impact: 28 },
  { factor: "Thickness Degradation", averageScore: 0.51, impact: 21 },
  { factor: "Age of Equipment", averageScore: 0.38, impact: 16 },
  { factor: "Inspection Coverage", averageScore: 0.27, impact: 11 },
  { factor: "Process Upsets", averageScore: 0.19, impact: 8 },
  { factor: "Material Susceptibility", averageScore: 0.14, impact: 6 },
  { factor: "Weld Quality", averageScore: 0.11, impact: 5 },
  { factor: "Fatigue", averageScore: 0.06, impact: 3 }
];

export const COF_CONTRIBUTORS: RiskContributor[] = [
  { factor: "Personnel Safety", averageScore: 0.71, impact: 30 },
  { factor: "Environmental Impact", averageScore: 0.58, impact: 24 },
  { factor: "Production Loss", averageScore: 0.43, impact: 18 },
  { factor: "Repair Cost", averageScore: 0.27, impact: 11 },
  { factor: "Reputation", averageScore: 0.17, impact: 7 },
  { factor: "Regulatory Impact", averageScore: 0.12, impact: 5 },
  { factor: "Utility Disruption", averageScore: 0.08, impact: 3 }
];

export const TRIGGERED_RBI_UPDATES: TriggeredRbiUpdate[] = [
  { triggerId: "IOW-2025-018", triggerType: "IOW Excursion", assetUnit: "V-101 / Production Unit", detectedDate: "10 May 2025", severity: "High", status: "Open" },
  { triggerId: "MOC-2025-021", triggerType: "MOC", assetUnit: "E-301 / Production Unit", detectedDate: "09 May 2025", severity: "Medium", status: "Open" },
  { triggerId: "IOW-2025-017", triggerType: "IOW Excursion", assetUnit: "T-501 / Storage Unit", detectedDate: "06 May 2025", severity: "High", status: "Open" },
  { triggerId: "IOC-2025-013", triggerType: "Inspection Result", assetUnit: "P-100 / Injection Unit", detectedDate: "05 May 2025", severity: "Medium", status: "Open" },
  { triggerId: "MOC-2025-019", triggerType: "MOC", assetUnit: "E-102 / Production Unit", detectedDate: "03 May 2025", severity: "Low", status: "Open" }
];

export const DATA_QUALITY_COLUMNS = ["Design Data", "Process Data", "Inspection Data", "Cost Data", "Consequence Data"];

export const DATA_QUALITY_HEATMAP: DataQualityHeatmapRow[] = [
  { unit: "Production Unit", values: { "Design Data": "Good", "Process Data": "Fair", "Inspection Data": "Good", "Cost Data": "Fair", "Consequence Data": "Good" } },
  { unit: "Injection Unit", values: { "Design Data": "Good", "Process Data": "Good", "Inspection Data": "Fair", "Cost Data": "Poor", "Consequence Data": "Fair" } },
  { unit: "Storage Unit", values: { "Design Data": "Fair", "Process Data": "Good", "Inspection Data": "Good", "Cost Data": "Fair", "Consequence Data": "Good" } },
  { unit: "Gas Treatment Unit", values: { "Design Data": "Good", "Process Data": "Poor", "Inspection Data": "Fair", "Cost Data": "Fair", "Consequence Data": "Fair" } },
  { unit: "Utilities Unit", values: { "Design Data": "Good", "Process Data": "Good", "Inspection Data": "Good", "Cost Data": "Good", "Consequence Data": "Fair" } }
];

export const INSPECTION_EFFECTIVENESS_DISTRIBUTION: InspectionEffectivenessItem[] = [
  { label: "Highly Effective", percentage: 26, value: 325, color: "#16a34a" },
  { label: "Usually Effective", percentage: 31, value: 387, color: "#22c55e" },
  { label: "Fairly Effective", percentage: 20, value: 250, color: "#facc15" },
  { label: "Poorly Effective", percentage: 15, value: 187, color: "#f97316" },
  { label: "Ineffective", percentage: 8, value: 99, color: "#dc2626" }
];

export const RISK_BAND_LABELS = [
  { label: "Extreme (20-25)", color: "#b91c1c" },
  { label: "Very High (15-19)", color: "#ef4444" },
  { label: "High (10-14)", color: "#f97316" },
  { label: "Medium (5-9)", color: "#facc15" },
  { label: "Low (0-4)", color: "#16a34a" }
];
