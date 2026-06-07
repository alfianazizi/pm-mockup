import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Archive, Building2, Search } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Input } from "@project-management-mockup/ui/components/input";

import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { LinkButton } from "@/components/common/link-button";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import { archiveSubholding } from "@/lib/actions";
import { formatIDRBillions, formatPercent } from "@/lib/formatters";
import { computeBudgetStatus, getCurrentUser, visibleSubholdings } from "@/lib/selectors";

export const Route = createFileRoute("/subholdings/")({
  component: SubholdingsPage,
});

function SubholdingsPage() {
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const subholdings = useMemo(() => {
    return visibleSubholdings(state).filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()),
    );
  }, [state, search]);

  const allSubholdings = useMemo(() => state.subholdings.filter((s) => !s.archivedAt), [state.subholdings]);
  const archivedSubholdings = useMemo(() => state.subholdings.filter((s) => !!s.archivedAt), [state.subholdings]);
  const rows = showArchived ? archivedSubholdings : subholdings;

  const columns: Column<typeof rows[number]>[] = defineColumns<typeof rows[number]>([
    {
      key: "name",
      header: "Subholding",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-sm bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 flex items-center justify-center">
            <Building2 className="size-4" />
          </div>
          <div>
            <div className="text-foreground font-medium">{row.name}</div>
            <div className="text-[11px] text-muted-foreground">{row.code} · {row.sector}</div>
          </div>
        </div>
      ),
    },
    { key: "allocation", header: "Annual allocation", align: "right", cell: (row) => formatIDRBillions(row.annualBudgetAllocation) },
    {
      key: "projects",
      header: "Projects",
      align: "right",
      cell: (row) => state.projects.filter((p) => !p.archivedAt && p.subholdingId === row.id).length,
    },
    {
      key: "spending",
      header: "Spending",
      align: "right",
      cell: (row) => {
        const projects = state.projects.filter((p) => !p.archivedAt && p.subholdingId === row.id);
        return formatIDRBillions(projects.reduce((acc, p) => acc + p.actualSpending, 0));
      },
    },
    {
      key: "util",
      header: "Utilization",
      cell: (row) => {
        const projects = state.projects.filter((p) => !p.archivedAt && p.subholdingId === row.id);
        const approved = projects.reduce((acc, p) => acc + p.approvedBudget, 0);
        const spending = projects.reduce((acc, p) => acc + p.actualSpending, 0);
        const value = approved > 0 ? spending / approved : 0;
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
      cell: (row) => <StatusBadge tone={row.status === "active" ? "success" : "muted"}>{row.status}</StatusBadge>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <LinkButton variant="ghost" size="sm" to="/subholdings/$subholdingId" params={{ subholdingId: row.id }}>
            View
          </LinkButton>
          {user?.role === "holding_admin" && !row.archivedAt ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm(`Archive ${row.name}?`)) {
                  setState((s) => archiveSubholding(s, row.id, user));
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
        title="Subholdings"
        description="Business units of the holding. Each subholding owns its projects, users, and budget allocation."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchived((s) => !s)}
          >
            {showArchived ? "Show active" : "Show archived"} ({showArchived ? allSubholdings.length : archivedSubholdings.length})
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search subholdings..."
          className="pl-7 h-8 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <SectionCard
        title={showArchived ? "Archived subholdings" : "Active subholdings"}
        description={showArchived ? "Soft-archived records. Restore is not part of the prototype." : "Owned by the holding."}
      >
        <DataTable
          rowKey={(row) => row.id}
          rows={rows}
          columns={columns}
          empty={<div className="text-xs text-muted-foreground">No subholdings to show.</div>}
        />
      </SectionCard>
    </div>
  );
}
