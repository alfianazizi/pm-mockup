import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/subholdings/")({
  component: SubholdingsPage,
});

function SubholdingsPage() {
  return (
    <FocusStub
      title="Subholdings"
      description="Subholding management is hidden in the menu. The focus of this prototype is Project and Template."
      backTo="/projects"
    />
  );
}
