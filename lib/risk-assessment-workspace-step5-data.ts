export interface SelectField {
  label: string;
  value: string;
  options: string[];
}

export interface LabelValue {
  label: string;
  value: string;
  tone?: "default" | "green" | "amber" | "red" | "blue";
}

export interface ReleaseScenario {
  holeSize: string;
  diameter: string;
  releaseType: string;
  releaseRate: string;
  releaseMass: string;
  releaseDuration: string;
  continuity: string;
}

export interface EventOutcome {
  title: string;
  subtitle: string;
  probability?: string;
  impactLabel?: string;
  impact?: string;
  notes: string;
  tone: "blue" | "green" | "red" | "orange" | "purple" | "teal" | "slate";
}

export interface ConsequenceMetric {
  label: string;
  value: string;
  tone?: "default" | "red" | "amber" | "green" | "blue";
}

export interface SupportingDocument {
  documentName: string;
  documentNo: string;
  revision: string;
  lastUpdated: string;
  source: string;
}

export interface MechanismBadge {
  label: string;
  badge: "Governing" | "Credible" | "Possible" | "Not Applicable";
}

export interface UncertaintyItem {
  label: string;
  percent: number;
  level: "Low" | "Medium";
}

export interface RadarItem {
  subject: string;
  score: number;
}

export const COF_SELECTION: SelectField[] = [
  {
    label: "CoF Method",
    value: "API RP 581 Level 1",
    options: ["API RP 581 Level 1", "API RP 581 Level 2", "Corporate Consequence Screening"]
  },
  {
    label: "Fluid Model",
    value: "Actual Composition",
    options: ["Actual Composition", "Representative Hydrocarbon", "Corporate Default Fluid"]
  },
  {
    label: "Risk Basis",
    value: "Area Risk",
    options: ["Area Risk", "Financial Risk", "Safety Risk", "Environmental Risk"]
  }
];

export const RELEASED_FLUID_INVENTORY: LabelValue[] = [
  { label: "Fluid Type", value: "Wet Gas" },
  { label: "Phase", value: "Gas" },
  { label: "Molecular Weight", value: "20.8" },
  { label: "Normal Boiling Point", value: "-161 deg C" },
  { label: "Density (Gas)", value: "18.4 kg/m3 @ 15 deg C" },
  { label: "Operating Pressure", value: "42.0 barg" },
  { label: "Operating Temperature", value: "40 deg C" },
  { label: "Inventory Group", value: "Group 2" },
  { label: "Available Release Mass", value: "8,500 kg" },
  { label: "Flammable / Toxic Classification", value: "H2S, CO2, HC" },
  { label: "Key Hazardous Components", value: "H2S (4.0%), CO2 (12.5%), HC (83%)" }
];

export const RELEASE_SCENARIOS: ReleaseScenario[] = [
  { holeSize: "Small Leak", diameter: "10", releaseType: "Continuous", releaseRate: "0.012 kg/s", releaseMass: "518", releaseDuration: "12.0 hr", continuity: "Continuous" },
  { holeSize: "Medium Leak", diameter: "25", releaseType: "Continuous", releaseRate: "0.075 kg/s", releaseMass: "3,240", releaseDuration: "12.0 hr", continuity: "Continuous" },
  { holeSize: "Large Leak", diameter: "50", releaseType: "Continuous", releaseRate: "0.270 kg/s", releaseMass: "11,664", releaseDuration: "12.0 hr", continuity: "Continuous" },
  { holeSize: "Rupture", diameter: "-", releaseType: "Instantaneous", releaseRate: "-", releaseMass: "8,500", releaseDuration: "10 sec", continuity: "Instantaneous" }
];

