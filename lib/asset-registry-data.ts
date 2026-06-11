import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Database,
  FileWarning,
  GitBranch,
  LayoutPanelTop,
  ShieldAlert,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

export type AssetRiskLevel = "Extreme" | "High" | "Medium" | "Low";
export type AssetCriticality = "A" | "B" | "C";
export type BoundaryStatus = "Defined" | "Safety-Critical";
export type CertificationStatus = "Valid" | "Expiring Soon" | "Expired";
export type InspectionStatus = "Overdue" | "Due Soon" | "Scheduled";

export interface AssetRegistryKpi {
  title: string;
  value: string;
  detail: string;
  color: "blue" | "green" | "purple" | "orange" | "red" | "teal";
  icon: LucideIcon;
}

export interface AssetRegistryFilterState {
  site: string;
  area: string;
  unit: string;
  system: string;
  equipmentClass: string;
  equipmentType: string;
  riskLevel: string;
  inspectionStatus: string;
  certificationStatus: string;
  reliabilityReadiness: string;
  safetyCriticalFlag: string;
  search: string;
}

export interface AssetRegistryRow {
  tagNumber: string;
  equipmentName: string;
  equipmentClass: string;
  taxonomyLevel: string;
  site: string;
  area: string;
  unit: string;
  system: string;
  unitSystem: string;
  service: string;
  currentRiskLevel: AssetRiskLevel;
  assetCriticality: AssetCriticality;
  boundaryStatus: BoundaryStatus;
  reliabilityDataReadiness: number;
  linkedSafetyFunctions: string;
  safetyCritical: boolean;
  nextInspectionDue: string;
  inspectionDueNote: string;
  inspectionStatus: InspectionStatus;
  certificationStatus: CertificationStatus;
  equipmentType: string;
  documentKeywords: string[];
  failureRecordKeywords: string[];
}

