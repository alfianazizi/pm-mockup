import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Archive, Copy, Edit, Layers, Plus, Search } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Input } from "@project-management-mockup/ui/components/input";

import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { LinkButton } from "@/components/common/link-button";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import { archiveTemplate, saveTemplate } from "@/lib/actions";
import { ROLE_LABELS, type ProjectTemplate } from "@/lib/domain";
import { formatDate } from "@/lib/formatters";
import { canEditTemplateLibrary } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/selectors";
import { toast } from "sonner";

export const Route = createFileRoute("/templates/")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const canEdit = canEditTemplateLibrary(user);

  const rows = useMemo(() => {
    return state.templates
      .filter((t) => (showArchived ? !!t.archivedAt : !t.archivedAt))
      .filter((t) => [t.name, t.category, t.description].join(" ").toLowerCase().includes(search.toLowerCase()));
  }, [state.templates, search, showArchived]);

  const handleDuplicate = (template: ProjectTemplate) => {
    if (!user) return;
    const newId = `tpl-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
    const copy: ProjectTemplate = {
      ...template,
      id: newId,
      name: `${template.name} (Copy)`,
      version: "v0.1",
      status: "active",
      createdBy: user.id,
      lastUpdated: new Date().toISOString().slice(0, 10),
      milestones: template.milestones.map((m) => ({ ...m, id: `${m.id}-copy` })),
    };
    setState((s) => saveTemplate(s, copy, user));
    toast.success("Template duplicated", { description: `${copy.name} added to the library.` });
  };

  const columns: Column<ProjectTemplate>[] = defineColumns<ProjectTemplate>([
    {
      key: "name",
      header: "Template",
      cell: (row) => (
        <div>
          <div className="text-foreground font-medium">{row.name}</div>
          <div className="text-[11px] text-muted-foreground">{row.description}</div>
        </div>
      ),
    },
    { key: "category", header: "Category", cell: (row) => <StatusBadge tone="info">{row.category}</StatusBadge> },
    { key: "version", header: "Version", cell: (row) => <StatusBadge tone="primary">{row.version}</StatusBadge> },
    {
      key: "milestones",
      header: "Milestones / Steps",
      cell: (row) => {
        const steps = row.milestones.reduce((acc, m) => acc + m.steps.length, 0);
        return `${row.milestones.length} / ${steps}`;
      },
    },
    {
      key: "approval",
      header: "Default approver",
      cell: (row) => ROLE_LABELS[row.defaultApproverRole as keyof typeof ROLE_LABELS] ?? row.defaultApproverRole,
    },
    {
      key: "updated",
      header: "Last updated",
      cell: (row) => formatDate(row.lastUpdated),
    },
    { key: "status", header: "Status", cell: (row) => <StatusBadge tone={row.status === "active" ? "success" : "muted"}>{row.status}</StatusBadge> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {canEdit ? (
            <>
              <LinkButton variant="ghost" size="sm" to="/templates/$templateId/edit" params={{ templateId: row.id }}>
                <Edit className="size-3.5" /> Edit
              </LinkButton>
              <Button variant="ghost" size="sm" onClick={() => handleDuplicate(row)}>
                <Copy className="size-3.5" /> Duplicate
              </Button>
              {!row.archivedAt ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`Archive ${row.name}?`)) {
                      if (user) {
                        setState((s) => archiveTemplate(s, row.id, user));
                        toast.success("Template archived");
                      }
                    }
                  }}
                >
                  <Archive className="size-3.5" /> Archive
                </Button>
              ) : null}
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => toast.info("Read-only access")}>
              <Layers className="size-3.5" /> View
            </Button>
          )}
        </div>
      ),
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Templates"
        description="Standardized blueprints for projects. Edits are restricted to Holding Admin; other roles can use templates."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchived((s) => !s)}
            >
              {showArchived ? "Show active" : "Show archived"}
            </Button>
            {canEdit ? (
              <LinkButton size="sm" to="/templates/new">
                <Plus className="size-3.5" /> New template
              </LinkButton>
            ) : null}
          </>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-7 h-8 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <SectionCard
        title={showArchived ? "Archived templates" : "Active templates"}
        description="Centralized library used by the project wizard."
      >
        <DataTable rowKey={(row) => row.id} rows={rows} columns={columns} />
      </SectionCard>
    </div>
  );
}
