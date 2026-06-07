import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Archive, Edit, Search, UserPlus } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Input } from "@project-management-mockup/ui/components/input";

import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import { ROLE_LABELS, type DemoUser, type Role } from "@/lib/domain";
import { formatDate, initials } from "@/lib/formatters";
import { toast } from "sonner";

export const Route = createFileRoute("/users/")({
  component: UsersPage,
});

const ROLE_OPTIONS: Role[] = [
  "holding_admin",
  "holding_executive",
  "finance_controller",
  "subholding_admin",
  "project_owner",
  "approver",
  "viewer",
];

function UsersPage() {
  const { state } = useAppState();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "all">("all");

  const rows = useMemo(() => {
    return state.users.filter((u) => {
      const matchesSearch = [u.name, u.email].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesRole = role === "all" || u.role === role;
      return matchesSearch && matchesRole;
    });
  }, [state.users, search, role]);

  const columns: Column<DemoUser>[] = defineColumns<DemoUser>([
    {
      key: "user",
      header: "User",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-sm text-white flex items-center justify-center text-[11px] font-medium" style={{ background: row.avatarColor }}>
            {initials(row.name)}
          </div>
          <div>
            <div className="text-foreground font-medium">{row.name}</div>
            <div className="text-[11px] text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", cell: (row) => <StatusBadge tone="info">{ROLE_LABELS[row.role]}</StatusBadge> },
    { key: "subholding", header: "Subholding", cell: (row) => state.subholdings.find((s) => s.id === row.subholdingId)?.name ?? "—" },
    { key: "projects", header: "Projects", align: "right", cell: (row) => row.projectIds?.length ?? 0 },
    { key: "status", header: "Status", cell: (row) => <StatusBadge tone={row.status === "active" ? "success" : "muted"}>{row.status}</StatusBadge> },
    { key: "lastLogin", header: "Last login", cell: (row) => formatDate(row.lastLogin) },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => toast.info(`Editing ${row.name} (mock)`)}>
            <Edit className="size-3.5" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast.success(`${row.name} deactivated (mock)`)}>
            <Archive className="size-3.5" /> Deactivate
          </Button>
        </div>
      ),
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Roles"
        description="Manage demo users and their data scope. Real users are not part of this prototype."
        actions={
          <Button size="sm" onClick={() => toast.info("Create user form is mocked in this prototype")}>
            <UserPlus className="size-3.5" /> New user
          </Button>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-7 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Button size="sm" variant={role === "all" ? "default" : "outline"} onClick={() => setRole("all")}>
            All
          </Button>
          {ROLE_OPTIONS.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={role === r ? "default" : "outline"}
              onClick={() => setRole(r)}
            >
              {ROLE_LABELS[r]}
            </Button>
          ))}
        </div>
      </div>

      <SectionCard title="Users" description={`${rows.length} matching users`}>
        <DataTable rowKey={(row) => row.id} rows={rows} columns={columns} />
      </SectionCard>
    </div>
  );
}
