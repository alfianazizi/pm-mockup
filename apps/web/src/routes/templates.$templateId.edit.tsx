import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { TemplateEditor } from "@/components/templates/template-editor";

export const Route = createFileRoute("/templates/$templateId/edit")({
  component: EditTemplatePage,
});

function EditTemplatePage() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  return <TemplateEditor templateId={templateId} onDone={() => navigate({ to: "/templates" })} />;
}
