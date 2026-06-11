"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { StaticFilePreviewApp } from "@/components/static/static-file-preview-app";
import { clearSession, isSessionValid } from "@/lib/auth";
import { navigateToAppRoute } from "@/lib/static-navigation";

export default function HomePage() {
  const router = useRouter();
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const [fileMode, setFileMode] = useState(false);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => setFallbackVisible(true), 1500);

    if (window.location.protocol === "file:") {
      setFileMode(true);
      return () => window.clearTimeout(fallbackTimer);
    }

    if (isSessionValid()) {
      navigateToAppRoute(router, "/dashboard/", "replace");
      return () => window.clearTimeout(fallbackTimer);
    }

    clearSession();
    navigateToAppRoute(router, "/login/", "replace");

    return () => window.clearTimeout(fallbackTimer);
  }, [router]);

  if (fileMode) {
    return <StaticFilePreviewApp />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-md rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">
        <p className="font-semibold">Preparing secure workspace...</p>
        {fallbackVisible ? (
          <div className="mt-3 space-y-3">
            <p className="leading-6">
              Navigation is taking longer than expected. Use one of the links below to continue.
            </p>
            <div className="flex flex-wrap gap-2">
              <a className="rounded-md bg-blue-700 px-3 py-2 text-xs font-bold text-white" href="/login/">Open Login</a>
              <a className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200" href="/dashboard/">Open Dashboard</a>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
