"use client";

import { useEffect, useMemo, useState } from "react";

import { AboutCustomizationModal } from "@/components/about/about-customization-modal";
import { AboutHero } from "@/components/about/about-hero";
import { AboutPanelCard } from "@/components/about/about-panel-card";
import { BrochureCta } from "@/components/about/brochure-cta";
import { BrochurePreviewModal } from "@/components/about/brochure-preview-modal";
import { ContactEditModal } from "@/components/about/contact-edit-modal";
import { ContactInformationPanel } from "@/components/about/contact-information-panel";
import {
  DEFAULT_ABOUT_CONTACT_CONFIG,
  DEFAULT_ABOUT_PAGE_CONFIG,
  type AboutContactConfig,
  type AboutPageConfig
} from "@/lib/about-data";

const ABOUT_CONFIG_KEY = "assetIntegrityAboutPageConfig";
const ABOUT_CONTACT_KEY = "assetIntegrityAboutContactConfig";

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readStoredConfig<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : cloneValue(fallback);
  } catch {
    return cloneValue(fallback);
  }
}

export function AboutPage() {
  const [config, setConfig] = useState<AboutPageConfig>(() => cloneValue(DEFAULT_ABOUT_PAGE_CONFIG));
  const [contact, setContact] = useState<AboutContactConfig>(() => cloneValue(DEFAULT_ABOUT_CONTACT_CONFIG));
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [contactEditOpen, setContactEditOpen] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);

  useEffect(() => {
    setConfig(readStoredConfig(ABOUT_CONFIG_KEY, DEFAULT_ABOUT_PAGE_CONFIG));
    setContact(readStoredConfig(ABOUT_CONTACT_KEY, DEFAULT_ABOUT_CONTACT_CONFIG));
  }, []);

  const visiblePanels = useMemo(() => config.panels.filter((panel) => panel.visible), [config.panels]);

  function handleSaveConfig(nextConfig: AboutPageConfig) {
    setConfig(nextConfig);
    window.localStorage.setItem(ABOUT_CONFIG_KEY, JSON.stringify(nextConfig));
    setCustomizationOpen(false);
  }

  function handleResetConfig() {
    const defaultConfig = cloneValue(DEFAULT_ABOUT_PAGE_CONFIG);
    setConfig(defaultConfig);
    window.localStorage.setItem(ABOUT_CONFIG_KEY, JSON.stringify(defaultConfig));
    setCustomizationOpen(false);
  }

  function handleSaveContact(nextContact: AboutContactConfig) {
    setContact(nextContact);
    window.localStorage.setItem(ABOUT_CONTACT_KEY, JSON.stringify(nextContact));
    setContactEditOpen(false);
  }

  return (
    <div className="min-w-0 space-y-4 overflow-hidden pb-5">
      <AboutHero hero={config.hero} metrics={config.metrics} onCustomize={() => setCustomizationOpen(true)} />

      <section aria-label="About SUCOFINDO content panels" className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visiblePanels.map((panel, index) => (
          <AboutPanelCard key={panel.id} panel={panel} index={index} />
        ))}
      </section>

      <ContactInformationPanel contact={contact} onEdit={() => setContactEditOpen(true)} />

      <BrochureCta onViewBrochure={() => setBrochureOpen(true)} />

      <footer className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; 2025 PT SUCOFINDO (PERSERO). All rights reserved.</span>
        <span className="flex flex-wrap gap-x-5 gap-y-2">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
          <span>Contact Us</span>
        </span>
      </footer>

      {customizationOpen ? (
        <AboutCustomizationModal
          config={config}
          onClose={() => setCustomizationOpen(false)}
          onReset={handleResetConfig}
          onSave={handleSaveConfig}
        />
      ) : null}

      {contactEditOpen ? (
        <ContactEditModal
          contact={contact}
          onClose={() => setContactEditOpen(false)}
          onSave={handleSaveContact}
        />
      ) : null}

      {brochureOpen ? (
        <BrochurePreviewModal
          brochurePdfUrl={config.brochure.brochurePdfUrl}
          onClose={() => setBrochureOpen(false)}
        />
      ) : null}
    </div>
  );
}