export const ISOLATION_DETECTION_MITIGATION: LabelValue[] = [
  { label: "Upstream Isolation", value: "Partially Available", tone: "amber" },
  { label: "Downstream Isolation", value: "Available", tone: "green" },
  { label: "Isolation Time (avg)", value: "120 sec" },
  { label: "Detection System", value: "DCS Alarm" },
  { label: "Fire / Gas Detection", value: "Yes (FGD)", tone: "green" },
  { label: "ESD Availability", value: "Yes", tone: "green" },
  { label: "Blowdown / Depressurization", value: "Available", tone: "green" },
  { label: "Drainage / Diking", value: "Diked Area" },
  { label: "Fire Protection", value: "Monitors, Hydrant" },
  { label: "Mitigation Factor (MF)", value: "0.42", tone: "blue" }
];

export const EVENT_OUTCOMES: EventOutcome[] = [
  { title: "Release", subtitle: "Release from Inlet Nozzle (N1)", impactLabel: "Fluid", impact: "Wet Gas, 42.0 barg", notes: "40 deg C basis", tone: "blue" },
  { title: "Safe Dispersion", subtitle: "Dispersion without ignition", probability: "0.38", impactLabel: "Area Impact", impact: "-", notes: "Wind class D stability", tone: "green" },
  { title: "Pool Fire", subtitle: "Pool fire in diked area", probability: "0.12", impactLabel: "Area Impact", impact: "12,500 ft2", notes: "Mitigated by monitors", tone: "red" },
  { title: "Jet Fire", subtitle: "Jet fire at release location", probability: "0.10", impactLabel: "Area Impact", impact: "2,800 ft2", notes: "Local personnel exposure", tone: "red" },
  { title: "Flash Fire", subtitle: "Flash fire due to delayed ignition", probability: "0.08", impactLabel: "Area Impact", impact: "8,000 ft2", notes: "Open area", tone: "orange" },
  { title: "Fireball", subtitle: "Fireball from rupture", probability: "0.05", impactLabel: "Area Impact", impact: "3,500 ft2", notes: "Low probability rupture", tone: "orange" },
  { title: "Vapor Cloud Explosion", subtitle: "VCE due to confinement", probability: "0.04", impactLabel: "Area Impact", impact: "-", notes: "Low confinement potential", tone: "purple" },
  { title: "Toxic Cloud Exposure", subtitle: "Toxic exposure (H2S)", probability: "0.12", impactLabel: "Area Impact", impact: "Downwind area", notes: "Consider wind rose", tone: "teal" },
  { title: "Equipment Damage", subtitle: "Equipment damage", probability: "0.07", impactLabel: "Financial Impact", impact: "Local", notes: "Overpressure", tone: "slate" },
  { title: "Personnel Injury", subtitle: "Injury from heat radiation / impact", probability: "0.04", impactLabel: "Injury Category", impact: "Minor to Major", notes: "Based on occupancy", tone: "slate" }
];

export const COF_CALCULATION_SUMMARY: ConsequenceMetric[] = [
  { label: "Area Consequence", value: "12,850 ft2" },
  { label: "Financial Consequence", value: "USD 1.25 M" },
  { label: "Injury Consequence", value: "2.3" },
  { label: "Equipment Damage Cost", value: "180,000" },
  { label: "Business Interruption Cost", value: "650,000" },
  { label: "Environmental Cleanup Cost", value: "75,000" },
  { label: "Repair / Replacement Cost", value: "220,000" },
  { label: "Production Loss", value: "550,000" },
  { label: "Final CoF Category", value: "4 (High)", tone: "red" }
];

export const CORPORATE_CONSEQUENCE_OVERLAY: ConsequenceMetric[] = [
  { label: "Safety Consequence", value: "High", tone: "red" },
  { label: "Environmental Consequence", value: "Medium", tone: "amber" },
  { label: "Production Consequence", value: "High", tone: "red" },
  { label: "Financial Consequence", value: "High", tone: "red" },
  { label: "Regulatory Consequence", value: "Medium", tone: "amber" },
  { label: "Reputation Consequence", value: "Medium", tone: "amber" }
];

