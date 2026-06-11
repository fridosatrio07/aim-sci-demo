export type RbiRiskLevel = "Low" | "Medium" | "High" | "Very High" | "Extreme";
export type RbiRiskTargetStatus = "Acceptable" | "Approaching" | "Exceeded";
export type RbiAssessmentStatus = "Draft" | "Under Review" | "In Progress" | "Approved";
export type RbiApprovalStatus = "Draft" | "Ready for Approval" | "In Review" | "Approved" | "Revision Requested" | "Rejected";
export type RbiActionStatus = "Mitigation Planned" | "Inspection Planned" | "Monitoring Planned" | "Immediate Action";
export type RbiCriticality = "A" | "B" | "C";
export type DataQualityLevel = "High" | "Medium" | "Low";

export interface RbiProject {
  id: string;
  name: string;
  location: string;
  owner: string;
}

export interface FailureRecord {
  id: string;
  assetId: string;
  date: string;
  failureMode: string;
  description: string;
  severity: "Low" | "Medium" | "High";
}

export interface CertificationRecord {
  id: string;
  assetId: string;
  name: string;
  status: "Valid" | "Expiring Soon" | "Expired" | "Not Required";
  expiryDate: string;
}

export interface SafetyFunctionLink {
  id: string;
  assetId: string;
  functionName: string;
  sil?: string;
}

export interface SupportingDocument {
  id: string;
  title: string;
  type: string;
  documentNo: string;
  revision: string;
  lastUpdated: string;
  source: string;
}

export interface DataQualityProfile {
  designData: DataQualityLevel;
  operatingData: DataQualityLevel;
  inspectionData: DataQualityLevel;
  processChemistryData: DataQualityLevel;
  costBusinessData: DataQualityLevel;
  consequenceData: DataQualityLevel;
  completeness: number;
}

export interface CalculationTrace {
  recalculationRequired: boolean;
  staleCount: number;
  latestRunId?: string | null;
  latestCalculationType?: string | null;
  latestCompletedAt?: string | null;
  staleReason?: string | null;
}

export interface RbiAsset {
  id: string;
  tagNumber: string;
  assetName: string;
  equipmentType: string;
  iso14224Class: string;
  taxonomyLevel: string;
  site: string;
  area: string;
  unit: string;
  system: string;
  service: string;
  designCode: string;
  material: string;
  yearBuilt: number;
  commissioningDate: string;
  operatingPressure: number;
  operatingTemperature: number;
  designPressure: number;
  designTemperature: number;
  mawp: number;
  corrosionAllowance: number;
  currentRiskLevel: RbiRiskLevel;
  assetCriticality: RbiCriticality;
  boundaryStatus: "Defined" | "Partially Defined" | "Missing" | "Safety-Critical";
  reliabilityDataReadiness: number;
  linkedSafetyFunctions: SafetyFunctionLink[];
  nextInspectionDue: string;
  certificationStatus: CertificationRecord["status"];
  failureRecords: FailureRecord[];
  supportingDocuments: SupportingDocument[];
  dataQualityProfile: DataQualityProfile;
  calculationTrace?: CalculationTrace;
}

export interface RbiComponent {
  id: string;
  assetId: string;
  name: string;
  componentType: string;
  material: string;
  nominalThicknessMm: number;
  latestThicknessMm: number;
  minimumRequiredThicknessMm: number;
  corrosionAllowanceRemainingMm: number;
}

export interface DamageMechanism {
  id: string;
  name: string;
  mode: string;
  failureMode: string;
  severity: "Low" | "Medium" | "High";
  susceptibility: "Low" | "Medium" | "High";
  applicable: boolean;
  basis: string;
}

export interface InspectionRecord {
  id: string;
  assetId: string;
  date: string;
  method: string;
  coverage: number;
  effectiveness: "Highly Effective" | "Usually Effective" | "Fairly Effective" | "Poorly Effective" | "Ineffective";
  finding: string;
}

export interface InspectionPlanItem {
  id: string;
  assessmentId: string;
  activity: string;
  component: string;
  method: string;
  effectiveness: string;
  targetDate: string;
  responsibleParty: string;
  status: "Planned" | "In Progress" | "Completed" | "Overdue";
}

export interface MitigationAction {
  id: string;
  assessmentId: string;
  action: string;
  type: "Maintenance" | "Repair" | "Process Control" | "Engineering" | "Fitness-for-Service";
  priority: "Low" | "Medium" | "High" | "Extreme";
  targetDate: string;
  status: "Planned" | "In Progress" | "Completed" | "Overdue";
  expectedRiskReduction: number;
}

