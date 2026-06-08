import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Input } from "@project-management-mockup/ui/components/input";

import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import {
  decideMilestoneApproval,
  decideProjectApproval,
} from "@/lib/actions";
import {
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_TONE,
  APPROVAL_TYPE_LABELS,
  type ApprovalRequest,
  type ApprovalStatus,
} from "@/lib/domain";
import { formatDate, relativeDays } from "@/lib/formatters";
import { getCurrentUser } from "@/lib/selectors";
import { scopedApprovals } from "@/lib/selectors";
import { toast } from "sonner";

export const Route = createFileRoute("/approvals/")({
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "all">("pending");

  const approvals = useMemo(() => {
    return scopedApprovals(state).filter((a) => statusFilter === "all" || a.status === statusFilter);
  }, [state, statusFilter]);

  const rows = useMemo(
    () =>
      approvals.filter((a) => {
        const project = state.projects.find((p) => p.id === a.projectId);
        return [project?.name, APPROVAL_TYPE_LABELS[a.type]].join(" ").toLowerCase().includes(search.toLowerCase());
      }),
    [approvals, search, state.projects],
  );

  const decide = (approval: ApprovalRequest, decision: ApprovalStatus) => {
    if (!user) return;
    if (approval.type === "project_approval") {
      setState((s) => decideProjectApproval(s, approval.id, decision, "Decision recorded.", user));
    } else {
      setState((s) => decideMilestoneApproval(s, approval.id, decision, "Decision recorded.", user));
    }
    toast.success(`Decision: ${APPROVAL_STATUS_LABELS[decision]}`);
  };

  const columns: Column<ApprovalRequest>[] = defineColumns<ApprovalRequest>([
    { key: "type", header: "Type", cell: (row) => APPROVAL_TYPE_LABELS[row.type] },
    {
      key: "project",
      header: "Project",
      cell: (row) => {
        const project = state.projects.find((p) => p.id === row.projectId);
        return project ? (
          <Link to="/projects/$projectId" params={{ projectId: project.id }} className="text-primary hover:underline">
            {project.name}
          </Link>
        ) : row.projectId;
      },
    },
    {
      key: "subholding",
      header: "Subholding",
      cell: (row) => state.subholdings.find((s) => s.id === row.subholdingId)?.code ?? "—",
    },
    {
      key: "milestone",
      header: "Milestone",
      cell: (row) => {
        if (!row.milestoneId) return "—";
        const project = state.projects.find((p) => p.id === row.projectId);
        return project?.milestones.find((m) => m.id === row.milestoneId)?.name ?? "—";
      },
    },
    { key: "requestedBy", header: "Requested by", cell: (row) => state.users.find((u) => u.id === row.requestedBy)?.name ?? row.requestedBy },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (row) => (row.amount ? `Rp ${row.amount.toFixed(1)}B` : "—"),
    },
    { key: "submitted", header: "Submitted", cell: (row) => formatDate(row.submittedAt) },
    { key: "aging", header: "Aging", cell: (row) => relativeDays(row.submittedAt) },
    { key: "priority", header: "Priority", cell: (row) => <StatusBadge tone={row.priority === "high" ? "danger" : row.priority === "medium" ? "warning" : "muted"}>{row.priority}</StatusBadge> },
    { key: "status", header: "Status", cell: (row) => <StatusBadge tone={APPROVAL_STATUS_TONE[row.status]}>{APPROVAL_STATUS_LABELS[row.status]}</StatusBadge> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => {
        if (row.status !== "pending") {
          return row.decisionComment ? <span className="text-[11px] text-muted-foreground">{row.decisionComment}</span> : null;
        }
        if (!user || row.approverUserId !== user.id) {
          return <span className="text-[11px] text-muted-foreground">Routed to {state.users.find((u) => u.id === row.approverUserId)?.name ?? "approver"}</span>;
        }
        return (
          <div className="flex items-center justify-end gap-1">
            <Button size="sm" onClick={() => decide(row, "approved")}>Approve</Button>
            <Button size="sm" variant="outline" onClick={() => decide(row, "revision_required")}>Revision</Button>
            <Button size="sm" variant="destructive" onClick={() => decide(row, "rejected")}>Reject</Button>
          </div>
        );
      },
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals"
        description="Review and decide on project and milestone submissions waiting for you."
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search approvals..."
            className="pl-7 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {(["all", "pending", "approved", "rejected", "revision_required"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : APPROVAL_STATUS_LABELS[s as ApprovalStatus]}
            </Button>
          ))}
        </div>
      </div>

      <SectionCard title="Approval queue" description={`${rows.length} request(s)`}>
        {rows.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="size-8" />}
            title="No approvals to show"
            description="Approvals will appear here when projects or milestones are submitted."
          />
        ) : (
          <DataTable rowKey={(row) => row.id} rows={rows} columns={columns} />
        )}
      </SectionCard>
    </div>
  );
}
