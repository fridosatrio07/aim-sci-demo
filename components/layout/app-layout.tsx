"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { APP_INFO } from "@/lib/dashboard-data";
import { RbiDataProvider } from "@/lib/rbi-store";
import {
  applyTheme,
  getCurrentDocumentTheme,
  getStoredThemePreference,
  setManualTheme,
  syncThemeFromPreference,
  type AppTheme,
  type ThemeSource
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "assetIntegritySidebarCollapsed";

interface AppLayoutProps {
  children: ReactNode;
  contentClassName?: string;
}

export function AppLayout({ children, contentClassName }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => getCurrentDocumentTheme());
  const [themeSource, setThemeSource] = useState<ThemeSource>("system");

  useEffect(() => {
    setSidebarCollapsed(window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
    const preference = syncThemeFromPreference();
    setTheme(preference.theme);
    setThemeSource(preference.source);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      const preference = getStoredThemePreference();
      if (preference.source !== "system") return;

      const nextTheme = event.matches ? "dark" : "light";
      applyTheme(nextTheme, "system");
      setTheme(nextTheme);
      setThemeSource("system");
    }

    if (themeSource === "system") {
      media.addEventListener("change", handleSystemThemeChange);
    }

    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, [themeSource]);

  function handleSidebarCollapsedChange(nextCollapsed: boolean) {
    setSidebarCollapsed(nextCollapsed);
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(nextCollapsed));
  }

  function handleThemeToggle() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      setManualTheme(nextTheme);
      setThemeSource("manual");
      return nextTheme;
    });
  }

  return (
    <AuthGuard>
      <div
        className={cn(
          "min-h-screen overflow-hidden transition-colors duration-300",
          theme === "dark" ? "app-theme-dark bg-slate-950 text-slate-200" : "app-theme-light bg-slate-50 text-slate-950"
        )}
      >
        <RbiDataProvider>
          <Topbar
            appInfo={APP_INFO}
            sidebarCollapsed={sidebarCollapsed}
            theme={theme}
            onMobileMenuClick={() => setMobileSidebarOpen(true)}
            onThemeToggle={handleThemeToggle}
          />
          <Sidebar
            collapsed={sidebarCollapsed}
            mobileOpen={mobileSidebarOpen}
            theme={theme}
            onCollapsedChange={handleSidebarCollapsedChange}
            onMobileOpenChange={setMobileSidebarOpen}
          />

          <main
            className={cn(
              "min-w-0 pt-[var(--app-header-height)] transition-[padding] duration-300 ease-out lg:pl-[280px]",
              theme === "dark" ? "main-theme-dark bg-slate-950 text-slate-200" : "main-theme-light bg-slate-50 text-slate-950",
              sidebarCollapsed && "lg:pl-20"
            )}
          >
            <div className={cn("mx-auto w-full max-w-[1760px] min-w-0 px-3 py-3 sm:px-4 lg:px-4 2xl:px-5", contentClassName)}>
              {children}
            </div>
          </main>
        </RbiDataProvider>
      </div>
    </AuthGuard>
  );
}
