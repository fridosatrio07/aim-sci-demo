import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { OverdueInspection, RiskLevel } from "@/lib/dashboard-data";

interface OverdueInspectionsTableProps {
  rows: OverdueInspection[];
  className?: string;
}

const riskBadgeVariant: Record<RiskLevel, "red" | "orange" | "yellow" | "green"> = {
  Extreme: "red",
  High: "orange",
  Medium: "yellow",
  Low: "green"
};

export function OverdueInspectionsTable({ rows, className }: OverdueInspectionsTableProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Overdue Inspections</CardTitle>
        <Button variant="link" className="text-xs">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-[11px]">
            <caption className="sr-only">Overdue inspections by asset, due date, risk, and status</caption>
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                <th className="px-1.5 py-2">Asset ID</th>
                <th className="px-1.5 py-2">Asset Name</th>
                <th className="px-1.5 py-2">Inspection Type</th>
                <th className="px-1.5 py-2">Due Date</th>
                <th className="px-1.5 py-2">Overdue</th>
                <th className="px-1.5 py-2">Risk</th>
                <th className="px-1.5 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.assetId} className="border-b border-slate-100 last:border-0">
                  <td className="px-1.5 py-2.5 font-semibold text-slate-950">{row.assetId}</td>
                  <td className="px-1.5 py-2.5 text-slate-700">{row.assetName}</td>
                  <td className="px-1.5 py-2.5 text-slate-600">{row.inspectionType}</td>
                  <td className="px-1.5 py-2.5 text-slate-600">{row.dueDate}</td>
                  <td className="px-1.5 py-2.5 font-semibold text-red-600">{row.overdue}</td>
                  <td className="px-1.5 py-2.5">
                    <Badge variant={riskBadgeVariant[row.risk]}>{row.risk}</Badge>
                  </td>
                  <td className="px-1.5 py-2.5">
                    <Badge variant="red">{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="link" className="text-xs">
          Go to Inspection Management
        </Button>
      </CardFooter>
    </Card>
  );
}
