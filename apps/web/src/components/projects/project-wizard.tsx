import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, Folder, Paperclip, ShieldCheck, Users } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Card } from "@project-management-mockup/ui/components/card";
import { Checkbox } from "@project-management-mockup/ui/components/checkbox";
import { Input } from "@project-management-mockup/ui/components/input";
import { Label } from "@project-management-mockup/ui/components/label";
import { cn } from "@project-management-mockup/ui/lib/utils";

import { PageHeader, SectionCard } from "@/components/common/page-header";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { useAppState } from "@/lib/app-state";
import { createProjectFromTemplate } from "@/lib/actions";
import { ROLE_LABELS, type ProjectTemplate, type Department } from "@/lib/domain";
import { formatIDRBillions, initials } from "@/lib/formatters";
import { canCreateProject } from "@/lib/permissions";
import { getCurrentUser, visibleDepartments } from "@/lib/selectors";
import { toast } from "sonner";

interface WizardState {
  departmentId?: string;
  templateId?: string;
  name: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  approvedBudget: number;
  startDate: string;
  targetCompletionDate: string;
  ownerId?: string;
  approverUserId?: string;
  notes: string;
  submitForApproval: boolean;
}

const STEPS = [
  { key: "scope", label: "Department and template", icon: Folder },
  { key: "details", label: "Project details", icon: FileText },
  { key: "budget", label: "Budget and team", icon: ShieldCheck },
  { key: "review", label: "Review generated milestones", icon: Users },
  { key: "submit", label: "Save or submit", icon: Check },
] as const;

