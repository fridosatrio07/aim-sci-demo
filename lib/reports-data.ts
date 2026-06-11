export type ReportTemplateIcon =
  | "BarChart3"
  | "ShieldCheck"
  | "ClipboardList"
  | "CalendarDays"
  | "AlertTriangle"
  | "BadgeCheck"
  | "FileCheck"
  | "PieChart";

export type ReportFormat = "PDF" | "Excel" | "CSV";
export type ReportStatus = "Completed" | "Failed";

export interface ReportTemplate {
  id: string;
  title: string;
  icon: ReportTemplateIcon;
  tone: "blue" | "orange" | "green" | "purple" | "red" | "teal" | "indigo";
  description: string;
}

export interface ReportHistoryItem {
  reportName: string;
  reportType: string;
  generatedBy: string;
  generatedDate: string;
  format: ReportFormat;
  dateRange: string;
  status: ReportStatus;
  fileSize: string;
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "asset-integrity-summary",
    title: "Asset Integrity Summary",
    icon: "BarChart3",
    tone: "blue",
    description: "Overall integrity status of assets including KPIs, risk, and findings summary."
  },
  {
    id: "rbi-assessment-report",
    title: "RBI Assessment Report",
    icon: "ShieldCheck",
    tone: "orange",
    description: "Detailed risk-based inspection assessment including rankings, methodology and results."
  },
  {
    id: "inspection-plan-report",
    title: "Inspection Plan Report",
    icon: "ClipboardList",
    tone: "green",
    description: "Planned inspections by asset, method, frequency, and resource allocation."
  },
  {
    id: "inspection-history-report",
    title: "Inspection History Report",
    icon: "CalendarDays",
    tone: "purple",
    description: "Historical inspection records, results, damages and trend analysis."
  },
  {
    id: "recommendation-tracking-report",
    title: "Recommendation Tracking Report",
    icon: "AlertTriangle",
    tone: "red",
    description: "Open recommendations and actions with status, priority and target dates."
  },
  {
    id: "compliance-report",
    title: "Compliance Report",
    icon: "BadgeCheck",
    tone: "teal",
    description: "Compliance status against regulations, standards and internal requirements."
  },
  {
    id: "plo-plf-readiness-report",
    title: "PLO/PLF Readiness Report",
    icon: "FileCheck",
    tone: "blue",
    description: "PLO/PLF compliance and readiness status, gaps and renewal requirements."
  },
  {
    id: "executive-dashboard-report",
    title: "Executive Dashboard Report",
    icon: "PieChart",
    tone: "indigo",
    description: "Executive level summary with KPIs, insights and performance highlights."
  }
];

export const REPORT_FORM_OPTIONS = {
  sites: ["All Sites", "PLTG Jawa-1 / Unit 1", "Geothermal Dieng Unit 1", "Offshore Platform Alpha", "Refinery Unit Balongan"],
  units: ["All Units", "Process Unit", "Utility", "Reinjection", "Steam System"],
  assetTypes: ["All Asset Types", "Pressure Vessel", "Storage Tank", "Piping", "Pump", "Heat Exchanger"],
  riskLevels: ["All Risk Levels", "Extreme", "High", "Medium", "Low"],
  formats: ["PDF", "Excel", "CSV"] as ReportFormat[]
};

export const GENERATED_REPORT_HISTORY: ReportHistoryItem[] = [
  {
    reportName: "Asset_Integrity_Summary_20250510.pdf",
    reportType: "Asset Integrity Summary",
    generatedBy: "Budi Santoso",
    generatedDate: "10 May 2025 14:35",
    format: "PDF",
    dateRange: "01/05/2025 - 10/05/2025",
    status: "Completed",
    fileSize: "2.45 MB"
  },
  {
    reportName: "RBI_Assessment_Report_20250510.xlsx",
    reportType: "RBI Assessment Report",
    generatedBy: "R. Hadiyat",
    generatedDate: "10 May 2025 14:20",
    format: "Excel",
    dateRange: "01/05/2025 - 10/05/2025",
    status: "Completed",
    fileSize: "1.89 MB"
  },
  {
    reportName: "Inspection_Plan_Report_20250509.pdf",
    reportType: "Inspection Plan Report",
    generatedBy: "M. Irfan",
    generatedDate: "09 May 2025 09:15",
    format: "PDF",
    dateRange: "01/04/2025 - 30/04/2025",
    status: "Completed",
    fileSize: "1.72 MB"
  },
  {
    reportName: "Inspection_History_Report_20250508.pdf",
    reportType: "Inspection History Report",
    generatedBy: "T. Wijaya",
    generatedDate: "08 May 2025 16:10",
    format: "PDF",
    dateRange: "01/01/2024 - 30/04/2025",
    status: "Completed",
    fileSize: "3.21 MB"
  },
  {
    reportName: "Recommendation_Tracking_20250508.xlsx",
    reportType: "Recommendation Tracking Report",
    generatedBy: "S. Nugroho",
    generatedDate: "08 May 2025 15:02",
    format: "Excel",
    dateRange: "01/04/2025 - 30/04/2025",
    status: "Failed",
    fileSize: "-"
  },
  {
    reportName: "Compliance_Report_20250507.pdf",
    reportType: "Compliance Report",
    generatedBy: "A. Pratama",
    generatedDate: "07 May 2025 11:45",
    format: "PDF",
    dateRange: "01/04/2025 - 30/04/2025",
    status: "Completed",
    fileSize: "2.12 MB"
  },
  {
    reportName: "PLO_PLF_Readiness_Report_20250506.pdf",
    reportType: "PLO/PLF Readiness Report",
    generatedBy: "R. Hadiyat",
    generatedDate: "06 May 2025 10:30",
    format: "PDF",
    dateRange: "01/04/2025 - 30/04/2025",
    status: "Completed",
    fileSize: "1.56 MB"
  },
  {
    reportName: "Executive_Dashboard_Report_20250505.pdf",
    reportType: "Executive Dashboard Report",
    generatedBy: "Budi Santoso",
    generatedDate: "05 May 2025 09:00",
    format: "PDF",
    dateRange: "01/04/2025 - 30/04/2025",
    status: "Completed",
    fileSize: "1.34 MB"
  }
];
