import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/subholdings/")({
  component: SubholdingsPage,
});

function SubholdingsPage() {
  return (
    <FocusStub
      title="Subholdings"
      description="Subholdings are not part of the current release. Use the project and template views to see your work."
      backTo="/projects"
    />
  );
}