export function ProjectWizard({ onDone }: { onDone: () => void }) {
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const [stepIndex, setStepIndex] = useState(0);
  const [state2, setWizard] = useState<WizardState>({
    name: "",
    description: "",
    category: "Infrastructure",
    priority: "medium",
    approvedBudget: 25,
    startDate: "2026-07-01",
    targetCompletionDate: "2026-12-15",
    notes: "",
    submitForApproval: true,
  });

  const departments = useMemo<Department[]>(() => {
    if (!user) return [];
    const all = visibleDepartments(state);
    if (user.role === "department_admin" && user.departmentId) {
      return all.filter((s) => s.id === user.departmentId);
    }
    return all;
  }, [state, user]);

  const templates = useMemo(
    () => state.templates.filter((t) => !t.archivedAt),
    [state.templates],
  );

  const projectOwners = useMemo(
    () => state.users.filter((u) => u.role === "project_owner" && (!state2.departmentId || u.departmentId === state2.departmentId)),
    [state.users, state2.departmentId],
  );

  const approvers = useMemo(
    () => state.users.filter((u) => u.role === "approver"),
    [state.users],
  );

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === state2.templateId),
    [templates, state2.templateId],
  );
  const selectedDepartment = useMemo(
    () => departments.find((s) => s.id === state2.departmentId),
    [departments, state2.departmentId],
  );

  if (!user || !canCreateProject(user)) {
    return (
      <Card className="p-6 text-center">
        <div className="text-sm font-medium">Access denied</div>
        <div className="text-xs text-muted-foreground mt-1">Only Company Admin and Department Admin can create projects.</div>
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={onDone}>
            <ArrowLeft className="size-3.5" /> Back
          </Button>
        </div>
      </Card>
    );
  }

  const canAdvance = () => {
    if (stepIndex === 0) return !!state2.departmentId && !!state2.templateId;
    if (stepIndex === 1) return !!state2.name.trim() && !!state2.startDate && !!state2.targetCompletionDate;
    if (stepIndex === 2) return state2.approvedBudget > 0 && !!state2.ownerId && !!state2.approverUserId;
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error("Please complete the required fields before continuing");
      return;
    }
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const handleSubmit = (submitForApproval: boolean) => {
    if (!user || !selectedTemplate || !state2.departmentId || !state2.ownerId || !state2.approverUserId) {
      toast.error("Please complete the wizard");
      return;
    }
    if (state2.targetCompletionDate <= state2.startDate) {
      toast.error("Target date must be after start date");
      return;
    }
    const departmentId = state2.departmentId;
    const ownerId = state2.ownerId;
    const approverUserId = state2.approverUserId;
    setState((s) =>
      createProjectFromTemplate(
        s,
        {
          template: selectedTemplate,
          name: state2.name,
          description: state2.description,
          departmentId,
          ownerId,
          approvedBudget: state2.approvedBudget,
          startDate: state2.startDate,
          targetCompletionDate: state2.targetCompletionDate,
          priority: state2.priority,
          category: state2.category,
          notes: state2.notes,
          submitForApproval,
          approverUserId,
        },
        user,
      ),
    );
    toast.success(submitForApproval ? "Project submitted for approval" : "Project saved as draft", {
      description: `${state2.name} created from ${selectedTemplate.name} (${selectedTemplate.version}).`,
    });
    onDone();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create new project"
        description="Set up a new project step by step. Pick a department, choose a template, fill in the details, and review before saving."
        actions={
          <Button variant="outline" size="sm" onClick={onDone}>
            <ArrowLeft className="size-3.5" /> Back to projects
          </Button>
        }
      />

      <Card className="p-4">
        <ol className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const done = idx < stepIndex;
            const active = idx === stepIndex;
            return (
              <li
                key={step.key}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-sm ring-1 ring-inset",
                  done && "bg-success/5 ring-success/30",
                  active && "bg-primary/5 ring-primary/30",
                  !done && !active && "ring-foreground/10",
                )}
              >
                <div
                  className={cn(
                    "size-7 flex items-center justify-center rounded-sm text-[11px] font-medium",
                    done && "bg-success text-white",
                    active && "bg-primary text-primary-foreground",
                    !done && !active && "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Step {idx + 1}</span>
                  <span className="text-xs font-medium text-foreground">{step.label}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      {stepIndex === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard         title="Choose the department"
        description="Pick which business unit will own this project.">
            <div className="grid grid-cols-1 gap-2">
              {departments.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setWizard((prev) => ({ ...prev, departmentId: s.id, ownerId: undefined }))}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-sm ring-1 ring-inset text-left",
                    state2.departmentId === s.id
                      ? "bg-primary/5 ring-primary/40"
                      : "ring-foreground/10 hover:bg-muted",
                  )}
                >
                  <div className="size-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                    <Folder className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">{s.sector} · {s.code}</div>
                  </div>
                </button>
              ))}
              {departments.length === 0 ? (
                <div className="text-xs text-muted-foreground">No departments available.</div>
              ) : null}
            </div>
          </SectionCard>
          <SectionCard         title="Choose a template"
        description="Templates come with milestones, steps, and approval rules ready to go.">
            <div className="grid grid-cols-1 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setWizard((prev) => ({ ...prev, templateId: t.id, category: t.category }))}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-sm ring-1 ring-inset text-left",
                    state2.templateId === t.id
                      ? "bg-primary/5 ring-primary/40"
                      : "ring-foreground/10 hover:bg-muted",
                  )}
                >
                  <div className="size-9 rounded-sm bg-info/10 text-info flex items-center justify-center">
                    <FileText className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-foreground">{t.name}</div>
                      <StatusBadge tone="primary">{t.version}</StatusBadge>
                    </div>
                    <div className="text-[11px] text-muted-foreground">{t.description}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {t.milestones.length} milestones · {t.milestones.reduce((acc, m) => acc + m.steps.length, 0)} steps
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      ) : null}

      {stepIndex === 1 ? (
        <SectionCard         title="Project details"
        description="The basics that will appear in your project list.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Project name *</Label>
              <Input
                value={state2.name}
                onChange={(e) => setWizard((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. New warehouse network expansion"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                className="h-8 w-full text-xs border border-input bg-card px-2 rounded-none"
                value={state2.category}
                onChange={(e) => setWizard((p) => ({ ...p, category: e.target.value }))}
              >
                {["Infrastructure", "IT", "Facility", "Procurement", "Expansion"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Start date *</Label>
              <Input
                type="date"
                value={state2.startDate}
                onChange={(e) => setWizard((p) => ({ ...p, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>Target completion date *</Label>
              <Input
                type="date"
                value={state2.targetCompletionDate}
                onChange={(e) => setWizard((p) => ({ ...p, targetCompletionDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>Priority</Label>
              <select
                className="h-8 w-full text-xs border border-input bg-card px-2 rounded-none"
                value={state2.priority}
                onChange={(e) => setWizard((p) => ({ ...p, priority: e.target.value as WizardState["priority"] }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <textarea
                rows={3}
                className="w-full text-xs border border-input bg-card px-2 py-1.5 rounded-none"
                value={state2.description}
                onChange={(e) => setWizard((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description visible on the project card and detail page."
              />
            </div>
          </div>
        </SectionCard>
      ) : null}

      {stepIndex === 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard         title="Budget"
        description="Set the approved project budget in IDR billions.">
            <div className="space-y-3">
              <div>
                <Label>Approved budget (Rp billions)</Label>
                <Input
                  type="number"
                  value={state2.approvedBudget}
                  onChange={(e) => setWizard((p) => ({ ...p, approvedBudget: Number(e.target.value) }))}
                />
                <div className="text-[11px] text-muted-foreground mt-1">
                  ~ {formatIDRBillions(state2.approvedBudget)}
                </div>
              </div>
              <div>
                <Label>Department annual allocation</Label>
                <div className="text-sm text-foreground">
                  {formatIDRBillions(selectedDepartment?.annualBudgetAllocation ?? 0)}
                </div>
              </div>
              <ProgressBar
                value={
                  selectedDepartment && selectedDepartment.annualBudgetAllocation > 0
                    ? state2.approvedBudget / selectedDepartment.annualBudgetAllocation
                    : 0
                }
                tone="info"
                label="Utilization of department allocation"
              />
            </div>
          </SectionCard>
          <SectionCard         title="Team"
        description="Choose who owns the project and who will approve it.">
            <div className="space-y-3">
              <div>
                <Label>Project owner *</Label>
                <select
                  className="h-8 w-full text-xs border border-input bg-card px-2 rounded-none"
                  value={state2.ownerId ?? ""}
                  onChange={(e) => setWizard((p) => ({ ...p, ownerId: e.target.value }))}
                >
                  <option value="">Select a project owner</option>
                  {projectOwners.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} · {u.departmentId ? state.departments.find((s) => s.id === u.departmentId)?.code : "—"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Default approver *</Label>
                <select
                  className="h-8 w-full text-xs border border-input bg-card px-2 rounded-none"
                  value={state2.approverUserId ?? ""}
                  onChange={(e) => setWizard((p) => ({ ...p, approverUserId: e.target.value }))}
                >
                  <option value="">Select an approver</option>
                  {approvers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} · {ROLE_LABELS[u.role]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <textarea
                  rows={3}
                  className="w-full text-xs border border-input bg-card px-2 py-1.5 rounded-none"
                  value={state2.notes}
                  onChange={(e) => setWizard((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Optional notes for the approver or future reference."
                />
              </div>
            </div>
          </SectionCard>
        </div>
      ) : null}

      {stepIndex === 3 ? (
        <SectionCard         title="Milestones and steps"
        description="These come from the template. You can change dates and assignees after the project is created.">
          {!selectedTemplate ? (
            <div className="text-xs text-muted-foreground">Select a template to see milestones.</div>
          ) : (
            <div className="space-y-3">
              {selectedTemplate.milestones.map((m, idx) => (
                <Card key={m.id} className="ring-1 ring-inset ring-foreground/10">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        Order {m.order} · {m.estimatedDurationDays} days
                        {m.approvalRequired ? " · approval required" : ""}
                        {m.budgetCheckpoint ? " · budget checkpoint" : ""}
                      </div>
                    </div>
                    <StatusBadge tone="info">{m.steps.length} steps</StatusBadge>
                  </div>
                  <div className="px-4 pb-3 space-y-1">
                    {m.steps.map((s) => (
                      <div key={s.id} className="text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="size-1 rounded-full bg-muted-foreground" />
                          {s.name}
                        </div>
                        {s.requiredAttachmentNames && s.requiredAttachmentNames.length > 0 ? (
                          <div className="ml-3 flex flex-wrap items-center gap-1.5">
                            <Paperclip className="size-3" />
                            <span className="text-[10px] uppercase tracking-wide">
                              Required:
                            </span>
                            {s.requiredAttachmentNames.map((name) => (
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
                    {m.steps.length === 0 ? (
                      <div className="text-[11px] text-muted-foreground">No steps.</div>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </SectionCard>
      ) : null}

      {stepIndex === 4 ? (
        <SectionCard         title="Review"
        description="Check the project details before saving.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-muted-foreground">Department</div>
              <div className="text-foreground font-medium">{selectedDepartment?.name ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Template</div>
              <div className="text-foreground font-medium">{selectedTemplate?.name ?? "—"} ({selectedTemplate?.version})</div>
            </div>
            <div>
              <div className="text-muted-foreground">Project name</div>
              <div className="text-foreground font-medium">{state2.name || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Category / Priority</div>
              <div className="text-foreground font-medium">{state2.category} · {state2.priority}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Timeline</div>
              <div className="text-foreground font-medium">{state2.startDate} → {state2.targetCompletionDate}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Approved budget</div>
              <div className="text-foreground font-medium">{formatIDRBillions(state2.approvedBudget)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Project owner</div>
              <div className="text-foreground font-medium">{state.users.find((u) => u.id === state2.ownerId)?.name ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Approver</div>
              <div className="text-foreground font-medium">{state.users.find((u) => u.id === state2.approverUserId)?.name ?? "—"}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Checkbox
              checked={state2.submitForApproval}
              onCheckedChange={(checked) => setWizard((p) => ({ ...p, submitForApproval: !!checked }))}
            />
            <span className="text-xs text-muted-foreground">Submit for approval upon creation (otherwise saves as draft)</span>
          </div>
        </SectionCard>
      ) : null}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
        >
          <ArrowLeft className="size-3.5" /> Back
        </Button>
        {stepIndex < STEPS.length - 1 ? (
          <Button size="sm" onClick={handleNext}>
            Next <ArrowRight className="size-3.5" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSubmit(false)}>
              Save as draft
            </Button>
            <Button size="sm" onClick={() => handleSubmit(true)}>
              Submit for approval
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
