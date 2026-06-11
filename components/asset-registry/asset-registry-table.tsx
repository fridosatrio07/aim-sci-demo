"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Info,
  MoreVertical,
  SlidersHorizontal
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ASSET_REGISTRY_TOTAL, type AssetRegistryRow } from "@/lib/asset-registry-data";
import { cn } from "@/lib/utils";

interface AssetRegistryTableProps {
  rows: AssetRegistryRow[];
  filtered: boolean;
  totalCount: number;
}

function riskClass(risk: AssetRegistryRow["currentRiskLevel"]) {
  if (risk === "Extreme") return "border-red-300 bg-red-600 text-white dark:border-red-500 dark:bg-red-600";
  if (risk === "High") return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/35 dark:text-orange-200";
  if (risk === "Medium") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200";
  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
}

function criticalityClass(criticality: AssetRegistryRow["assetCriticality"]) {
  if (criticality === "A") return "border-red-300 text-red-700 dark:border-red-700 dark:text-red-200";
  if (criticality === "B") return "border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-200";
  return "border-green-300 text-green-700 dark:border-green-700 dark:text-green-200";
}

function boundaryClass(status: AssetRegistryRow["boundaryStatus"]) {
  return status === "Safety-Critical"
    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200"
    : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
}

function readinessClass(value: number) {
  if (value >= 85) return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (value >= 70) return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200";
  return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
}

function certificationClass(status: AssetRegistryRow["certificationStatus"]) {
  if (status === "Valid") return "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200";
  if (status === "Expiring Soon") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200";
  return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-200";
}

function SmallBadge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold leading-4", className)}>
      {children}
    </span>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="whitespace-nowrap px-3 py-3 align-middle">
      <span className="inline-flex items-center gap-1">
        {children}
        <Info className="h-3 w-3 text-slate-400" aria-hidden="true" />
      </span>
    </th>
  );
}

export function AssetRegistryTable({ rows, filtered, totalCount }: AssetRegistryTableProps) {
  const shownCount = rows.length;
  const totalLabel = filtered ? totalCount : ASSET_REGISTRY_TOTAL;

  return (
    <Card className="overflow-hidden">
      <div className="flex min-w-0 flex-col gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Showing {shownCount ? 1 : 0} to {shownCount} of {totalLabel.toLocaleString()} assets
        </p>
        <Button type="button" variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Columns
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[1680px] border-collapse text-left text-xs">
          <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wide text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            <tr>
              <th className="w-10 px-3 py-3">
                <input type="checkbox" aria-label="Select all assets" className="h-4 w-4 rounded border-slate-300 text-blue-700" />
              </th>
              <HeaderCell>Tag Number</HeaderCell>
              <HeaderCell>Equipment Name</HeaderCell>
              <HeaderCell>ISO 14224 Equipment Class</HeaderCell>
              <HeaderCell>Taxonomy Level</HeaderCell>
              <HeaderCell>Unit / System</HeaderCell>
              <HeaderCell>Service</HeaderCell>
              <HeaderCell>Current Risk Level</HeaderCell>
              <HeaderCell>Asset Criticality</HeaderCell>
              <HeaderCell>Boundary Status</HeaderCell>
              <HeaderCell>Reliability Data Readiness</HeaderCell>
              <HeaderCell>Linked Safety Functions</HeaderCell>
              <HeaderCell>Next Inspection Due</HeaderCell>
              <HeaderCell>Certification Status</HeaderCell>
              <th className="whitespace-nowrap px-3 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.tagNumber} className="bg-white transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-3 align-top">
                    <input type="checkbox" aria-label={`Select ${row.tagNumber}`} className="h-4 w-4 rounded border-slate-300 text-blue-700" />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top font-black text-blue-700 dark:text-blue-300">
                    {row.tagNumber}
                  </td>
                  <td className="min-w-[150px] px-3 py-3 align-top font-bold text-slate-900 dark:text-slate-100">{row.equipmentName}</td>
                  <td className="min-w-[150px] px-3 py-3 align-top font-semibold text-slate-700 dark:text-slate-300">{row.equipmentClass}</td>
                  <td className="min-w-[130px] px-3 py-3 align-top text-slate-700 dark:text-slate-300">{row.taxonomyLevel}</td>
                  <td className="min-w-[150px] px-3 py-3 align-top text-slate-700 dark:text-slate-300">{row.unitSystem}</td>
                  <td className="min-w-[170px] px-3 py-3 align-top text-slate-700 dark:text-slate-300">{row.service}</td>
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <SmallBadge className={riskClass(row.currentRiskLevel)}>{row.currentRiskLevel}</SmallBadge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <SmallBadge className={cn("bg-white dark:bg-slate-900", criticalityClass(row.assetCriticality))}>{row.assetCriticality}</SmallBadge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <SmallBadge className={boundaryClass(row.boundaryStatus)}>{row.boundaryStatus}</SmallBadge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <SmallBadge className={readinessClass(row.reliabilityDataReadiness)}>{row.reliabilityDataReadiness}%</SmallBadge>
                  </td>
                  <td className="min-w-[118px] px-3 py-3 align-top font-semibold text-blue-700 dark:text-blue-300">{row.linkedSafetyFunctions}</td>
                  <td className="min-w-[120px] px-3 py-3 align-top">
                    <span className="block font-bold text-slate-800 dark:text-slate-200">{row.nextInspectionDue}</span>
                    <span className={cn("mt-0.5 block text-[11px] font-black", row.inspectionStatus === "Overdue" ? "text-red-600 dark:text-red-300" : row.inspectionStatus === "Due Soon" ? "text-orange-600 dark:text-orange-300" : "text-slate-500 dark:text-slate-400")}>
                      ({row.inspectionDueNote})
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <SmallBadge className={certificationClass(row.certificationStatus)}>{row.certificationStatus}</SmallBadge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/asset-registry/${encodeURIComponent(row.tagNumber)}`}
                        prefetch={false}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-blue-200 px-3 text-[11px] font-black text-blue-700 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/35"
                      >
                        View Detail
                      </Link>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                        aria-label={`More actions for ${row.tagNumber}`}
                      >
                        <MoreVertical className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={15} className="bg-white px-3 py-10 text-center text-sm font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  No assets match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex min-w-0 flex-col gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <label className="flex items-center gap-2">
            Rows per page:
            <select className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" defaultValue="10">
              <option>10</option>
            </select>
          </label>
          <span>1-10 of {ASSET_REGISTRY_TOTAL.toLocaleString()} assets</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {[ChevronsLeft, ChevronLeft].map((Icon, index) => (
            <button key={index} type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          ))}
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              type="button"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-black",
                page === 1
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              {page}
            </button>
          ))}
          <span className="px-2 text-xs font-bold text-slate-500">...</span>
          <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 px-2 text-xs font-black text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            126
          </button>
          {[ChevronRight, ChevronsRight].map((Icon, index) => (
            <button key={index} type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
