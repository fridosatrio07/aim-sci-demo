import {
  calculateRiskLevel,
  calculateRiskRanking,
  calculateRiskScore,
  formatScientific
} from "@/lib/rbi/rbi-calculations";
import type {
  ApprovalStep,
  CertificationRecord,
  DamageMechanism,
  DataQualityLevel,
  DataQualityProfile,
  FailureRecord,
  InspectionPlanItem,
  InspectionRecord,
  MitigationAction,
  RbiAssessment,
  RbiAsset,
  RbiComponent,
  RbiCriticality,
  RbiProject,
  RbiRiskLevel,
  RbiStoreState,
  SafetyFunctionLink,
  SupportingDocument
} from "@/lib/rbi/rbi-types";

const SITE = "Geothermal Dieng Unit 1";

type AssetSeed = {
  tagNumber: string;
  assetName: string;
  equipmentType: string;
  iso14224Class: string;
  taxonomyLevel: string;
  area: string;
  unit: string;
  system: string;
  service: string;
  risk: RbiRiskLevel;
  criticality: RbiCriticality;
  readiness: number;
  inspectionDue: string;
  certification: CertificationRecord["status"];
};

type KeyAssetTuple = [
  tagNumber: string,
  assetName: string,
  equipmentType: string,
  iso14224Class: string,
  taxonomyLevel: string,
  area: string,
  unit: string,
  system: string,
  service: string,
  risk: RbiRiskLevel,
  criticality: RbiCriticality,
  readiness: number,
  inspectionDue: string,
  certification: CertificationRecord["status"]
];

type GeneratedAssetTuple = [
  tagNumber: string,
  assetName: string,
  equipmentType: string,
  iso14224Class: string,
  area: string,
  unit: string,
  system: string
];

export const RBI_PROJECTS: RbiProject[] = [
  {
    id: "project-dieng-1",
    name: SITE,
    location: "Dieng, Central Java",
    owner: "PT SUCOFINDO Client Asset Owner"
  }
];

const keyAssetTuples: KeyAssetTuple[] = [
  ["V-101", "Production Separator", "Pressure Vessel", "Pressure Vessel", "Equipment Unit", "Process Area", "Production Unit", "Separator System", "Wet Gas Separation", "High", "A", 92, "15 May 2026", "Valid"],
  ["P-201A", "Condensate Pump", "Pump", "Pump", "Equipment Unit", "Process Area", "Production Unit", "Condensate System", "Condensate Transfer", "High", "A", 88, "10 May 2026", "Expiring Soon"],
  ["T-501", "Storage Tank", "Storage Tank", "Atmospheric Storage Tank", "Equipment Unit", "Storage Area", "Storage Unit", "Fuel System", "Fuel Oil Storage", "Medium", "A", 90, "10 Jul 2026", "Valid"],
  ["E-301", "Heat Exchanger", "Heat Exchanger", "Heat Exchanger", "Equipment Unit", "Process Area", "Production Unit", "Steam System", "Steam Heating", "High", "B", 85, "18 May 2026", "Valid"],
  ["PSV-101", "Pressure Safety Valve", "Safety Valve", "Safety Valve", "Equipment Unit", "Protection Area", "Production Unit", "V-101 Protection System", "Steam / Gas Relief", "High", "A", 94, "18 Jul 2025", "Valid"],
  ["BDV-101", "Blowdown Valve", "Valve", "Valve", "Equipment Unit", "Protection Area", "Production Unit", "V-101 Protection System", "Steam / Condensate", "Medium", "A", 76, "15 Jun 2025", "Expiring Soon"],
  ["LT-101", "Level Transmitter", "Level Instrument", "Instrumentation", "Component / Maintainable Item", "Control Area", "Production Unit", "Measurement & Control System", "Condensate Level", "Medium", "B", 65, "25 Aug 2025", "Valid"],
  ["PT-101", "Pressure Transmitter", "Pressure Instrument", "Instrumentation", "Component / Maintainable Item", "Control Area", "Production Unit", "Measurement & Control System", "Pressure Measurement", "Medium", "B", 63, "25 Aug 2025", "Valid"],
  ["E-205", "Air Cooler", "Heat Exchanger", "Heat Exchanger", "Equipment Unit", "Utility Area", "Utilities Unit", "Utility System", "Cooling Air", "Low", "C", 70, "20 May 2025", "Valid"],
  ["C-101", "Chemical Dosing Pump", "Pump", "Pump", "Equipment Unit", "Chemical Area", "Chemical Injection Unit", "Chemical Injection System", "MEG / Corrosion Inhibitor", "Low", "C", 68, "25 Aug 2025", "Valid"]
];

