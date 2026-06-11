"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AboutContactConfig } from "@/lib/about-data";

interface ContactEditModalProps {
  contact: AboutContactConfig;
  onClose: () => void;
  onSave: (contact: AboutContactConfig) => void;
}

export function ContactEditModal({ contact, onClose, onSave }: ContactEditModalProps) {
  const [draft, setDraft] = useState({
    ...contact,
    phoneNumbers: contact.phoneNumbers.join("\n")
  });

  function updateField(field: keyof typeof draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSave() {
    onSave({
      ...draft,
      phoneNumbers: draft.phoneNumbers
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    });
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-labelledby="contact-edit-title">
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)]">
        <div className="shrink-0 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
          <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="contact-edit-title" className="text-lg font-bold text-slate-950 dark:text-slate-100">
              Edit Contact Information
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Frontend-only prototype configuration.</p>
          </div>
          <button type="button" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" onClick={onClose} aria-label="Close contact editor">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Office Label
              <Input value={draft.officeLabel} onChange={(event) => updateField("officeLabel", event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Office Name
              <Input value={draft.officeName} onChange={(event) => updateField("officeName", event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300 md:col-span-2">
              Address
              <textarea
                className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-900/50"
                value={draft.address}
                onChange={(event) => updateField("address", event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Phone Numbers
              <textarea
                className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-900/50"
                value={draft.phoneNumbers}
                onChange={(event) => updateField("phoneNumbers", event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email
              <Input value={draft.email} onChange={(event) => updateField("email", event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Website
              <Input value={draft.website} onChange={(event) => updateField("website", event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Contact Person
              <Input value={draft.contactPerson ?? ""} onChange={(event) => updateField("contactPerson", event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Branch / City
              <Input value={draft.branchCity ?? ""} onChange={(event) => updateField("branchCity", event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300 md:col-span-2">
              Notes
              <textarea
                className="min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-900/50"
                value={draft.notes ?? ""}
                onChange={(event) => updateField("notes", event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5 sm:py-4">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Contact Information
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
