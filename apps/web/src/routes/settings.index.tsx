import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <FocusStub
      title="Settings"
      description="Settings are not part of the current release."
    />
  );
}
