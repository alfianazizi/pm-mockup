import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Archive, Plus, Search, Send } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Input } from "@project-management-mockup/ui/components/input";

import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { LinkButton } from "@/components/common/link-button";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import { archiveProject, submitProjectForApproval } from "@/lib/actions";
import {
  BUDGET_STATUS_LABELS,
  BUDGET_STATUS_TONE,
  PROJECT_LIFECYCLE_LABELS,
  PROJECT_LIFECYCLE_TONE,
  RISK_LABELS,
  RISK_TONE,
  type Project,
  type ProjectLifecycleStatus,
} from "@/lib/domain";
import { formatDate, formatIDRBillions, formatPercent } from "@/lib/formatters";
import { canCreateProject } from "@/lib/permissions";
import {
  computeBudgetStatus,
  computeProjectProgress,
  computeRiskLevel,
  getCurrentUser,
  scopedProjects,
} from "@/lib/selectors";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
});

const STATUS_FILTERS: { label: string; value: ProjectLifecycleStatus | "all" | "active" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Waiting approval", value: "waiting_approval" },
  { label: "On hold", value: "on_hold" },
  { label: "Delayed", value: "delayed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function ProjectsPage() {
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectLifecycleStatus | "all" | "active">("all");
  const [showArchived, setShowArchived] = useState(false);

  const projects = useMemo(() => {
    return scopedProjects(state).filter((p) => (showArchived ? !!p.archivedAt : !p.archivedAt));
  }, [state, showArchived]);

  const rows = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = [p.name, p.templateName, p.category].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        status === "all"
          ? true
          : status === "active"
            ? p.status === "active"
            : p.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, status]);

  const handleSubmit = (project: Project) => {
    if (!user) return;
    const approver = state.users.find((u) => u.role === "approver");
    if (!approver) {
      toast.error("No approver configured");
      return;
    }
    setState((s) => submitProjectForApproval(s, project.id, user, approver.id));
    toast.success("Project submitted for approval");
  };

  const columns: Column<Project>[] = defineColumns<Project>([
    {
      key: "name",
      header: "Project",
      cell: (row) => (
        <div>
          <Link to="/projects/$projectId" params={{ projectId: row.id }} className="text-primary hover:underline font-medium">
            {row.name}
          </Link>
          <div className="text-[11px] text-muted-foreground">{row.category} · {row.templateName} ({row.templateVersion})</div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      cell: (row) => state.departments.find((s) => s.id === row.departmentId)?.name ?? "—",
    },
    {
      key: "owner",
      header: "Owner",
      cell: (row) => state.users.find((u) => u.id === row.ownerId)?.name ?? "—",
    },
    { key: "status", header: "Status", cell: (row) => (
      <StatusBadge tone={PROJECT_LIFECYCLE_TONE[row.status]}>{PROJECT_LIFECYCLE_LABELS[row.status]}</StatusBadge>
    ) },
    {
      key: "budget",
      header: "Budget",
      align: "right",
      cell: (row) => formatIDRBillions(row.approvedBudget),
    },
    {
      key: "spending",
      header: "Spending",
      align: "right",
      cell: (row) => formatIDRBillions(row.actualSpending),
    },
    {
      key: "budgetStatus",
      header: "Budget status",
      cell: (row) => {
        const s = computeBudgetStatus(row);
        return <StatusBadge tone={BUDGET_STATUS_TONE[s]}>{BUDGET_STATUS_LABELS[s]}</StatusBadge>;
      },
    },
    {
      key: "progress",
      header: "Progress",
      cell: (row) => {
        const v = computeProjectProgress(row);
        return (
          <div className="w-28">
            <ProgressBar value={v} />
            <div className="text-[10px] text-muted-foreground mt-0.5">{formatPercent(v)}</div>
          </div>
        );
      },
    },
    { key: "risk", header: "Risk", cell: (row) => {
      const r = computeRiskLevel(row);
      return <StatusBadge tone={RISK_TONE[r]}>{RISK_LABELS[r]}</StatusBadge>;
    } },
    { key: "target", header: "Target date", cell: (row) => formatDate(row.targetCompletionDate) },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {row.status === "draft" && user ? (
            <Button variant="ghost" size="sm" onClick={() => handleSubmit(row)}>
              <Send className="size-3.5" /> Submit
            </Button>
          ) : null}
          {user && user.role === "company_admin" && !row.archivedAt ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm(`Archive ${row.name}?`)) {
                  setState((s) => archiveProject(s, row.id, user));
                }
              }}
            >
              <Archive className="size-3.5" /> Archive
            </Button>
          ) : null}
        </div>
      ),
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="All projects in your scope. Use the filters to narrow the list."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchived((s) => !s)}
            >
              {showArchived ? "Show active" : "Show archived"}
            </Button>
            {canCreateProject(user) ? (
              <LinkButton size="sm" to="/projects/new">
                <Plus className="size-3.5" /> New project
              </LinkButton>
            ) : null}
          </>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-7 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={status === f.value ? "default" : "outline"}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <SectionCard title={showArchived ? "Archived projects" : "Projects"} description={`${rows.length} project${rows.length === 1 ? "" : "s"} in your scope`}>
        <DataTable
          rowKey={(row) => row.id}
          rows={rows}
          columns={columns}
          empty={<div className="text-xs text-muted-foreground">No projects match the filters.</div>}
        />
      </SectionCard>
    </div>
  );
}
