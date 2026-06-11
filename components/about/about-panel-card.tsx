import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { aboutIconMap } from "@/components/about/about-icons";
import type { AboutPanel } from "@/lib/about-data";

interface AboutPanelCardProps {
  panel: AboutPanel;
  index: number;
}

export function AboutPanelCard({ panel, index }: AboutPanelCardProps) {
  const Icon = aboutIconMap[panel.icon] ?? aboutIconMap.Building2;

  return (
    <Card className="p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-6 text-slate-950">
            {index + 1}. {panel.title}
          </h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{panel.body}</p>
      {panel.items?.length ? (
        <div className="mt-4 space-y-2">
          {panel.items.map((item) => (
            <div key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