export interface RegistryQualityInsight {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface DataQualityGap {
  title: string;
  count: string;
  percentage: string;
  color: "red" | "orange" | "amber" | "blue";
  icon: LucideIcon;
}

export const ASSET_REGISTRY_TOTAL = 1253;

export const DEFAULT_ASSET_REGISTRY_FILTERS: AssetRegistryFilterState = {
  site: "All Sites",
  area: "All Areas",
  unit: "All Units",
  system: "All Systems",
  equipmentClass: "All Classes",
  equipmentType: "All Types",
  riskLevel: "All Risk Levels",
  inspectionStatus: "All Status",
  certificationStatus: "All Status",
  reliabilityReadiness: "All Readiness",
  safetyCriticalFlag: "All",
  search: ""
};

export const ASSET_REGISTRY_KPIS: AssetRegistryKpi[] = [
  {
    title: "Total Assets",
    value: "1,253",
    detail: "assets",
    color: "blue",
    icon: Database
  },
  {
    title: "ISO 14224 Mapped Assets",
    value: "1,108",
    detail: "assets (89%)",
    color: "green",
    icon: GitBranch
  },
  {
    title: "Boundary Defined",
    value: "842",
    detail: "assets (67%)",
    color: "purple",
    icon: ShieldCheck
  },
  {
    title: "Safety-Critical Assets",
    value: "318",
    detail: "assets (25%)",
    color: "orange",
    icon: ShieldAlert
  },
  {
    title: "Assets with Open Failure Records",
    value: "46",
    detail: "assets (3.7%)",
    color: "red",
    icon: AlertTriangle
  },
  {
    title: "Reliability Data Ready",
    value: "76%",
    detail: "of assets",
    color: "teal",
    icon: TrendingUp
  }
];

export const ASSET_REGISTRY_FILTER_OPTIONS = {
  site: ["All Sites", "Geothermal Dieng Unit 1", "PLTG Jawa-1 / Unit 1", "Offshore Platform Alpha", "Refinery Unit Balongan"],
  area: ["All Areas", "Process Area", "Fuel System", "Utility Area", "Protection System", "Control System", "Chemical Injection"],
  unit: ["All Units", "Process Unit", "Fuel System", "V-101 Protection System", "Measurement & Control System", "Utility System", "Chemical Injection System"],
  system: ["All Systems", "Separator System", "Condensate System", "Steam System", "Fuel System", "Protection System", "Measurement & Control System", "Utility System", "Chemical Injection System"],
  equipmentClass: ["All Classes", "Pressure Vessel", "Pump", "Atmospheric Storage Tank", "Heat Exchanger", "Safety Valve", "Valve", "Level Instrument", "Pressure Instrument"],
  equipmentType: ["All Types", "Pressure Vessel", "Pump", "Storage Tank", "Heat Exchanger", "Safety Valve", "Valve", "Instrument"],
  riskLevel: ["All Risk Levels", "Extreme", "High", "Medium", "Low"],
  inspectionStatus: ["All Status", "Overdue", "Due Soon", "Scheduled"],
  certificationStatus: ["All Status", "Valid", "Expiring Soon", "Expired"],
  reliabilityReadiness: ["All Readiness", "High (>=85%)", "Medium (70-84%)", "Low (<70%)"],
  safetyCriticalFlag: ["All", "Safety-Critical", "Non Safety-Critical"]
};

export const ASSET_REGISTRY_ROWS: AssetRegistryRow[] = [
  {
    tagNumber: "V-101",
    equipmentName: "Production Separator",
    equipmentClass: "Pressure Vessel",
    taxonomyLevel: "Equipment Unit",
    site: "Geothermal Dieng Unit 1",
    area: "Process Area",
    unit: "Process Unit",
    system: "Separator System",
    unitSystem: "Process Unit / Separator System",
    service: "Oil, gas, and produced water separation",
    currentRiskLevel: "Extreme",
    assetCriticality: "A",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 92,
    linkedSafetyFunctions: "4 linked functions",
    safetyCritical: true,
    nextInspectionDue: "15 May 2025",
    inspectionDueNote: "Overdue",
    inspectionStatus: "Overdue",
    certificationStatus: "Valid",
    equipmentType: "Pressure Vessel",
    documentKeywords: ["RBI assessment", "inspection report", "datasheet", "P&ID"],
    failureRecordKeywords: ["localized corrosion", "pitting", "wall loss"]
  },
  {
    tagNumber: "P-201A",
    equipmentName: "Condensate Pump",
    equipmentClass: "Pump",
    taxonomyLevel: "Equipment Unit",
    site: "Geothermal Dieng Unit 1",
    area: "Process Area",
    unit: "Process Unit",
    system: "Condensate System",
    unitSystem: "Process Unit / Condensate System",
    service: "Condensate",
    currentRiskLevel: "High",
    assetCriticality: "A",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 88,
    linkedSafetyFunctions: "2 linked functions",
    safetyCritical: true,
    nextInspectionDue: "10 May 2025",
    inspectionDueNote: "Overdue",
    inspectionStatus: "Overdue",
    certificationStatus: "Expiring Soon",
    equipmentType: "Pump",
    documentKeywords: ["pump curve", "maintenance plan", "inspection history"],
    failureRecordKeywords: ["bearing vibration", "seal leak", "thickness loss"]
  },
  {
    tagNumber: "T-501",
    equipmentName: "Storage Tank",
    equipmentClass: "Atmospheric Storage Tank",
    taxonomyLevel: "Equipment Unit",
    site: "Geothermal Dieng Unit 1",
    area: "Fuel System",
    unit: "Fuel System",
    system: "Fuel System",
    unitSystem: "Fuel System",
    service: "Fuel Oil",
    currentRiskLevel: "High",
    assetCriticality: "A",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 90,
    linkedSafetyFunctions: "1 linked function",
    safetyCritical: true,
    nextInspectionDue: "12 May 2025",
    inspectionDueNote: "Overdue",
    inspectionStatus: "Overdue",
    certificationStatus: "Valid",
    equipmentType: "Storage Tank",
    documentKeywords: ["tank inspection", "API 653", "bottom plate"],
    failureRecordKeywords: ["soil-side corrosion", "settlement", "coating damage"]
  },
  {
    tagNumber: "E-301",
    equipmentName: "Heat Exchanger",
    equipmentClass: "Heat Exchanger",
    taxonomyLevel: "Equipment Unit",
    site: "Geothermal Dieng Unit 1",
    area: "Process Area",
    unit: "Process Unit",
    system: "Steam System",
    unitSystem: "Process Unit / Steam System",
    service: "Steam",
    currentRiskLevel: "High",
    assetCriticality: "B",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 85,
    linkedSafetyFunctions: "1 linked function",
    safetyCritical: true,
    nextInspectionDue: "18 May 2025",
    inspectionDueNote: "Overdue",
    inspectionStatus: "Overdue",
    certificationStatus: "Valid",
    equipmentType: "Heat Exchanger",
    documentKeywords: ["tube bundle", "inspection report", "RCA workflow"],
    failureRecordKeywords: ["tubesheet cracking", "CUI", "fouling"]
  },
  {
    tagNumber: "PSV-101",
    equipmentName: "Pressure Safety Valve",
    equipmentClass: "Safety Valve",
    taxonomyLevel: "Equipment Unit",
    site: "Geothermal Dieng Unit 1",
    area: "Protection System",
    unit: "V-101 Protection System",
    system: "Protection System",
    unitSystem: "V-101 Protection System",
    service: "Steam / Gas Relief",
    currentRiskLevel: "High",
    assetCriticality: "A",
    boundaryStatus: "Safety-Critical",
    reliabilityDataReadiness: 94,
    linkedSafetyFunctions: "1 safety function",
    safetyCritical: true,
    nextInspectionDue: "18 Jul 2025",
    inspectionDueNote: "68 days left",
    inspectionStatus: "Scheduled",
    certificationStatus: "Valid",
    equipmentType: "Safety Valve",
    documentKeywords: ["PSV certificate", "relief valve", "safety function"],
    failureRecordKeywords: ["set pressure drift", "seat leakage"]
  },
  {
    tagNumber: "BDV-101",
    equipmentName: "Blowdown Valve",
    equipmentClass: "Valve",
    taxonomyLevel: "Equipment Unit",
    site: "Geothermal Dieng Unit 1",
    area: "Protection System",
    unit: "V-101 Protection System",
    system: "Protection System",
    unitSystem: "V-101 Protection System",
    service: "Steam / Condensate",
    currentRiskLevel: "Medium",
    assetCriticality: "A",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 76,
    linkedSafetyFunctions: "1 safety function",
    safetyCritical: true,
    nextInspectionDue: "15 Jun 2025",
    inspectionDueNote: "36 days left",
    inspectionStatus: "Due Soon",
    certificationStatus: "Expiring Soon",
    equipmentType: "Valve",
    documentKeywords: ["blowdown valve", "SIF proof test", "maintenance history"],
    failureRecordKeywords: ["actuator delay", "valve passing"]
  },
  {
    tagNumber: "LT-101",
    equipmentName: "Level Transmitter",
    equipmentClass: "Level Instrument",
    taxonomyLevel: "Component / Maintainable Item",
    site: "Geothermal Dieng Unit 1",
    area: "Control System",
    unit: "Measurement & Control System",
    system: "Measurement & Control System",
    unitSystem: "Measurement & Control System",
    service: "Condensate Level",
    currentRiskLevel: "Medium",
    assetCriticality: "B",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 65,
    linkedSafetyFunctions: "1 safety function",
    safetyCritical: true,
    nextInspectionDue: "25 Aug 2025",
    inspectionDueNote: "107 days left",
    inspectionStatus: "Scheduled",
    certificationStatus: "Valid",
    equipmentType: "Instrument",
    documentKeywords: ["calibration certificate", "level transmitter", "SIF"],
    failureRecordKeywords: ["calibration drift", "signal fault"]
  },
  {
    tagNumber: "PT-101",
    equipmentName: "Pressure Transmitter",
    equipmentClass: "Pressure Instrument",
    taxonomyLevel: "Component / Maintainable Item",
    site: "Geothermal Dieng Unit 1",
    area: "Control System",
    unit: "Measurement & Control System",
    system: "Measurement & Control System",
    unitSystem: "Measurement & Control System",
    service: "Pressure Measurement",
    currentRiskLevel: "Medium",
    assetCriticality: "B",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 63,
    linkedSafetyFunctions: "1 safety function",
    safetyCritical: true,
    nextInspectionDue: "25 Aug 2025",
    inspectionDueNote: "107 days left",
    inspectionStatus: "Scheduled",
    certificationStatus: "Valid",
    equipmentType: "Instrument",
    documentKeywords: ["pressure transmitter", "calibration", "instrument loop"],
    failureRecordKeywords: ["impulse line blockage", "signal noise"]
  },
  {
    tagNumber: "E-205",
    equipmentName: "Air Cooler",
    equipmentClass: "Heat Exchanger",
    taxonomyLevel: "Equipment Unit",
    site: "Geothermal Dieng Unit 1",
    area: "Utility Area",
    unit: "Utility System",
    system: "Utility System",
    unitSystem: "Utility System",
    service: "Cooling Air",
    currentRiskLevel: "Low",
    assetCriticality: "C",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 70,
    linkedSafetyFunctions: "-",
    safetyCritical: false,
    nextInspectionDue: "20 May 2025",
    inspectionDueNote: "5 days left",
    inspectionStatus: "Due Soon",
    certificationStatus: "Valid",
    equipmentType: "Heat Exchanger",
    documentKeywords: ["air cooler", "fan inspection", "utility"],
    failureRecordKeywords: ["fan imbalance", "tube fouling"]
  },
  {
    tagNumber: "C-101",
    equipmentName: "Chemical Dosing Pump",
    equipmentClass: "Pump",
    taxonomyLevel: "Equipment Unit",
    site: "Geothermal Dieng Unit 1",
    area: "Chemical Injection",
    unit: "Chemical Injection System",
    system: "Chemical Injection System",
    unitSystem: "Chemical Injection System",
    service: "MEG / Corrosion Inhibitor",
    currentRiskLevel: "Low",
    assetCriticality: "C",
    boundaryStatus: "Defined",
    reliabilityDataReadiness: 68,
    linkedSafetyFunctions: "-",
    safetyCritical: false,
    nextInspectionDue: "25 Aug 2025",
    inspectionDueNote: "107 days left",
    inspectionStatus: "Scheduled",
    certificationStatus: "Valid",
    equipmentType: "Pump",
    documentKeywords: ["chemical dosing", "corrosion inhibitor", "MEG"],
    failureRecordKeywords: ["pump trip", "low flow"]
  }
];

export const REGISTRY_QUALITY_INSIGHTS: RegistryQualityInsight[] = [
  { label: "Complete (High Quality)", value: 632, percentage: 50, color: "#16a34a" },
  { label: "Good", value: 420, percentage: 33, color: "#86efac" },
  { label: "Needs Attention", value: 132, percentage: 11, color: "#f97316" },
  { label: "Poor / Incomplete", value: 69, percentage: 6, color: "#ef4444" }
];

export const DATA_QUALITY_GAPS: DataQualityGap[] = [
  {
    title: "Missing Boundary Definition",
    count: "411 assets",
    percentage: "33%",
    color: "orange",
    icon: LayoutPanelTop
  },
  {
    title: "Missing ISO 14224 Class",
    count: "145 assets",
    percentage: "12%",
    color: "red",
    icon: Boxes
  },
  {
    title: "Missing Maintenance History Link",
    count: "298 assets",
    percentage: "24%",
    color: "amber",
    icon: FileWarning
  },
  {
    title: "Assets requiring Safety Function Mapping",
    count: "63 assets",
    percentage: "5%",
    color: "blue",
    icon: CheckCircle2
  }
];
