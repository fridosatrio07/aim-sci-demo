import { Cog, Factory, PenLine, ShieldCheck } from "lucide-react";

import { AboutMetric } from "@/components/about/about-metric";
import { Button } from "@/components/ui/button";
import type { AboutHeroConfig, AboutMetric as AboutMetricData } from "@/lib/about-data";

interface AboutHeroProps {
  hero: AboutHeroConfig;
  metrics: AboutMetricData[];
  onCustomize: () => void;
}

export function AboutHero({ hero, metrics, onCustomize }: AboutHeroProps) {
  const subtitleLines = hero.subtitle.split("\n");

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.96fr)_minmax(360px,1.04fr)]">
        <div className="min-w-0 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-slate-950 2xl:text-4xl">{hero.title}</h1>
              <div className="mt-3 text-lg font-bold leading-7 text-blue-700 sm:text-xl">
                {subtitleLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <Button type="button" className="shrink-0 gap-2" onClick={onCustomize}>
              <PenLine className="h-4 w-4" aria-hidden="true" />
              Customize About Page
            </Button>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{hero.description}</p>

          <div className="mt-6 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {metrics.map((metric) => (
              <AboutMetric key={metric.id} metric={metric} />
            ))}
          </div>
        </div>

        <div
          className="about-hero-visual relative min-h-[300px] overflow-hidden bg-gradient-to-br from-blue-50 via-sky-100 to-white"
          style={hero.heroImageUrl ? { backgroundImage: `url(${hero.heroImageUrl})`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}
          aria-label="Industrial asset integrity visual"
        >
          {!hero.heroImageUrl ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.22),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.6),rgba(255,255,255,0.1))]" />
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#1d4ed8_1px,transparent_1px),linear-gradient(90deg,#1d4ed8_1px,transparent_1px)] [background-size:42px_42px]" />
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-blue-200/70 to-transparent" />
              <div className="absolute bottom-8 left-[12%] h-32 w-16 rounded-t-full border border-blue-400/70" />
              <div className="absolute bottom-8 left-[26%] h-20 w-28 rounded-t-full border border-blue-400/70" />
              <div className="absolute bottom-8 right-[22%] h-44 w-10 border-x border-blue-500/70" />
              <div className="absolute bottom-8 right-[18%] h-44 w-20 border-b border-blue-500/70 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
              <Factory className="absolute bottom-10 left-10 h-20 w-20 text-blue-700/25" aria-hidden="true" />
              <ShieldCheck className="absolute right-10 top-10 h-24 w-24 text-blue-700/20" aria-hidden="true" />
              <Cog className="absolute bottom-16 right-24 h-16 w-16 text-blue-700/20" aria-hidden="true" />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
