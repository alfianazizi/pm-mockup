import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Banknote, Search, Wallet } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Input } from "@project-management-mockup/ui/components/input";

import {
  BudgetVsSpendingChart,
  CategoryUtilizationChart,
} from "@/components/charts/dashboard-charts";
import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import { BUDGET_STATUS_LABELS, BUDGET_STATUS_TONE, type BudgetStatus, type Project } from "@/lib/domain";
import { formatIDRBillions, formatPercent } from "@/lib/formatters";
import {
  computeBudgetStatus,
  scopedProjects,
  subholdingPerformance,
  totalBudgetAllocation,
  totalCommittedCost,
  totalSpending,
  visibleSubholdings,
} from "@/lib/selectors";

export const Route = createFileRoute("/budget-monitoring/")({
  component: BudgetMonitoringPage,
});

function BudgetMonitoringPage() {
  const { state } = useAppState();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | "all">("all");
  const subholdings = visibleSubholdings(state);
  const projects = scopedProjects(state);

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchesSearch = [p.name, p.templateName, p.category].join(" ").toLowerCase().includes(search.toLowerCase());
        const status = computeBudgetStatus(p);
        return matchesSearch && (statusFilter === "all" || status === statusFilter);
      }),
    [projects, search, statusFilter],
  );

  const totalApproved = projects.reduce((acc, p) => acc + p.approvedBudget, 0);
  const totalSpent = totalSpending(projects);
  const totalCommitted = totalCommittedCost(projects);
  const totalAllocated = totalBudgetAllocation(subholdings);
  const remaining = totalApproved - totalSpent;
  const variance = totalApproved - totalSpent;
  const utilization = totalApproved > 0 ? totalSpent / totalApproved : 0;
  const overBudget = projects.filter((p) => computeBudgetStatus(p) === "over_budget").length;
  const nearLimit = projects.filter((p) => computeBudgetStatus(p) === "near_limit").length;

  const chartData = subholdings.map((sh) => {
    const perf = subholdingPerformance(sh, projects);
    return {
      name: sh.code,
      approved: perf.approved,
      spending: perf.spending,
    };
  });

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

  const columns: Column<Project>[] = defineColumns<Project>([
    { key: "subholding", header: "Subholding", cell: (row) => state.subholdings.find((s) => s.id === row.subholdingId)?.name ?? "—" },
    {
      key: "project",
      header: "Project",
      cell: (row) => (
        <Link to="/projects/$projectId" params={{ projectId: row.id }} className="text-primary hover:underline font-medium">
          {row.name}
        </Link>
      ),
    },
    { key: "approved", header: "Approved", align: "right", cell: (row) => formatIDRBillions(row.approvedBudget) },
    { key: "committed", header: "Committed", align: "right", cell: (row) => formatIDRBillions(row.committedCost) },
    { key: "actual", header: "Actual", align: "right", cell: (row) => formatIDRBillions(row.actualSpending) },
    { key: "remaining", header: "Remaining", align: "right", cell: (row) => formatIDRBillions(row.approvedBudget - row.actualSpending) },
    { key: "variance", header: "Variance", align: "right", cell: (row) => formatIDRBillions(row.approvedBudget - row.actualSpending) },
    {
      key: "util",
      header: "Utilization",
      cell: (row) => {
        const value = row.approvedBudget > 0 ? row.actualSpending / row.approvedBudget : 0;
        return (
          <div className="w-32">
            <ProgressBar value={value} tone={value > 1 ? "danger" : value > 0.8 ? "warning" : "primary"} />
            <div className="text-[10px] text-muted-foreground mt-0.5">{formatPercent(value)}</div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const s = computeBudgetStatus(row);
        return <StatusBadge tone={BUDGET_STATUS_TONE[s]}>{BUDGET_STATUS_LABELS[s]}</StatusBadge>;
      },
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget Monitoring"
        description="Consolidated financial view across subholdings and projects."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Subholding allocation" value={formatIDRBillions(totalAllocated)} icon={<Wallet className="size-4" />} tone="primary" />
        <MetricCard label="Approved (project)" value={formatIDRBillions(totalApproved)} icon={<Banknote className="size-4" />} tone="info" />
        <MetricCard label="Committed cost" value={formatIDRBillions(totalCommitted)} icon={<Banknote className="size-4" />} tone="warning" />
        <MetricCard label="Actual spending" value={formatIDRBillions(totalSpent)} hint={`${formatPercent(utilization)} of approved`} icon={<Banknote className="size-4" />} tone={utilization > 1 ? "danger" : "success"} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Remaining" value={formatIDRBillions(remaining)} tone="success" />
        <MetricCard label="Variance" value={formatIDRBillions(variance)} tone={variance < 0 ? "danger" : "success"} />
        <MetricCard label="Over budget" value={overBudget} tone="danger" />
        <MetricCard label="Near limit" value={nearLimit} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Budget vs spending by subholding" description="Allocated, approved and actual">
          <BudgetVsSpendingChart data={chartData} />
        </SectionCard>
        <SectionCard title="Utilization by category" description="Actual vs approved by category">
          <CategoryUtilizationChart data={categoryData} />
        </SectionCard>
      </div>

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
          {(["all", "normal", "near_limit", "over_budget"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : BUDGET_STATUS_LABELS[s as BudgetStatus]}
            </Button>
          ))}
        </div>
      </div>

      <SectionCard title="Project budget table" description={`${filtered.length} project(s)`}>
        <DataTable rowKey={(row) => row.id} rows={filtered} columns={columns} />
      </SectionCard>
    </div>
  );
}
