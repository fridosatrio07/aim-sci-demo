"use client";

import Image from "next/image";
import { ArrowRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BrochureCtaProps {
  onViewBrochure: () => void;
}

export function BrochureCta({ onViewBrochure }: BrochureCtaProps) {
  return (
    <section className="about-brochure-cta overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-sky-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700">
            <Info className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-6 text-slate-800 sm:text-base">
              Serving Oil & Gas, Geothermal and Energy industries with reliable assurance for a safe, efficient and sustainable future.
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <div className="about-brochure-brand flex min-w-0 items-center gap-4 rounded-lg border border-blue-100 bg-white/80 px-4 py-3">
            <Image
              src="/images/logo-sucofindo.png"
              alt="SUCOFINDO"
              width={118}
              height={50}
              className="h-auto w-24 shrink-0 object-contain sm:w-28"
            />
            <div className="h-10 w-px bg-blue-200" aria-hidden="true" />
            <p className="text-sm font-bold leading-5 text-blue-950">
              Assurance for
              <br />A Better Future
            </p>
          </div>
          <Button type="button" className="shrink-0" onClick={onViewBrochure}>
            View Brochure
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
