"use client";

import { useEffect } from "react";

import { applyTheme, getStoredThemePreference, syncThemeFromPreference } from "@/lib/theme";

export function ThemeSync() {
  useEffect(() => {
    syncThemeFromPreference();
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      const currentPreference = getStoredThemePreference();
      if (currentPreference.source === "system") {
        applyTheme(event.matches ? "dark" : "light", "system");
      }
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key === "assetIntegrityTheme" || event.key === "assetIntegrityThemeSource") {
        syncThemeFromPreference();
      }
    }

    media.addEventListener("change", handleSystemThemeChange);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      media.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return null;
}
