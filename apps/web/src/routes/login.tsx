import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LayoutTemplate, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@project-management-mockup/ui/components/card";

import { useAppState } from "@/lib/app-state";
import { login } from "@/lib/actions";
import { ROLE_LABELS, type DemoUser } from "@/lib/domain";
import { initials } from "@/lib/formatters";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { state, setState } = useAppState();
  const navigate = useNavigate();

  const handleLogin = (user: DemoUser) => {
    setState((s) => login(s, user.id));
    navigate({ to: "/projects" });
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
              Project and Template focus.
            </h1>
            <p className="text-sm text-sidebar-muted">
              Sign in as a demo user to walk through the project lifecycle and the template
              library that powers it. The Project Owner is scoped to assigned projects; the
              Holding Admin can manage templates and approve work.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-sm bg-primary/20 text-primary flex items-center justify-center">
                  <LayoutTemplate className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Project Templates</div>
                  <div className="text-xs text-sidebar-muted">
                    Governed centrally. Edit milestones, steps, approvals, and risk checklist.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-sm bg-primary/20 text-primary flex items-center justify-center">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Project Wizard</div>
                  <div className="text-xs text-sidebar-muted">
                    Five-step creation flow that snapshots a template into a new project.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-sm bg-primary/20 text-primary flex items-center justify-center">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Approvals</div>
                  <div className="text-xs text-sidebar-muted">
                    Project and milestone approvals update lifecycle state in local storage.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-sidebar-muted">
            Prototype build for stakeholder review. Data is mocked and stored locally.
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
          <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Sign in to continue</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Two demo users are available. Switch personas to see different scopes and
                permissions.
              </p>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {state.users.map((user) => {
                const subholding = state.subholdings.find((s) => s.id === user.subholdingId);
                return (
                  <Card key={user.id} className="hover:ring-primary/40 transition-shadow">
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
                        <div>
                          Role: <span className="text-foreground font-medium">{ROLE_LABELS[user.role]}</span>
                        </div>
                        {subholding ? (
                          <div>
                            Subholding:{" "}
                            <span className="text-foreground font-medium">{subholding.name}</span>
                          </div>
                        ) : (
                          <div>
                            Scope: <span className="text-foreground font-medium">Holding-wide</span>
                          </div>
                        )}
                        {user.projectIds?.length ? (
                          <div>
                            Projects:{" "}
                            <span className="text-foreground font-medium">{user.projectIds.length}</span>
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
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
