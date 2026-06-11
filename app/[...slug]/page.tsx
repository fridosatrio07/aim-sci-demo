import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Construction, Layers3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNavigationPageByPath, PLACEHOLDER_PAGES } from "@/lib/navigation-data";

const CONCRETE_APP_ROUTES = new Set([
  "/",
  "/login",
  "/dashboard",
  "/risk-based-inspection/rbi-information",
  "/risk-based-inspection/risk-analytics",
  "/risk-based-inspection/risk-register",
  "/risk-based-inspection/risk-assessment-workspace",
  "/risk-based-inspection/rbi-update-revalidation-control",
  "/risk-based-inspection/iow-moc-triggers",
  "/risk-based-inspection/methodology-governance-library",
  "/reports",
  "/about-sucofindo",
  "/administration"
]);

export const dynamicParams = false;

export function generateStaticParams() {
  return PLACEHOLDER_PAGES
    .filter((page) => !CONCRETE_APP_ROUTES.has(page.href))
    .map((page) => ({
      slug: page.href.split("/").filter(Boolean)
    }));
}

interface PlaceholderPageProps {
  params: {
    slug: string[];
  };
}

export default function PlaceholderPage({ params }: PlaceholderPageProps) {
  const path = `/${params.slug.join("/")}`;
  const page = getNavigationPageByPath(path);

  if (!page) {
    notFound();
  }

  return (
    <div className="grid min-w-0 gap-3 lg:grid-cols-12">
      <Card className="lg:col-span-8">
        <CardHeader className="pb-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Layers3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              {page.parentLabel ? (
                <p className="mb-1 text-xs font-semibold uppercase text-blue-700">{page.parentLabel}</p>
              ) : null}
              <CardTitle className="text-xl">{page.label}</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This module is prepared for future development.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-slate-600 shadow-sm">
                <Construction className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">Module workspace</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Future screens, workflows, approval states, registers, and report views will be added here while preserving the same authenticated application shell.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Navigation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <dt className="text-slate-500">Route</dt>
              <dd className="min-w-0 truncate font-semibold text-slate-950">{path}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <dt className="text-slate-500">Status</dt>
              <dd className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">Prepared</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Data Source</dt>
              <dd className="font-semibold text-slate-950">Prototype</dd>
            </div>
          </dl>
          <Link
            href="/dashboard"
            prefetch={false}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            Back to Dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
