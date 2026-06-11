export type AdminModuleIcon =
  | "Users"
  | "ShieldCheck"
  | "Building2"
  | "Grid3X3"
  | "Workflow"
  | "Database"
  | "Bell"
  | "FileClock";

export type AdminStatus = "Success" | "Failed";

export interface AdminModule {
  title: string;
  description: string;
  actionLabel: string;
  icon: AdminModuleIcon;
  tone: "blue" | "green" | "cyan" | "orange" | "purple" | "teal" | "yellow" | "indigo";
}

export interface AdminActivity {
  dateTime: string;
  user: string;
  userInitials: string;
  activity: string;
  module: string;
  status: AdminStatus;
  ipAddress: string;
}

export const ADMIN_MODULES: AdminModule[] = [
  {
    title: "User Management",
    description: "Manage system users, profiles, and account status.",
    actionLabel: "Manage",
    icon: "Users",
    tone: "blue"
  },
  {
    title: "Role & Permission",
    description: "Define user roles and manage module-level access rights.",
    actionLabel: "Manage",
    icon: "ShieldCheck",
    tone: "green"
  },
  {
    title: "Project / Site Configuration",
    description: "Configure projects, sites, units, facilities, and asset hierarchy.",
    actionLabel: "Manage",
    icon: "Building2",
    tone: "cyan"
  },
  {
    title: "Risk Matrix Configuration",
    description: "Configure risk matrix, likelihood, consequence, and risk criteria.",
    actionLabel: "Manage",
    icon: "Grid3X3",
    tone: "orange"
  },
  {
    title: "Approval Workflow",
    description: "Define and manage approval workflow and escalation rules.",
    actionLabel: "Manage",
    icon: "Workflow",
    tone: "purple"
  },
  {
    title: "Master Data",
    description: "Manage master data for assets, inspection, materials, vendors, and more.",
    actionLabel: "Manage",
    icon: "Database",
    tone: "teal"
  },
  {
    title: "Notification Setting",
    description: "Configure system notifications and alert preferences.",
    actionLabel: "Manage",
    icon: "Bell",
    tone: "yellow"
  },
  {
    title: "Audit Trail",
    description: "Review system audit logs, user activities, and changes.",
    actionLabel: "View Logs",
    icon: "FileClock",
    tone: "indigo"
  }
];

export const ADMIN_MODULE_FILTERS = [
  "All Modules",
  "User Management",
  "Role & Permission",
  "Project / Site Configuration",
  "Risk Matrix Configuration",
  "Approval Workflow",
  "Master Data",
  "Notification Setting",
  "Audit Trail"
];

export const ADMIN_ACTIVITIES: AdminActivity[] = [
  {
    dateTime: "10 May 2025 14:32",
    user: "Admin User",
    userInitials: "AU",
    activity: "Created new user: andi.pratama@client.co.id",
    module: "User Management",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "10 May 2025 13:45",
    user: "Admin User",
    userInitials: "AU",
    activity: "Updated role permissions: Reliability Engineer",
    module: "Role & Permission",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "10 May 2025 11:20",
    user: "Admin User",
    userInitials: "AU",
    activity: "Added new site: Central Processing Plant",
    module: "Project / Site Configuration",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "09 May 2025 16:10",
    user: "Admin User",
    userInitials: "AU",
    activity: "Updated risk matrix: High Risk Criteria",
    module: "Risk Matrix Configuration",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "09 May 2025 15:05",
    user: "Admin User",
    userInitials: "AU",
    activity: "Updated approval workflow: RCA Workflow",
    module: "Approval Workflow",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "09 May 2025 10:22",
    user: "Admin User",
    userInitials: "AU",
    activity: "Added new master data: Material Category",
    module: "Master Data",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "08 May 2025 17:40",
    user: "Admin User",
    userInitials: "AU",
    activity: "Updated notification setting: Email Alert",
    module: "Notification Setting",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "08 May 2025 09:15",
    user: "Admin User",
    userInitials: "AU",
    activity: "Viewed audit log",
    module: "Audit Trail",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "07 May 2025 14:00",
    user: "System",
    userInitials: "SY",
    activity: "User login: Admin User",
    module: "Authentication",
    status: "Success",
    ipAddress: "10.10.1.25"
  },
  {
    dateTime: "07 May 2025 09:30",
    user: "Admin User",
    userInitials: "AU",
    activity: "Deleted user: test.user@client.co.id",
    module: "User Management",
    status: "Failed",
    ipAddress: "10.10.1.25"
  }
];
