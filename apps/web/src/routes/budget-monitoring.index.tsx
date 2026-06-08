import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/budget-monitoring/")({
  component: BudgetMonitoringPage,
});

function BudgetMonitoringPage() {
  return (
    <FocusStub
      title="Budget Monitoring"
      description="The prototype focuses on Project and Template flows. Budget monitoring remains accessible for direct URL access only."
    />
  );
}
