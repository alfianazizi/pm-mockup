import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { BarChart3, Calendar, CheckCircle2, FolderKanban, Users, Wallet } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Card } from "@project-management-mockup/ui/components/card";

import {
  MilestoneCompletionChart,
  QuarterlyTrendChart,
} from "@/components/charts/dashboard-charts";
import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { LinkButton } from "@/components/common/link-button";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import {
  PROJECT_LIFECYCLE_LABELS,
  PROJECT_LIFECYCLE_TONE,
  RISK_LABELS,
  RISK_TONE,
  type Project,
} from "@/lib/domain";
import { formatDate, formatIDRBillions, formatPercent, initials } from "@/lib/formatters";
import {
  computeMilestoneProgress,
  computeProjectProgress,
  computeRiskLevel,
  scopedProjects,
} from "@/lib/selectors";

export const Route = createFileRoute("/subholdings/$subholdingId")({
  component: SubholdingDetailPage,
});

function SubholdingDetailPage() {
  const { subholdingId } = Route.useParams();
  const { state } = useAppState();

  const subholding = useMemo(
    () => state.subholdings.find((s) => s.id === subholdingId),
    [state.subholdings, subholdingId],
  );

  const projects = useMemo(
    () => scopedProjects(state).filter((p) => p.subholdingId === subholdingId),
    [state, subholdingId],
  );
  const users = useMemo(
    () => state.users.filter((u) => u.subholdingId === subholdingId),
    [state.users, subholdingId],
  );

  if (!subholding) {
    return (
      <PageHeader title="Subholding not found" description="The selected subholding does not exist." />
    );
  }

  const approved = projects.reduce((acc, p) => acc + p.approvedBudget, 0);
  const spending = projects.reduce((acc, p) => acc + p.actualSpending, 0);
  const committed = projects.reduce((acc, p) => acc + p.committedCost, 0);
  const utilization = approved > 0 ? spending / approved : 0;

  const trendData = ["Q1", "Q2", "Q3", "Q4"].map((label, idx) => ({
    label,
    spending: Math.round((spending * (idx + 1)) / 4 * 10) / 10,
    committed: Math.round((committed * (idx + 1)) / 4 * 10) / 10,
  }));

  const milestoneData = projects.length === 0
    ? []
    : [
        (() => {
          let completed = 0;
          let inProgress = 0;
          let remaining = 0;
          for (const p of projects) {
            for (const m of p.milestones) {
              const progress = computeMilestoneProgress(m);
              if (m.status === "completed") completed += 1;
              else if (m.status === "in_progress" || m.status === "submitted") {
                inProgress += progress;
                remaining += 1 - progress;
              } else {
                remaining += 1;
              }
            }
          }
          const total = completed + inProgress + remaining;
          return {
            label: subholding.code,
            completed: total ? completed / total : 0,
            inProgress: total ? inProgress / total : 0,
            remaining: total ? remaining / total : 0,
          };
        })(),
      ];

  const projectColumns: Column<Project>[] = defineColumns<Project>([
    { key: "name", header: "Project", cell: (row) => (
      <Link to="/projects/$projectId" params={{ projectId: row.id }} className="text-primary hover:underline">
        {row.name}
      </Link>
    ) },
    { key: "status", header: "Status", cell: (row) => (
      <StatusBadge tone={PROJECT_LIFECYCLE_TONE[row.status]}>{PROJECT_LIFECYCLE_LABELS[row.status]}</StatusBadge>
    ) },
    { key: "progress", header: "Progress", cell: (row) => (
      <div className="w-24">
        <ProgressBar value={computeProjectProgress(row)} />
        <div className="text-[10px] text-muted-foreground mt-0.5">{formatPercent(computeProjectProgress(row))}</div>
      </div>
    ) },
    { key: "budget", header: "Approved", align: "right", cell: (row) => formatIDRBillions(row.approvedBudget) },
    { key: "spending", header: "Spending", align: "right", cell: (row) => formatIDRBillions(row.actualSpending) },
    { key: "risk", header: "Risk", cell: (row) => {
      const risk = computeRiskLevel(row);
      return <StatusBadge tone={RISK_TONE[risk]}>{RISK_LABELS[risk]}</StatusBadge>;
    } },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={subholding.name}
        description={`${subholding.sector} · ${subholding.code} · ${subholding.description ?? ""}`}
        actions={
          <LinkButton variant="outline" size="sm" to="/subholdings">
            All subholdings
          </LinkButton>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Annual allocation" value={formatIDRBillions(subholding.annualBudgetAllocation)} icon={<Wallet className="size-4" />} tone="primary" />
        <MetricCard label="Approved project budget" value={formatIDRBillions(approved)} icon={<FolderKanban className="size-4" />} tone="info" />
        <MetricCard label="Actual spending" value={formatIDRBillions(spending)} icon={<BarChart3 className="size-4" />} tone={utilization > 1 ? "danger" : "success"} />
        <MetricCard label="Active projects" value={projects.filter((p) => p.status === "active").length} icon={<CheckCircle2 className="size-4" />} tone="success" />
      </div>

      <SectionCard title="Subholding profile">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-muted-foreground">Code</div>
            <div className="text-foreground font-medium">{subholding.code}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Sector</div>
            <div className="text-foreground font-medium">{subholding.sector}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div className="text-foreground font-medium capitalize">{subholding.status}</div>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Spending trend" description="Quarterly actual vs committed">
          <QuarterlyTrendChart data={trendData} />
        </SectionCard>
        <SectionCard title="Milestone performance" description="Progress distribution for this subholding">
          <MilestoneCompletionChart data={milestoneData} />
        </SectionCard>
      </div>

      <SectionCard title="Project portfolio" description="Projects under this subholding">
        <DataTable rowKey={(row) => row.id} rows={projects} columns={projectColumns} />
      </SectionCard>

      <SectionCard title="Assigned users" description="Team members scoped to this subholding">
        {users.length === 0 ? (
          <div className="text-xs text-muted-foreground">No users directly assigned.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((user) => (
              <Card key={user.id} size="sm" className="ring-1 ring-inset ring-foreground/10">
                <div className="px-3 py-3 flex items-start gap-3">
                  <div
                    className="size-9 rounded-sm flex items-center justify-center text-xs font-medium text-white"
                    style={{ background: user.avatarColor }}
                  >
                    {initials(user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground font-medium text-sm">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground">{user.email}</div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Users className="size-3" />
                      <span>{user.role.replace("_", " ")}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Calendar className="size-3" />
                      <span>Last login {formatDate(user.lastLogin)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