const keyAssets: AssetSeed[] = keyAssetTuples.map(([tagNumber, assetName, equipmentType, iso14224Class, taxonomyLevel, area, unit, system, service, risk, criticality, readiness, inspectionDue, certification]) => ({
  tagNumber,
  assetName,
  equipmentType,
  iso14224Class,
  taxonomyLevel,
  area,
  unit,
  system,
  service,
  risk,
  criticality,
  readiness,
  inspectionDue,
  certification
}));

const generatedAssetTags: GeneratedAssetTuple[] = [
  ["V-102", "Flash Separator", "Pressure Vessel", "Pressure Vessel", "Process Area", "Production Unit", "Separator System"],
  ["V-201", "Knock Out Drum", "Pressure Vessel", "Pressure Vessel", "Process Area", "Gas Treatment Unit", "Gas Conditioning System"],
  ["V-301", "Scrubber Vessel", "Pressure Vessel", "Pressure Vessel", "Process Area", "Gas Treatment Unit", "Scrubber System"],
  ["E-102", "Preheater", "Heat Exchanger", "Heat Exchanger", "Process Area", "Production Unit", "Heating System"],
  ["E-201", "Reboiler", "Heat Exchanger", "Heat Exchanger", "Process Area", "Production Unit", "Steam System"],
  ["E-401", "Condensate Cooler", "Heat Exchanger", "Heat Exchanger", "Utility Area", "Utilities Unit", "Cooling System"],
  ["T-201", "Condensate Tank", "Storage Tank", "Atmospheric Storage Tank", "Storage Area", "Storage Unit", "Condensate System"],
  ["T-601", "Chemical Storage Tank", "Storage Tank", "Atmospheric Storage Tank", "Chemical Area", "Chemical Injection Unit", "Chemical Storage System"],
  ["P-102", "Injection Line Pump", "Pump", "Pump", "Injection Area", "Injection Unit", "Injection System"],
  ["P-301A", "Reinjection Pump A", "Pump", "Pump", "Injection Area", "Injection Unit", "Reinjection System"],
  ["P-301B", "Reinjection Pump B", "Pump", "Pump", "Injection Area", "Injection Unit", "Reinjection System"],
  ["P-402A", "Cooling Water Pump A", "Pump", "Pump", "Utility Area", "Utilities Unit", "Cooling Water System"],
  ["P-402B", "Cooling Water Pump B", "Pump", "Pump", "Utility Area", "Utilities Unit", "Cooling Water System"],
  ["PL-101", "Steam Line 10in-CLS", "Piping Circuit", "Piping", "Steam Area", "Production Unit", "Steam System"],
  ["PL-102", "Condensate Return Line", "Piping Circuit", "Piping", "Process Area", "Production Unit", "Condensate System"],
  ["PL-201", "Brine Reinjection Header", "Piping Circuit", "Piping", "Injection Area", "Injection Unit", "Reinjection System"],
  ["CV-101", "Separator Level Control Valve", "Control Valve", "Valve", "Control Area", "Production Unit", "Measurement & Control System"],
  ["CV-201", "Condensate Control Valve", "Control Valve", "Valve", "Control Area", "Production Unit", "Condensate System"],
  ["PSV-201", "Reboiler PSV", "Safety Valve", "Safety Valve", "Protection Area", "Production Unit", "E-201 Protection System"],
  ["PSV-501", "Tank Emergency Vent", "Safety Valve", "Safety Valve", "Storage Area", "Storage Unit", "Tank Protection System"],
  ["BDV-201", "Gas Blowdown Valve", "Blowdown Valve", "Valve", "Protection Area", "Gas Treatment Unit", "Blowdown System"],
  ["FT-101", "Feed Flow Transmitter", "Flow Instrument", "Instrumentation", "Control Area", "Production Unit", "Measurement & Control System"],
  ["TT-101", "Separator Temperature Transmitter", "Temperature Instrument", "Instrumentation", "Control Area", "Production Unit", "Measurement & Control System"],
  ["A-101", "Instrument Air Receiver", "Pressure Vessel", "Pressure Vessel", "Utility Area", "Utilities Unit", "Instrument Air System"],
  ["K-101", "Gas Compressor", "Compressor", "Compressor", "Process Area", "Gas Treatment Unit", "Gas Compression System"],
  ["K-102", "Seal Gas Booster", "Compressor", "Compressor", "Process Area", "Gas Treatment Unit", "Gas Compression System"],
  ["F-101", "Fuel Gas Filter", "Filter", "Filter", "Utility Area", "Utilities Unit", "Fuel Gas System"],
  ["S-101", "Steam Silencer", "Silencer", "Static Equipment", "Steam Area", "Production Unit", "Steam System"],
  ["HX-501", "Lube Oil Cooler", "Heat Exchanger", "Heat Exchanger", "Utility Area", "Utilities Unit", "Lube Oil System"],
  ["TK-701", "Fire Water Tank", "Storage Tank", "Atmospheric Storage Tank", "Safety Area", "Utilities Unit", "Fire Water System"],
  ["P-701A", "Fire Water Pump A", "Pump", "Pump", "Safety Area", "Utilities Unit", "Fire Water System"],
  ["P-701B", "Fire Water Pump B", "Pump", "Pump", "Safety Area", "Utilities Unit", "Fire Water System"],
  ["D-101", "Desalter Vessel", "Pressure Vessel", "Pressure Vessel", "Process Area", "Production Unit", "Desalting System"],
  ["M-101", "Static Mixer", "Static Mixer", "Static Equipment", "Process Area", "Production Unit", "Chemical Injection System"],
  ["C-201", "Scale Inhibitor Pump", "Pump", "Pump", "Chemical Area", "Chemical Injection Unit", "Chemical Injection System"],
  ["AN-101", "Corrosion Monitoring Probe", "Analyzer", "Instrumentation", "Control Area", "Production Unit", "Corrosion Monitoring System"],
  ["ROV-101", "Remote Inspection Crawler", "Inspection Device", "Inspection Equipment", "Inspection Area", "Integrity Unit", "Robotic Inspection System"],
  ["WH-101", "Wellhead Manifold", "Piping Circuit", "Piping", "Wellpad Area", "Production Unit", "Wellhead System"]
];

