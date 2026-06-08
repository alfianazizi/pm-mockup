import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ListChecks,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Wallet,
} from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Card } from "@project-management-mockup/ui/components/card";
import { Input } from "@project-management-mockup/ui/components/input";
import { Label } from "@project-management-mockup/ui/components/label";
import { cn } from "@project-management-mockup/ui/lib/utils";

import { DataTable, defineColumns, type Column } from "@/components/common/data-table";
import { LinkButton } from "@/components/common/link-button";
import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import {
  addAttachment,
  decideMilestoneApproval,
  decideProjectApproval,
  removeAttachment,
  submitMilestoneForApproval,
  submitProjectForApproval,
  updateStepCompletion,
} from "@/lib/actions";
import {
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_TONE,
  APPROVAL_TYPE_LABELS,
  BUDGET_STATUS_LABELS,
  BUDGET_STATUS_TONE,
  MILESTONE_WORK_LABELS,
  MILESTONE_WORK_TONE,
  PROJECT_LIFECYCLE_LABELS,
  PROJECT_LIFECYCLE_TONE,
  RISK_LABELS,
  RISK_TONE,
  type ApprovalRequest,
  type ApprovalStatus,
  type ProjectMilestone,
  type ProjectStep,
  type SpendingRecord,
} from "@/lib/domain";
import { formatDate, formatDateTime, formatIDRBillions, formatPercent, initials } from "@/lib/formatters";
import { canManageProject } from "@/lib/permissions";
import {
  computeBudgetStatus,
  computeMilestoneProgress,
  computeProjectProgress,
  computeRiskLevel,
  getCurrentUser,
} from "@/lib/selectors";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailPage,
});