export interface PofEvaluation {
  category: 1 | 2 | 3 | 4 | 5;
  numeric: string;
  numericValue: number;
  damageFactor: string;
  drivers: string[];
}

export interface CofEvaluation {
  category: 1 | 2 | 3 | 4 | 5;
  areaConsequence: string;
  areaConsequenceValue: number;
  financialConsequence: string;
  confidenceLevel: string;
  governingScenario: string;
  drivers: string[];
}

export interface RiskTarget {
  basis: string;
  pofTarget: string;
  areaRiskTarget: string;
  maxInspectionIntervalMonths: number;
  acceptanceAuthority: string;
}

export interface RiskDetermination {
  level: RbiRiskLevel;
  score: number;
  ranking: string;
  numericRiskValue: string;
  numericRisk: number;
  residualRisk: string;
  targetStatus: RbiRiskTargetStatus;
  acceptability: "Acceptable" | "Not Acceptable" | "Acceptable with Conditions";
}

export interface RbiRecommendation {
  inspectionMethod: string;
  inspectionDate: string;
  mitigationRequired: boolean;
  residualRiskLevel: RbiRiskLevel;
  expectedRiskReduction: number;
  priority: "Low" | "Medium" | "High" | "Extreme";
}

export interface ApprovalStep {
  id: string;
  label: string;
  owner: string;
  role: string;
  status: "Pending" | "In Review" | "Approved" | "Rejected";
  date?: string;
}

export interface RevisionHistoryItem {
  version: string;
  date: string;
  updatedBy: string;
  changedField: string;
  reason: string;
  status: "Draft" | "In Review" | "Approved";
}

export interface RbiAssessment {
  assessmentId: string;
  assetId: string;
  assessmentType: "New Assessment" | "Revalidation" | "Event-Based Update";
  assessmentDate: string;
  assessmentStatus: RbiAssessmentStatus;
  approvalStatus: RbiApprovalStatus;
  assessor: string;
  reviewer: string;
  methodology: string;
  calculationMethodology: string;
  calculationMode: "Qualitative" | "Semi-Quantitative" | "Quantitative";
  selectedDamageMechanisms: DamageMechanism[];
  pof: PofEvaluation;
  cof: CofEvaluation;
  riskTarget: RiskTarget;
  riskDetermination: RiskDetermination;
  recommendation: RbiRecommendation;
  inspectionPlan: InspectionPlanItem[];
  mitigationActions: MitigationAction[];
  approvalWorkflow: ApprovalStep[];
  dataCompleteness: number;
  dataConfidence: RbiActionStatus;
  documents: SupportingDocument[];
  technicalNotes: string;
  revisionHistory: RevisionHistoryItem[];
  revalidationDueDate: string;
  calculationTrace?: CalculationTrace;
}

export interface RbiStoreState {
  version: 1;
  activeAssessmentId: string;
  projects: RbiProject[];
  assets: RbiAsset[];
  components: RbiComponent[];
  inspectionRecords: InspectionRecord[];
  assessments: RbiAssessment[];
  lastUpdated: string;
}

export interface SharedRbiAssessment {
  activeAssessmentId: string;
  tagNumber: string;
  assetName: string;
  equipmentType: string;
  unit: string;
  service: string;
  assessmentDate: string;
  selectedDamageMechanisms: string[];
  pof: {
    category: 1 | 2 | 3 | 4 | 5;
    numeric: string;
    damageFactor: string;
  };
  cof: {
    category: 1 | 2 | 3 | 4 | 5;
    areaConsequence: string;
    financialConsequence: string;
    confidenceLevel: string;
  };
  risk: {
    level: RbiRiskLevel;
    ranking: string;
    numericRiskValue: string;
    residualRisk: string;
    targetStatus: RbiRiskTargetStatus;
  };
  recommendedInspectionDate: string;
  revalidationDueDate: string;
  dataConfidence: RbiActionStatus;
  dataCompleteness: number;
  assessmentStatus: RbiAssessmentStatus;
  supportingDocuments: string[];
  technicalNotes: string;
  calculationTrace?: CalculationTrace;
}

export type RbiStoreAction =
  | { type: "load"; state: RbiStoreState }
  | { type: "reset" }
  | { type: "set-active-assessment"; assessmentId: string }
  | { type: "update-active-shared"; patch: Partial<SharedRbiAssessment> }
  | { type: "update-assessment"; assessmentId: string; patch: Partial<RbiAssessment> }
  | { type: "update-asset"; assetId: string; patch: Partial<RbiAsset> }
  | { type: "set-assessment-status"; status: RbiAssessmentStatus }
  | { type: "set-approval-status"; status: RbiApprovalStatus }
  | { type: "recalculate-risk" }
  | { type: "generate-inspection-plan" };
