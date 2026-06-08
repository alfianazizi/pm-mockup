import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/subholdings/$subholdingId")({
  component: SubholdingDetailPage,
});

function SubholdingDetailPage() {
  return (
    <FocusStub
      title="Subholding detail"
      description="Subholding detail is not part of the current release."
      backTo="/projects"
    />
  );
}
