import { Download, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentSpotlightData } from "@/lib/dashboard-data";

interface DocumentSpotlightProps {
  document: DocumentSpotlightData;
  className?: string;
}

export function DocumentSpotlight({ document, className }: DocumentSpotlightProps) {
  const metadata = [
    { label: "File Type", value: document.fileType },
    { label: "Version", value: document.version },
    { label: "Size", value: document.size },
    { label: "Date", value: document.date },
    { label: "Owner", value: document.owner },
    { label: "Expiry Date", value: document.expiryDate }
  ];

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Document Spotlight</CardTitle>
        <Button variant="link" className="text-xs">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-600">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-xs font-bold leading-5 text-slate-950">{document.fileName}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="green">{document.status}</Badge>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-600">{document.description}</p>

        <dl className="mt-4 grid grid-cols-1 gap-2">
          {metadata.slice(1).map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <dt className="text-[11px] font-medium text-slate-500">{item.label}</dt>
              <dd className="truncate text-xs font-semibold text-slate-900">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center gap-2">
          <Button className="h-9 flex-1 text-xs" aria-label={`Preview ${document.fileName}`}>
            Preview Document
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" aria-label={`Download ${document.fileName}`}>
            <Download className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
