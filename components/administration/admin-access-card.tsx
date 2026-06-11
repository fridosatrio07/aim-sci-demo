import { CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const accessItems = [
  "Only authorized administrators can access this module.",
  "All activities are logged and monitored.",
  "Ensure data integrity and system security."
];

export function AdminAccessCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrator Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-5 flex h-40 items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50">
          <div className="absolute h-28 w-28 rounded-full bg-blue-200/35 blur-2xl" />
          <ShieldCheck className="absolute h-28 w-28 text-blue-200" aria-hidden="true" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-[0_16px_36px_rgba(29,78,216,0.28)]">
            <LockKeyhole className="h-8 w-8" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-3">
          {accessItems.map((item) => (
            <div key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
