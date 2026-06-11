/**
 * Fallback-only legacy mock data.
 * Runtime RBI Information metrics should come from backend-synchronized RBI store.
 */
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  DatabaseZap,
  FileText,
  Library,
  PencilLine,
  ShieldAlert,
  ShieldCheck,
  Settings2,
  SlidersHorizontal,
  TrendingUp
} from "lucide-react";

export type RbiColor = "blue" | "red" | "orange" | "purple" | "green";
export type RbiTrendDirection = "up" | "down";
export type RbiRiskLevel = "High" | "Medium";
export type RbiTargetStatus = "Exceeded" | "Acceptable";
export type RbiAssessmentStatus = "In Progress" | "Under Review" | "Draft" | "Approved";

export interface RbiKpiCard {
  title: string;
  value: string;
  trend: string;
  trendDirection: RbiTrendDirection;
  icon: LucideIcon;
  color: RbiColor;
}

export interface RbiQuickAccessCard {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  icon: LucideIcon;
  color: RbiColor;
}

export interface RbiRiskProfileItem {
  label: string;
  range: string;
  value: number;
  percentage: number;
  color: string;
}

export interface RbiActivitySummaryItem {
  label: string;
  value: string;
  icon: LucideIcon;
  critical?: boolean;
}

export interface RecentRbiAssessment {
  assessmentId: string;
  tagNumber: string;
  equipmentType: string;
  assessmentDate: string;
  pof: string;
  cof: string;
  riskLevel: RbiRiskLevel;
  targetStatus: RbiTargetStatus;
  assessmentStatus: RbiAssessmentStatus;
}

