export type IconName =
  | "Activity"
  | "AlertTriangle"
  | "Archive"
  | "BadgeCheck"
  | "BarChart3"
  | "Bell"
  | "Building2"
  | "CalendarClock"
  | "ClipboardCheck"
  | "Database"
  | "FileCheck2"
  | "FileText"
  | "FolderOpen"
  | "Gauge"
  | "HelpCircle"
  | "LayoutDashboard"
  | "LifeBuoy"
  | "LineChart"
  | "Settings"
  | "ShieldAlert"
  | "ShieldCheck"
  | "UserCog"
  | "Wrench";

export type TrendDirection = "up" | "down";
export type TrendTone = "positive" | "negative";
export type RiskLevel = "Extreme" | "High" | "Medium" | "Low";
export type Severity = "critical" | "warning" | "info";
export type WorkflowStatus = "completed" | "pending";

export interface UserProfile {
  name: string;
  role: string;
}

export interface AppInfo {
  company: string;
  title: string;
  subtitle: string;
  projectName: string;
  standardLabel: string;
  lastUpdated: string;
  user: UserProfile;
}

export interface SidebarItem {
  label: string;
  icon: IconName;
  href: string;
  active?: boolean;
}

export interface SummaryKpi {
  title: string;
  value: string;
  icon: IconName;
  trend: {
    value: string;
    direction: TrendDirection;
    tone: TrendTone;
  };
  iconTone: "blue" | "green" | "yellow" | "orange" | "red" | "cyan";
}

export interface AxisItem {
  value: number;
  label: string;
}

export interface RiskMatrixMarker {
  likelihood: number;
  consequence: number;
  label: string;
  value: number;
  level: RiskLevel;
}

export interface RiskLegendItem {
  label: RiskLevel | "Total Assets";
  value: number;
}

export interface DonutSegment {
  name: string;
  value: number;
  percentage?: string;
  color: string;
}

export interface DonutChartDataset {
  title: string;
  centerLabel: string;
  actionLabel: string;
  data: DonutSegment[];
}

export interface RecentAlert {
  title: string;
  asset: string;
  time: string;
  severity: Severity;
}

export interface OverdueInspection {
  assetId: string;
  assetName: string;
  inspectionType: string;
  dueDate: string;
  overdue: string;
  risk: RiskLevel;
  status: "Overdue";
}

export interface DocumentSpotlightData {
  fileName: string;
  fileType: string;
  status: "Approved";
  version: string;
  size: string;
  date: string;
  description: string;
  owner: string;
  expiryDate: string;
}

export interface WorkflowStep {
  label: string;
  status: WorkflowStatus;
  detail?: string;
}

export interface ApprovalDetails {
  approvedBy: string;
  role: string;
  date: string;
  status: "Approved";
  comment: string;
}

export interface AuditTrailItem {
  actor: string;
  action: string;
  date: string;
}

export interface WorkflowApprovalData {
  document: string;
  steps: WorkflowStep[];
  approval: ApprovalDetails;
  auditTrail: AuditTrailItem[];
}

export interface RiskTrendPoint {
  month: string;
  extreme: number;
  high: number;
  medium: number;
  low: number;
}

export interface InspectionPerformanceData {
  value: number;
  label: string;
  target: string;
}

export interface ExpiringCertificate {
  name: string;
  expiry: string;
  remaining: string;
  tone: "critical" | "warning" | "normal";
}

export const APP_INFO: AppInfo = {
  company: "PT SUCOFINDO (Persero)",
  title: "ASSET INTEGRITY MANAGEMENT",
  subtitle: "Risk-Based Inspection Platform",
  projectName: "Geothermal Dieng Unit 1",
  standardLabel: "API 580 / API 581 Concepts",
  lastUpdated: "Last updated: 20 May 2025, 10:35 WIB",
  user: {
    name: "Budi Santoso",
    role: "Reliability Engineer"
  }
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", icon: "LayoutDashboard", href: "#", active: true },
  { label: "Asset Registry", icon: "Database", href: "#" },
  { label: "Risk-Based Inspection", icon: "Gauge", href: "#" },
  { label: "Inspection Management", icon: "ClipboardCheck", href: "#" },
  { label: "Anomaly & Recommendation", icon: "ShieldAlert", href: "#" },
  { label: "Compliance & Certification", icon: "BadgeCheck", href: "#" },
  { label: "Document Center", icon: "FolderOpen", href: "#" },
  { label: "Reports", icon: "BarChart3", href: "#" },
  { label: "Helpdesk", icon: "LifeBuoy", href: "#" },
  { label: "About SUCOFINDO", icon: "Building2", href: "#" },
  { label: "Administration", icon: "Settings", href: "#" }
];

