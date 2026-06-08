import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/users/")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <FocusStub
      title="Users & Roles"
      description="The prototype uses a small, fixed set of demo users. See the login page to sign in as a different persona."
    />
  );
}
