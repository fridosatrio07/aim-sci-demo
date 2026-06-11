"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ASSET_REGISTRY_FILTER_OPTIONS, type AssetRegistryFilterState } from "@/lib/asset-registry-data";
import { cn } from "@/lib/utils";

interface AssetRegistryFiltersProps {
  filters: AssetRegistryFilterState;
  onChange: (nextFilters: AssetRegistryFilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const selectClass =
  "h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

const fields: Array<{
  key: keyof Omit<AssetRegistryFilterState, "search">;
  label: string;
  options: string[];
}> = [
  { key: "site", label: "Site", options: ASSET_REGISTRY_FILTER_OPTIONS.site },
  { key: "area", label: "Area", options: ASSET_REGISTRY_FILTER_OPTIONS.area },
  { key: "unit", label: "Unit", options: ASSET_REGISTRY_FILTER_OPTIONS.unit },
  { key: "system", label: "System", options: ASSET_REGISTRY_FILTER_OPTIONS.system },
  { key: "equipmentClass", label: "Equipment Class (ISO 14224)", options: ASSET_REGISTRY_FILTER_OPTIONS.equipmentClass },
  { key: "equipmentType", label: "Equipment Type", options: ASSET_REGISTRY_FILTER_OPTIONS.equipmentType },
  { key: "riskLevel", label: "Risk Level", options: ASSET_REGISTRY_FILTER_OPTIONS.riskLevel },
  { key: "inspectionStatus", label: "Inspection Status", options: ASSET_REGISTRY_FILTER_OPTIONS.inspectionStatus },
  { key: "certificationStatus", label: "Certification Status", options: ASSET_REGISTRY_FILTER_OPTIONS.certificationStatus },
  { key: "reliabilityReadiness", label: "Reliability Data Readiness", options: ASSET_REGISTRY_FILTER_OPTIONS.reliabilityReadiness },
  { key: "safetyCriticalFlag", label: "Safety-Critical Flag", options: ASSET_REGISTRY_FILTER_OPTIONS.safetyCriticalFlag }
];

export function AssetRegistryFilters({
  filters,
  onChange,
  onApply,
  onReset
}: AssetRegistryFiltersProps) {
  function updateFilter<K extends keyof AssetRegistryFilterState>(key: K, value: AssetRegistryFilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Card className="p-4">
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {fields.map((field) => (
          <label key={field.key} className="min-w-0 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{field.label}</span>
            <select
              value={filters[field.key]}
              onChange={(event) => updateFilter(field.key, event.target.value)}
              className={selectClass}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}

        <label className="min-w-0 space-y-1.5 md:col-span-2 xl:col-span-3 2xl:col-span-6">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search by tag number, equipment name, document, or failure record..."
              className={cn(selectClass, "pl-9 pr-9")}
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          </div>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset Filters
        </Button>
        <Button type="button" onClick={onApply}>
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}
