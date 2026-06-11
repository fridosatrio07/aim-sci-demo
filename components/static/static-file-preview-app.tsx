"use client";

import { Suspense, useEffect, useState } from "react";

import { LoginPage } from "@/components/auth/login-page";
import { AssetDetailPlaceholder } from "@/components/asset-registry/asset-detail-placeholder";
import { AssetRegistryPage } from "@/components/asset-registry/asset-registry-page";
import { RevisedDashboard } from "@/components/dashboard/revised-dashboard";
import { AppLayout } from "@/components/layout/app-layout";
import { RbiInformationPage } from "@/components/rbi/rbi-information-page";
import { RiskAnalyticsPage } from "@/components/rbi/risk-analytics/risk-analytics-page";
import { RiskRegisterPage } from "@/components/rbi/risk-register/risk-register-page";
import { RiskAssessmentWorkspacePage } from "@/components/rbi/workspace/risk-assessment-workspace-page";
import { isSessionValid } from "@/lib/auth";

function getHashRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash.startsWith("/") ? hash : "/dashboard";
}

function StaticRouteContent({ route }: { route: string }) {
  const path = route.split("?")[0].replace(/\/+$/, "") || "/";

  if (path === "/asset-registry") return <AssetRegistryPage />;
  if (path.startsWith("/asset-registry/")) {
    return <AssetDetailPlaceholder tagNumber={path.replace(/^\/asset-registry\//, "")} />;
  }
  if (path === "/risk-based-inspection/rbi-information") return <RbiInformationPage />;
  if (path === "/risk-based-inspection/risk-analytics") return <RiskAnalyticsPage />;
  if (path === "/risk-based-inspection/risk-register") return <RiskRegisterPage />;
  if (path === "/risk-based-inspection/risk-assessment-workspace") {
    return (
      <Suspense fallback={null}>
        <RiskAssessmentWorkspacePage />
      </Suspense>
    );
  }

  return <RevisedDashboard />;
}

export function StaticFilePreviewApp() {
  const [route, setRoute] = useState("/dashboard");
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function syncRoute() {
      setRoute(getHashRoute());
      setAuthenticated(isSessionValid());
      setReady(true);
    }

    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("storage", syncRoute);

    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("storage", syncRoute);
    };
  }, []);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">
          Preparing secure workspace...
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <StaticRouteContent route={route === "/" || route === "/login" ? "/dashboard" : route} />
    </AppLayout>
  );
}
