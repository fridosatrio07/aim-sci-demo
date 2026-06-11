import type { LucideIcon } from "lucide-react";
import type { CalculationTrace } from "@/lib/rbi-store";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Library,
  Settings,
  ShieldCheck
} from "lucide-react";

export type RiskRegisterFilterId =
  | "site"
  | "unit"
  | "asset"
  | "equipmentType"
  | "componentType"
  | "damageMechanism"
  | "riskLevel"
  | "riskTargetStatus"
  | "assessmentStatus"
  | "reviewer"
  | "revalidationDue"
  | "dataQuality"
  | "actionStatus";

export type RiskLevel = "Low" | "Medium" | "High" | "Very High" | "Extreme";
export type RiskTargetStatus = "Acceptable" | "Approaching" | "Exceeded";
export type AssessmentStatus = "Draft" | "Under Review" | "In Progress" | "Approved";
export type ActionStatus =
  | "Mitigation Planned"
  | "Inspection Planned"
  | "Monitoring Planned"
  | "Immediate Action";

export interface RiskRegisterFilter {
  id: RiskRegisterFilterId;
  label: string;
  defaultValue: string;
  options: string[];
}

export interface RiskRegisterAssessment {
  assessmentId: string;
  tagNumber: string;
  equipmentComponent: string;
  equipmentType: string;
  governingDamageMechanism: string;
  pofCategory: 1 | 2 | 3 | 4 | 5;
  cofCategory: 1 | 2 | 3 | 4 | 5;
  numericRiskValue: string;
  riskBasis: string;
  riskLevel: RiskLevel;
  riskTargetStatus: RiskTargetStatus;
  residualRisk: string;
  recommendedInspectionDate: string;
  recommendedInspectionOverdue: boolean;
  revalidationDueDate: string;
  revalidationOverdue: boolean;
  dataConfidence: ActionStatus;
  assessmentStatus: AssessmentStatus;
  calculationTrace?: CalculationTrace;
}

export interface RegisterSummaryItem {
  label: string;
  value: string;
  tone?: "default" | "red" | "orange";
}

export interface RiskDistributionItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface DataQualityItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface QuickLinkItem {
  label: string;
  icon: LucideIcon;
}

export const RISK_REGISTER_FILTERS: RiskRegisterFilter[] = [
  {
    id: "site",
    label: "Site",
    defaultValue: "All Sites",
    options: ["All Sites", "Geothermal Dieng Unit 1", "PLTG Jawa-1 / Unit 1", "Offshore Platform Alpha", "Refinery Unit Balongan"]
  },
  {
    id: "unit",
    label: "Unit",
    defaultValue: "All Units",
    options: ["All Units", "Production Unit", "Injection Unit", "Storage Unit", "Gas Treatment Unit", "Utilities Unit"]
  },
  {
    id: "asset",
    label: "Asset",
    defaultValue: "All Assets",
    options: ["All Assets", "V-101", "E-201", "T-501", "P-301A/B", "E-102", "P-102"]
  },
  {
    id: "equipmentType",
    label: "Equipment Type",
    defaultValue: "All Types",
    options: ["All Types", "Pressure Vessel", "Heat Exchanger", "Storage Tank", "Centrifugal Pump", "Piping Circuit"]
  },
  {
    id: "componentType",
    label: "Component Type",
    defaultValue: "All Components",
    options: ["All Components", "Shell Side", "Tube Bundle", "Bottom Plate", "Pressure Boundary", "Injection Line"]
  },
  {
    id: "damageMechanism",
    label: "Damage Mechanism",
    defaultValue: "All Mechanisms",
    options: ["All Mechanisms", "Localized CO2/H2S Corrosion", "Corrosion Under Insulation (CUI)", "Soil-Side Corrosion", "Erosion-Corrosion Cracking (SSC)", "Sulfide Stress Cracking", "Injection Point Corrosion"]
  },
  {
    id: "riskLevel",
    label: "Risk Level",
    defaultValue: "All",
    options: ["All", "Low", "Medium", "High", "Very High", "Extreme"]
  },
  {
    id: "riskTargetStatus",
    label: "Risk Target Status",
    defaultValue: "All",
    options: ["All", "Acceptable", "Approaching", "Exceeded"]
  },
  {
    id: "assessmentStatus",
    label: "Assessment Status",
    defaultValue: "All",
    options: ["All", "Draft", "Under Review", "In Progress", "Approved"]
  },
  {
    id: "reviewer",
    label: "Reviewer",
    defaultValue: "All Reviewers",
    options: ["All Reviewers", "Budi Santoso", "Arief Wibowo", "Dewi Lestari", "Rizky Pratama"]
  },
  {
    id: "revalidationDue",
    label: "Revalidation Due",
    defaultValue: "All",
    options: ["All", "Overdue", "Due in 30 Days", "Due in 60 Days", "Due in 90 Days"]
  },
  {
    id: "dataQuality",
    label: "Data Quality",
    defaultValue: "All",
    options: ["All", "High", "Medium", "Low"]
  },
  {
    id: "actionStatus",
    label: "Action Status",
    defaultValue: "All",
    options: ["All", "Inspection Planned", "Mitigation Planned", "Monitoring Planned", "Immediate Action", "Closed"]
  }
];