function qualityFromReadiness(readiness: number): DataQualityLevel {
  if (readiness >= 85) return "High";
  if (readiness >= 70) return "Medium";
  return "Low";
}

function makeDataQuality(readiness: number): DataQualityProfile {
  const quality = qualityFromReadiness(readiness);
  return {
    designData: quality,
    operatingData: readiness >= 70 ? "High" : "Medium",
    inspectionData: quality,
    processChemistryData: readiness >= 80 ? "High" : "Medium",
    costBusinessData: readiness >= 75 ? "Medium" : "Low",
    consequenceData: readiness >= 70 ? "High" : "Medium",
    completeness: readiness
  };
}

function makeDocuments(tagNumber: string): SupportingDocument[] {
  return [
    { id: `${tagNumber}-datasheet`, title: `${tagNumber} Equipment Datasheet`, type: "Datasheet", documentNo: `DS-${tagNumber}`, revision: "3.0", lastUpdated: "05 Jan 2025", source: "Asset Registry" },
    { id: `${tagNumber}-inspection`, title: `Inspection Report - ${tagNumber}`, type: "Inspection Report", documentNo: `IR-2025-${tagNumber}`, revision: "1.0", lastUpdated: "10 May 2025", source: "Inspection Management" },
    { id: `${tagNumber}-p&id`, title: `P&ID Reference - ${tagNumber}`, type: "P&ID", documentNo: `P-ID-${tagNumber}`, revision: "D", lastUpdated: "12 Feb 2024", source: "Document Center" }
  ];
}

