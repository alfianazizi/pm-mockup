import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/reports/")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <FocusStub
      title="Reports"
      description="Reports are not part of the current release."
    />
  );
}
