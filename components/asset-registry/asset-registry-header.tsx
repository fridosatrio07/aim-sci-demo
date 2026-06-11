"use client";

import { Columns3, Download, Plus, UploadCloud } from "lucide-react";

import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Button } from "@/components/ui/button";

interface AssetRegistryHeaderProps {
  onAction: (message: string) => void;
}

export function AssetRegistryHeader({ onAction }: AssetRegistryHeaderProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <PageBreadcrumb items={[{ label: "Asset Registry" }]} />
        <div className="mt-4">
          <h1 className="text-2xl font-black tracking-normal text-slate-950 dark:text-slate-100 md:text-3xl">
            Asset Registry
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            View and manage assets across facilities using ISO 14224 taxonomy, reliability readiness, and integrity status.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button type="button" onClick={() => onAction("Add Asset form is prepared for future development.")}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Asset
        </Button>
        <Button type="button" variant="outline" onClick={() => onAction("Bulk Import is prepared for future development.")}>
          <UploadCloud className="h-4 w-4" aria-hidden="true" />
          Bulk Import
        </Button>
        <Button type="button" variant="outline" onClick={() => onAction("Asset list export started in prototype mode.")}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Export Asset List
        </Button>
        <Button type="button" variant="outline" onClick={() => onAction("Customize Columns is prepared for future development.")}>
          <Columns3 className="h-4 w-4" aria-hidden="true" />
          Customize Columns
        </Button>
      </div>
    </div>
  );
}
