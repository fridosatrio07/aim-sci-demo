"use client";

import { Suspense, useEffect, useState } from "react";

import { LoginPage } from "@/components/auth/login-page";
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

  useEffect(() => {
    function syncRoute() {
      setRoute(getHashRoute());
      setAuthenticated(isSessionValid());
    }

    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("storage", syncRoute);

    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("storage", syncRoute);
    };
  }, []);

  if (!authenticated) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <StaticRouteContent route={route === "/" || route === "/login" ? "/dashboard" : route} />
    </AppLayout>
  );
}