export interface MethodologyShortcut {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export const RBI_KPI_CARDS: RbiKpiCard[] = [
  {
    title: "Total Assessed Assets",
    value: "1,248",
    trend: "6% vs last month",
    trendDirection: "up",
    icon: ClipboardCheck,
    color: "blue"
  },
  {
    title: "High Risk Assets",
    value: "142",
    trend: "3% vs last month",
    trendDirection: "down",
    icon: ShieldAlert,
    color: "red"
  },
  {
    title: "Assets Exceeding Risk Target",
    value: "38",
    trend: "12% vs last month",
    trendDirection: "up",
    icon: AlertTriangle,
    color: "orange"
  },
  {
    title: "Pending RBI Approval",
    value: "18",
    trend: "10% vs last month",
    trendDirection: "down",
    icon: PencilLine,
    color: "purple"
  },
  {
    title: "Average Data Confidence",
    value: "82%",
    trend: "4% vs last month",
    trendDirection: "up",
    icon: ShieldCheck,
    color: "green"
  },
  {
    title: "Inspection Plans Generated from RBI",
    value: "74",
    trend: "15% vs last month",
    trendDirection: "up",
    icon: ClipboardList,
    color: "blue"
  }
];

export const RBI_QUICK_ACCESS_CARDS: RbiQuickAccessCard[] = [
  {
    title: "Risk Analytics",
    icon: TrendingUp,
    description: "Visualize portfolio risk, risk drivers, risk trends, and mitigation effectiveness.",
    buttonLabel: "Go to Risk Analytics",
    href: "/risk-based-inspection/risk-analytics",
    color: "blue"
  },
  {
    title: "Risk Register",
    icon: ClipboardList,
    description: "Manage all RBI assessment records, residual risk status, and recommended actions.",
    buttonLabel: "Go to Risk Register",
    href: "/risk-based-inspection/risk-register",
    color: "green"
  },
  {
    title: "Risk Assessment Workspace",
    icon: Settings2,
    description: "Create, calculate, review, approve, and update RBI assessments.",
    buttonLabel: "Go to Workspace",
    href: "/risk-based-inspection/risk-assessment-workspace",
    color: "purple"
  },
  {
    title: "RBI Update & Revalidation Control",
    icon: CalendarClock,
    description: "Monitor time-based and event-based updates, revalidations, and trigger status.",
    buttonLabel: "Manage Updates",
    href: "/risk-based-inspection/rbi-update-revalidation-control",
    color: "orange"
  },
  {
    title: "IOW & MOC Triggers",
    icon: Activity,
    description: "Track operating window excursions and management of change triggers.",
    buttonLabel: "View Triggers",
    href: "/risk-based-inspection/iow-moc-triggers",
    color: "red"
  },
  {
    title: "Methodology & Governance Library",
    icon: Library,
    description: "Manage calculation standards, risk criteria, effectiveness tables, and damage mechanism library.",
    buttonLabel: "Open Library",
    href: "/risk-based-inspection/methodology-governance-library",
    color: "blue"
  }
];

export const RBI_RISK_PROFILE: RbiRiskProfileItem[] = [
  { label: "Extreme", range: "20-25", value: 48, percentage: 4, color: "#dc2626" },
  { label: "Very High", range: "15-19", value: 102, percentage: 8, color: "#f97316" },
  { label: "High", range: "10-14", value: 237, percentage: 19, color: "#fb923c" },
  { label: "Medium", range: "5-9", value: 436, percentage: 35, color: "#2563eb" },
  { label: "Low", range: "0-4", value: 425, percentage: 34, color: "#16a34a" }
];

export const RBI_ACTIVITY_SUMMARY: RbiActivitySummaryItem[] = [
  { label: "Assessments Created", value: "28", icon: FileText },
  { label: "Assessments Completed", value: "18", icon: CheckCircle2 },
  { label: "Reassessments Due (Next 30 Days)", value: "31", icon: CalendarClock },
  { label: "Overdue Assessments", value: "12", icon: AlertTriangle, critical: true },
  { label: "Mitigation Actions Open", value: "44", icon: SlidersHorizontal },
  { label: "Inspection Actions Overdue", value: "19", icon: ShieldAlert, critical: true }
];

export const RECENT_RBI_ASSESSMENTS: RecentRbiAssessment[] = [
  {
    assessmentId: "RBI-2025-0156",
    tagNumber: "V-101",
    equipmentType: "Pressure Vessel",
    assessmentDate: "12 May 2025",
    pof: "3.06E-04",
    cof: "12,500",
    riskLevel: "High",
    targetStatus: "Exceeded",
    assessmentStatus: "In Progress"
  },
  {
    assessmentId: "RBI-2025-0155",
    tagNumber: "E-201",
    equipmentType: "Heat Exchanger",
    assessmentDate: "09 May 2025",
    pof: "2.10E-04",
    cof: "18,200",
    riskLevel: "High",
    targetStatus: "Exceeded",
    assessmentStatus: "Under Review"
  },
  {
    assessmentId: "RBI-2025-0154",
    tagNumber: "T-501",
    equipmentType: "Storage Tank",
    assessmentDate: "10 May 2025",
    pof: "1.20E-04",
    cof: "9,800",
    riskLevel: "Medium",
    targetStatus: "Acceptable",
    assessmentStatus: "Draft"
  },
  {
    assessmentId: "RBI-2025-0153",
    tagNumber: "P-301A/B",
    equipmentType: "Centrifugal Pump",
    assessmentDate: "08 May 2025",
    pof: "8.70E-05",
    cof: "6,100",
    riskLevel: "Medium",
    targetStatus: "Acceptable",
    assessmentStatus: "In Progress"
  },
  {
    assessmentId: "RBI-2025-0152",
    tagNumber: "P-102",
    equipmentType: "Piping Circuit",
    assessmentDate: "07 May 2025",
    pof: "5.60E-05",
    cof: "22,000",
    riskLevel: "High",
    targetStatus: "Exceeded",
    assessmentStatus: "Approved"
  }
];

export const RBI_RISK_LEGEND = [
  { label: "Low (0-4)", color: "#16a34a" },
  { label: "Medium (5-9)", color: "#2563eb" },
  { label: "High (10-14)", color: "#fb923c" },
  { label: "Very High (15-19)", color: "#f97316" },
  { label: "Extreme (20-25)", color: "#dc2626" }
];

export const METHODOLOGY_SHORTCUTS: MethodologyShortcut[] = [
  {
    title: "API RP 580 Program Governance",
    subtitle: "Fourth Edition with Addendum 1, 2025",
    icon: ShieldCheck
  },
  {
    title: "API RP 581 Calculation Basis",
    subtitle: "Fourth Edition, January 2025",
    icon: DatabaseZap
  },
  {
    title: "Risk Criteria Configuration",
    subtitle: "Risk matrix, target, and thresholds",
    icon: BarChart3
  },
  {
    title: "Damage Mechanism Library",
    subtitle: "API 571 / API 581 aligned mechanisms",
    icon: Library
  },
  {
    title: "Inspection Effectiveness Tables",
    subtitle: "NDE effectiveness by mechanism",
    icon: ClipboardCheck
  },
  {
    title: "Management Systems Factor Assessment",
    subtitle: "Facility management system evaluation",
    icon: SlidersHorizontal
  },
  {
    title: "Report Template Configuration",
    subtitle: "RBI report templates and packages",
    icon: BookOpen
  }
];
