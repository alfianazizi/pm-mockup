import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ClipboardList,
  Clock,
  Coins,
  FolderKanban,
  Gauge,
  Layers3,
  PauseCircle,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Card } from "@project-management-mockup/ui/components/card";

import {
  BudgetVsSpendingChart,
  CategoryUtilizationChart,
  MilestoneCompletionChart,
  ProjectStatusChart,
  QuarterlyTrendChart,
  TopProjectsByBudgetChart,
} from "@/components/charts/dashboard-charts";
import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { LinkButton } from "@/components/common/link-button";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import {
  BUDGET_STATUS_LABELS,
  BUDGET_STATUS_TONE,
  PROJECT_LIFECYCLE_LABELS,
  PROJECT_LIFECYCLE_TONE,
  RISK_LABELS,
  RISK_TONE,
  type Project,
} from "@/lib/domain";
import { formatDate, formatIDRBillions, formatPercent, initials, relativeDays } from "@/lib/formatters";
import { isHoldingWide } from "@/lib/permissions";
import {
  computeBudgetStatus,
  computeMilestoneProgress,
  computeProjectProgress,
  computeRiskLevel,
  getCurrentUser,
  pendingApprovalsForQueue,
  scopedProjects,
  subholdingPerformance,
  upcomingMilestones,
  visibleSubholdings,
} from "@/lib/selectors";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { state } = useAppState();
  const user = getCurrentUser(state);
  const subholdings = useMemo(() => visibleSubholdings(state), [state]);
  const projects = useMemo(() => scopedProjects(state), [state]);
  const approvals = useMemo(() => pendingApprovalsForQueue(state.approvals), [state.approvals]);

  const totalBudget = projects.reduce((acc, p) => acc + p.approvedBudget, 0);
  const totalSpending = projects.reduce((acc, p) => acc + p.actualSpending, 0);
  const remaining = totalBudget - totalSpending;
  const utilization = totalBudget > 0 ? totalSpending / totalBudget : 0;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const delayedProjects = projects.filter((p) => p.status === "delayed").length;
  const awaiting = projects.filter((p) => p.status === "waiting_approval").length;
  const overrun = projects.filter((p) => computeBudgetStatus(p) === "over_budget").length;
  const avgProgress = projects.length
    ? projects.reduce((acc, p) => acc + computeProjectProgress(p), 0) / projects.length
    : 0;

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      counts[p.status] = (counts[p.status] ?? 0) + 1;
    }
    return Object.entries(counts).map(([key, value]) => ({
      name: PROJECT_LIFECYCLE_LABELS[key as Project["status"]] ?? key,
      value,
    }));
  }, [projects]);

  const budgetVsSpending = useMemo(() => {
    return subholdings.map((sh) => {
      const subs = projects.filter((p) => p.subholdingId === sh.id);
      return {
        name: sh.code,
        approved: subs.reduce((acc, p) => acc + p.approvedBudget, 0),
        spending: subs.reduce((acc, p) => acc + p.actualSpending, 0),
      };
    });
  }, [subholdings, projects]);

  const trendData = useMemo(() => {
    const labels = ["Q1", "Q2", "Q3", "Q4"];
    return labels.map((label, idx) => ({
      label,
      spending: Math.round((totalSpending * (idx + 1)) / 4 * 10) / 10,
      committed: Math.round((projects.reduce((acc, p) => acc + p.committedCost, 0) * (idx + 1)) / 4 * 10) / 10,
    }));
  }, [projects, totalSpending]);

  const categoryData = useMemo(() => {
    const groups: Record<string, { approved: number; spending: number }> = {};
    for (const p of projects) {
      const c = p.category;
      groups[c] = groups[c] ?? { approved: 0, spending: 0 };
      groups[c].approved += p.approvedBudget;
      groups[c].spending += p.actualSpending;
    }
    return Object.entries(groups).map(([category, value]) => ({
      category,
      utilization: value.approved > 0 ? value.spending / value.approved : 0,
    }));
  }, [projects]);

  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => b.approvedBudget - a.approvedBudget)
      .slice(0, 6)
      .map((p) => ({ name: p.name.split(" ").slice(0, 2).join(" "), budget: p.approvedBudget, spending: p.actualSpending }));
  }, [projects]);

  const milestoneMix = useMemo(() => {
    const groups: Record<string, { completed: number; inProgress: number; remaining: number }> = {};
    for (const p of projects) {
      for (const m of p.milestones) {
        const c = p.category;
        groups[c] = groups[c] ?? { completed: 0, inProgress: 0, remaining: 0 };
        const progress = computeMilestoneProgress(m);
        if (m.status === "completed") {
          groups[c].completed += 1;
        } else if (m.status === "in_progress" || m.status === "submitted") {
          groups[c].inProgress += progress;
          groups[c].remaining += 1 - progress;
        } else {
          groups[c].remaining += 1;
        }
      }
    }
    return Object.entries(groups).map(([label, value]) => {
      const total = value.completed + value.inProgress + value.remaining;
      return {
        label,
        completed: total ? value.completed / total : 0,
        inProgress: total ? value.inProgress / total : 0,
        remaining: total ? value.remaining / total : 0,
      };
    });
  }, [projects]);

  const highRisk = useMemo(
    () => projects.filter((p) => {
      const risk = computeRiskLevel(p);
      return risk === "high" || risk === "critical";
    }),
    [projects],
  );

  const upcoming = useMemo(() => upcomingMilestones(projects, 6), [projects]);
  const budgetOverruns = useMemo(
    () => projects.filter((p) => computeBudgetStatus(p) === "over_budget").slice(0, 5),
    [projects],
  );

  type SubholdingPerf = ReturnType<typeof subholdingPerformance>;
  const subholdingColumns: Column<SubholdingPerf>[] = defineColumns<SubholdingPerf>([
    { key: "name", header: "Subholding", cell: (row) => (
      <div>
        <div className="text-foreground font-medium">{row.subholding.name}</div>
        <div className="text-[11px] text-muted-foreground">{row.subholding.code} · {row.subholding.sector}</div>
      </div>
    ) },
    { key: "projects", header: "Projects", align: "right", cell: (row) => row.projects.length },
    { key: "approved", header: "Approved", align: "right", cell: (row) => formatIDRBillions(row.approved) },
    { key: "spending", header: "Spending", align: "right", cell: (row) => formatIDRBillions(row.spending) },
    { key: "util", header: "Utilization", cell: (row) => (
      <div className="w-32">
        <ProgressBar value={row.utilization} tone={row.utilization > 1 ? "danger" : row.utilization > 0.8 ? "warning" : "primary"} />
        <div className="text-[10px] text-muted-foreground mt-0.5">{formatPercent(row.utilization)}</div>
      </div>
    ) },
    { key: "active", header: "Active", align: "right", cell: (row) => row.active },
    { key: "delayed", header: "Delayed", align: "right", cell: (row) => (
      <span className={row.delayed > 0 ? "text-danger font-medium" : "text-muted-foreground"}>{row.delayed}</span>
    ) },
  ]);

  const riskColumns: Column<Project>[] = defineColumns<Project>([
    { key: "name", header: "Project", cell: (row) => (
      <Link to="/projects/$projectId" params={{ projectId: row.id }} className="text-primary hover:underline">
        {row.name}
      </Link>
    ) },
    { key: "subholding", header: "Subholding", cell: (row) => state.subholdings.find((s) => s.id === row.subholdingId)?.code ?? "—" },
    { key: "progress", header: "Progress", cell: (row) => (
      <div className="w-24">
        <ProgressBar value={computeProjectProgress(row)} />
        <div className="text-[10px] text-muted-foreground">{formatPercent(computeProjectProgress(row))}</div>
      </div>
    ) },
    { key: "risk", header: "Risk", cell: (row) => {
      const risk = computeRiskLevel(row);
      return <StatusBadge tone={RISK_TONE[risk]}>{RISK_LABELS[risk]}</StatusBadge>;
    } },
    { key: "budget", header: "Spending", align: "right", cell: (row) => formatIDRBillions(row.actualSpending) },
  ]);

  type UpcomingRow = { project: Project; milestone: { id: string; name: string; plannedEnd: string; status: string; approvalStatus: string } };
  const upcomingColumns: Column<UpcomingRow>[] = defineColumns<UpcomingRow>([
    { key: "project", header: "Project", cell: ({ project }) => (
      <Link to="/projects/$projectId" params={{ projectId: project.id }} className="text-primary hover:underline">
        {project.name}
      </Link>
    ) },
    { key: "milestone", header: "Milestone", cell: ({ milestone }) => milestone.name },
    { key: "due", header: "Due", cell: ({ milestone }) => (
      <div>
        <div className="text-foreground">{formatDate(milestone.plannedEnd)}</div>
        <div className="text-[10px] text-muted-foreground">{relativeDays(milestone.plannedEnd)}</div>
      </div>
    ) },
    { key: "status", header: "Work status", cell: ({ milestone }) => (
      <StatusBadge tone="muted">{milestone.status.replace("_", " ")}</StatusBadge>
    ) },
  ]);

  type PendingRow = typeof approvals[number];
  const pendingColumns: Column<PendingRow>[] = defineColumns<PendingRow>([
    { key: "type", header: "Type", cell: (row) => (
      <span className="text-foreground">{row.type.replace("_", " ")}</span>
    ) },
    { key: "project", header: "Project", cell: (row) => (
      <Link to="/projects/$projectId" params={{ projectId: row.projectId }} className="text-primary hover:underline">
        {state.projects.find((p) => p.id === row.projectId)?.name ?? row.projectId}
      </Link>
    ) },
    { key: "requester", header: "Requested by", cell: (row) => {
      const u = state.users.find((u) => u.id === row.requestedBy);
      return u ? u.name : row.requestedBy;
    } },
    { key: "submitted", header: "Submitted", cell: (row) => formatDate(row.submittedAt) },
    { key: "priority", header: "Priority", cell: (row) => (
      <StatusBadge tone={row.priority === "high" ? "danger" : row.priority === "medium" ? "warning" : "muted"}>
        {row.priority}
      </StatusBadge>
    ) },
  ]);

  const showSubholdingColumn = isHoldingWide(user);

  return (
    <div className="space-y-6">
      <PageHeader
        title={user ? `Welcome back, ${user.name.split(" ")[0]}` : "Dashboard"}
        description="Holding-level consolidated monitoring of project budgets, milestones, and approvals."
        actions={
          <>
            <LinkButton variant="outline" size="sm" to="/projects">
              All projects
            </LinkButton>
            <LinkButton size="sm" to="/approvals">
              Open approvals
            </LinkButton>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Total approved budget"
          value={formatIDRBillions(totalBudget)}
          hint={`${projects.length} projects`}
          icon={<Banknote className="size-4" />}
          tone="primary"
        />
        <MetricCard
          label="Actual spending"
          value={formatIDRBillions(totalSpending)}
          hint={`${formatPercent(utilization)} utilization`}
          icon={<Wallet className="size-4" />}
          tone={utilization > 1 ? "danger" : utilization > 0.8 ? "warning" : "success"}
        />
        <MetricCard
          label="Remaining budget"
          value={formatIDRBillions(remaining)}
          hint="Approved minus actual"
          icon={<Coins className="size-4" />}
          tone="info"
        />
        <MetricCard
          label="Active projects"
          value={activeProjects}
          hint={`${delayedProjects} delayed`}
          icon={<FolderKanban className="size-4" />}
          tone="primary"
        />
        <MetricCard
          label="Awaiting approval"
          value={awaiting}
          hint={`${overrun} over budget`}
          icon={<ClipboardList className="size-4" />}
          tone="warning"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Completed"
          value={completedProjects}
          hint="Lifecycle = Completed"
          icon={<CheckCircle2 className="size-4" />}
          tone="success"
        />
        <MetricCard
          label="Delayed"
          value={delayedProjects}
          hint="Lifecycle = Delayed"
          icon={<Clock className="size-4" />}
          tone="danger"
        />
        <MetricCard
          label="Budget overruns"
          value={overrun}
          hint=">100% actual vs approved"
          icon={<AlertTriangle className="size-4" />}
          tone="danger"
        />
        <MetricCard
          label="Average progress"
          value={formatPercent(avgProgress)}
          hint="Derived from milestone progress"
          icon={<Gauge className="size-4" />}
          tone="info"
        />
        <MetricCard
          label="Pending approvals"
          value={approvals.length}
          hint="In queue across all subholdings"
          icon={<PauseCircle className="size-4" />}
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Budget vs spending by subholding" description="Approved budget against actual spending" className="lg:col-span-2">
          <BudgetVsSpendingChart data={budgetVsSpending} />
        </SectionCard>
        <SectionCard title="Project status distribution" description="By lifecycle status">
          <ProjectStatusChart data={statusCounts} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Quarterly spending trend" description="Actual vs committed across quarters">
          <QuarterlyTrendChart data={trendData} />
        </SectionCard>
        <SectionCard title="Budget utilization by category" description="Actual spending / approved budget">
          <CategoryUtilizationChart data={categoryData} />
        </SectionCard>
        <SectionCard title="Milestone completion rate" description="Stacked by project category">
          <MilestoneCompletionChart data={milestoneMix} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Top projects by approved budget" description="Largest investments across the portfolio">
          <TopProjectsByBudgetChart data={topProjects} />
        </SectionCard>
        <SectionCard title="Subholding performance" description="Roll-up by subholding (within scope)">
          <DataTable
            rowKey={(row) => row.subholding.id}
            rows={subholdings.map((sh) => subholdingPerformance(sh, projects))}
            columns={subholdingColumns}
          />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="High-risk projects"
          description="Computed from delayed milestones, budget overruns, and progress"
          action={
            <LinkButton variant="ghost" size="sm" to="/projects">
              View projects
            </LinkButton>
          }
        >
          {highRisk.length === 0 ? (
            <div className="text-xs text-muted-foreground">No projects are currently high risk.</div>
          ) : (
            <DataTable rowKey={(row) => row.id} rows={highRisk} columns={riskColumns} />
          )}
        </SectionCard>
        <SectionCard
          title="Budget overrun projects"
          description="Actual spending exceeds approved project budget"
        >
          {budgetOverruns.length === 0 ? (
            <div className="text-xs text-muted-foreground">No projects are currently over budget.</div>
          ) : (
            <DataTable
              rowKey={(row) => row.id}
              rows={budgetOverruns}
              columns={[
                { key: "name", header: "Project", cell: (row) => (
                  <Link to="/projects/$projectId" params={{ projectId: row.id }} className="text-primary hover:underline">{row.name}</Link>
                ) },
                { key: "budget", header: "Approved", align: "right", cell: (row) => formatIDRBillions(row.approvedBudget) },
                { key: "spending", header: "Spending", align: "right", cell: (row) => formatIDRBillions(row.actualSpending) },
                { key: "status", header: "Status", cell: (row) => {
                  const s = computeBudgetStatus(row);
                  return <StatusBadge tone={BUDGET_STATUS_TONE[s]}>{BUDGET_STATUS_LABELS[s]}</StatusBadge>;
                } },
              ]}
            />
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Upcoming milestones" description="Sorted by planned end date">
          {upcoming.length === 0 ? (
            <div className="text-xs text-muted-foreground">No upcoming milestones in scope.</div>
          ) : (
            <DataTable
              rowKey={({ milestone, project }) => `${project.id}-${milestone.id}`}
              rows={upcoming}
              columns={upcomingColumns}
            />
          )}
        </SectionCard>
        <SectionCard
          title="Pending approvals"
          description="Active approval requests across subholdings"
          action={
            <LinkButton variant="ghost" size="sm" to="/approvals">
              Open queue
            </LinkButton>
          }
        >
          {approvals.length === 0 ? (
            <div className="text-xs text-muted-foreground">No pending approvals.</div>
          ) : (
            <DataTable rowKey={(row) => row.id} rows={approvals.slice(0, 6)} columns={pendingColumns} />
          )}
        </SectionCard>
      </div>

      {showSubholdingColumn ? (
        <SectionCard title="Subholding scorecard" description="Headline indicators per subholding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subholdings.map((sh) => {
              const perf = subholdingPerformance(sh, projects);
              return (
                <Card key={sh.id} size="sm" className="ring-1 ring-inset ring-foreground/10">
                  <div className="px-3 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-foreground">{sh.name}</div>
                        <div className="text-[11px] text-muted-foreground">{sh.sector} · {sh.code}</div>
                      </div>
                      <StatusBadge tone="muted">{perf.projects.length} projects</StatusBadge>
                    </div>
                    <ProgressBar value={perf.utilization} tone={perf.utilization > 1 ? "danger" : perf.utilization > 0.8 ? "warning" : "primary"} />
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                      <div>
                        <div className="text-foreground text-xs font-medium">{formatIDRBillions(perf.spending)}</div>
                        <div>Spending</div>
                      </div>
                      <div>
                        <div className="text-foreground text-xs font-medium">{perf.active}</div>
                        <div>Active</div>
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${perf.delayed ? "text-danger" : "text-foreground"}`}>{perf.delayed}</div>
                        <div>Delayed</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
