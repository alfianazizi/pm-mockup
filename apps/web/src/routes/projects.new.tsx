import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ProjectWizard } from "@/components/projects/project-wizard";

export const Route = createFileRoute("/projects/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  const navigate = useNavigate();
  return <ProjectWizard onDone={() => navigate({ to: "/projects" })} />;
}
