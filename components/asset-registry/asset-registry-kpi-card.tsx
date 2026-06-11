import type { AssetRegistryKpi } from "@/lib/asset-registry-data";
import { cn } from "@/lib/utils";

const kpiStyles: Record<AssetRegistryKpi["color"], string> = {
  blue: "bg-blue-600 text-white shadow-blue-600/20",
  green: "bg-green-600 text-white shadow-green-600/20",
  purple: "bg-purple-600 text-white shadow-purple-600/20",
  orange: "bg-orange-500 text-white shadow-orange-500/20",
  red: "bg-red-600 text-white shadow-red-600/20",
  teal: "bg-teal-600 text-white shadow-teal-600/20"
};

export function AssetRegistryKpiCard({ item }: { item: AssetRegistryKpi }) {
  const Icon = item.icon;

  return (
    <section className="flex min-h-[112px] min-w-0 items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg", kpiStyles[item.color])}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.title}</p>
        <p className="mt-1 text-2xl font-black tracking-normal text-slate-950 dark:text-slate-100">{item.value}</p>
        <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">{item.detail}</p>
      </div>
    </section>
  );
}