export const SUMMARY_KPIS: SummaryKpi[] = [
  {
    title: "Total Assets",
    value: "1,253",
    icon: "Archive",
    trend: { value: "+4.2%", direction: "up", tone: "positive" },
    iconTone: "blue"
  },
  {
    title: "High Risk Assets",
    value: "142",
    icon: "ShieldAlert",
    trend: { value: "+8.1%", direction: "up", tone: "positive" },
    iconTone: "red"
  },
  {
    title: "Overdue Inspections",
    value: "28",
    icon: "CalendarClock",
    trend: { value: "-12.5%", direction: "down", tone: "positive" },
    iconTone: "orange"
  },
  {
    title: "Open Anomalies",
    value: "36",
    icon: "AlertTriangle",
    trend: { value: "+5.6%", direction: "up", tone: "positive" },
    iconTone: "yellow"
  },
  {
    title: "Expired Certificates",
    value: "14",
    icon: "FileCheck2",
    trend: { value: "-7.1%", direction: "down", tone: "positive" },
    iconTone: "cyan"
  },
  {
    title: "Open Recommendations",
    value: "41",
    icon: "Wrench",
    trend: { value: "+3.3%", direction: "up", tone: "positive" },
    iconTone: "green"
  }
];

export const LIKELIHOOD_AXIS: AxisItem[] = [
  { value: 1, label: "Rare" },
  { value: 2, label: "Unlikely" },
  { value: 3, label: "Possible" },
  { value: 4, label: "Likely" },
  { value: 5, label: "Almost Certain" }
];