export const RISK_REGISTER_ASSESSMENTS: RiskRegisterAssessment[] = [
  {
    assessmentId: "RBI-2025-0156",
    tagNumber: "V-101",
    equipmentComponent: "Production Separator (Inlet Nozzle)",
    equipmentType: "Pressure Vessel",
    governingDamageMechanism: "Localized CO2/H2S Corrosion",
    pofCategory: 3,
    cofCategory: 4,
    numericRiskValue: "3.83E-03",
    riskBasis: "Area Risk (ft²-yr)",
    riskLevel: "High",
    riskTargetStatus: "Exceeded",
    residualRisk: "1.21E-03",
    recommendedInspectionDate: "15 May 2026",
    recommendedInspectionOverdue: true,
    revalidationDueDate: "12 May 2026",
    revalidationOverdue: true,
    dataConfidence: "Mitigation Planned",
    assessmentStatus: "Approved"
  },
  {
    assessmentId: "RBI-2025-0155",
    tagNumber: "E-201",
    equipmentComponent: "Reboiler (Shell Side)",
    equipmentType: "Heat Exchanger",
    governingDamageMechanism: "Corrosion Under Insulation (CUI)",
    pofCategory: 2,
    cofCategory: 4,
    numericRiskValue: "3.15E-03",
    riskBasis: "Financial (USD/yr)",
    riskLevel: "High",
    riskTargetStatus: "Exceeded",
    residualRisk: "1.40E-03",
    recommendedInspectionDate: "20 Jun 2026",
    recommendedInspectionOverdue: false,
    revalidationDueDate: "09 May 2026",
    revalidationOverdue: true,
    dataConfidence: "Mitigation Planned",
    assessmentStatus: "Under Review"
  },
  {
    assessmentId: "RBI-2025-0154",
    tagNumber: "T-501",
    equipmentComponent: "Storage Tank Bottom (Soil Side)",
    equipmentType: "Storage Tank",
    governingDamageMechanism: "Soil-Side Corrosion",
    pofCategory: 2,
    cofCategory: 3,
    numericRiskValue: "1.18E-03",
    riskBasis: "Area Risk (ft²-yr)",
    riskLevel: "Medium",
    riskTargetStatus: "Acceptable",
    residualRisk: "6.20E-04",
    recommendedInspectionDate: "10 Jul 2026",
    recommendedInspectionOverdue: false,
    revalidationDueDate: "10 Jul 2026",
    revalidationOverdue: false,
    dataConfidence: "Inspection Planned",
    assessmentStatus: "Draft"
  },
  {
    assessmentId: "RBI-2025-0153",
    tagNumber: "P-301A/B",
    equipmentComponent: "Crude Oil Pump (Pressure Boundary)",
    equipmentType: "Centrifugal Pump",
    governingDamageMechanism: "Erosion-Corrosion Cracking (SSC)",
    pofCategory: 2,
    cofCategory: 3,
    numericRiskValue: "5.31E-04",
    riskBasis: "Financial (USD/yr)",
    riskLevel: "Medium",
    riskTargetStatus: "Acceptable",
    residualRisk: "3.10E-04",
    recommendedInspectionDate: "12 Jul 2026",
    recommendedInspectionOverdue: false,
    revalidationDueDate: "12 Jul 2026",
    revalidationOverdue: false,
    dataConfidence: "Monitoring Planned",
    assessmentStatus: "Approved"
  },
  {
    assessmentId: "RBI-2025-0152",
    tagNumber: "E-102",
    equipmentComponent: "Heat Exchanger T-102 Tube Bundle (TB)",
    equipmentType: "Heat Exchanger",
    governingDamageMechanism: "Sulfide Stress Cracking",
    pofCategory: 3,
    cofCategory: 4,
    numericRiskValue: "2.20E-03",
    riskBasis: "Area Risk (ft²-yr)",
    riskLevel: "High",
    riskTargetStatus: "Exceeded",
    residualRisk: "8.70E-04",
    recommendedInspectionDate: "05 Aug 2026",
    recommendedInspectionOverdue: false,
    revalidationDueDate: "05 Aug 2026",
    revalidationOverdue: false,
    dataConfidence: "Inspection Planned",
    assessmentStatus: "Under Review"
  },
  {
    assessmentId: "RBI-2025-0151",
    tagNumber: "P-102",
    equipmentComponent: "Piping Circuit (Injection Line)",
    equipmentType: "Piping Circuit",
    governingDamageMechanism: "Injection Point Corrosion",
    pofCategory: 4,
    cofCategory: 5,
    numericRiskValue: "8.90E-03",
    riskBasis: "Area Risk (ft²-yr)",
    riskLevel: "Extreme",
    riskTargetStatus: "Exceeded",
    residualRisk: "2.90E-03",
    recommendedInspectionDate: "25 May 2026",
    recommendedInspectionOverdue: true,
    revalidationDueDate: "25 May 2026",
    revalidationOverdue: true,
    dataConfidence: "Immediate Action",
    assessmentStatus: "Under Review"
  }
];

