import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { TemplateEditor } from "@/components/templates/template-editor";

export const Route = createFileRoute("/templates/new")({
  component: NewTemplatePage,
});

function NewTemplatePage() {
  const navigate = useNavigate();
  return (
    <TemplateEditor
      onDone={() => navigate({ to: "/templates" })}
    />
  );
}
