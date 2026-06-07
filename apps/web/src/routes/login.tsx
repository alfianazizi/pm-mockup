import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@project-management-mockup/ui/components/card";
import { cn } from "@project-management-mockup/ui/lib/utils";

import { useAppState } from "@/lib/app-state";
import { login } from "@/lib/actions";
import { ROLE_LABELS, type DemoUser, type Role } from "@/lib/domain";
import { initials } from "@/lib/formatters";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const ROLE_ORDER: Role[] = [
  "holding_admin",
  "holding_executive",
  "finance_controller",
  "subholding_admin",
  "project_owner",
  "approver",
  "viewer",
];

function LoginPage() {
  const { state, setState } = useAppState();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>("holding_admin");
  const [search, setSearch] = useState("");

  const users = state.users;

  const grouped = useMemo(() => {
    const filtered = users.filter((u) =>
      [u.name, u.email, u.role, u.subholdingId].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase()),
    );
    const groups: Record<Role, DemoUser[]> = {
      holding_admin: [],
      holding_executive: [],
      finance_controller: [],
      subholding_admin: [],
      project_owner: [],
      approver: [],
      viewer: [],
    };
    for (const user of filtered) {
      groups[user.role].push(user);
    }
    return groups;
  }, [users, search]);

  const handleLogin = (user: DemoUser) => {
    setState((s) => login(s, user.id));
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="grid lg:grid-cols-[1.1fr_1fr] min-h-svh">
        <div className="hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-10">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-sm bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              PH
            </div>
            <div>
              <div className="text-sm font-semibold">Pratama Holding</div>
              <div className="text-[11px] text-sidebar-muted uppercase tracking-wide">PMO Console</div>
            </div>
          </div>
          <div className="space-y-6 max-w-md">
            <h1 className="text-3xl font-semibold leading-tight">
              Monitor project budgets, milestones, and approvals across the holding.
            </h1>
            <p className="text-sm text-sidebar-muted">
              Sign in as a demo user to explore the project and template workflows, scoped data filters,
              and the milestone approval queue.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-sm bg-primary/20 text-primary flex items-center justify-center">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Stakeholder-ready demo</div>
                  <div className="text-xs text-sidebar-muted">Recharts, scoped data, role-based menus.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-sm bg-primary/20 text-primary flex items-center justify-center">
                  <Users className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Persona-driven flows</div>
                  <div className="text-xs text-sidebar-muted">Pick a role, see scoped dashboards and actions.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-sm bg-primary/20 text-primary flex items-center justify-center">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Approvals & milestones</div>
                  <div className="text-xs text-sidebar-muted">Project and milestone approvals move lifecycle state.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-sidebar-muted">
            Prototype build for stakeholder review. Data is mocked and stored locally in your browser.
          </div>
        </div>
        <div className="flex flex-col p-6 md:p-10">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="size-9 rounded-sm bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              PH
            </div>
            <div>
              <div className="text-sm font-semibold">Pratama Holding</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide">PMO Console</div>
            </div>
          </div>
          <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Sign in to continue</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Choose any demo user to experience scoped data, role-based menus, and approval workflows.
              </p>
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search demo users..."
                className="h-9 w-full rounded-sm border border-input bg-card px-3 text-xs"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROLE_ORDER.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "px-3 py-1.5 text-[11px] rounded-sm ring-1 ring-inset transition-colors",
                    selectedRole === role
                      ? "bg-primary text-primary-foreground ring-primary"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  )}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
            <div className="mt-4 flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-5 pb-6">
              {ROLE_ORDER.map((role) => {
                const list = grouped[role];
                if (selectedRole !== role && list.length === 0) return null;
                return (
                  <div key={role}>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">
                      {ROLE_LABELS[role]}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {list.length === 0 ? (
                        <div className="text-[11px] text-muted-foreground">No matching demo users.</div>
                      ) : (
                        list.map((user) => {
                          const subholding = state.subholdings.find((s) => s.id === user.subholdingId);
                          return (
                            <Card
                              key={user.id}
                              className="hover:ring-primary/40 transition-shadow"
                            >
                              <CardHeader>
                                <div className="flex items-start gap-3">
                                  <div
                                    className="size-10 rounded-sm flex items-center justify-center text-xs font-medium text-white"
                                    style={{ background: user.avatarColor }}
                                  >
                                    {initials(user.name)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <CardTitle>{user.name}</CardTitle>
                                    <CardDescription>{user.email}</CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-[11px] text-muted-foreground space-y-1">
                                  <div>Role: <span className="text-foreground font-medium">{ROLE_LABELS[user.role]}</span></div>
                                  {subholding ? (
                                    <div>
                                      Subholding: <span className="text-foreground font-medium">{subholding.name}</span>
                                    </div>
                                  ) : (
                                    <div>
                                      Scope: <span className="text-foreground font-medium">Holding-wide</span>
                                    </div>
                                  )}
                                  {user.projectIds?.length ? (
                                    <div>
                                      Projects: <span className="text-foreground font-medium">{user.projectIds.length}</span>
                                    </div>
                                  ) : null}
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full mt-3"
                                  onClick={() => handleLogin(user)}
                                >
                                  Sign in as {user.name.split(" ")[0]}
                                  <ArrowRight className="size-3.5" />
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
