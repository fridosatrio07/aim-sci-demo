"use client";

import { ExternalLink, Headphones, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportCard() {
  function handleContactSupport() {
    window.alert("Support contact action is not available in this prototype.");
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Headphones className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle>Need Help?</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">
          For administration support or access request, please contact SUCOFINDO IT Support.
        </p>
        <div className="mt-4 space-y-3 text-sm font-semibold text-blue-700">
          <a className="flex min-w-0 items-center gap-2 hover:underline" href="mailto:it.support@sucofindo.co.id">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">it.support@sucofindo.co.id</span>
          </a>
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
            <span>+62 21 8067 5000</span>
          </div>
        </div>
        <Button type="button" variant="outline" className="mt-5 h-10 w-full gap-2 text-blue-700" onClick={handleContactSupport}>
          Contact Support
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}
