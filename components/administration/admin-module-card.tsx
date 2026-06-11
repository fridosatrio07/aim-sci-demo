import {
  ArrowRight,
  Bell,
  Building2,
  Database,
  FileClock,
  Grid3X3,
  ShieldCheck,
  Users,
  Workflow
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type { AdminModule, AdminModuleIcon } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

interface AdminModuleCardProps {
  module: AdminModule;
}

const iconMap: Record<AdminModuleIcon, typeof Users> = {
  Users,
  ShieldCheck,
  Building2,
  Grid3X3,
  Workflow,
  Database,
  Bell,
  FileClock
};

const toneClasses: Record<AdminModule["tone"], string> = {
  blue: "from-blue-600 to-blue-500",
  green: "from-emerald-600 to-green-500",
  cyan: "from-cyan-600 to-blue-500",
  orange: "from-orange-500 to-amber-500",
  purple: "from-violet-600 to-purple-500",
  teal: "from-teal-600 to-cyan-500",
  yellow: "from-yellow-500 to-amber-400",
  indigo: "from-indigo-600 to-blue-600"
};

export function AdminModuleCard({ module }: AdminModuleCardProps) {
  const Icon = iconMap[module.icon];

  return (
    <Card className="group flex min-h-[168px] flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <div className="flex min-w-0 flex-1 gap-4 p-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm", toneClasses[module.tone])}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-5 text-slate-950">{module.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-3">
        <button type="button" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-800">
          {module.actionLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}