function makeSafetyLinks(tagNumber: string, count: number): SafetyFunctionLink[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${tagNumber}-sif-${index + 1}`,
    assetId: tagNumber,
    functionName: `${tagNumber} safety function ${index + 1}`,
    sil: index === 0 ? "SIL-2" : "SIL-1"
  }));
}

function makeAsset(input: typeof keyAssets[number], index: number): RbiAsset {
  const safetyCount = input.criticality === "A" ? 2 : input.criticality === "B" ? 1 : 0;
  const failureRecords: FailureRecord[] = input.risk === "High" || input.risk === "Extreme"
    ? [{ id: `${input.tagNumber}-fr-1`, assetId: input.tagNumber, date: "10 May 2025", failureMode: "Wall loss / degradation", description: `${input.tagNumber} has active integrity finding requiring RBI review.`, severity: "High" }]
    : [];

  return {
    id: input.tagNumber,
    tagNumber: input.tagNumber,
    assetName: input.assetName,
    equipmentType: input.equipmentType,
    iso14224Class: input.iso14224Class,
    taxonomyLevel: input.taxonomyLevel,
    site: SITE,
    area: input.area,
    unit: input.unit,
    system: input.system,
    service: input.service,
    designCode: input.equipmentType.includes("Tank") ? "API 650" : input.equipmentType.includes("Piping") ? "ASME B31.3" : "ASME Section VIII Div. 1",
    material: input.equipmentType.includes("Pump") ? "A216 WCB / 316SS" : "SA-516 Gr.70",
    yearBuilt: 2008 + (index % 10),
    commissioningDate: `${String(10 + (index % 18)).padStart(2, "0")} Jan ${2009 + (index % 10)}`,
    operatingPressure: 20 + (index % 25),
    operatingTemperature: 65 + (index % 55),
    designPressure: 45,
    designTemperature: 120,
    mawp: 42,
    corrosionAllowance: 3,
    currentRiskLevel: input.risk,
    assetCriticality: input.criticality,
    boundaryStatus: input.equipmentType.includes("Safety") ? "Safety-Critical" : "Defined",
    reliabilityDataReadiness: input.readiness,
    linkedSafetyFunctions: makeSafetyLinks(input.tagNumber, safetyCount),
    nextInspectionDue: input.inspectionDue,
    certificationStatus: input.certification,
    failureRecords,
    supportingDocuments: makeDocuments(input.tagNumber),
    dataQualityProfile: makeDataQuality(input.readiness)
  };
}

const generatedAssets: AssetSeed[] = generatedAssetTags.map(([tagNumber, assetName, equipmentType, iso14224Class, area, unit, system], index) => ({
  tagNumber,
  assetName,
  equipmentType,
  iso14224Class,
  taxonomyLevel: equipmentType.includes("Transmitter") || equipmentType.includes("Analyzer") ? "Component / Maintainable Item" : "Equipment Unit",
  area,
  unit,
  system,
  service: system.replace("System", "Service"),
  risk: index % 11 === 0 ? "Very High" : index % 7 === 0 ? "High" : index % 5 === 0 ? "Medium" : "Low",
  criticality: index % 4 === 0 ? "A" : index % 3 === 0 ? "B" : "C",
  readiness: 62 + (index * 7) % 35,
  inspectionDue: `${String(12 + (index % 15)).padStart(2, "0")} ${["May", "Jun", "Jul", "Aug", "Sep"][index % 5]} 2026`,
  certification: index % 9 === 0 ? "Expiring Soon" : "Valid"
}));

export const RBI_ASSETS: RbiAsset[] = [...keyAssets, ...generatedAssets].map(makeAsset);

export const RBI_COMPONENTS: RbiComponent[] = [
  { id: "V-101-shell", assetId: "V-101", name: "Shell", componentType: "Shell Course", material: "SA-516 Gr.70", nominalThicknessMm: 22.4, latestThicknessMm: 19.8, minimumRequiredThicknessMm: 16.2, corrosionAllowanceRemainingMm: 3.6 },
  { id: "V-101-inlet-head", assetId: "V-101", name: "Inlet Head", componentType: "Ellipsoidal Head", material: "SA-516 Gr.70", nominalThicknessMm: 19.1, latestThicknessMm: 17.6, minimumRequiredThicknessMm: 13.8, corrosionAllowanceRemainingMm: 3.8 },
  { id: "V-101-outlet-head", assetId: "V-101", name: "Outlet Head", componentType: "Ellipsoidal Head", material: "SA-516 Gr.70", nominalThicknessMm: 19.1, latestThicknessMm: 18.1, minimumRequiredThicknessMm: 13.8, corrosionAllowanceRemainingMm: 4.3 },
  { id: "V-101-inlet-nozzle", assetId: "V-101", name: "Inlet Nozzle", componentType: "Nozzle", material: "SA-516 Gr.70", nominalThicknessMm: 17.5, latestThicknessMm: 15.6, minimumRequiredThicknessMm: 12.1, corrosionAllowanceRemainingMm: 3.5 }
];

function mechanism(name: string, severity: DamageMechanism["severity"], susceptibility: DamageMechanism["susceptibility"], basis: string): DamageMechanism {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    mode: name.includes("Thinning") ? "Wall Loss" : "Localized Damage",
    failureMode: severity === "High" ? "Leak / Rupture" : "Small Leak",
    severity,
    susceptibility,
    applicable: true,
    basis
  };
}

const defaultWorkflow: ApprovalStep[] = [
  { id: "created", label: "Assessment Created", owner: "Budi Santoso", role: "Reliability Engineer", status: "Approved", date: "12 May 2025 09:15 WIB" },
  { id: "technical", label: "Technical Review", owner: "Arief Wibowo", role: "Senior Integrity Engineer", status: "Approved", date: "12 May 2025 11:20 WIB" },
  { id: "corrosion", label: "Corrosion / Materials Review", owner: "Rachmat Hidayat", role: "Corrosion Engineer", status: "Approved", date: "12 May 2025 13:45 WIB" },
  { id: "owner", label: "Owner Review", owner: "Putri Ayu", role: "Asset Owner", status: "In Review", date: "13 May 2025 09:10 WIB" },
  { id: "final", label: "Final Approval", owner: "Pending", role: "Approving Authority", status: "Pending" }
];

function makeInspectionPlan(assessmentId: string, tagNumber: string, inspectionDate: string): InspectionPlanItem[] {
  return [
    { id: `${assessmentId}-ip-1`, assessmentId, activity: "UT thickness mapping on shell CML", component: `${tagNumber} shell CML`, method: "UT Thickness Mapping", effectiveness: "Highly Effective", targetDate: inspectionDate, responsibleParty: "NDT Team", status: "Planned" },
    { id: `${assessmentId}-ip-2`, assessmentId, activity: "PAUT on inlet nozzle weld", component: "Inlet nozzle weld", method: "Phased Array UT", effectiveness: "Highly Effective", targetDate: inspectionDate, responsibleParty: "NDT Team", status: "Planned" }
  ];
}

function makeMitigation(assessmentId: string, riskLevel: RbiRiskLevel): MitigationAction[] {
  return [
    { id: `${assessmentId}-ma-1`, assessmentId, action: "Remove deposits / clean internal surfaces", type: "Maintenance", priority: riskLevel === "Extreme" ? "Extreme" : "High", targetDate: "15 May 2026", status: "Planned", expectedRiskReduction: 35 },
    { id: `${assessmentId}-ma-2`, assessmentId, action: "Update corrosion inhibitor review and IOW monitoring", type: "Process Control", priority: "Medium", targetDate: "30 Jun 2025", status: "Planned", expectedRiskReduction: 24 }
  ];
}

function makeAssessment(asset: RbiAsset, index: number, overrides?: Partial<RbiAssessment>): RbiAssessment {
  const pofCategory = (overrides?.pof?.category ?? (asset.currentRiskLevel === "Extreme" ? 4 : asset.currentRiskLevel === "High" ? 3 : asset.currentRiskLevel === "Medium" ? 2 : 1)) as 1 | 2 | 3 | 4 | 5;
  const cofCategory = (overrides?.cof?.category ?? (asset.assetCriticality === "A" ? 4 : asset.assetCriticality === "B" ? 3 : 2)) as 1 | 2 | 3 | 4 | 5;
  const score = calculateRiskScore(pofCategory, cofCategory);
  const level = overrides?.riskDetermination?.level ?? calculateRiskLevel(pofCategory, cofCategory);
  const pofNumericValue = overrides?.pof?.numericValue ?? Number((0.000055 * (pofCategory + index / 20)).toFixed(7));
  const areaValue = overrides?.cof?.areaConsequenceValue ?? (cofCategory * 3100 + index * 180);
  const assessmentId = overrides?.assessmentId ?? `RBI-2025-${String(156 - index).padStart(4, "0")}`;
  const inspectionDate = overrides?.recommendation?.inspectionDate ?? asset.nextInspectionDue;

  return {
    assessmentId,
    assetId: asset.id,
    assessmentType: overrides?.assessmentType ?? (index % 3 === 0 ? "Revalidation" : "New Assessment"),
    assessmentDate: overrides?.assessmentDate ?? `${String(12 - (index % 7)).padStart(2, "0")} May 2025`,
    assessmentStatus: overrides?.assessmentStatus ?? (index % 4 === 0 ? "Approved" : index % 3 === 0 ? "Under Review" : "In Progress"),
    approvalStatus: overrides?.approvalStatus ?? (index === 0 ? "In Review" : index % 4 === 0 ? "Approved" : "Draft"),
    assessor: overrides?.assessor ?? "Budi Santoso",
    reviewer: overrides?.reviewer ?? "Arief Wibowo",
    methodology: "API RP 580 Fourth Edition with Addendum 1, 2025",
    calculationMethodology: "API RP 581 Fourth Edition, January 2025",
    calculationMode: "Semi-Quantitative",
    selectedDamageMechanisms: overrides?.selectedDamageMechanisms ?? [
      mechanism(asset.equipmentType.includes("Pump") ? "Erosion-Corrosion" : "Localized Corrosion (CO2 Corrosion)", level === "Low" ? "Medium" : "High", level === "Low" ? "Medium" : "High", "Service condition and latest inspection evidence"),
      mechanism("General Thinning", "Medium", "Medium", "Historical UT trend")
    ],
    pof: overrides?.pof ?? {
      category: pofCategory,
      numeric: formatScientific(pofNumericValue),
      numericValue: pofNumericValue,
      damageFactor: (pofCategory * 2.4).toFixed(2),
      drivers: ["Corrosion rate uncertainty", "Inspection coverage limitation", "Process upset history"]
    },
    cof: overrides?.cof ?? {
      category: cofCategory,
      areaConsequence: `${areaValue.toLocaleString("en-US")} ft2`,
      areaConsequenceValue: areaValue,
      financialConsequence: `USD ${(areaValue / 10000).toFixed(2)} M`,
      confidenceLevel: `${Math.max(68, asset.reliabilityDataReadiness - 6)}%`,
      governingScenario: "Jet Fire / Pool Fire",
      drivers: ["Flammable release", "Personnel exposure potential", "Production loss"]
    },
    riskTarget: {
      basis: "Area Risk (ft2-yr)",
      pofTarget: "1.00E-04",
      areaRiskTarget: "5,000 ft2",
      maxInspectionIntervalMonths: 12,
      acceptanceAuthority: "Asset Integrity Manager"
    },
    riskDetermination: overrides?.riskDetermination ?? {
      level,
      score,
      ranking: calculateRiskRanking(level, asset.assetCriticality),
      numericRisk: pofNumericValue * areaValue,
      numericRiskValue: formatScientific(pofNumericValue * areaValue),
      residualRisk: formatScientific(pofNumericValue * 0.17),
      targetStatus: score >= 10 ? "Exceeded" : score >= 8 ? "Approaching" : "Acceptable",
      acceptability: score >= 10 ? "Not Acceptable" : "Acceptable"
    },
    recommendation: overrides?.recommendation ?? {
      inspectionMethod: asset.equipmentType.includes("Pump") ? "Vibration + UT Inspection" : "UT Thickness Mapping / Phased Array UT",
      inspectionDate,
      mitigationRequired: score >= 10,
      residualRiskLevel: score >= 10 ? "Low" : level,
      expectedRiskReduction: score >= 10 ? 83 : 45,
      priority: score >= 15 ? "Extreme" : score >= 10 ? "High" : score >= 5 ? "Medium" : "Low"
    },
    inspectionPlan: overrides?.inspectionPlan ?? makeInspectionPlan(assessmentId, asset.tagNumber, inspectionDate),
    mitigationActions: overrides?.mitigationActions ?? makeMitigation(assessmentId, level),
    approvalWorkflow: overrides?.approvalWorkflow ?? defaultWorkflow,
    dataCompleteness: overrides?.dataCompleteness ?? asset.dataQualityProfile.completeness,
    dataConfidence: overrides?.dataConfidence ?? (score >= 10 ? "Mitigation Planned" : "Inspection Planned"),
    documents: overrides?.documents ?? asset.supportingDocuments,
    technicalNotes: overrides?.technicalNotes ?? "Risk evaluation is based on available asset master data, latest inspection records, and prototype RBI semi-quantitative calculation logic.",
    revisionHistory: overrides?.revisionHistory ?? [
      { version: "2.1", date: "12 May 2025", updatedBy: "Budi Santoso", changedField: "Mitigation Plan", reason: "Updated action scope", status: "In Review" }
    ],
    revalidationDueDate: overrides?.revalidationDueDate ?? inspectionDate
  };
}

const assessmentAssets = ["V-101", "P-201A", "T-501", "E-301", "PSV-101", "BDV-101", "E-205", "C-101", "PL-101", "E-201", "P-102", "K-101"];

export const RBI_ASSESSMENTS: RbiAssessment[] = assessmentAssets
  .map((tag) => RBI_ASSETS.find((asset) => asset.tagNumber === tag))
  .filter((asset): asset is RbiAsset => Boolean(asset))
  .map((asset, index) => {
    if (asset.tagNumber !== "V-101") return makeAssessment(asset, index);

    return makeAssessment(asset, index, {
      assessmentId: "RBI-2025-0156",
      assessmentType: "Revalidation",
      assessmentStatus: "In Progress",
      approvalStatus: "In Review",
      selectedDamageMechanisms: [
        mechanism("Localized Corrosion (CO2 Corrosion)", "High", "High", "Minor pitting near inlet nozzle and high CO2 partial pressure"),
        mechanism("General Thinning", "Medium", "Medium", "Historical UT trend"),
        mechanism("External Corrosion (CUI)", "Medium", "Medium", "Insulation limits direct access"),
        mechanism("SCC (Chloride SCC)", "High", "Medium", "Chloride excursion history")
      ],
      pof: {
        category: 3,
        numeric: "3.06E-04",
        numericValue: 3.06e-4,
        damageFactor: "7.20",
        drivers: ["Localized corrosion / pitting", "High chloride concentration", "Inspection coverage limitation", "Corrosion rate uncertainty", "Coating degradation"]
      },
      cof: {
        category: 4,
        areaConsequence: "12,850 ft2",
        areaConsequenceValue: 12850,
        financialConsequence: "USD 1.2M",
        confidenceLevel: "82%",
        governingScenario: "Jet Fire / Pool Fire",
        drivers: ["Flammable hydrocarbon release", "Partial isolation capability", "Production loss", "Personnel exposure potential", "Ignition potential"]
      },
      riskDetermination: {
        level: "High",
        score: 12,
        ranking: "A2",
        numericRisk: 3.93e-3,
        numericRiskValue: "3.93E-03",
        residualRisk: "5.20E-05",
        targetStatus: "Exceeded",
        acceptability: "Not Acceptable"
      },
      recommendation: {
        inspectionMethod: "UT Thickness Mapping / Phased Array UT",
        inspectionDate: "15 May 2026",
        mitigationRequired: true,
        residualRiskLevel: "Low",
        expectedRiskReduction: 83,
        priority: "High"
      },
      dataCompleteness: 88,
      dataConfidence: "Mitigation Planned",
      technicalNotes: "Risk exceeds targets primarily due to localized corrosion near the inlet nozzle, high consequence footprint, and limited inspection coverage."
    });
  });

export const RBI_INSPECTION_RECORDS: InspectionRecord[] = RBI_ASSETS.slice(0, 18).map((asset, index) => ({
  id: `${asset.tagNumber}-inspection-${index + 1}`,
  assetId: asset.id,
  date: `${String(10 + (index % 15)).padStart(2, "0")} Mar 2025`,
  method: index % 2 === 0 ? "UT Thickness Mapping" : "Visual / PAUT",
  coverage: 60 + (index * 7) % 38,
  effectiveness: index % 4 === 0 ? "Highly Effective" : index % 3 === 0 ? "Fairly Effective" : "Usually Effective",
  finding: index % 5 === 0 ? "Localized thinning requiring monitoring" : "No critical finding"
}));

export const DEFAULT_RBI_STORE_STATE: RbiStoreState = {
  version: 1,
  activeAssessmentId: "RBI-2025-0156",
  projects: RBI_PROJECTS,
  assets: RBI_ASSETS,
  components: RBI_COMPONENTS,
  inspectionRecords: RBI_INSPECTION_RECORDS,
  assessments: RBI_ASSESSMENTS,
  lastUpdated: "12 May 2025 10:30 WIB"
};
