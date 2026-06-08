import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/departments/")({
  component: DepartmentsPage,
});

function DepartmentsPage() {
  return (
    <FocusStub
      title="Departments"
      description="Departments are not part of the current release. Use the project and template views to see your work."
      backTo="/projects"
    />
  );
}
