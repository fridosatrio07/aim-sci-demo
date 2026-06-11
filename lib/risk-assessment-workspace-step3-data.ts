export type ApplicabilityStatus = "Applicable" | "Not Applicable" | "Potentially Applicable" | "To Be Evaluated";
export type LevelStatus = "High" | "Medium" | "Low";
export type IowStatus = "Within Normal" | "Inside IOW" | "Beyond IOW";

export interface ContextField {
  label: string;
  value: string;
}

export interface DamageMechanismScreeningItem {
  mechanism: string;
  status: ApplicabilityStatus;
}

export interface SelectedDamageMechanism {
  mechanism: string;
  damageMode: string;
  failureMode: string;
  affectedComponent: string;
  severity: "High" | "Medium";
  susceptibility: "High" | "Medium";
  damageRateBasis: string;
  inspectionEvidence: string;
  comments: string;
}

export interface ProcessDriverIowRow {
  processVariable: string;
  normalRange: string;
  iowLimit: string;
  criticalLimit: string;
  currentValue: string;
  currentStatus: IowStatus;
  excursionHistory: string;
  affectedDamageMechanism: string;
  requiredAction: string;
}

export interface DataCompletenessItem {
  label: string;
  value: string;
  color: string;
}

export interface OperatingFactorIndicator {
  label: string;
  status: LevelStatus;
}

export interface MissingInformationItem {
  item: string;
  priority: LevelStatus;
}

export interface DamageMechanismSummaryItem {
  label: string;
  value: string;
  tone?: "red" | "amber" | "blue";
}

export interface SpecialistReviewStatus {
  reviewStatus: string;
  specialist: string;
  role: string;
}

export interface MocIowTriggerStatusItem {
  label: string;
  value: string;
  tone?: "red" | "amber" | "green";
}

export const ASSESSMENT_CONTEXT: ContextField[] = [
  { label: "Tag Number", value: "V-101" },
  { label: "Asset Name", value: "Production Separator" },
  { label: "Equipment Type", value: "Pressure Vessel" },
  { label: "Service", value: "Wet Gas Separation" },
  { label: "Assessment Level", value: "Component Level" },
  { label: "Assessment Date", value: "12 May 2025" },
  { label: "Assessment Status", value: "In Progress" }
];

export const SCREENING_BASIS: ContextField[] = [
  { label: "Screening Basis", value: "API RP 580 / API RP 581 aligned DMR" },
  { label: "Damage Mechanism Library", value: "API 571 / API 581 mapping" },
  { label: "Screening Method", value: "Component and service-condition based" },
  { label: "Evidence Document", value: "RBI_Screening_Basis_V-101.pdf" }
];

export const DAMAGE_MECHANISM_SCREENING: DamageMechanismScreeningItem[] = [
  { mechanism: "General Thinning", status: "Applicable" },
  { mechanism: "Localized Corrosion / Pitting", status: "Applicable" },
  { mechanism: "Erosion-Corrosion", status: "Applicable" },
  { mechanism: "CO2 Corrosion", status: "Applicable" },
  { mechanism: "H2S / Wet Sour Damage", status: "Applicable" },
  { mechanism: "Chloride Stress Corrosion Cracking", status: "Not Applicable" },
  { mechanism: "Corrosion Under Insulation (CUI)", status: "Applicable" },
  { mechanism: "External Corrosion", status: "Applicable" },
  { mechanism: "Fatigue", status: "Potentially Applicable" },
  { mechanism: "Brittle Fracture", status: "Not Applicable" },
  { mechanism: "HTHA", status: "Not Applicable" },
  { mechanism: "Creep", status: "Not Applicable" },
  { mechanism: "Lining / Coating Damage", status: "Applicable" },
  { mechanism: "Other", status: "To Be Evaluated" }
];

