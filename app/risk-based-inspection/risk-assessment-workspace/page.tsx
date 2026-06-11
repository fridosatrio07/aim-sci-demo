import { Suspense } from "react";

import { RiskAssessmentWorkspacePage as RiskAssessmentWorkspaceContent } from "@/components/rbi/workspace/risk-assessment-workspace-page";

export default function RiskAssessmentWorkspacePage() {
  return (
    <Suspense fallback={null}>
      <RiskAssessmentWorkspaceContent />
    </Suspense>
  );
}
