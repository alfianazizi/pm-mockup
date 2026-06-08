import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/subholdings/$subholdingId")({
  component: SubholdingDetailPage,
});

function SubholdingDetailPage() {
  return (
    <FocusStub
      title="Subholding detail"
      description="Subholding detail is out of scope for the focused prototype."
      backTo="/projects"
    />
  );
}
