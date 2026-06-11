export interface SelectField {
  label: string;
  value: string;
  options: string[];
}

export interface ComponentTimeBasis {
  fields: Array<{ label: string; value: string }>;
}

export interface GenericFailureFrequencyRow {
  category: string;
  failuresPerYear: string;
  source: string;
}

export interface ManagementSystemsFactor {
  value: string;
  basis: string;
  lastAssessmentDate: string;
}

export interface DamageFactorRow {
  mechanism: string;
  dfType: string;
  exposureYears: string;
  corrosionRateSusceptibility: string;
  inspectionEffectivenessCredit: string;
  dfCurrent: string;
  dfPlanDate: string;
  dfTarget: string;
  governing: boolean;
}

export interface InspectionEffectiveness {
  fields: Array<{ label: string; value: string; tone?: "green" }>;
  confidenceLevel: number;
}

export interface SelectedDamageMechanismForPof {
  label: string;
  badge: "Governing" | "Credible" | "Possible" | "Not Applicable";
}

export interface PofTrendPoint {
  label: string;
  value: number;
  displayValue: string;
}

export interface PofResultSummary {
  currentPof: string;
  pofCategory: string;
  trend: PofTrendPoint[];
  timeToTarget: string;
  governingMechanism: string;
}

export interface UncertaintyImpactItem {
  label: string;
  value: string;
  level: "Medium" | "Low";
}

export interface PofDriver {
  label: string;
  impact: number;
}

export interface SupportingDocument {
  name: string;
}

export const POF_SELECTION: SelectField[] = [
  {
    label: "Selected Component",
    value: "Inlet Nozzle (N1)",
    options: ["Inlet Nozzle (N1)", "Shell", "Outlet Nozzle", "Manway"]
  },
  {
    label: "Damage Mechanism",
    value: "Localized Corrosion / CO2 Corrosion",
    options: ["Localized Corrosion / CO2 Corrosion", "General Thinning", "External Corrosion (CUI)", "Chloride SCC"]
  },
  {
    label: "PoF Method",
    value: "API RP 581 GFF Method",
    options: ["API RP 581 GFF Method", "Corporate Semi-Quantitative Method", "Qualitative Screening"]
  },
  {
    label: "Calculation Basis",
    value: "API RP 581 Fourth Edition, January 2025",
    options: ["API RP 581 Fourth Edition, January 2025", "API RP 581 Third Edition"]
  }
];

export const COMPONENT_TIME_BASIS: ComponentTimeBasis = {
  fields: [
    { label: "Component Type", value: "Nozzle" },
    { label: "Material", value: "SA-516 Gr.70" },
    { label: "Component Age", value: "14.4 Years" },
    { label: "Time Since Last Inspection", value: "15 Mar 2025 (58 days)" },
    { label: "Time Since Last Effective Inspection", value: "15 Mar 2025 (58 days)" },
    { label: "RBI Date", value: "12 May 2025" },
    { label: "Plan Date", value: "15 May 2026" },
    { label: "Target Date Logic", value: "PoF Target (1.0E-03 /yr)" }
  ]
};

export const GENERIC_FAILURE_FREQUENCY_ROWS: GenericFailureFrequencyRow[] = [
  { category: "Total GFF", failuresPerYear: "1.20E-04", source: "Table 6.4.1" },
  { category: "Hole Size 1 GFF (Small Leak)", failuresPerYear: "5.00E-05", source: "Table 6.4.1" },
  { category: "Hole Size 2 GFF (Medium Leak)", failuresPerYear: "3.50E-05", source: "Table 6.4.1" },
  { category: "Hole Size 3 GFF (Large Leak)", failuresPerYear: "1.50E-05", source: "Table 6.4.1" },
  { category: "Rupture GFF", failuresPerYear: "1.00E-05", source: "Table 6.4.1" }
];

export const MANAGEMENT_SYSTEMS_FACTOR: ManagementSystemsFactor = {
  value: "1.00",
  basis: "Industry Average",
  lastAssessmentDate: "05 Jan 2025"
};

export const DAMAGE_FACTOR_ROWS: DamageFactorRow[] = [
  {
    mechanism: "Localized Corrosion / CO2 Corrosion",
    dfType: "Localized Thinning (LD)",
    exposureYears: "14.4",
    corrosionRateSusceptibility: "0.28 mm/y (Historical UT)",
    inspectionEffectivenessCredit: "High (0.40), UT Mapping",
    dfCurrent: "3.20",
    dfPlanDate: "4.10",
    dfTarget: "3.00",
    governing: true
  },
  {
    mechanism: "General Thinning (Uniform)",
    dfType: "Uniform Thinning (UT)",
    exposureYears: "14.4",
    corrosionRateSusceptibility: "0.22 mm/y (Trend)",
    inspectionEffectivenessCredit: "Medium (0.60), UT Mapping",
    dfCurrent: "1.80",
    dfPlanDate: "2.30",
    dfTarget: "3.00",
    governing: false
  },
  {
    mechanism: "External Corrosion (CUI)",
    dfType: "External Thinning (ET)",
    exposureYears: "10.0",
    corrosionRateSusceptibility: "0.10 mm/y (Visual + UT)",
    inspectionEffectivenessCredit: "Medium (0.60), UT Mapping",
    dfCurrent: "1.60",
    dfPlanDate: "2.10",
    dfTarget: "3.00",
    governing: false
  },
  {
    mechanism: "Chloride SCC",
    dfType: "Cracking (SC)",
    exposureYears: "14.4",
    corrosionRateSusceptibility: "Susceptible",
    inspectionEffectivenessCredit: "Low (0.20), VT / UT",
    dfCurrent: "1.20",
    dfPlanDate: "1.60",
    dfTarget: "-",
    governing: false
  },
  {
    mechanism: "Brittle Fracture",
    dfType: "Fracture (BF)",
    exposureYears: "14.4",
    corrosionRateSusceptibility: "Low, -29 degF / DBTT Check",
    inspectionEffectivenessCredit: "High (0.40), Thickness Mapping",
    dfCurrent: "0.60",
    dfPlanDate: "0.70",
    dfTarget: "-",
    governing: false
  }
];

