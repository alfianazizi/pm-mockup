import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/budget-monitoring/")({
  component: BudgetMonitoringPage,
});

function BudgetMonitoringPage() {
  return (
    <FocusStub
      title="Budget Monitoring"
      description="Budget monitoring is not part of the current release. Project and template views are available."
    />
  );
}
