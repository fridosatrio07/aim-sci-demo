import { LockKeyhole, ShieldCheck } from "lucide-react";

import { AdminAccessCard } from "@/components/administration/admin-access-card";
import { AdminActivityTable } from "@/components/administration/admin-activity-table";
import { AdminModuleCard } from "@/components/administration/admin-module-card";
import { SupportCard } from "@/components/administration/support-card";
import { Card } from "@/components/ui/card";
import { ADMIN_ACTIVITIES, ADMIN_MODULES } from "@/lib/admin-data";

export function AdministrationPageContent() {
  return (
    <div className="min-w-0 space-y-4">
      <section className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-2xl font-bold text-slate-950 sm:text-3xl">Administration</h1>
            <ShieldCheck className="h-6 w-6 shrink-0 text-blue-700" aria-hidden="true" />
          </div>
          <p className="mt-2 text-sm font-medium text-slate-600">
            System configuration and user access management
          </p>
        </div>

        <Card className="p-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-950">Restricted Area</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                This area is accessible to authorized administrators only.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <h2 className="mb-3 text-base font-bold text-slate-950">Admin Modules</h2>
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {ADMIN_MODULES.map((module) => (
              <AdminModuleCard key={module.title} module={module} />
            ))}
          </div>
        </div>

        <aside className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-1">
          <AdminAccessCard />
          <SupportCard />
        </aside>
      </section>

      <AdminActivityTable activities={ADMIN_ACTIVITIES} />
    </div>
  );
}
