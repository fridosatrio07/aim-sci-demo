import { Activity, BarChart3, FileCheck2, ShieldCheck } from "lucide-react";

export function LoginHero() {
  return (
    <section className="relative isolate flex min-h-[300px] overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-white p-6 sm:min-h-[360px] sm:p-8 lg:min-h-0 lg:p-10 xl:p-12 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_76%_12%,rgba(14,165,233,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.08)_52%)] dark:bg-[radial-gradient(circle_at_18%_14%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_76%_12%,rgba(14,165,233,0.12),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.55)_0%,rgba(15,23,42,0.2)_52%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(#1d4ed8_1px,transparent_1px),linear-gradient(90deg,#1d4ed8_1px,transparent_1px)] [background-size:42px_42px] dark:opacity-[0.1]" />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100/90 via-sky-100/55 to-transparent dark:from-slate-900/90 dark:via-blue-950/45" />
      <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-r from-blue-900/12 via-blue-700/10 to-cyan-700/10 [clip-path:polygon(0_65%,12%_48%,22%_58%,34%_35%,47%_52%,61%_28%,74%_50%,88%_34%,100%_55%,100%_100%,0_100%)] dark:from-blue-500/10 dark:via-cyan-500/5 dark:to-slate-700/20" />
      <div className="absolute bottom-7 left-[8%] h-20 w-16 rounded-t-full border border-blue-300/60 dark:border-blue-400/25" />
      <div className="absolute bottom-7 left-[19%] h-14 w-24 rounded-t-full border border-blue-300/60 dark:border-blue-400/25" />
      <div className="absolute bottom-7 right-[16%] h-24 w-8 border-x border-blue-300/60 dark:border-blue-400/25" />
      <div className="absolute bottom-7 right-[14%] h-24 w-14 border-b border-blue-300/60 [clip-path:polygon(50%_0,100%_100%,0_100%)] dark:border-blue-400/25" />

      <div className="relative z-10 flex max-w-3xl flex-col">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-24 overflow-hidden rounded-full bg-gradient-to-br from-blue-800 via-blue-600 to-cyan-400 shadow-sm">
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/60" />
            <div className="absolute inset-y-0 left-1/4 w-px -translate-x-1/2 bg-white/45" />
            <div className="absolute inset-y-0 left-3/4 w-px -translate-x-1/2 bg-white/45" />
            <div className="absolute left-0 right-0 top-1/3 h-px bg-white/60" />
            <div className="absolute left-0 right-0 top-2/3 h-px bg-white/60" />
            <div className="absolute inset-y-0 left-[12%] w-12 rounded-full border border-white/60" />
            <div className="absolute inset-y-0 right-[12%] w-12 rounded-full border border-white/60" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-950 dark:text-slate-100">SUCOFINDO</p>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">PT SUCOFINDO (Persero)</p>
          </div>
        </div>

        <div className="mt-10 max-w-2xl sm:mt-12 lg:mt-16 xl:mt-20">
          <p className="text-sm font-semibold uppercase text-blue-700 dark:text-blue-300">Digital Platform</p>
          <h1 className="mt-4 text-[clamp(2.25rem,5vw,5.25rem)] font-bold leading-[0.98] tracking-normal text-slate-950 dark:text-slate-100">
            Digital Asset
            <span className="block text-blue-700 dark:text-blue-300">Integrity Portal</span>
          </h1>
          <p className="mt-5 text-sm font-semibold text-slate-700 sm:text-base dark:text-slate-300">
            Risk-Based Inspection | Inspection Management | Compliance Monitoring
          </p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 dark:text-slate-400">
            Integrated digital platform to support asset integrity, reliability, and regulatory compliance for Oil & Gas and Geothermal asset owners.
          </p>
        </div>

        <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 sm:mt-10">
          {[
            { label: "RBI", icon: ShieldCheck },
            { label: "Inspection", icon: FileCheck2 },
            { label: "Risk Trend", icon: BarChart3 }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-lg border border-blue-100 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
                <Icon className="h-5 w-5 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Activity className="absolute right-10 top-20 h-24 w-24 text-blue-600/10 lg:h-32 lg:w-32 dark:text-blue-300/10" aria-hidden="true" />
    </section>
  );
}
