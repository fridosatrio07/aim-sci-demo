export interface WorkspaceStep {
  number: number;
  label: string;
}

export interface SelectField {
  value: string;
  options: string[];
}

export interface AssessmentInfo {
  assessmentId: string;
  assessmentTypes: string[];
  assessmentType: string;
  assessmentDate: string;
  assessor: string;
  reviewer: string;
  clientRepresentativeStatus: SelectField;
}

export interface MethodologyBasis {
  rbiProgramStandard: SelectField;
  calculationMethodology: SelectField;
  calculationMode: SelectField;
  cofMethod: SelectField;
  internalProcedureVersion: string;
  calculationLibraryVersion: string;
}

export interface ScopeBoundary {
  tagNumber: string;
  assetName: string;
  equipmentType: SelectField;
  includedComponents: string[];
  excludedComponents: string[];
  physicalBoundaryDescription: string;
  processBoundaryDescription: string;
  assessmentScopeNote: string;
}

export interface SupportingDocument {
  documentType: string;
  title: string;
  documentNo: string;
  revision: string;
  lastUpdated: string;
  source: string;
}

export interface RiskCriteriaTarget {
  riskBasis: SelectField;
  riskMatrixConfiguration: SelectField;
  riskTarget: string;
  targetParameters: Array<{ label: string; value: string }>;
  riskAcceptanceAuthority: SelectField;
}

export interface PlanPeriod {
  rbiDate: string;
  planDate: string;
  targetDateLogic: SelectField;
  turnaroundAlignment: string;
  applicableCodeConstraint: SelectField;
}

export interface MethodologySubmission {
  status: string;
  description: string;
  overallReadiness: number;
  items: Array<{ label: string; value: string; tone?: "green" | "amber" | "red" }>;
}

export interface ValidationStatus {
  status: string;
  description: string;
}

export const WORKSPACE_STEPS: WorkspaceStep[] = [
  { number: 1, label: "Assessment Basis" },
  { number: 2, label: "Asset, Component & Operating Information" },
  { number: 3, label: "Damage Mechanism Review" },
  { number: 4, label: "PoF Evaluation" },
  { number: 5, label: "CoF Evaluation" },
  { number: 6, label: "Risk Determination & Risk Target" },
  { number: 7, label: "Inspection & Mitigation Recommendation" },
  { number: 8, label: "Review, Approval & Risk Acceptance" }
];

export const ASSESSMENT_INFO: AssessmentInfo = {
  assessmentId: "RBI-2025-0156",
  assessmentTypes: ["New Assessment", "Revalidation", "Event-Based Update"],
  assessmentType: "New Assessment",
  assessmentDate: "12 May 2025",
  assessor: "Budi Santoso — Reliability Engineer",
  reviewer: "Arief Wibowo — Senior Integrity Engineer",
  clientRepresentativeStatus: {
    value: "In Progress",
    options: ["In Progress", "Submitted", "Confirmed", "Pending Client Review"]
  }
};

export const METHODOLOGY_BASIS: MethodologyBasis = {
  rbiProgramStandard: {
    value: "API RP 580 Fourth Edition with Addendum 1, 2025",
    options: ["API RP 580 Fourth Edition with Addendum 1, 2025", "API RP 580 Third Edition", "Corporate RBI Governance Standard"]
  },
  calculationMethodology: {
    value: "API RP 581 Fourth Edition, January 2025",
    options: ["API RP 581 Fourth Edition, January 2025", "API RP 581 Third Edition", "Corporate Semi-Quantitative Method"]
  },
  calculationMode: {
    value: "Semi-Quantitative",
    options: ["Semi-Quantitative", "Qualitative Screening", "Quantitative"]
  },
  cofMethod: {
    value: "Level 1",
    options: ["Level 1", "Level 2", "Level 3"]
  },
  internalProcedureVersion: "RBI-PROC-001 Rev. 4",
  calculationLibraryVersion: "RBI-CALC-LIB-2025.01"
};

export const SCOPE_BOUNDARY: ScopeBoundary = {
  tagNumber: "V-101",
  assetName: "Production Separator",
  equipmentType: {
    value: "Pressure Vessel",
    options: ["Pressure Vessel", "Heat Exchanger", "Storage Tank", "Piping Circuit", "Centrifugal Pump"]
  },
  includedComponents: ["Shell", "Heads (Front & Rear)", "Inlet Nozzle", "Outlet Nozzle", "Manway", "Pressure Boundary Welds"],
  excludedComponents: ["Supports / Skirt / Foundation", "Instrumentation Tubing", "Non-Pressure Attachments", "Ladders / Platforms", "Nameplate", "Electrical / Control Devices"],
  physicalBoundaryDescription:
    "Assessment covers pressure boundary of V-101 including shell, heads, nozzles, manway and welds. Supports, foundations and non-pressure attachments are excluded.",
  processBoundaryDescription:
    "Assessment is based on current operating conditions in Production Unit. Upstream limit: header block valve. Downstream limit: outlet block valve.",
  assessmentScopeNote:
    "Focus on internal corrosion (CO2/H2S), localized corrosion near inlet nozzle and CUI on external shell."
};