export const CONSEQUENCE_AXIS: AxisItem[] = [
  { value: 1, label: "Negligible" },
  { value: 2, label: "Minor" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Major" },
  { value: 5, label: "Catastrophic" }
];

export const RISK_MATRIX_MARKERS: RiskMatrixMarker[] = [
  { likelihood: 1, consequence: 1, label: "Low", value: 220, level: "Low" },
  { likelihood: 2, consequence: 2, label: "Low/Medium", value: 61, level: "Medium" },
  { likelihood: 3, consequence: 3, label: "Medium", value: 35, level: "Medium" },
  { likelihood: 4, consequence: 4, label: "High", value: 17, level: "High" },
  { likelihood: 5, consequence: 5, label: "Extreme", value: 8, level: "Extreme" }
];

export const RISK_LEGEND: RiskLegendItem[] = [
  { label: "Extreme", value: 8 },
  { label: "High", value: 52 },
  { label: "Medium", value: 121 },
  { label: "Low", value: 281 },
  { label: "Total Assets", value: 1253 }
];

export const INSPECTION_STATUS: DonutChartDataset = {
  title: "Inspection Status",
  centerLabel: "Total 612",
  actionLabel: "View Inspection Management",
  data: [
    { name: "Completed", value: 312, percentage: "51.0%", color: "#16a34a" },
    { name: "In Progress", value: 156, percentage: "25.5%", color: "#2563eb" },
    { name: "Scheduled", value: 104, percentage: "17.0%", color: "#eab308" },
    { name: "Overdue", value: 40, percentage: "6.5%", color: "#dc2626" }
  ]
};

export const RECOMMENDATIONS_STATUS: DonutChartDataset = {
  title: "Recommendations Status",
  centerLabel: "Total 197",
  actionLabel: "View All Recommendations",
  data: [
    { name: "Closed", value: 102, percentage: "51.8%", color: "#16a34a" },
    { name: "In Progress", value: 41, percentage: "20.8%", color: "#2563eb" },
    { name: "Proposed", value: 28, percentage: "14.2%", color: "#eab308" },
    { name: "Overdue", value: 26, percentage: "13.2%", color: "#dc2626" }
  ]
};

export const RECENT_ALERTS: RecentAlert[] = [
  {
    title: "Overdue Inspection",
    asset: "Asset: V-101 - 12 months inspection is overdue",
    time: "Today 09:15",
    severity: "critical"
  },
  {
    title: "High Risk Anomaly",
    asset: "Asset: Thickness loss detected on P-201 (Shell)",
    time: "Today 08:42",
    severity: "critical"
  },
  {
    title: "Certificate Expiring Soon",
    asset: "Asset: API 510 - Pressure Vessel Inspector Certificate",
    time: "Yesterday 16:30",
    severity: "warning"
  },
  {
    title: "Document Expired",
    asset: "Asset: WPS - CS-01 has expired",
    time: "Yesterday 11:05",
    severity: "info"
  }
];

export const OVERDUE_INSPECTIONS: OverdueInspection[] = [
  {
    assetId: "V-101",
    assetName: "Separator Vessel",
    inspectionType: "Internal Inspection",
    dueDate: "15 Apr 2025",
    overdue: "18 days",
    risk: "High",
    status: "Overdue"
  },
  {
    assetId: "P-201A",
    assetName: "Condensate Pump",
    inspectionType: "Internal Inspection",
    dueDate: "20 Apr 2025",
    overdue: "13 days",
    risk: "High",
    status: "Overdue"
  },
  {
    assetId: "T-501",
    assetName: "Storage Tank",
    inspectionType: "Internal Inspection",
    dueDate: "05 May 2025",
    overdue: "8 days",
    risk: "Medium",
    status: "Overdue"
  },
  {
    assetId: "E-301",
    assetName: "Heat Exchanger",
    inspectionType: "Internal Inspection",
    dueDate: "10 May 2025",
    overdue: "3 days",
    risk: "Medium",
    status: "Overdue"
  },
  {
    assetId: "P-302B",
    assetName: "Reinjection Pump",
    inspectionType: "Vibration Analysis",
    dueDate: "12 May 2025",
    overdue: "1 day",
    risk: "Low",
    status: "Overdue"
  }
];

export const DOCUMENT_SPOTLIGHT: DocumentSpotlightData = {
  fileName: "RBI Assessment Report - Dieng Unit 1 - 2025.pdf",
  fileType: "PDF",
  status: "Approved",
  version: "2.1",
  size: "2.45 MB",
  date: "08 May 2025",
  description: "RBI Assessment for Pressure System based on API 580 & ASME FFS-1",
  owner: "Rizky Pratama",
  expiryDate: "08 May 2026"
};

export const WORKFLOW_APPROVAL: WorkflowApprovalData = {
  document: "RBI Assessment Report - Dieng Unit 1 - 2025",
  steps: [
    { label: "Prepared", status: "completed", detail: "Prepared by Rizky P. on 02 May 2025" },
    { label: "Reviewed", status: "completed", detail: "Reviewed by Arief W. on 05 May 2025" },
    { label: "Approved", status: "completed", detail: "Approved by Dewi L. on 08 May 2025" },
    { label: "Issued", status: "pending" }
  ],
  approval: {
    approvedBy: "Dewi Lestari",
    role: "Integrity Manager",
    date: "08 May 2025 14:22",
    status: "Approved",
    comment: "Approved. Please proceed with implementation."
  },
  auditTrail: [
    {
      actor: "Dewi Lestari",
      action: "approved the document",
      date: "08 May 2025 14:22"
    },
    {
      actor: "Arief Wibowo",
      action: "reviewed the document",
      date: "05 May 2025 10:11"
    },
    {
      actor: "Rizky Pratama",
      action: "uploaded the document",
      date: "02 May 2025 09:08"
    }
  ]
};

export const RISK_TREND: RiskTrendPoint[] = [
  { month: "Dec 2024", extreme: 75, high: 125, medium: 175, low: 32 },
  { month: "Jan 2025", extreme: 76, high: 122, medium: 166, low: 31 },
  { month: "Feb 2025", extreme: 58, high: 82, medium: 122, low: 28 },
  { month: "Mar 2025", extreme: 70, high: 102, medium: 145, low: 30 },
  { month: "Apr 2025", extreme: 72, high: 105, medium: 150, low: 33 },
  { month: "May 2025", extreme: 71, high: 101, medium: 143, low: 34 }
];

export const INSPECTION_PERFORMANCE: InspectionPerformanceData = {
  value: 91,
  label: "On-time Completion",
  target: "Target: ≥ 90%"
};

export const ANOMALIES_BY_CATEGORY: DonutChartDataset = {
  title: "Anomalies by Category",
  centerLabel: "Total 36",
  actionLabel: "View Anomaly Register",
  data: [
    { name: "Corrosion", value: 15, percentage: "41.7%", color: "#dc2626" },
    { name: "Mechanical", value: 9, percentage: "25.0%", color: "#f97316" },
    { name: "Process", value: 7, percentage: "19.4%", color: "#2563eb" },
    { name: "Others", value: 5, percentage: "13.9%", color: "#64748b" }
  ]
};

export const COMPLIANCE_STATUS: DonutChartDataset = {
  title: "Compliance Status",
  centerLabel: "87% Compliant",
  actionLabel: "View Compliance",
  data: [
    { name: "Compliant", value: 156, color: "#16a34a" },
    { name: "Minor Gap", value: 18, color: "#eab308" },
    { name: "Major Gap", value: 6, color: "#f97316" },
    { name: "Non-Compliant", value: 3, color: "#dc2626" }
  ]
};

export const EXPIRING_CERTIFICATES: ExpiringCertificate[] = [
  {
    name: "API 510 - Pressure Vessel Inspector",
    expiry: "Exp: 25 May 2025",
    remaining: "5 days",
    tone: "critical"
  },
  {
    name: "API 570 - Piping Inspector",
    expiry: "Exp: 02 Jun 2025",
    remaining: "13 days",
    tone: "warning"
  },
  {
    name: "ISO 9001:2015",
    expiry: "Exp: 18 Jul 2025",
    remaining: "59 days",
    tone: "normal"
  }
];

export interface RevisedDashboardKpi {
  title: string;
  value: string;
  trend?: string;
  status?: string;
  tone: "blue" | "green" | "orange" | "red" | "purple";
  icon: "Database" | "ShieldAlert" | "CalendarClock" | "AlertTriangle" | "BadgeCheck";
  circularProgress?: number;
}

export interface DashboardTableAsset {
  tagNumber: string;
  equipmentName: string;
  type: string;
  unit: string;
  riskLevel: "Extreme" | "High" | "Medium";
  nextInspectionDue: string;
}

export interface SimpleInspectionRow {
  tagNumber: string;
  equipment: string;
  dueDate?: string;
  overdueSince?: string;
}

export interface InspectionCompletionPoint {
  month: string;
  completed: number;
  completion: number;
}

export interface DashboardMetricRow {
  label: string;
  value: number | string;
  tone?: "green" | "yellow" | "orange" | "red" | "blue" | "slate";
}

export interface ActionPriorityItem {
  type: string;
  title: string;
  meta: string;
  status: string;
  tone: "blue" | "green" | "orange" | "red";
}

export const DASHBOARD_PAGE_META = {
  title: "Dashboard",
  site: "Geothermal Dieng Unit 1",
  lastDataUpdate: "08 May 2025 09:00 WIB"
};

export const REVISED_DASHBOARD_KPIS: RevisedDashboardKpi[] = [
  {
    title: "Total Assets",
    value: "1,253",
    trend: "+4.2% vs last month",
    tone: "blue",
    icon: "Database"
  },
  {
    title: "High Risk Assets",
    value: "142",
    trend: "+8.1% vs last month",
    tone: "orange",
    icon: "ShieldAlert"
  },
  {
    title: "Overdue Inspections",
    value: "28",
    trend: "-12.5% vs last month",
    tone: "red",
    icon: "CalendarClock"
  },
  {
    title: "Open Recommendations",
    value: "36",
    trend: "+5.6% vs last month",
    tone: "orange",
    icon: "AlertTriangle"
  },
  {
    title: "Expiring Certifications",
    value: "14",
    trend: "-7.1% vs last month",
    tone: "purple",
    icon: "BadgeCheck"
  },
  {
    title: "Data Completeness Score",
    value: "86%",
    status: "Good",
    tone: "green",
    icon: "BadgeCheck",
    circularProgress: 86
  }
];

export const REVISED_RISK_CATEGORIES: DashboardMetricRow[] = [
  { label: "Extreme", value: 8, tone: "red" },
  { label: "High", value: 52, tone: "orange" },
  { label: "Medium", value: 121, tone: "yellow" },
  { label: "Low", value: 281, tone: "green" },
  { label: "Not Assessed", value: 791, tone: "slate" },
  { label: "Total Assets", value: "1,253", tone: "blue" }
];

export const REVISED_RISK_DISTRIBUTION: DonutChartDataset = {
  title: "Risk Distribution",
  centerLabel: "1,253 Assets",
  actionLabel: "View Full Risk Register",
  data: [
    { name: "Low", value: 281, percentage: "22.4%", color: "#16a34a" },
    { name: "Medium", value: 121, percentage: "9.7%", color: "#eab308" },
    { name: "High", value: 52, percentage: "4.1%", color: "#f97316" },
    { name: "Extreme", value: 8, percentage: "0.6%", color: "#dc2626" },
    { name: "Not Assessed", value: 791, percentage: "63.2%", color: "#cbd5e1" }
  ]
};

export const TOP_CRITICAL_ASSETS: DashboardTableAsset[] = [
  { tagNumber: "V-101", equipmentName: "Separator Vessel", type: "Pressure Vessel", unit: "Process Unit", riskLevel: "Extreme", nextInspectionDue: "15 May 2025" },
  { tagNumber: "P-201A", equipmentName: "Condensate Pump", type: "Pump", unit: "Process Unit", riskLevel: "High", nextInspectionDue: "10 May 2025" },
  { tagNumber: "T-501", equipmentName: "Storage Tank", type: "Storage Tank", unit: "Fuel System", riskLevel: "High", nextInspectionDue: "12 May 2025" },
  { tagNumber: "E-301", equipmentName: "Heat Exchanger", type: "Heat Exchanger", unit: "Process Unit", riskLevel: "High", nextInspectionDue: "18 May 2025" },
  { tagNumber: "P-302B", equipmentName: "Reinjection Pump", type: "Pump", unit: "Reinjection", riskLevel: "High", nextInspectionDue: "09 May 2025" },
  { tagNumber: "PL-101", equipmentName: "Steam Line 10\"-CLS", type: "Piping", unit: "Steam System", riskLevel: "Medium", nextInspectionDue: "25 May 2025" },
  { tagNumber: "T-201", equipmentName: "Flash Tank", type: "Storage Tank", unit: "Process Unit", riskLevel: "Medium", nextInspectionDue: "20 May 2025" },
  { tagNumber: "E-205", equipmentName: "Cooler", type: "Heat Exchanger", unit: "Utility", riskLevel: "Medium", nextInspectionDue: "20 May 2025" },
  { tagNumber: "V-305", equipmentName: "Knock Out Drum", type: "Pressure Vessel", unit: "Process Unit", riskLevel: "Medium", nextInspectionDue: "26 May 2025" },
  { tagNumber: "P-102", equipmentName: "Boiler Feed Pump", type: "Pump", unit: "Utility", riskLevel: "Medium", nextInspectionDue: "27 May 2025" }
];

export const UPCOMING_INSPECTIONS: SimpleInspectionRow[] = [
  { tagNumber: "V-101", equipment: "Separator Vessel", dueDate: "15 May 2025" },
  { tagNumber: "P-201A", equipment: "Condensate Pump", dueDate: "10 May 2025" },
  { tagNumber: "T-501", equipment: "Storage Tank", dueDate: "12 May 2025" },
  { tagNumber: "E-301", equipment: "Heat Exchanger", dueDate: "18 May 2025" },
  { tagNumber: "PL-101", equipment: "Steam Line 10\"-CLS", dueDate: "25 May 2025" }
];

export const OVERDUE_INSPECTION_OVERVIEW: SimpleInspectionRow[] = [
  { tagNumber: "P-302B", equipment: "Reinjection Pump", overdueSince: "09 May 2025" },
  { tagNumber: "P-402A", equipment: "Cooling Water Pump", overdueSince: "05 May 2025" },
  { tagNumber: "T-102", equipment: "Storage Tank", overdueSince: "03 May 2025" },
  { tagNumber: "T-103", equipment: "Surge Tank", overdueSince: "03 May 2025" },
  { tagNumber: "E-103", equipment: "Heat Exchanger", overdueSince: "02 May 2025" }
];

export const INSPECTION_COMPLETION_TREND: InspectionCompletionPoint[] = [
  { month: "Dec 2024", completed: 142, completion: 72 },
  { month: "Jan 2025", completed: 128, completion: 68 },
  { month: "Feb 2025", completed: 136, completion: 76 },
  { month: "Mar 2025", completed: 151, completion: 84 },
  { month: "Apr 2025", completed: 120, completion: 71 },
  { month: "May 2025", completed: 132, completion: 78 }
];

export const INSPECTION_STATUS_SUMMARY: DonutChartDataset = {
  title: "Status Summary",
  centerLabel: "Total 168",
  actionLabel: "Go to Inspection Management",
  data: [
    { name: "Completed", value: 96, color: "#16a34a" },
    { name: "In Progress", value: 41, color: "#2563eb" },
    { name: "Overdue", value: 13, color: "#dc2626" },
    { name: "Scheduled", value: 18, color: "#eab308" }
  ]
};

export const RECOMMENDATION_STATUS_REVISED: DonutChartDataset = {
  title: "Recommendation Status",
  centerLabel: "Total 197",
  actionLabel: "View All Recommendations",
  data: [
    { name: "Closed", value: 102, percentage: "51.8%", color: "#16a34a" },
    { name: "In Progress", value: 41, percentage: "24.4%", color: "#2563eb" },
    { name: "Proposed", value: 28, percentage: "14.2%", color: "#eab308" },
    { name: "Overdue", value: 26, percentage: "13.2%", color: "#dc2626" }
  ]
};

export const PLO_PLF_STATUS: DonutChartDataset = {
  title: "PLO / PLF Status",
  centerLabel: "87% Compliant",
  actionLabel: "View PLO / PLF Details",
  data: [
    { name: "Compliant", value: 24, color: "#16a34a" },
    { name: "Minor Gap", value: 3, color: "#eab308" },
    { name: "Major Gap", value: 1, color: "#dc2626" },
    { name: "Not Applicable", value: 2, color: "#cbd5e1" }
  ]
};

export const CERTIFICATION_STATUS_REVISED: DonutChartDataset = {
  title: "Certification Status",
  centerLabel: "Total 168",
  actionLabel: "View Certifications",
  data: [
    { name: "Valid", value: 124, color: "#16a34a" },
    { name: "Expiring Soon", value: 24, color: "#eab308" },
    { name: "Expired", value: 16, color: "#dc2626" },
    { name: "Not Required", value: 4, color: "#cbd5e1" }
  ]
};

export const REGULATORY_GAP_SUMMARY: DashboardMetricRow[] = [
  { label: "Total Requirements", value: 156, tone: "blue" },
  { label: "Compliant", value: 112, tone: "green" },
  { label: "Minor Gap", value: 28, tone: "yellow" },
  { label: "Major Gap", value: 12, tone: "red" },
  { label: "Not Applicable", value: 4, tone: "slate" }
];

export const PENDING_APPROVALS: ActionPriorityItem[] = [
  { type: "RBI", title: "RBI Assessment - V-101 Separator Vessel", meta: "Submitted by Arief W.", status: "Under Review", tone: "blue" },
  { type: "INS", title: "Inspection Result - P-201A Condensate Pump", meta: "Submitted by Rony S.", status: "Under Review", tone: "orange" },
  { type: "DOC", title: "Workpack - T-501 Storage Tank", meta: "Submitted by Indra G.", status: "Under Review", tone: "green" }
];

export const REQUIRED_OWNER_ACTIONS: ActionPriorityItem[] = [
  { type: "High", title: "Review & approve inspection plan for P-302B", meta: "Due: 09 May 2025", status: "Overdue", tone: "red" },
  { type: "High", title: "Provide operating data update for E-301", meta: "Due: 10 May 2025", status: "Overdue", tone: "red" },
  { type: "High", title: "Respond to recommendation for T-102", meta: "Due: 12 May 2025", status: "Due Soon", tone: "orange" }
];

export const HIGH_PRIORITY_MITIGATION: ActionPriorityItem[] = [
  { type: "Extreme", title: "Thickness loss detected on V-101 shell", meta: "Recommendation due: 16 May 2025", status: "In Progress", tone: "red" },
  { type: "Extreme", title: "Crack-like indication on E-301 tubesheet", meta: "Recommendation due: 18 May 2025", status: "In Progress", tone: "red" },
  { type: "Extreme", title: "High vibration on P-201A bearing DE", meta: "Recommendation due: 20 May 2025", status: "In Progress", tone: "red" }
];