export const REGISTER_SUMMARY: RegisterSummaryItem[] = [
  { label: "Total Assessments", value: "156" },
  { label: "Target Exceeded", value: "38", tone: "red" },
  { label: "Overdue Inspection", value: "19", tone: "red" },
  { label: "Revalidation Due", value: "96", tone: "orange" },
  { label: "Open Mitigation Actions", value: "44", tone: "orange" },
  { label: "Low Data Confidence (<70%)", value: "21", tone: "red" }
];

export const RISK_LEVEL_DISTRIBUTION: RiskDistributionItem[] = [
  { label: "Extreme (20-25)", value: 48, percentage: 4, color: "#b91c1c" },
  { label: "Very High (15-19)", value: 102, percentage: 8, color: "#ef4444" },
  { label: "High (10-14)", value: 237, percentage: 19, color: "#f97316" },
  { label: "Medium (5-9)", value: 436, percentage: 35, color: "#facc15" },
  { label: "Low (0-4)", value: 425, percentage: 34, color: "#16a34a" }
];

export const DATA_QUALITY_OVERVIEW: DataQualityItem[] = [
  { label: "High (85-100%)", value: 656, percentage: 53, color: "#16a34a" },
  { label: "Medium (70-84%)", value: 436, percentage: 35, color: "#facc15" },
  { label: "Low (<70%)", value: 156, percentage: 12, color: "#ef4444" }
];

export const RISK_REGISTER_QUICK_LINKS: QuickLinkItem[] = [
  { label: "RBI Methodology & Governance Library", icon: BookOpen },
  { label: "Risk Criteria Configuration", icon: Settings },
  { label: "Damage Mechanism Library", icon: Library },
  { label: "Inspection Effectiveness Tables", icon: ClipboardList },
  { label: "Management Systems Factor Assessment", icon: ShieldCheck },
  { label: "Report Templates & Packages", icon: FileText }
];
