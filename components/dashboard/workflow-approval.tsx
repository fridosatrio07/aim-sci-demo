import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowApprovalData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface WorkflowApprovalProps {
  workflow: WorkflowApprovalData;
  className?: string;
}

export function WorkflowApproval({ workflow, className }: WorkflowApprovalProps) {
  const formatStepDetail = (detail?: string) => {
    if (!detail) {
      return { actor: "Pending", date: "" };
    }

    const [, afterBy = detail] = detail.split(" by ");
    const [actor = afterBy, date = ""] = afterBy.split(" on ");

    return { actor, date };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Workflow & Approval</CardTitle>
        <p className="mt-2 truncate text-sm font-bold text-slate-950">{workflow.document}</p>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto grid max-w-2xl grid-cols-4 gap-2" aria-label="Workflow progress">
          <div className="absolute left-[12.5%] right-[12.5%] top-4 h-px bg-slate-200" />
          <div className="absolute left-[12.5%] top-4 h-px w-1/2 bg-blue-500" />
          <div className="absolute left-[62.5%] top-4 h-px w-[12.5%] bg-green-500" />
          {workflow.steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isApproved = step.label === "Approved";
            const detail = formatStepDetail(step.detail);

            return (
              <div key={step.label} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border bg-white text-xs font-bold",
                    isApproved && "border-green-500 text-green-600 shadow-[0_0_0_4px_rgba(34,197,94,0.08)]",
                    isCompleted && !isApproved && "border-blue-500 text-blue-600 shadow-[0_0_0_4px_rgba(59,130,246,0.08)]",
                    !isCompleted && "border-slate-300 text-slate-600"
                  )}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-xs font-bold text-slate-950">{step.label}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">
                  {detail.actor}
                  {detail.date ? <span className="block">{detail.date}</span> : null}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px]">
          <section className="rounded-md border border-slate-200 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-950">Approval Details</h3>
              <Badge variant="green">
                <Check className="mr-1 h-3 w-3" aria-hidden="true" />
                {workflow.approval.status}
              </Badge>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-blue-700 text-xs font-bold text-white">
                DL
              </div>
              <dl className="grid flex-1 gap-2 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-medium text-slate-500">Approved by</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{workflow.approval.approvedBy}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-slate-500">Date</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{workflow.approval.date}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-slate-500">Role</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{workflow.approval.role}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-slate-500">Comments</dt>
                  <dd className="mt-1 font-semibold text-slate-700">{workflow.approval.comment}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="rounded-md border border-slate-200 p-3">
            <h3 className="text-sm font-semibold text-slate-950">Audit Trail</h3>
            <ol className="mt-3 space-y-3">
              {workflow.auditTrail.map((item) => (
                <li key={`${item.actor}-${item.date}`} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  <p className="text-[11px] leading-4 text-slate-600">
                    <span className="block font-bold text-slate-950">{item.actor}</span>
                    {item.action}
                    <span className="block text-slate-500">{item.date}</span>
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
