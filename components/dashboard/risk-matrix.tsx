import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AxisItem, RiskLegendItem, RiskMatrixMarker } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface RiskMatrixProps {
  likelihoodAxis: AxisItem[];
  consequenceAxis: AxisItem[];
  markers: RiskMatrixMarker[];
  legend: RiskLegendItem[];
  className?: string;
}

const riskCellClasses = {
  Low: "border-white/70 bg-gradient-to-br from-emerald-500 to-green-400 text-white",
  Medium: "border-white/70 bg-gradient-to-br from-yellow-400 to-amber-500 text-white",
  High: "border-white/70 bg-gradient-to-br from-orange-500 to-orange-600 text-white",
  Extreme: "border-white/70 bg-gradient-to-br from-red-500 to-red-700 text-white"
};

const legendDotClasses: Record<string, string> = {
  Extreme: "bg-red-600",
  High: "bg-orange-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-600",
  "Total Assets": "bg-blue-700"
};

function getRiskLevel(score: number): RiskMatrixMarker["level"] {
  if (score >= 17) return "Extreme";
  if (score >= 10) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

function markerKey(likelihood: number, consequence: number) {
  return `${likelihood}-${consequence}`;
}

export function RiskMatrix({
  likelihoodAxis,
  consequenceAxis,
  markers,
  legend,
  className
}: RiskMatrixProps) {
  const markerMap = new Map(markers.map((marker) => [markerKey(marker.likelihood, marker.consequence), marker]));
  const reversedConsequence = [...consequenceAxis].reverse();

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Risk Exposure (RBI Overview)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_140px] 2xl:grid-cols-[minmax(0,1fr)_132px]">
          <div className="min-w-0 pb-2">
            <div className="w-full min-w-0" role="img" aria-label="5 by 5 RBI risk matrix">
              <div className="mb-1 ml-[68px] grid grid-cols-5 gap-1 sm:ml-[80px]">
                {likelihoodAxis.map((axis) => (
                  <div key={axis.value} className="min-w-0 text-center text-[9px] font-medium leading-3 text-slate-500 sm:text-[10px]">
                    <span className="block text-xs font-semibold text-slate-700">{axis.value}</span>
                    {axis.label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[64px_repeat(5,minmax(0,1fr))] gap-px overflow-hidden rounded-md border border-white bg-white shadow-sm sm:grid-cols-[76px_repeat(5,minmax(0,1fr))]">
                {reversedConsequence.map((consequence) => (
                  <div key={consequence.value} className="contents">
                    <div className="flex min-h-12 items-center justify-end self-stretch bg-white pr-1.5 text-right text-[9px] font-medium leading-3 text-slate-500 sm:pr-2 sm:text-[10px]">
                      <span>
                        <span className="block text-xs font-semibold text-slate-700">{consequence.value}</span>
                        {consequence.label}
                      </span>
                    </div>
                    {likelihoodAxis.map((likelihood) => {
                      const score = likelihood.value * consequence.value;
                      const level = getRiskLevel(score);
                      const marker = markerMap.get(markerKey(likelihood.value, consequence.value));

                      return (
                        <div
                          key={`${consequence.value}-${likelihood.value}`}
                          className={cn(
                            "relative flex aspect-square min-h-12 items-center justify-center border text-xs",
                            riskCellClasses[level]
                          )}
                        >
                          {marker ? (
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white/70 bg-white/15 px-1.5 text-xs font-bold shadow-sm backdrop-blur">
                                {marker.value}
                              </span>
                              <span className="max-w-[52px] text-center text-[9px] font-semibold leading-3 text-white/95">
                                {marker.label}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-semibold opacity-35">{score}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-[64px_1fr] items-center sm:grid-cols-[76px_1fr]">
                <div className="text-right text-[10px] font-semibold text-slate-500">Consequence</div>
                <div className="text-center text-[10px] font-semibold text-slate-500">Likelihood</div>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 xl:block xl:space-y-3">
              {legend.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", legendDotClasses[item.label])} />
                    <span className="truncate text-xs text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-950">{item.value.toLocaleString("en-US")}</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-6 justify-start text-xs">
              View Full Risk Register
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
