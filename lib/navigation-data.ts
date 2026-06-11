import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Database,
  Folder,
  Headphones,
  Home,
  Settings,
  ShieldCheck
} from "lucide-react";

export interface NavigationChild {
  label: string;
  href: string;
}

export interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavigationChild[];
}

export interface NavigationPage {
  label: string;
  href: string;
  parentLabel?: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    key: "asset-registry",
    label: "Asset Registry",
    href: "/asset-registry",
    icon: Database
  },
  {
    key: "risk-based-inspection",
    label: "Risk-Based Inspection",
    href: "/risk-based-inspection",
    icon: ClipboardList,
    children: [
      { label: "RBI Information", href: "/risk-based-inspection/rbi-information" },
      { label: "Risk Analytics", href: "/risk-based-inspection/risk-analytics" },
      { label: "Risk Register", href: "/risk-based-inspection/risk-register" },
      { label: "Risk Assessment Workspace", href: "/risk-based-inspection/risk-assessment-workspace" }
    ]
  },
  {
    key: "inspection-management",
    label: "Inspection Management",
    href: "/inspection-management",
    icon: ClipboardCheck,
    children: [
      { label: "Inspection Information", href: "/inspection-management/inspection-information" },
      { label: "Inspection Plan", href: "/inspection-management/inspection-plan" },
      { label: "Inspection Schedule", href: "/inspection-management/inspection-schedule" },
      { label: "Inspection Detail", href: "/inspection-management/inspection-detail" },
      { label: "Inspection History", href: "/inspection-management/inspection-history" }
    ]
  },
  {
    key: "anomaly-recommendation",
    label: "Anomaly & Recommendation",
    href: "/anomaly-recommendation",
    icon: AlertTriangle,
    children: [
      { label: "Anomaly Register", href: "/anomaly-recommendation/anomaly-register" },
      { label: "Recommendation Detail", href: "/anomaly-recommendation/recommendation-detail" }
    ]
  },
  {
    key: "compliance-certification",
    label: "Compliance & Certification",
    href: "/compliance-certification",
    icon: ShieldCheck,
    children: [
      { label: "Certification Information", href: "/compliance-certification/certification-information" },
      { label: "Certification Register", href: "/compliance-certification/certification-register" },
      { label: "Regulatory Matrix", href: "/compliance-certification/regulatory-matrix" },
      { label: "Renewal Tracker", href: "/compliance-certification/renewal-tracker" }
    ]
  },
  {
    key: "document-center",
    label: "Document Center",
    href: "/document-center",
    icon: Folder
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: BarChart3
  },
  {
    key: "helpdesk",
    label: "Helpdesk",
    href: "/helpdesk",
    icon: Headphones,
    children: [
      { label: "Helpdesk Information", href: "/helpdesk/helpdesk-information" },
      { label: "Create Ticket", href: "/helpdesk/create-ticket" },
      { label: "Ticket Detail", href: "/helpdesk/ticket-detail" }
    ]
  },
  {
    key: "about-sucofindo",
    label: "About SUCOFINDO",
    href: "/about-sucofindo",
    icon: Building2
  },
  {
    key: "administration",
    label: "Administration",
    href: "/administration",
    icon: Settings
  }
];

export const DEFAULT_OPEN_NAVIGATION_KEYS = NAVIGATION_ITEMS
  .filter((item) => item.children?.length)
  .map((item) => item.key);

export const NAVIGATION_PAGES: NavigationPage[] = NAVIGATION_ITEMS.flatMap((item) => [
  { label: item.label, href: item.href },
  ...(item.children ?? []).map((child) => ({
    label: child.label,
    href: child.href,
    parentLabel: item.label
  }))
]);

export const EXTRA_PLACEHOLDER_PAGES: NavigationPage[] = [
  {
    label: "RBI Update & Revalidation Control",
    href: "/risk-based-inspection/rbi-update-revalidation-control",
    parentLabel: "Risk-Based Inspection"
  },
  {
    label: "IOW & MOC Triggers",
    href: "/risk-based-inspection/iow-moc-triggers",
    parentLabel: "Risk-Based Inspection"
  },
  {
    label: "Methodology & Governance Library",
    href: "/risk-based-inspection/methodology-governance-library",
    parentLabel: "Risk-Based Inspection"
  }
];

export const PLACEHOLDER_PAGES: NavigationPage[] = [
  ...NAVIGATION_PAGES,
  ...EXTRA_PLACEHOLDER_PAGES
];

export function getNavigationPageByPath(path: string) {
  return PLACEHOLDER_PAGES.find((page) => page.href === path);
}

export function isNavigationHrefActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isProtectedNavigationPath(pathname: string) {
  return NAVIGATION_ITEMS.some((item) => isNavigationHrefActive(pathname, item.href));
}