export const SELECTED_DAMAGE_MECHANISMS: SelectedDamageMechanism[] = [
  {
    mechanism: "General Thinning",
    damageMode: "Wall Loss",
    failureMode: "Leak / Rupture",
    affectedComponent: "Shell (Cylindrical Section)",
    severity: "Medium",
    susceptibility: "Medium",
    damageRateBasis: "0.12 mm/y (Historical UT trend)",
    inspectionEvidence: "UT Mapping 15 Mar 2025, 82% coverage",
    comments: "Uniform wall loss observed."
  },
  {
    mechanism: "Localized Corrosion / Pitting",
    damageMode: "Pitting / Localized Thinning",
    failureMode: "Small Leak",
    affectedComponent: "Inlet Nozzle (Inside)",
    severity: "High",
    susceptibility: "High",
    damageRateBasis: "0.35 mm/y (ER Probe, 15 Mar 2025)",
    inspectionEvidence: "UT Mapping 15 Mar 2025, Pitting found",
    comments: "Minor pitting near inlet nozzle."
  },
  {
    mechanism: "CO2 Corrosion",
    damageMode: "Localized Thinning",
    failureMode: "Leak",
    affectedComponent: "Wet Gas Area (Shell ID)",
    severity: "High",
    susceptibility: "High",
    damageRateBasis: "0.28 mm/y (ER Probe, 15 Mar 2025)",
    inspectionEvidence: "ER Probe 15 Mar 2025",
    comments: "High CO2 partial pressure."
  },
  {
    mechanism: "Erosion-Corrosion",
    damageMode: "Wall Loss",
    failureMode: "Leak",
    affectedComponent: "Inlet Nozzle (Flow Impingement)",
    severity: "Medium",
    susceptibility: "Medium",
    damageRateBasis: "0.18 mm/y (Visual + UT trend)",
    inspectionEvidence: "UT Mapping 15 Mar 2025",
    comments: "Flow impingement at inlet."
  },
  {
    mechanism: "External Corrosion",
    damageMode: "External Wall Loss",
    failureMode: "Leak",
    affectedComponent: "Insulated Shell (OD)",
    severity: "Medium",
    susceptibility: "Medium",
    damageRateBasis: "0.10 mm/y (Previous Visual)",
    inspectionEvidence: "External VT 10 Oct 2024",
    comments: "Insulation in place, access limited."
  }
];

export const PROCESS_DRIVERS_IOW: ProcessDriverIowRow[] = [
  {
    processVariable: "Chloride (ppm)",
    normalRange: "< 50",
    iowLimit: "50-100",
    criticalLimit: "> 100",
    currentValue: "68",
    currentStatus: "Inside IOW",
    excursionHistory: "2 excursions (Mar 15 peak)",
    affectedDamageMechanism: "Localized Corrosion, SCC",
    requiredAction: "Review desalting performance, continue monitoring."
  },
  {
    processVariable: "Water Content (vol%)",
    normalRange: "< 5",
    iowLimit: "5-10",
    criticalLimit: "> 10",
    currentValue: "6.2",
    currentStatus: "Inside IOW",
    excursionHistory: "1 excursion (Mar 7)",
    affectedDamageMechanism: "CO2 Corrosion, H2S Corrosion",
    requiredAction: "Maintain dehydration unit performance."
  },
  {
    processVariable: "pH",
    normalRange: "6.5-8.5",
    iowLimit: "6.0-6.5 / 8.5-9.0",
    criticalLimit: "< 6.0 / > 9.0",
    currentValue: "6.7",
    currentStatus: "Within Normal",
    excursionHistory: "0 excursions",
    affectedDamageMechanism: "General Thinning",
    requiredAction: "Continue pH control."
  },
  {
    processVariable: "CO2 Partial Pressure (bar)",
    normalRange: "< 0.50",
    iowLimit: "0.50-1.00",
    criticalLimit: "> 1.00",
    currentValue: "0.68",
    currentStatus: "Inside IOW",
    excursionHistory: "1 excursion (Max 0.92 bar)",
    affectedDamageMechanism: "CO2 Corrosion",
    requiredAction: "Monitor CO2 loading and sweetening."
  },
  {
    processVariable: "H2S (ppm)",
    normalRange: "< 50",
    iowLimit: "50-100",
    criticalLimit: "> 100",
    currentValue: "42",
    currentStatus: "Within Normal",
    excursionHistory: "0 excursions",
    affectedDamageMechanism: "Wet Sour Damage, SSC",
    requiredAction: "Maintain amine system performance."
  },
  {
    processVariable: "Velocity (m/s)",
    normalRange: "< 15",
    iowLimit: "15-20",
    criticalLimit: "> 20",
    currentValue: "16.5",
    currentStatus: "Inside IOW",
    excursionHistory: "1 excursion (Max 19.1 m/s)",
    affectedDamageMechanism: "Erosion-Corrosion",
    requiredAction: "Review flow routing at inlet nozzle."
  },
  {
    processVariable: "Operating Temp (degC)",
    normalRange: "80-110",
    iowLimit: "110-130",
    criticalLimit: "> 130",
    currentValue: "98",
    currentStatus: "Within Normal",
    excursionHistory: "0 excursions",
    affectedDamageMechanism: "General Thinning, CO2 Corrosion",
    requiredAction: "Within acceptable range."
  },
  {
    processVariable: "Corrosion Inhibitor (ppm)",
    normalRange: "> 10",
    iowLimit: "5-10",
    criticalLimit: "< 5",
    currentValue: "11.2",
    currentStatus: "Within Normal",
    excursionHistory: "0 excursions",
    affectedDamageMechanism: "All Corrosion Mechanisms",
    requiredAction: "Maintain dosing program."
  }
];

