import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FolderKanban,
  Layers,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";

import { Card } from "@project-management-mockup/ui/components/card";

import { MetricCard } from "@/components/common/metric-card";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import { getCurrentUser, scopedProjects, scopedApprovals } from "@/lib/selectors";
import { LinkButton } from "@/components/common/link-button";
import { formatIDRBillions } from "@/lib/formatters";
import { computeProjectProgress } from "@/lib/selectors";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("pmm.appState.v1") : null;
    if (!raw) throw redirect({ to: "/login" });
    try {
      const parsed = JSON.parse(raw) as { currentUserId?: string } | null;
      if (!parsed || !parsed.currentUserId) throw redirect({ to: "/login" });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { state } = useAppState();
  const user = getCurrentUser(state);
  const projects = useMemo(() => scopedProjects(state), [state]);
  const approvals = useMemo(() => scopedApprovals(state), [state]);

  if (!user) return null;

  const totalBudget = projects.reduce((acc, p) => acc + p.approvedBudget, 0);
  const totalSpending = projects.reduce((acc, p) => acc + p.actualSpending, 0);
  const active = projects.filter((p) => p.status === "active").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const pending = approvals.filter((a) => a.status === "pending").length;
  const avgProgress = projects.length
    ? projects.reduce((acc, p) => acc + computeProjectProgress(p), 0) / projects.length
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="A quick look at your projects and what needs your attention."
        actions={
          <>
            <LinkButton size="sm" to="/projects">
              <FolderKanban className="size-3.5" /> Open projects
            </LinkButton>
            <LinkButton variant="outline" size="sm" to="/approvals">
              <Layers className="size-3.5" /> Open approvals
            </LinkButton>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Projects in scope"
          value={projects.length}
          hint={`${active} active · ${completed} completed`}
          icon={<FolderKanban className="size-4" />}
          tone="primary"
        />
        <MetricCard
          label="Total approved budget"
          value={formatIDRBillions(totalBudget)}
          icon={<Sparkles className="size-4" />}
          tone="info"
        />
        <MetricCard
          label="Actual spending"
          value={formatIDRBillions(totalSpending)}
          icon={<Clock className="size-4" />}
          tone="success"
        />
        <MetricCard
          label="Pending approvals"
          value={pending}
          hint="Project & milestone approvals"
          icon={<CheckCircle2 className="size-4" />}
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 ring-1 ring-inset ring-foreground/10">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
              <LayoutTemplate className="size-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Project Templates</div>
              <p className="text-xs text-muted-foreground mt-1">
                Reusable blueprints with milestones, steps, and approval rules. Pick one when
                starting a new project.
              </p>
              <div className="mt-3">
                <LinkButton size="sm" to="/templates">
                  Manage templates
                </LinkButton>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 ring-1 ring-inset ring-foreground/10">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-sm bg-info/10 text-info flex items-center justify-center">
              <FolderKanban className="size-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Projects</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average progress is {Math.round(avgProgress * 100)}% across {projects.length}{" "}
                project{projects.length === 1 ? "" : "s"}. Open one to see milestones, approvals,
                attachments, and recent activity.
              </p>
              <div className="mt-3">
                <LinkButton size="sm" to="/projects">
                  View projects
                </LinkButton>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <SectionCard
        title="Pending approvals"
        description="Approval requests waiting on the current user"
        action={
          <LinkButton variant="ghost" size="sm" to="/approvals">
            Open queue
          </LinkButton>
        }
      >
        {pending === 0 ? (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="size-3.5" />
            Nothing waiting on you. Submit a milestone or project to populate the queue.
          </div>
        ) : (
          <ul className="space-y-2">
            {approvals
              .filter((a) => a.status === "pending" && a.approverUserId === user.id)
              .slice(0, 5)
              .map((a) => {
                const project = state.projects.find((p) => p.id === a.projectId);
                return (
                  <li
                    key={a.id}
                    className="flex items-center justify-between text-xs px-3 py-2 ring-1 ring-inset ring-foreground/10 rounded-sm"
                  >
                    <div>
                      <div className="text-foreground font-medium">{project?.name ?? a.projectId}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {a.type.replace("_", " ")} · {a.submittedAt.slice(0, 10)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge tone="warning">Pending</StatusBadge>
                      <Link
                        to="/approvals"
                        className="text-primary text-[11px] hover:underline"
                      >
                        Review
                      </Link>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
