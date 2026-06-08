import { createFileRoute } from "@tanstack/react-router";

import { FocusStub } from "@/components/common/focus-stub";

export const Route = createFileRoute("/departments/$departmentId")({
  component: DepartmentDetailPage,
});

function DepartmentDetailPage() {
  return (
    <FocusStub
      title="Department detail"
      description="Department detail is not part of the current release."
      backTo="/projects"
    />
  );
}
