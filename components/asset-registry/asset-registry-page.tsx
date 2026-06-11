"use client";

import { useEffect, useMemo, useState } from "react";

import { AssetRegistryFilters } from "@/components/asset-registry/asset-registry-filters";
import { AssetRegistryHeader } from "@/components/asset-registry/asset-registry-header";
import { AssetRegistryKpiCard } from "@/components/asset-registry/asset-registry-kpi-card";
import { AssetRegistryTable } from "@/components/asset-registry/asset-registry-table";
import { DataQualityGaps } from "@/components/asset-registry/data-quality-gaps";
import { RegistryQualityInsights } from "@/components/asset-registry/registry-quality-insights";
import { Badge } from "@/components/ui/badge";
import {
  ASSET_REGISTRY_KPIS,
  ASSET_REGISTRY_ROWS,
  DEFAULT_ASSET_REGISTRY_FILTERS,
  type AssetRegistryFilterState,
  type AssetRegistryRow
} from "@/lib/asset-registry-data";
import { aimApi } from "@/lib/api-client";
import type { AssetApiRecord } from "@/lib/api-types";
import { cn } from "@/lib/utils";

function matchesFilter(row: AssetRegistryRow, filters: AssetRegistryFilterState) {
  if (filters.site !== "All Sites" && row.site !== filters.site) return false;
  if (filters.area !== "All Areas" && row.area !== filters.area) return false;
  if (filters.unit !== "All Units" && row.unit !== filters.unit) return false;
  if (filters.system !== "All Systems" && row.system !== filters.system) return false;
  if (filters.equipmentClass !== "All Classes" && row.equipmentClass !== filters.equipmentClass) return false;
  if (filters.equipmentType !== "All Types" && row.equipmentType !== filters.equipmentType) return false;
  if (filters.riskLevel !== "All Risk Levels" && row.currentRiskLevel !== filters.riskLevel) return false;
  if (filters.inspectionStatus !== "All Status" && row.inspectionStatus !== filters.inspectionStatus) return false;
  if (filters.certificationStatus !== "All Status" && row.certificationStatus !== filters.certificationStatus) return false;
  if (filters.safetyCriticalFlag === "Safety-Critical" && !row.safetyCritical) return false;
  if (filters.safetyCriticalFlag === "Non Safety-Critical" && row.safetyCritical) return false;

  if (filters.reliabilityReadiness === "High (>=85%)" && row.reliabilityDataReadiness < 85) return false;
  if (filters.reliabilityReadiness === "Medium (70-84%)" && (row.reliabilityDataReadiness < 70 || row.reliabilityDataReadiness >= 85)) return false;
  if (filters.reliabilityReadiness === "Low (<70%)" && row.reliabilityDataReadiness >= 70) return false;

  const search = filters.search.trim().toLowerCase();
  if (!search) return true;

  const searchable = [
    row.tagNumber,
    row.equipmentName,
    row.equipmentClass,
    row.unitSystem,
    row.service,
    ...row.documentKeywords,
    ...row.failureRecordKeywords
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(search);
}

function hasActiveFilters(filters: AssetRegistryFilterState) {
  return JSON.stringify(filters) !== JSON.stringify(DEFAULT_ASSET_REGISTRY_FILTERS);
}

function Toast({ message }: { message: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed right-4 top-[calc(var(--app-header-height)+1rem)] z-50 max-w-[calc(100vw-2rem)] rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800 shadow-lg transition dark:border-blue-500/30 dark:bg-blue-950/80 dark:text-blue-100",
        message ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      )}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

function coerceRiskLevel(value: string): AssetRegistryRow["currentRiskLevel"] {
  if (value === "Extreme" || value === "High" || value === "Medium" || value === "Low") return value;
  return "Medium";
}

function coerceCriticality(value: string): AssetRegistryRow["assetCriticality"] {
  if (value === "A" || value === "B" || value === "C") return value;
  return "B";
}

function coerceBoundary(value: string): AssetRegistryRow["boundaryStatus"] {
  return value === "Safety-Critical" ? "Safety-Critical" : "Defined";
}

function coerceInspection(value: string): AssetRegistryRow["inspectionStatus"] {
  if (value === "Overdue" || value === "Due Soon" || value === "Scheduled") return value;
  return "Scheduled";
}

function coerceCertification(value: string): AssetRegistryRow["certificationStatus"] {
  if (value === "Valid" || value === "Expiring Soon" || value === "Expired") return value;
  return "Valid";
}

function mapApiAssetToRegistryRow(asset: AssetApiRecord): AssetRegistryRow {
  return {
    tagNumber: asset.tag_number,
    equipmentName: asset.asset_name,
    equipmentClass: asset.equipment_class,
    taxonomyLevel: asset.taxonomy_level,
    site: asset.site,
    area: asset.area,
    unit: asset.unit,
    system: asset.system,
    unitSystem: asset.unit_system,
    service: asset.service,
    currentRiskLevel: coerceRiskLevel(asset.current_risk_level),
    assetCriticality: coerceCriticality(asset.asset_criticality),
    boundaryStatus: coerceBoundary(asset.boundary_status),
    reliabilityDataReadiness: asset.reliability_data_readiness,
    linkedSafetyFunctions: asset.linked_safety_functions,
    safetyCritical: asset.safety_critical,
    nextInspectionDue: asset.next_inspection_due,
    inspectionDueNote: asset.inspection_due_note,
    inspectionStatus: coerceInspection(asset.inspection_status),
    certificationStatus: coerceCertification(asset.certification_status),
    equipmentType: asset.equipment_type,
    documentKeywords: asset.document_keywords ?? [],
    failureRecordKeywords: asset.failure_record_keywords ?? []
  };
}

export function AssetRegistryPage() {
  const [filters, setFilters] = useState<AssetRegistryFilterState>(DEFAULT_ASSET_REGISTRY_FILTERS);
  const [toast, setToast] = useState("");
  const [backendRows, setBackendRows] = useState<AssetRegistryRow[] | null>(null);
  const [backendStatus, setBackendStatus] = useState<"loading" | "connected" | "fallback">("loading");

  useEffect(() => {
    let mounted = true;

    aimApi
      .listAssets()
      .then((response) => {
        if (!mounted) return;
        if (response.items.length > 0) {
          setBackendRows(response.items.map(mapApiAssetToRegistryRow));
          setBackendStatus("connected");
        } else {
          setBackendStatus("fallback");
        }
      })
      .catch(() => {
        if (mounted) setBackendStatus("fallback");
      });

    return () => {
      mounted = false;
    };
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  const rows = backendRows ?? ASSET_REGISTRY_ROWS;
  const filteredRows = useMemo(() => rows.filter((row) => matchesFilter(row, filters)), [filters, rows]);
  const activeFilters = hasActiveFilters(filters);

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <Toast message={toast} />

      <div className="space-y-4">
        <AssetRegistryHeader onAction={showToast} />

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <span>Data Source</span>
          {backendStatus === "connected" ? (
            <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/35 dark:text-green-200">
              Backend API connected
            </Badge>
          ) : backendStatus === "loading" ? (
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200">
              Checking backend API
            </Badge>
          ) : (
            <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-200">
              Offline fallback data
            </Badge>
          )}
          <span className="text-slate-500 dark:text-slate-400">
            The registry uses the backend when available and falls back to bundled demo data for static review.
          </span>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {ASSET_REGISTRY_KPIS.map((item) => (
            <AssetRegistryKpiCard key={item.title} item={item} />
          ))}
        </div>

        <AssetRegistryFilters
          filters={filters}
          onChange={setFilters}
          onApply={() => showToast("Filters applied in prototype mode.")}
          onReset={() => {
            setFilters(DEFAULT_ASSET_REGISTRY_FILTERS);
            showToast("Filters reset.");
          }}
        />

        <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <AssetRegistryTable rows={filteredRows} filtered={activeFilters} totalCount={filteredRows.length} />
          </div>
          <aside className="min-w-0 space-y-4">
            <RegistryQualityInsights />
            <DataQualityGaps onAction={showToast} />
          </aside>
        </div>

        <div className="flex justify-end text-xs font-semibold text-slate-500 dark:text-slate-400">
          Data as of: 08 May 2025 09:00 WIB
        </div>
      </div>
    </div>
  );
}
