export interface AssetSummary {
  fields: Array<{ label: string; value: string }>;
}

export interface ComponentBreakdownRow {
  component: string;
  componentType: string;
  material: string;
  nominalThickness: string;
  latestThickness: string;
  minimumRequiredThickness: string;
  corrosionAllowanceRemaining: string;
  designPressure: string;
  designTemperature: string;
  inspectionStatus: "Inspected";
}

export interface SnapshotCardData {
  title: string;
  fields: Array<{ label: string; value: string }>;
  actionLabel: string;
  actionMessage: string;
}

export interface TechnicalAssumption {
  assumption: string;
  basis: string;
  impact: string;
  dataSource: string;
  addedBy: string;
  dateAdded: string;
  approvalStatus: "Approved";
}

export interface MissingInformationItem {
  item: string;
  priority: "High" | "Medium" | "Low";
}

export interface DataQualityIndicator {
  label: string;
  status: "Good" | "Fair" | "Poor";
}

export interface DataSourceItem {
  label: string;
  percentage: number;
  color: string;
}

export const ASSET_SUMMARY: AssetSummary = {
  fields: [
    { label: "Tag Number", value: "V-101" },
    { label: "Asset Name", value: "Production Separator" },
    { label: "Equipment Type", value: "Pressure Vessel" },
    { label: "Unit", value: "Production Unit" },
    { label: "Service", value: "Wet Gas Separation" },
    { label: "Design Code", value: "ASME Section VIII Div. 1" },
    { label: "Year Built", value: "2010" },
    { label: "Commissioning Date", value: "15 Jan 2011" }
  ]
};

export const COMPONENT_BREAKDOWN: ComponentBreakdownRow[] = [
  { component: "Shell", componentType: "Shell Course", material: "SA-516 Gr.70", nominalThickness: "22.4", latestThickness: "19.8", minimumRequiredThickness: "16.2", corrosionAllowanceRemaining: "3.6", designPressure: "45.0", designTemperature: "120", inspectionStatus: "Inspected" },
  { component: "Inlet Head", componentType: "Ellipsoidal Head", material: "SA-516 Gr.70", nominalThickness: "19.1", latestThickness: "17.6", minimumRequiredThickness: "13.8", corrosionAllowanceRemaining: "3.8", designPressure: "45.0", designTemperature: "120", inspectionStatus: "Inspected" },
  { component: "Outlet Head", componentType: "Ellipsoidal Head", material: "SA-516 Gr.70", nominalThickness: "19.1", latestThickness: "18.1", minimumRequiredThickness: "13.8", corrosionAllowanceRemaining: "4.3", designPressure: "45.0", designTemperature: "120", inspectionStatus: "Inspected" },
  { component: "Inlet Nozzle", componentType: "Nozzle", material: "SA-516 Gr.70", nominalThickness: "17.5", latestThickness: "15.6", minimumRequiredThickness: "12.1", corrosionAllowanceRemaining: "3.5", designPressure: "45.0", designTemperature: "120", inspectionStatus: "Inspected" },
  { component: "Outlet Nozzle", componentType: "Nozzle", material: "SA-516 Gr.70", nominalThickness: "17.5", latestThickness: "15.2", minimumRequiredThickness: "12.1", corrosionAllowanceRemaining: "3.1", designPressure: "45.0", designTemperature: "120", inspectionStatus: "Inspected" },
  { component: "Manway", componentType: "Opening", material: "SA-516 Gr.70", nominalThickness: "12.7", latestThickness: "11.5", minimumRequiredThickness: "8.9", corrosionAllowanceRemaining: "2.6", designPressure: "45.0", designTemperature: "120", inspectionStatus: "Inspected" },
  { component: "Weld HAZ", componentType: "Shell Welds (HAZ)", material: "SA-516 Gr.70", nominalThickness: "22.4", latestThickness: "19.1", minimumRequiredThickness: "16.2", corrosionAllowanceRemaining: "2.9", designPressure: "45.0", designTemperature: "120", inspectionStatus: "Inspected" }
];

