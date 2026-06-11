import type { AboutMetric as AboutMetricData } from "@/lib/about-data";
import { aboutIconMap } from "@/components/about/about-icons";

interface AboutMetricProps {
  metric: AboutMetricData;
}

export function AboutMetric({ metric }: AboutMetricProps) {
  const Icon = aboutIconMap[metric.icon] ?? aboutIconMap.ShieldCheck;

  return (
    <div className="about-metric-card flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white/75 p-3 shadow-sm backdrop-blur">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-5 text-slate-950">{metric.value}</p>
        <p className="text-xs leading-5 text-slate-600">{metric.label}</p>
      </div>
    </div>
  );
}
