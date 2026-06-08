import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/reports/")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <FocusStub
      title="Reports"
      description="Reports remain accessible for direct URL access; the prototype focuses on Project and Template."
    />
  );
}
