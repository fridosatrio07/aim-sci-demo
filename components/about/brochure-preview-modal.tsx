"use client";

import { FileText, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BrochurePreviewModalProps {
  brochurePdfUrl: string;
  onClose: () => void;
}

export function BrochurePreviewModal({ brochurePdfUrl, onClose }: BrochurePreviewModalProps) {
  function handleConfigure() {
    window.alert("Brochure configuration is not available in this prototype.");
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brochure-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 id="brochure-modal-title" className="truncate text-lg font-bold text-slate-950">
              SUCOFINDO AEBT Brochure
            </h2>
            <p className="mt-1 text-sm text-slate-500">PDF brochure preview will be available here.</p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close brochure preview"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-150px)] overflow-y-auto p-5">
          {brochurePdfUrl ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <iframe
                title="SUCOFINDO AEBT brochure preview"
                src={brochurePdfUrl}
                className="h-[min(62vh,620px)] w-full"
              />
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-blue-200 bg-blue-50/60 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                <FileText className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-950">Brochure Preview Placeholder</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                A configured PDF path will render here using an embedded preview. No backend or upload storage is connected yet.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleConfigure}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload/Configure Brochure
          </Button>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