export const OVERALL_DMR_COMMENT =
  "Credible corrosion mechanisms identified are consistent with service conditions (wet gas with CO2 and H2S). Localized corrosion near inlet nozzle is the governing risk driver. Continue monitoring process chemistry and inspection program effectiveness.";

export const DATA_COMPLETENESS = {
  percentage: 88,
  items: [
    { label: "Complete", value: "158 / 180", color: "#16a34a" },
    { label: "Partial", value: "14 / 180", color: "#f59e0b" },
    { label: "Missing", value: "8 / 180", color: "#ef4444" }
  ] satisfies DataCompletenessItem[]
};

export const OPERATING_FACTOR_INDICATORS: OperatingFactorIndicator[] = [
  { label: "Temperature Exposure", status: "Medium" },
  { label: "Pressure Level", status: "Medium" },
  { label: "Corrosivity", status: "High" },
  { label: "Erosion Potential", status: "Medium" },
  { label: "Stress / Load Cycling", status: "Low" },
  { label: "Fluid Velocity", status: "Medium" },
  { label: "pH", status: "Low" }
];

export const MISSING_INFORMATION: MissingInformationItem[] = [
  { item: "MTR for inlet nozzle material", priority: "High" },
  { item: "Coating specification on shell OD", priority: "Medium" },
  { item: "Insulation detail on inlet nozzle", priority: "Medium" },
  { item: "Hydrotest report not available", priority: "Low" }
];

export const DAMAGE_MECHANISM_SUMMARY: DamageMechanismSummaryItem[] = [
  { label: "Total Applicable Mechanisms", value: "5" },
  { label: "Highest Severity Mechanism", value: "High", tone: "red" },
  { label: "Primary Risk Driver", value: "Localized Corrosion / CO2 Corrosion", tone: "red" },
  { label: "Governing Component", value: "Inlet Nozzle", tone: "amber" },
  { label: "Governing Location", value: "Wet Gas Area", tone: "blue" }
];

export const SPECIALIST_REVIEW_STATUS: SpecialistReviewStatus = {
  reviewStatus: "Under Review",
  specialist: "Rachmat Hidayat",
  role: "Corrosion Engineer"
};

export const MOC_IOW_TRIGGER_STATUS: MocIowTriggerStatusItem[] = [
  { label: "Active MOC Impacting Asset", value: "1", tone: "amber" },
  { label: "IOW Excursions (Last 90 Days)", value: "5", tone: "red" },
  { label: "RBI Update Triggered", value: "Yes", tone: "green" }
];