export const SUPPORTING_DOCUMENTS: SupportingDocument[] = [
  { documentType: "Previous RBI Assessment", title: "RBI Assessment - V-101 (2024)", documentNo: "RBI-2024-0087", revision: "2.0", lastUpdated: "18 Dec 2024", source: "Document Center" },
  { documentType: "Latest Inspection Report", title: "IR - V-101 - Internal Inspection", documentNo: "IR-2025-0421", revision: "1.0", lastUpdated: "10 May 2025", source: "Inspection Management" },
  { documentType: "Datasheet", title: "V-101 Equipment Datasheet", documentNo: "DS-V-101", revision: "3.0", lastUpdated: "05 Jan 2025", source: "Asset Registry" },
  { documentType: "P&ID", title: "P&ID - Production Unit - Sheet 2", documentNo: "P-ID-201", revision: "D", lastUpdated: "12 Feb 2024", source: "Document Center" },
  { documentType: "Operating Data", title: "Operating Data 2024 - Production Unit", documentNo: "OP-DATA-2024", revision: "1.0", lastUpdated: "01 May 2025", source: "PI System" },
  { documentType: "Process Safety Information", title: "HAZOP 2024 - Production Unit", documentNo: "HAZOP-2024-PROD", revision: "1.0", lastUpdated: "15 Feb 2024", source: "PSSR / HAZOP" },
  { documentType: "Damage Mechanism Review Basis", title: "DMR Basis - V-101", documentNo: "DMR-V-101", revision: "1.0", lastUpdated: "05 May 2025", source: "Document Center" },
  { documentType: "Risk Criteria Document", title: "Risk Criteria & Acceptability", documentNo: "RISK-CRIT-2025", revision: "3.0", lastUpdated: "10 Apr 2025", source: "Governance Library" }
];

export const RISK_CRITERIA_TARGET: RiskCriteriaTarget = {
  riskBasis: {
    value: "Area Risk (ft²-yr)",
    options: ["Area Risk (ft²-yr)", "Financial Risk (USD/yr)", "Safety Risk", "Environmental Risk"]
  },
  riskMatrixConfiguration: {
    value: "Corporate RBI Risk Matrix Rev. 3",
    options: ["Corporate RBI Risk Matrix Rev. 3", "Project RBI Matrix Rev. 2", "API 581 Default Matrix"]
  },
  riskTarget: "1.00E-03 failures/year × consequence basis",
  targetParameters: [
    { label: "PoF Target (failures/year)", value: "1.00E-04" },
    { label: "DF Target", value: "1.00" },
    { label: "Thickness Target (mm)", value: "Remaining CA ≥ 2.00 mm" },
    { label: "Maximum Inspection Interval Target", value: "12 Months" }
  ],
  riskAcceptanceAuthority: {
    value: "Asset Integrity Manager",
    options: ["Asset Integrity Manager", "Integrity Manager", "Engineering Manager", "Asset Owner Representative"]
  }
};

export const PLAN_PERIOD: PlanPeriod = {
  rbiDate: "12 May 2025",
  planDate: "12 May 2026",
  targetDateLogic: {
    value: "Risk Target and DF Target",
    options: ["Risk Target and DF Target", "Maximum Interval", "Turnaround Alignment", "Manual Target Date"]
  },
  turnaroundAlignment: "Next TA: Jun 2026 (Window ± 45 days)",
  applicableCodeConstraint: {
    value: "API 510 - Maximum Interval 12 Months",
    options: ["API 510 - Maximum Interval 12 Months", "API 570 - Maximum Interval 10 Years", "Corporate Inspection Interval Rule"]
  }
};

export const METHODOLOGY_SUBMISSION: MethodologySubmission = {
  status: "Compliant",
  description: "Assessment basis meets API RP 580 and API RP 581 requirements.",
  overallReadiness: 88,
  items: [
    { label: "Total Data Items", value: "56" },
    { label: "Data Items Complete", value: "48 (86%)", tone: "green" },
    { label: "Data Items Partial", value: "6 (11%)", tone: "amber" },
    { label: "Data Items Missing", value: "2 (4%)", tone: "red" },
    { label: "Last Data Quality Review", value: "10 May 2025" }
  ]
};

export const VALIDATION_STATUS: ValidationStatus = {
  status: "Compliant",
  description: "Assessment basis meets API RP 580 and API RP 581 requirements."
};
