"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Boxes, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aimApi } from "@/lib/api-client";
import type { AssetApiRecord } from "@/lib/api-types";
import { ASSET_REGISTRY_ROWS } from "@/lib/asset-registry-data";

export function AssetDetailPlaceholder({ tagNumber }: { tagNumber: string }) {
  const decodedTag = decodeURIComponent(tagNumber);
  const fallbackAsset = ASSET_REGISTRY_ROWS.find((row) => row.tagNumber === decodedTag);
  const [asset, setAsset] = useState<AssetApiRecord | null>(null);
  const [mode, setMode] = useState<"loading" | "backend" | "offline">("loading");
  const title = `Asset Detail - ${decodedTag}`;

  useEffect(() => {
    let mounted = true;
    void aimApi
      .getAsset(decodedTag)
      .then((response) => {
        if (!mounted) return;
        setAsset(response);
        setMode("backend");
      })
      .catch(() => {
        if (mounted) setMode("offline");
      });
    return () => {
      mounted = false;
    };
  }, [decodedTag]);

  const values = {
    equipmentName: asset?.asset_name ?? fallbackAsset?.equipmentName ?? "Prepared asset",
    equipmentClass: asset?.equipment_class ?? fallbackAsset?.equipmentClass ?? "Prepared class",
    unitSystem: asset?.unit_system ?? fallbackAsset?.unitSystem ?? "Prepared system",
    riskLevel: asset?.current_risk_level ?? fallbackAsset?.currentRiskLevel ?? "Prepared",
    boundaryStatus: asset?.boundary_status ?? fallbackAsset?.boundaryStatus ?? "Prepared",
    reliabilityReadiness: asset ? `${asset.reliability_data_readiness}%` : fallbackAsset ? `${fallbackAsset.reliabilityDataReadiness}%` : "Prepared"
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <PageBreadcrumb items={[{ label: "Asset Registry", href: "/asset-registry" }, { label: title }]} />

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Badge className={mode === "backend" ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200"}>
          {mode === "backend" ? "Backend API" : mode === "loading" ? "Checking backend" : "Offline Prototype Mode"}
        </Badge>
        <span>{mode === "offline" ? "Backend is unavailable; showing fallback-only legacy asset detail." : "Asset detail is resolved from the canonical backend asset record."}</span>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader>
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                <Boxes className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl">{title}</CardTitle>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Single asset workspace is prepared for future development.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Equipment Name", values.equipmentName],
                ["Equipment Class", values.equipmentClass],
                ["Unit / System", values.unitSystem],
                ["Risk Level", values.riskLevel],
                ["Boundary Status", values.boundaryStatus],
                ["Reliability Readiness", values.reliabilityReadiness]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/45">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-black text-slate-950 dark:text-slate-100">{value}</p>
                </div>
              ))}
            </div>

            <Link
              href="/asset-registry"
              prefetch={false}
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-300 dark:hover:bg-blue-950/30"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Asset Registry
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Workspace Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Asset master data", icon: FileText },
              { label: "Integrity status", icon: ShieldCheck },
              { label: "Reliability taxonomy", icon: Boxes }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <Icon className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
