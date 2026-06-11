import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { rbiColorStyles } from "@/components/rbi/rbi-style";
import type { RbiQuickAccessCard as RbiQuickAccessCardData } from "@/lib/rbi-information-data";
import { cn } from "@/lib/utils";

interface RbiQuickAccessCardProps {
  item: RbiQuickAccessCardData;
}

export function RbiQuickAccessCard({ item }: RbiQuickAccessCardProps) {
  const Icon = item.icon;
  const color = rbiColorStyles[item.color];

  return (
    <Card className="group flex min-h-[224px] flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", color.iconSoft)}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="mt-4 min-w-0 flex-1">
        <h3 className="text-base font-bold leading-6 text-slate-950 dark:text-slate-100">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
      </div>
      <Link
        href={item.href}
        prefetch={false}
        className={cn(
          "mt-5 inline-flex items-center gap-2 text-sm font-bold transition-colors",
          color.button
        )}
      >
        {item.buttonLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </Card>
  );
}