export const COF_NOTES =
  "Weather class D, 5 m/s wind speed used for dispersion. Population density based on site occupancy model (day shift). Isolation time based on average historical data. No congested area or building enclosure considered for Level 1 evaluation. Consequence values based on corporate consequence criteria Rev. 2.";

export const COF_SUPPORTING_DOCUMENTS: SupportingDocument[] = [
  { documentName: "Process & Chemistry Data Sheet", documentNo: "PCDS-V-101", revision: "2.1", lastUpdated: "10 Apr 2025", source: "Process Data" },
  { documentName: "Inventory Calculation", documentNo: "INV-V-101-2025", revision: "1.0", lastUpdated: "08 Apr 2025", source: "Process Eng." },
  { documentName: "Mitigation System Datasheet", documentNo: "MSD-V-101", revision: "1.0", lastUpdated: "02 Apr 2025", source: "Safety Eng." },
  { documentName: "Weather Data Summary", documentNo: "WTH-DIEN-2025", revision: "1.0", lastUpdated: "05 Apr 2025", source: "Met. Station" },
  { documentName: "Consequence Criteria", documentNo: "CON-CRIT-2025", revision: "2.0", lastUpdated: "01 Apr 2025", source: "Governance" }
];

export const COF_SUMMARY: LabelValue[] = [
  { label: "Method", value: "API RP 581 Level 1" },
  { label: "Risk Basis", value: "Area Risk" },
  { label: "CoF Category", value: "4 (High)", tone: "red" },
  { label: "Numeric CoF (Current)", value: "12,850 ft2" },
  { label: "Confidence Level", value: "78%" },
  { label: "Governing Scenario", value: "Jet Fire / Pool Fire" },
  { label: "Mitigation Factor (MF)", value: "0.42" },
  { label: "Last Calculated", value: "12 May 2025 10:28 WIB" }
];

export const CONSEQUENCE_SCORE_RADAR: RadarItem[] = [
  { subject: "Safety", score: 4.0 },
  { subject: "Environmental", score: 3.0 },
  { subject: "Production", score: 4.0 },
  { subject: "Financial", score: 4.6 },
  { subject: "Regulatory", score: 3.6 },
  { subject: "Reputation", score: 3.0 }
];

export const COF_DATA_UNCERTAINTY: UncertaintyItem[] = [
  { label: "Release Rate", percent: 64, level: "Medium" },
  { label: "Inventory", percent: 36, level: "Low" },
  { label: "Mitigation Factor", percent: 62, level: "Medium" },
  { label: "Weather Data", percent: 34, level: "Low" },
  { label: "Population / Occupancy", percent: 66, level: "Medium" }
];

export const COF_SELECTED_DAMAGE_MECHANISMS: MechanismBadge[] = [
  { label: "Localized Corrosion (CO2 Corrosion)", badge: "Governing" },
  { label: "General Thinning", badge: "Credible" },
  { label: "External Corrosion (CUI)", badge: "Credible" },
  { label: "SCC (Chloride SCC)", badge: "Possible" },
  { label: "Brittle Fracture", badge: "Not Applicable" }
];

export const CONSEQUENCE_BASIS: LabelValue[] = [
  { label: "Calculation Basis", value: "API RP 581 Fourth Edition, Jan 2025" },
  { label: "Reference", value: "Annex B, Level 1 Methodology" },
  { label: "Fluid Model", value: "Actual Composition" },
  { label: "Weather Data", value: "Site Specific (5-year avg)" }
];

export const LEVEL1_VALIDITY_CHECKS: LabelValue[] = [
  { label: "Inventory < 500,000 kg", value: "Pass", tone: "green" },
  { label: "Pressure < 100 barg", value: "Pass", tone: "green" },
  { label: "Release indoor / congested area check", value: "Pass", tone: "green" },
  { label: "No BLEVE potential", value: "Pass", tone: "green" },
  { label: "Other validity criteria", value: "Pass", tone: "green" },
  { label: "Overall Validity", value: "Valid", tone: "green" }
];
