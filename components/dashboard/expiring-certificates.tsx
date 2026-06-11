import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExpiringCertificate } from "@/lib/dashboard-data";

interface ExpiringCertificatesProps {
  certificates: ExpiringCertificate[];
  className?: string;
}

const remainingBadgeVariant: Record<ExpiringCertificate["tone"], "red" | "orange" | "green"> = {
  critical: "red",
  warning: "orange",
  normal: "green"
};

export function ExpiringCertificates({ certificates, className }: ExpiringCertificatesProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Expiring Certificates</CardTitle>
        <Button variant="link" className="text-xs">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100">
          {certificates.map((certificate) => (
            <article key={certificate.name} className="grid grid-cols-[minmax(0,1fr)_96px_auto] items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xs font-medium leading-5 text-slate-950">{certificate.name}</h3>
              </div>
              <p className="text-right text-[11px] text-slate-500">{certificate.expiry}</p>
              <Badge variant={remainingBadgeVariant[certificate.tone]}>{certificate.remaining}</Badge>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