export const DAMAGE_FACTOR_TOTALS = {
  current: "5.20",
  planDate: "6.80"
};

export const INSPECTION_EFFECTIVENESS: InspectionEffectiveness = {
  confidenceLevel: 82,
  fields: [
    { label: "NDE Method", value: "UT Thickness Mapping (Phased Array)" },
    { label: "Coverage", value: "82% (CML + High Risk Areas)" },
    { label: "Effectiveness Category", value: "High (BST Category 3)", tone: "green" },
    { label: "Last Effective Inspection Date", value: "15 Mar 2025" },
    { label: "Bayesian Update Status", value: "Updated (58 days since effective insp.)" },
    { label: "Limitations / Access Constraints", value: "Partial insulation removal, coating DFT, UT grid at 6-inch intervals" }
  ]
};

export const SELECTED_DAMAGE_MECHANISMS_FOR_POF: SelectedDamageMechanismForPof[] = [
  { label: "Localized Corrosion (CO2 Corrosion)", badge: "Governing" },
  { label: "General Thinning", badge: "Credible" },
  { label: "External Corrosion (CUI)", badge: "Credible" },
  { label: "SCC (Chloride SCC)", badge: "Possible" },
  { label: "Brittle Fracture", badge: "Not Applicable" }
];

export const POF_RESULT_SUMMARY: PofResultSummary = {
  currentPof: "3.06E-04",
  pofCategory: "3 (Medium)",
  timeToTarget: "Within Target Window",
  governingMechanism: "Localized Corrosion / CO2 Corrosion",
  trend: [
    { label: "Baseline (2024)", value: 5.1e-4, displayValue: "5.10E-04" },
    { label: "RBI Date", value: 3.06e-4, displayValue: "3.06E-04" },
    { label: "Plan Date", value: 2.45e-4, displayValue: "2.45E-04" },
    { label: "Target Date", value: 1.0e-3, displayValue: "1.00E-03" }
  ]
};

export const POF_CALCULATION_FORMULA = [
  { label: "Total GFF", value: "1.20E-04 /yr" },
  { label: "Total DF", value: "5.20" },
  { label: "FMS", value: "1.00" },
  { label: "PoF (Current)", value: "3.06E-04 /yr", final: true }
];

export const POF_FORMULA_HELPERS = [
  "GFF: Generic Failure Frequency (from Table 6.4.1)",
  "DF: Total Damage Factor (DF-Total)",
  "FMS: Management Systems Factor",
  "PoF: Probability of Failure (Current at RBI Date)"
];

export const UNCERTAINTY_IMPACT_ITEMS: UncertaintyImpactItem[] = [
  { label: "Corrosion rate data", value: "+/-15%", level: "Medium" },
  { label: "Inspection coverage", value: "+/-10%", level: "Low" },
  { label: "Access / Coating", value: "+/-10%", level: "Low" },
  { label: "Material data", value: "+/-5%", level: "Low" },
  { label: "Operating data", value: "+/-10%", level: "Low" }
];

export const POF_DRIVERS: PofDriver[] = [
  { label: "Localized Corrosion Rate", impact: 38 },
  { label: "Inspection Coverage", impact: 22 },
  { label: "CO2 Partial Pressure", impact: 16 },
  { label: "Component Age", impact: 12 },
  { label: "Coating / CUI Condition", impact: 8 },
  { label: "Material Susceptibility", impact: 4 }
];

export const NOTES_ON_POF = [
  "Localized CO2 corrosion with pitting observed near inlet nozzle.",
  "High CO2 partial pressure and chloride increases DF.",
  "Current PoF is within target, but will exceed within 18 months without inspection.",
  "High effectiveness UT mapping recommended."
];

export const POF_TECHNICAL_NOTE =
  "PoF calculated using API RP 581 GFF methodology with Bayesian updating based on last effective inspection.";

export const POF_KEY_ASSUMPTIONS = [
  "Corrosion rate based on last 24 months UT trend",
  "Inspection provides adequate sizing capability for pitting",
  "No change in process chemistry expected in plan period"
];

export const POF_SUPPORTING_DOCUMENTS: SupportingDocument[] = [
  { name: "GFF_Table_6.4.1.pdf" },
  { name: "Corrosion_Monitoring_Trend.xlsx" },
  { name: "UT_Mapping_Report_15Mar2025.pdf" },
  { name: "Process_Chemistry_Data_2024.xlsx" }
];