const TABS = [
  { key: "overview", label: "Overview", icon: Sparkles },
  { key: "budget", label: "Budget", icon: Banknote },
  { key: "milestones", label: "Milestones", icon: ListChecks },
  { key: "approvals", label: "Approvals", icon: ShieldCheck },
  { key: "attachments", label: "Attachments", icon: Paperclip },
  { key: "activity", label: "Activity log", icon: Activity },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const [tab, setTab] = useState<TabKey>("overview");

  const project = useMemo(() => state.projects.find((p) => p.id === projectId), [state.projects, projectId]);
  const department = useMemo(
    () => (project ? state.departments.find((s) => s.id === project.departmentId) : undefined),
    [state.departments, project],
  );
  const owner = useMemo(
    () => (project ? state.users.find((u) => u.id === project.ownerId) : undefined),
    [state.users, project],
  );
  const approvals = useMemo(
    () => state.approvals.filter((a) => a.projectId === projectId),
    [state.approvals, projectId],
  );
  const pendingApprovals = useMemo(() => approvals.filter((a) => a.status === "pending"), [approvals]);

  if (!project || !user) {
    return <PageHeader title="Project not found" description="This project is not available in your scope." />;
  }

  const progress = computeProjectProgress(project);
  const budgetStatus = computeBudgetStatus(project);
  const risk = computeRiskLevel(project);
  const canManage = canManageProject(user, project);
  const projectApproval = pendingApprovals.find((a) => a.type === "project_approval");

  const submitForApproval = () => {
    const approver = state.users.find((u) => u.role === "approver");
    if (!approver) {
      toast.error("No approver available");
      return;
    }
    setState((s) => submitProjectForApproval(s, project.id, user, approver.id));
    toast.success("Project submitted for approval");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description={`${department?.name ?? "—"} · ${project.category} · Template: ${project.templateName} (${project.templateVersion})`}
        actions={
          <div className="flex items-center gap-2">
            <LinkButton variant="outline" size="sm" to="/projects">
              All projects
            </LinkButton>
            {project.status === "draft" && canManage ? (
              <Button size="sm" onClick={submitForApproval}>
                <Send className="size-3.5" /> Submit for approval
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Status"
          value={<StatusBadge tone={PROJECT_LIFECYCLE_TONE[project.status]}>{PROJECT_LIFECYCLE_LABELS[project.status]}</StatusBadge>}
          hint={project.priority.toUpperCase() + " priority"}
          icon={<CheckCircle2 className="size-4" />}
          tone={project.status === "active" ? "success" : project.status === "delayed" ? "danger" : "muted"}
        />
        <MetricCard
          label="Progress"
          value={formatPercent(progress)}
          icon={<Sparkles className="size-4" />}
          tone="info"
        />
        <MetricCard
          label="Approved budget"
          value={formatIDRBillions(project.approvedBudget)}
          hint={<StatusBadge tone={BUDGET_STATUS_TONE[budgetStatus]}>{BUDGET_STATUS_LABELS[budgetStatus]}</StatusBadge>}
          icon={<Wallet className="size-4" />}
          tone="primary"
        />
        <MetricCard
          label="Risk"
          value={<StatusBadge tone={RISK_TONE[risk]}>{RISK_LABELS[risk]}</StatusBadge>}
          icon={<AlertTriangle className="size-4" />}
          tone={risk === "critical" ? "danger" : risk === "high" ? "warning" : "muted"}
        />
      </div>

      <Card className="p-2">
        <div className="flex flex-wrap items-center gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-xs rounded-sm",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </Card>

      {tab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-4 lg:col-span-2 space-y-3">
            <div>
              <h3 className="text-sm font-medium text-foreground">Project summary</h3>
              <p className="text-xs text-muted-foreground mt-1">{project.description || "No description provided."}</p>
            </div>
            <div>
              <Label>Project progress</Label>
              <div className="mt-1">
                <ProgressBar value={progress} tone="primary" />
                <div className="text-[11px] text-muted-foreground mt-1">{formatPercent(progress)} · derived from milestone and step progress</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Department</div>
                <div className="text-foreground font-medium">{department?.name ?? "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Project owner</div>
                <div className="text-foreground font-medium flex items-center gap-2">
                  {owner ? (
                    <>
                      <span
                        className="size-6 rounded-sm text-white text-[10px] font-medium flex items-center justify-center"
                        style={{ background: owner.avatarColor }}
                      >
                        {initials(owner.name)}
                      </span>
                      {owner.name}
                    </>
                  ) : "—"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Start date</div>
                <div className="text-foreground font-medium">{formatDate(project.startDate)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Target completion</div>
                <div className="text-foreground font-medium">{formatDate(project.targetCompletionDate)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Template</div>
                <div className="text-foreground font-medium">{project.templateName} ({project.templateVersion})</div>
              </div>
              <div>
                <div className="text-muted-foreground">Category</div>
                <div className="text-foreground font-medium">{project.category}</div>
              </div>
            </div>
            <div>
              <Label>Timeline</Label>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {project.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 text-xs">
                    <div className="w-6 text-muted-foreground">{m.order}.</div>
                    <div className="flex-1">
                      <div className="text-foreground font-medium">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {formatDate(m.plannedStart)} → {formatDate(m.plannedEnd)}
                      </div>
                    </div>
                    <StatusBadge tone={MILESTONE_WORK_TONE[m.status]}>{MILESTONE_WORK_LABELS[m.status]}</StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <div className="space-y-4">
            <SectionCard title="Approvals" description="Active approval requests">
              {pendingApprovals.length === 0 ? (
                <div className="text-xs text-muted-foreground">No pending approvals.</div>
              ) : (
                <ul className="space-y-2">
                  {pendingApprovals.map((a) => (
                    <li key={a.id} className="text-xs">
                      <div className="flex items-center justify-between">
                        <div className="text-foreground font-medium">{APPROVAL_TYPE_LABELS[a.type]}</div>
                        <StatusBadge tone={APPROVAL_STATUS_TONE[a.status]}>{APPROVAL_STATUS_LABELS[a.status]}</StatusBadge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">Submitted {formatDate(a.submittedAt)}</div>
                    </li>
                  ))}
                </ul>
              )}
              {projectApproval && projectApproval.approverUserId === user.id ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setState((s) => decideProjectApproval(s, projectApproval.id, "approved", "Approved via project detail.", user));
                      toast.success("Project approved");
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setState((s) => decideProjectApproval(s, projectApproval.id, "revision_required", "Returned for revision.", user));
                      toast.success("Project returned for revision");
                    }}
                  >
                    Request revision
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setState((s) => decideProjectApproval(s, projectApproval.id, "rejected", "Rejected via project detail.", user));
                      toast.success("Project rejected");
                    }}
                  >
                    Reject
                  </Button>
                </div>
              ) : null}
            </SectionCard>
            <SectionCard title="Activity snapshot" description="Latest entries">
              <ul className="space-y-2 text-xs">
                {project.activityLog.slice(0, 5).map((entry) => (
                  <li key={entry.id} className="flex items-start gap-2">
                    <Clock className="size-3.5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-foreground font-medium">{entry.action}</div>
                      <div className="text-[11px] text-muted-foreground">{entry.description}</div>
                      <div className="text-[10px] text-muted-foreground">{formatDateTime(entry.timestamp)}</div>
                    </div>
                  </li>
                ))}
                {project.activityLog.length === 0 ? (
                  <li className="text-xs text-muted-foreground">No activity yet.</li>
                ) : null}
              </ul>
            </SectionCard>
          </div>
        </div>
      ) : null}

      {tab === "budget" ? <BudgetTab projectId={project.id} /> : null}
      {tab === "milestones" ? (
        <MilestonesTab
          projectId={project.id}
          canManage={canManage}
          currentUserId={user.id}
        />
      ) : null}
      {tab === "approvals" ? <ApprovalsTab projectId={project.id} currentUserId={user.id} /> : null}
      {tab === "attachments" ? <AttachmentsTab projectId={project.id} canManage={canManage} /> : null}
      {tab === "activity" ? <ActivityTab projectId={project.id} /> : null}
    </div>
  );
}

function BudgetTab({ projectId }: { projectId: string }) {
  const { state } = useAppState();
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return null;
  const variance = project.approvedBudget - project.actualSpending;

  const spendingColumns: Column<SpendingRecord>[] = defineColumns<SpendingRecord>([
    { key: "date", header: "Date", cell: (row) => formatDate(row.date) },
    { key: "desc", header: "Description", cell: (row) => row.description },
    { key: "category", header: "Category", cell: (row) => <StatusBadge tone="info">{row.category}</StatusBadge> },
    { key: "amount", header: "Amount", align: "right", cell: (row) => formatIDRBillions(row.amount) },
    { key: "vendor", header: "Vendor", cell: (row) => row.vendor },
    { key: "approval", header: "Approval", cell: (row) => <StatusBadge tone={APPROVAL_STATUS_TONE[row.approvalStatus]}>{APPROVAL_STATUS_LABELS[row.approvalStatus]}</StatusBadge> },
  ]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Approved budget" value={formatIDRBillions(project.approvedBudget)} icon={<Wallet className="size-4" />} tone="primary" />
        <MetricCard label="Actual spending" value={formatIDRBillions(project.actualSpending)} icon={<Banknote className="size-4" />} tone={project.actualSpending > project.approvedBudget ? "danger" : "success"} />
        <MetricCard label="Committed cost" value={formatIDRBillions(project.committedCost)} icon={<ShieldCheck className="size-4" />} tone="info" />
        <MetricCard label="Variance" value={formatIDRBillions(variance)} hint={variance < 0 ? "Over approved budget" : "Within budget"} icon={<AlertTriangle className="size-4" />} tone={variance < 0 ? "danger" : "success"} />
      </div>
      <SectionCard title="Spending records" description={`${project.spending.length} entries`}>
        {project.spending.length === 0 ? (
          <EmptyState icon={<FileText className="size-8" />} title="No spending recorded" description="Spending records will appear here as the project progresses." />
        ) : (
          <DataTable rowKey={(row) => row.id} rows={project.spending} columns={spendingColumns} />
        )}
      </SectionCard>
      <SectionCard title="Spending by category">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from(
            project.spending.reduce((acc, s) => {
              acc.set(s.category, (acc.get(s.category) ?? 0) + s.amount);
              return acc;
            }, new Map<string, number>()),
          ).map(([category, amount]) => {
            const value = project.actualSpending > 0 ? amount / project.actualSpending : 0;
            return (
              <Card key={category} className="ring-1 ring-inset ring-foreground/10 p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{category}</div>
                <div className="text-sm font-medium text-foreground">{formatIDRBillions(amount)}</div>
                <div className="mt-1">
                  <ProgressBar value={value} tone="info" />
                </div>
              </Card>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function MilestonesTab({ projectId, canManage, currentUserId }: { projectId: string; canManage: boolean; currentUserId: string }) {
  const { state, setState } = useAppState();
  const project = state.projects.find((p) => p.id === projectId);
  const user = getCurrentUser(state);
  if (!project || !user) return null;

  const toggleStep = (milestone: ProjectMilestone, step: ProjectStep) => {
    if (!canManage) return;
    setState((s) => updateStepCompletion(s, project.id, milestone.id, step.id, !step.completed, user));
  };

  const submitMilestone = (milestone: ProjectMilestone) => {
    if (!canManage) return;
    const approver = state.users.find((u) => u.role === "approver");
    if (!approver) {
      toast.error("No approver available");
      return;
    }
    setState((s) => submitMilestoneForApproval(s, project.id, milestone.id, user, approver.id));
    toast.success("Milestone submitted for approval");
  };

  return (
    <div className="space-y-3">
      {project.milestones.map((milestone) => {
        const progress = computeMilestoneProgress(milestone);
        const approval = state.approvals.find(
          (a) => a.projectId === project.id && a.milestoneId === milestone.id && a.status === "pending",
        );
        return (
          <Card key={milestone.id} className="ring-1 ring-inset ring-foreground/10">
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{milestone.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {milestone.description} · {formatDate(milestone.plannedStart)} → {formatDate(milestone.plannedEnd)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={MILESTONE_WORK_TONE[milestone.status]}>{MILESTONE_WORK_LABELS[milestone.status]}</StatusBadge>
                  <StatusBadge tone={APPROVAL_STATUS_TONE[milestone.approvalStatus]}>{APPROVAL_STATUS_LABELS[milestone.approvalStatus]}</StatusBadge>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-muted-foreground">Milestone progress</span>
                  <span className="text-[11px] text-muted-foreground">{formatPercent(progress)}</span>
                </div>
                <ProgressBar value={progress} tone="primary" />
              </div>
              <div className="space-y-1">
                {milestone.steps.map((step) => (
                  <div key={step.id} className="text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={() => toggleStep(milestone, step)}
                        disabled={!canManage}
                        className="size-3.5 accent-primary"
                      />
                      <span className={cn("flex-1", step.completed && "line-through text-muted-foreground")}>{step.name}</span>
                      <span className="text-[11px] text-muted-foreground">{step.assignedRole ?? "—"}</span>
                      <span className="text-[11px] text-muted-foreground">{step.dueDate ? formatDate(step.dueDate) : ""}</span>
                    </label>
                    {step.requiredAttachmentNames.length > 0 ? (
                      <div className="ml-6 mt-1 flex flex-wrap items-center gap-1.5">
                        <Paperclip className="size-3 text-muted-foreground" />
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Upload:
                        </span>
                        {step.requiredAttachmentNames.map((name) => (
                          <span
                            key={name}
                            className="text-[11px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {milestone.steps.length === 0 ? (
                  <div className="text-[11px] text-muted-foreground">No steps in this milestone.</div>
                ) : null}
              </div>
              <div className="flex items-center justify-end gap-2">
                {milestone.status === "in_progress" && milestone.approvalStatus !== "pending" && canManage ? (
                  <Button size="sm" variant="outline" onClick={() => submitMilestone(milestone)}>
                    <Send className="size-3.5" /> Submit for approval
                  </Button>
                ) : null}
                {approval && approval.approverUserId === currentUserId ? (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        setState((s) => decideMilestoneApproval(s, approval.id, "approved", "Approved.", user));
                        toast.success("Milestone approved");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setState((s) => decideMilestoneApproval(s, approval.id, "revision_required", "Needs revision.", user));
                        toast.success("Revision requested");
                      }}
                    >
                      Request revision
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setState((s) => decideMilestoneApproval(s, approval.id, "rejected", "Rejected.", user));
                        toast.success("Milestone rejected");
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ApprovalsTab({ projectId, currentUserId }: { projectId: string; currentUserId: string }) {
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const project = state.projects.find((p) => p.id === projectId);
  if (!project || !user) return null;
  const approvals = state.approvals.filter((a) => a.projectId === projectId);

  if (approvals.length === 0) {
    return <EmptyState icon={<ShieldCheck className="size-8" />} title="No approvals yet" description="Approval requests will appear here when milestones or the project are submitted." />;
  }

  const approvalColumns: Column<ApprovalRequest>[] = defineColumns<ApprovalRequest>([
    { key: "type", header: "Type", cell: (row) => APPROVAL_TYPE_LABELS[row.type] },
    { key: "milestone", header: "Milestone", cell: (row) => row.milestoneId ? project.milestones.find((m) => m.id === row.milestoneId)?.name ?? "—" : "—" },
    { key: "status", header: "Status", cell: (row) => <StatusBadge tone={APPROVAL_STATUS_TONE[row.status]}>{APPROVAL_STATUS_LABELS[row.status]}</StatusBadge> },
    { key: "requester", header: "Requested by", cell: (row) => state.users.find((u) => u.id === row.requestedBy)?.name ?? row.requestedBy },
    { key: "approver", header: "Approver", cell: (row) => state.users.find((u) => u.id === row.approverUserId)?.name ?? row.approverUserId },
    { key: "submitted", header: "Submitted", cell: (row) => formatDate(row.submittedAt) },
    { key: "decision", header: "Decision", cell: (row) => row.decisionAt ? formatDate(row.decisionAt) : "—" },
    { key: "comment", header: "Comment", cell: (row) => row.decisionComment ?? row.comment ?? "—" },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => {
        if (row.status !== "pending") return null;
        if (row.approverUserId !== currentUserId) {
          return <span className="text-[11px] text-muted-foreground">Awaiting {state.users.find((u) => u.id === row.approverUserId)?.name ?? "approver"}</span>;
        }
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="sm"
              onClick={() => {
                if (row.type === "project_approval") {
                  setState((s) => decideProjectApproval(s, row.id, "approved", "Approved.", user));
                } else {
                  setState((s) => decideMilestoneApproval(s, row.id, "approved", "Approved.", user));
                }
                toast.success("Approved");
              }}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (row.type === "project_approval") {
                  setState((s) => decideProjectApproval(s, row.id, "revision_required", "Needs revision.", user));
                } else {
                  setState((s) => decideMilestoneApproval(s, row.id, "revision_required", "Needs revision.", user));
                }
                toast.success("Revision requested");
              }}
            >
              Revision
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (row.type === "project_approval") {
                  setState((s) => decideProjectApproval(s, row.id, "rejected", "Rejected.", user));
                } else {
                  setState((s) => decideMilestoneApproval(s, row.id, "rejected", "Rejected.", user));
                }
                toast.success("Rejected");
              }}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ]);

  return (
    <DataTable
      rowKey={(row) => row.id}
      rows={approvals}
      columns={approvalColumns}
    />
  );
}

function AttachmentsTab({ projectId, canManage }: { projectId: string; canManage: boolean }) {
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const project = state.projects.find((p) => p.id === projectId);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("PDF");
  if (!project || !user) return null;

  const handleUpload = () => {
    if (!fileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }
    setState((s) =>
      addAttachment(
        s,
        project.id,
        {
          fileName: fileName.trim(),
          fileType,
          uploadedBy: user.id,
          relatedType: "project",
          relatedId: project.id,
          status: "pending",
        },
        user,
      ),
    );
    toast.success("Attachment recorded");
    setFileName("");
  };

  const attachmentColumns: Column<typeof project.attachments[number]>[] = defineColumns<typeof project.attachments[number]>([
    { key: "name", header: "File", cell: (row) => (
      <div className="flex items-center gap-2">
        <FileText className="size-3.5 text-muted-foreground" />
        <span className="text-foreground font-medium">{row.fileName}</span>
      </div>
    ) },
    { key: "type", header: "Type", cell: (row) => <StatusBadge tone="info">{row.fileType}</StatusBadge> },
    { key: "uploaded", header: "Uploaded", cell: (row) => formatDateTime(row.uploadedAt) },
    { key: "uploader", header: "Uploaded by", cell: (row) => state.users.find((u) => u.id === row.uploadedBy)?.name ?? row.uploadedBy },
    { key: "status", header: "Status", cell: (row) => <StatusBadge tone={row.status === "verified" ? "success" : row.status === "rejected" ? "danger" : "warning"}>{row.status}</StatusBadge> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => canManage ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setState((s) => removeAttachment(s, project.id, row.id, user))}
        >
          <Trash2 className="size-3.5" /> Remove
        </Button>
      ) : null,
    },
  ]);

  return (
    <SectionCard
      title="Attachments"
      description="File records only. No file content is stored."
      action={
        canManage ? (
          <div className="flex items-center gap-2">
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File name"
              className="h-7 text-xs w-48"
            />
            <select
              className="h-7 text-xs border border-input bg-card px-2 rounded-none"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              {["PDF", "DOCX", "XLSX", "PNG", "JPG", "DWG"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={handleUpload}>
              <Upload className="size-3.5" /> Record attachment
            </Button>
          </div>
        ) : null
      }
    >
      {project.attachments.length === 0 ? (
        <EmptyState icon={<Paperclip className="size-8" />} title="No attachments yet" />
      ) : (
        <DataTable
          rowKey={(row) => row.id}
          rows={project.attachments}
          columns={attachmentColumns}
        />
      )}
    </SectionCard>
  );
}

function ActivityTab({ projectId }: { projectId: string }) {
  const { state } = useAppState();
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return null;
  return (
    <SectionCard title="Activity log" description="Chronological list of events">
      {project.activityLog.length === 0 ? (
        <EmptyState icon={<Activity className="size-8" />} title="No activity yet" />
      ) : (
        <ul className="space-y-2">
          {project.activityLog.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3 p-2 rounded-sm ring-1 ring-inset ring-foreground/10">
              <div className="size-7 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                <Calendar className="size-3.5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-foreground">{entry.action}</div>
                <div className="text-[11px] text-muted-foreground">{entry.description}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {formatDateTime(entry.timestamp)} · {state.users.find((u) => u.id === entry.userId)?.name ?? entry.userId}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
