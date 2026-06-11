"use client";

import { ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_ABOUT_PAGE_CONFIG,
  type AboutIconKey,
  type AboutPageConfig,
  type AboutPanel
} from "@/lib/about-data";

interface AboutCustomizationModalProps {
  config: AboutPageConfig;
  onClose: () => void;
  onReset: () => void;
  onSave: (config: AboutPageConfig) => void;
}

const ICON_OPTIONS: AboutIconKey[] = [
  "Building2",
  "ShieldCheck",
  "Globe2",
  "Award",
  "Users",
  "Settings",
  "BarChart3",
  "Search",
  "RefreshCcw",
  "FileCheck2",
  "Leaf"
];

function cloneConfig(config: AboutPageConfig): AboutPageConfig {
  return JSON.parse(JSON.stringify(config)) as AboutPageConfig;
}

function createPanel(): AboutPanel {
  return {
    id: `custom-panel-${Date.now()}`,
    title: "New Content Panel",
    icon: "Building2",
    body: "Describe this SUCOFINDO service, capability, or assurance message.",
    items: [],
    visible: true
  };
}

export function AboutCustomizationModal({ config, onClose, onReset, onSave }: AboutCustomizationModalProps) {
  const [draft, setDraft] = useState<AboutPageConfig>(() => cloneConfig(config));
  const visiblePanelCount = useMemo(() => draft.panels.filter((panel) => panel.visible).length, [draft.panels]);

  function updateHero(field: keyof AboutPageConfig["hero"], value: string) {
    setDraft((current) => ({ ...current, hero: { ...current.hero, [field]: value } }));
  }

  function updateBrochureUrl(value: string) {
    setDraft((current) => ({ ...current, brochure: { ...current.brochure, brochurePdfUrl: value } }));
  }

  function updateMetric(metricId: string, field: "icon" | "value" | "label", value: string) {
    setDraft((current) => ({
      ...current,
      metrics: current.metrics.map((metric) =>
        metric.id === metricId ? { ...metric, [field]: value } : metric
      )
    }));
  }

  function updatePanel(panelId: string, patch: Partial<AboutPanel>) {
    setDraft((current) => ({
      ...current,
      panels: current.panels.map((panel) => (panel.id === panelId ? { ...panel, ...patch } : panel))
    }));
  }

  function updatePanelItems(panelId: string, value: string) {
    updatePanel(panelId, {
      items: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    });
  }

  function movePanel(panelId: string, direction: "up" | "down") {
    setDraft((current) => {
      const index = current.panels.findIndex((panel) => panel.id === panelId);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || targetIndex < 0 || targetIndex >= current.panels.length) {
        return current;
      }

      const panels = [...current.panels];
      const [panel] = panels.splice(index, 1);
      panels.splice(targetIndex, 0, panel);
      return { ...current, panels };
    });
  }

  function removePanel(panelId: string) {
    setDraft((current) => ({ ...current, panels: current.panels.filter((panel) => panel.id !== panelId) }));
  }

  function handleReset() {
    setDraft(cloneConfig(DEFAULT_ABOUT_PAGE_CONFIG));
    onReset();
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-customize-title"
    >
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)]">
        <div className="flex min-w-0 shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
          <div className="min-w-0">
            <h2 id="about-customize-title" className="truncate text-lg font-bold text-slate-950 dark:text-slate-100">
              Customize About Page
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Prototype-only customization. Backend persistence will be added later.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Close About page customization"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <section className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-950">Hero Content</h3>
                <div className="mt-4 space-y-3">
                  <label className="block space-y-2 text-sm font-semibold text-slate-700">
                    Hero Title
                    <Input value={draft.hero.title} onChange={(event) => updateHero("title", event.target.value)} />
                  </label>
                  <label className="block space-y-2 text-sm font-semibold text-slate-700">
                    Hero Subtitle
                    <textarea
                      className="min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      value={draft.hero.subtitle}
                      onChange={(event) => updateHero("subtitle", event.target.value)}
                    />
                  </label>
                  <label className="block space-y-2 text-sm font-semibold text-slate-700">
                    Hero Description
                    <textarea
                      className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      value={draft.hero.description}
                      onChange={(event) => updateHero("description", event.target.value)}
                    />
                  </label>
                  <label className="block space-y-2 text-sm font-semibold text-slate-700">
                    Hero Image URL / Path
                    <Input
                      placeholder="/images/about-hero.jpg"
                      value={draft.hero.heroImageUrl}
                      onChange={(event) => updateHero("heroImageUrl", event.target.value)}
                    />
                  </label>
                  <label className="block space-y-2 text-sm font-semibold text-slate-700">
                    Brochure PDF URL / Path
                    <Input
                      placeholder="/documents/sucofindo-aebt-brochure.pdf"
                      value={draft.brochure.brochurePdfUrl}
                      onChange={(event) => updateBrochureUrl(event.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-950">Hero Metrics</h3>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                    {draft.metrics.length} items
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {draft.metrics.map((metric) => (
                    <div key={metric.id} className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[120px_minmax(0,1fr)]">
                      <label className="space-y-1 text-xs font-bold uppercase text-slate-500">
                        Icon
                        <select
                          className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold normal-case text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          value={metric.icon}
                          onChange={(event) => updateMetric(metric.id, "icon", event.target.value)}
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          aria-label={`${metric.value} metric value`}
                          value={metric.value}
                          onChange={(event) => updateMetric(metric.id, "value", event.target.value)}
                        />
                        <Input
                          aria-label={`${metric.value} metric label`}
                          value={metric.label}
                          onChange={(event) => updateMetric(metric.id, "label", event.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="min-w-0 rounded-lg border border-slate-200 p-4">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-950">Content Panels</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {visiblePanelCount} visible of {draft.panels.length} panels
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDraft((current) => ({ ...current, panels: [...current.panels, createPanel()] }))}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add Panel
                </Button>
              </div>

              <div className="mt-4 space-y-3">
                {draft.panels.map((panel, index) => (
                  <div key={panel.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <label className="flex min-w-0 items-center gap-2 text-sm font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={panel.visible}
                          onChange={(event) => updatePanel(panel.id, { visible: event.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                        />
                        <span className="min-w-0 truncate">Visible panel {index + 1}</span>
                      </label>
                      <div className="flex shrink-0 gap-1">
                        <Button type="button" variant="ghost" size="icon" onClick={() => movePanel(panel.id, "up")} aria-label={`Move ${panel.title} up`}>
                          <ArrowUp className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => movePanel(panel.id, "down")} aria-label={`Move ${panel.title} down`}>
                          <ArrowDown className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removePanel(panel.id)} aria-label={`Remove ${panel.title}`}>
                          <Trash2 className="h-4 w-4 text-red-600" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-[150px_minmax(0,1fr)]">
                      <label className="space-y-2 text-sm font-semibold text-slate-700">
                        Icon Key
                        <select
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          value={panel.icon}
                          onChange={(event) => updatePanel(panel.id, { icon: event.target.value as AboutIconKey })}
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-sm font-semibold text-slate-700">
                        Panel Title
                        <Input value={panel.title} onChange={(event) => updatePanel(panel.id, { title: event.target.value })} />
                      </label>
                      <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                        Body Text
                        <textarea
                          className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          value={panel.body}
                          onChange={(event) => updatePanel(panel.id, { body: event.target.value })}
                        />
                      </label>
                      <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                        Supporting Items (one per line)
                        <textarea
                          className="min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          value={(panel.items ?? []).join("\n")}
                          onChange={(event) => updatePanelItems(panel.id, event.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset to Default Content
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={() => onSave(draft)}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Prototype Changes
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