export const SNAPSHOT_CARDS: SnapshotCardData[] = [
  {
    title: "Design Data Snapshot",
    actionLabel: "View Design Datasheet",
    actionMessage: "Design datasheet is prepared for future development.",
    fields: [
      { label: "Design Pressure", value: "45.0 barg" },
      { label: "Design Temperature", value: "120 °C" },
      { label: "MAWP", value: "42.0 barg" },
      { label: "MDMT", value: "-29 °C" },
      { label: "Hydrotest Pressure", value: "67.5 barg" },
      { label: "Material", value: "SA-516 Gr.70" },
      { label: "PWHT", value: "No" },
      { label: "Joint Efficiency", value: "0.85" },
      { label: "Corrosion Allowance", value: "3.0 mm" }
    ]
  },
  {
    title: "Operating Envelope",
    actionLabel: "View Operating Data Trend",
    actionMessage: "Operating data trend is prepared for future development.",
    fields: [
      { label: "Normal Operating Pressure", value: "38.0 barg" },
      { label: "Maximum Operating Pressure", value: "41.2 barg" },
      { label: "Normal Operating Temperature", value: "85 °C" },
      { label: "Maximum Operating Temperature", value: "104 °C" },
      { label: "Flowrate", value: "22.5 MMSCFD" },
      { label: "Fluid Phase", value: "Gas / Liquid" },
      { label: "Startup / Shutdown (per year)", value: "24" },
      { label: "Cyclic Operation", value: "Yes" },
      { label: "Upset History", value: "3 events" }
    ]
  },
  {
    title: "Fluid & Process Chemistry",
    actionLabel: "View Chemistry Data",
    actionMessage: "Chemistry data is prepared for future development.",
    fields: [
      { label: "Fluid Type", value: "Wet Gas" },
      { label: "CO2 Content", value: "4.2%" },
      { label: "H2S Content", value: "45 ppm" },
      { label: "Water Content", value: "12.5%" },
      { label: "Chloride Content", value: "320 ppm" },
      { label: "pH", value: "6.3" },
      { label: "Oxygen Ingress", value: "Low" },
      { label: "Solids / Sand", value: "Low" },
      { label: "Corrosion Inhibitor", value: "Active" }
    ]
  },
  {
    title: "Inspection History Snapshot",
    actionLabel: "View Inspection History",
    actionMessage: "Inspection history is prepared for future development.",
    fields: [
      { label: "Last Inspection Date", value: "15 Mar 2025" },
      { label: "Last Effective Inspection Date", value: "15 Mar 2025" },
      { label: "Inspection Type", value: "Internal" },
      { label: "NDE Method", value: "UT Thickness Mapping" },
      { label: "Coverage", value: "82%" },
      { label: "Inspection Effectiveness", value: "Medium (Usually Effective)" },
      { label: "Main Finding", value: "Minor pitting near inlet nozzle" },
      { label: "CML / TML Count", value: "CML: 12 / TML: 3" },
      { label: "CML / TML Trend", value: "Improving" }
    ]
  },
  {
    title: "Failure & Repair History",
    actionLabel: "View History Details",
    actionMessage: "History details are prepared for future development.",
    fields: [
      { label: "Last Failure Date", value: "—" },
      { label: "Failure Mode", value: "—" },
      { label: "Number of Failures", value: "0" },
      { label: "Last Repair Date", value: "—" },
      { label: "Repair Type", value: "—" },
      { label: "FFS History", value: "No" },
      { label: "Rerating History", value: "No" }
    ]
  },
  {
    title: "Consequence Input Snapshot",
    actionLabel: "View Consequence Data",
    actionMessage: "Consequence data is prepared for future development.",
    fields: [
      { label: "Inventory Group", value: "Group 2" },
      { label: "Isolation System", value: "Partial" },
      { label: "Detection System", value: "Gas Avg" },
      { label: "Fire / Explosion Credit", value: "Yes" },
      { label: "Drainage / Diking", value: "Yes" },
      { label: "Occupancy Level", value: "Moderate" },
      { label: "Adjacent Equipment Exposure", value: "High" },
      { label: "Production Loss Basis", value: "USD 25,000 / hr" }
    ]
  }
];

export const TECHNICAL_ASSUMPTIONS: TechnicalAssumption[] = [
  {
    assumption: "Corrosion rate for localized corrosion (inlet nozzle)",
    basis: "Based on last inspection trend and monitoring probe",
    impact: "PoF (Corrosion Rate)",
    dataSource: "Inspection Report IR-2025-0421",
    addedBy: "Budi Santoso",
    dateAdded: "12 May 2025",
    approvalStatus: "Approved"
  },
  {
    assumption: "Inventory group classification",
    basis: "Per company consequence management procedure",
    impact: "CoF (Inventory)",
    dataSource: "Process Data Sheet PDS-101",
    addedBy: "Putri Ayu",
    dateAdded: "12 May 2025",
    approvalStatus: "Approved"
  },
  {
    assumption: "Isolation time",
    basis: "Average isolation time from ESD test",
    impact: "CoF (Mitigation Credit)",
    dataSource: "ESD Test Report ESD-2024-11",
    addedBy: "Arief Wibowo",
    dateAdded: "12 May 2025",
    approvalStatus: "Approved"
  }
];

export const DATA_COMPLETENESS = {
  percentage: 88,
  items: [
    { label: "Complete", value: "158 / 180", color: "#16a34a" },
    { label: "Partial", value: "14 / 180", color: "#f59e0b" },
    { label: "Missing", value: "8 / 180", color: "#ef4444" }
  ]
};

export const MISSING_INFORMATION: MissingInformationItem[] = [
  { item: "MTR for inlet nozzle material", priority: "High" },
  { item: "Coating specification on shell OD", priority: "Medium" },
  { item: "Insulation detail on inlet nozzle", priority: "Medium" },
  { item: "Hydrotest report not available", priority: "Low" }
];

export const DATA_QUALITY_INDICATORS: DataQualityIndicator[] = [
  { label: "Design Data", status: "Good" },
  { label: "Operating Data", status: "Good" },
  { label: "Inspection Data", status: "Good" },
  { label: "Process / Chemistry Data", status: "Fair" },
  { label: "Cost / Business Data", status: "Fair" },
  { label: "Consequence Data", status: "Good" }
];

export const DATA_SOURCE_MAP: DataSourceItem[] = [
  { label: "AIM Database", percentage: 45, color: "#2563eb" },
  { label: "PI System / Historian", percentage: 25, color: "#16a34a" },
  { label: "Manual Input", percentage: 15, color: "#f59e0b" },
  { label: "Documents", percentage: 10, color: "#7c3aed" },
  { label: "Other", percentage: 5, color: "#64748b" }
];

export const REQUIRED_API_581_DATA = {
  complete: 16,
  total: 24
};
