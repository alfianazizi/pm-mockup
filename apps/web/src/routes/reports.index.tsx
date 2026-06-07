import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Eye, FileSpreadsheet, FileText } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";

import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import { PERIOD_LABELS, type ReportCard } from "@/lib/domain";
import { formatDate } from "@/lib/formatters";
import { toast } from "sonner";

export const Route = createFileRoute("/reports/")({
  component: ReportsPage,
});

function ReportsPage() {
  const { state } = useAppState();
  const [period, setPeriod] = useState<"all" | "quarterly" | "semesterly" | "annually">("all");
  const reports = useMemo(
    () => state.reports.filter((r) => period === "all" || r.period === period),
    [state.reports, period],
  );

  const handleExport = (format: "PDF" | "Excel", report: ReportCard) => {
    toast.success(`${format} export queued`, { description: `${report.name} is ready for download.` });
  };

  const columns: Column<ReportCard>[] = defineColumns<ReportCard>([
    { key: "name", header: "Report", cell: (row) => (
      <div>
        <div className="text-foreground font-medium">{row.name}</div>
        <div className="text-[11px] text-muted-foreground max-w-md">{row.description}</div>
      </div>
    ) },
    { key: "period", header: "Period", cell: (row) => (
      <StatusBadge tone="info">{PERIOD_LABELS[row.period]}</StatusBadge>
    ) },
    { key: "last", header: "Last generated", cell: (row) => formatDate(row.lastGenerated) },
    { key: "format", header: "Format", cell: (row) => row.format },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => toast.info(`Previewing ${row.name}`)}>
            <Eye className="size-3.5" /> View
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("PDF", row)}>
            <FileText className="size-3.5" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("Excel", row)}>
            <FileSpreadsheet className="size-3.5" /> Excel
          </Button>
        </div>
      ),
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Executive and finance reports. Exports are mock actions in this prototype."
        actions={
          <div className="flex items-center gap-2">
            {(["all", "quarterly", "semesterly", "annually"] as const).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? "default" : "outline"}
                onClick={() => setPeriod(p)}
              >
                {p === "all" ? "All" : PERIOD_LABELS[p]}
              </Button>
            ))}
          </div>
        }
      />

      <SectionCard title="Available reports" description="View or export mock reports">
        <DataTable
          rowKey={(row) => row.id}
          rows={reports}
          columns={columns}
        />
      </SectionCard>

      <SectionCard title="Coming soon" description="Highlights from the next report cycle">
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li>· Variance analysis by budget category</li>
          <li>· Approval aging by subholding</li>
          <li>· Project risk heatmap by quarter</li>
        </ul>
      </SectionCard>
    </div>
  );
}
