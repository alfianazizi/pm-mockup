import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/users/")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <FocusStub
      title="Users & Roles"
      description="User management is not part of the current release. Sign in from the login page to switch persona."
    />
  );
}
