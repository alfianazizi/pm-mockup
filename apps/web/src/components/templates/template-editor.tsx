import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Checkbox } from "@project-management-mockup/ui/components/checkbox";
import { Input } from "@project-management-mockup/ui/components/input";
import { Label } from "@project-management-mockup/ui/components/label";
import { cn } from "@project-management-mockup/ui/lib/utils";

import { Card } from "@project-management-mockup/ui/components/card";

import { useAppState } from "@/lib/app-state";
import { saveTemplate } from "@/lib/actions";
import {
  PROJECT_CATEGORIES,
  type ProjectTemplate,
  type TemplateMilestone,
  type TemplateStep,
} from "@/lib/domain";
import { canEditTemplateLibrary } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/selectors";
import { toast } from "sonner";

const APPROVER_ROLES = [
  "holding_admin",
  "subholding_admin",
  "project_owner",
  "approver",
];

const APPROVER_LABELS: Record<string, string> = {
  holding_admin: "Holding Admin",
  subholding_admin: "Subholding Admin",
  project_owner: "Project Owner",
  approver: "Approver",
};

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

function blankTemplate(): ProjectTemplate {
  return {
    id: newId("tpl"),
    name: "",
    category: PROJECT_CATEGORIES[0],
    description: "",
    version: "v0.1",
    defaultApproverRole: "subholding_admin",
    requiredAttachments: [],
    riskChecklist: [],
    status: "active",
    createdBy: "",
    lastUpdated: new Date().toISOString().slice(0, 10),
    milestones: [],
  };
}

export function TemplateEditor({ templateId, onDone }: { templateId?: string; onDone: () => void }) {
  const { state, setState } = useAppState();
  const user = getCurrentUser(state);
  const [template, setTemplate] = useState<ProjectTemplate>(() => {
    if (templateId) {
      const existing = state.templates.find((t) => t.id === templateId);
      if (existing) return { ...existing, milestones: existing.milestones.map((m) => ({ ...m, steps: [...m.steps] })) };
    }
    return blankTemplate();
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [attachmentInput, setAttachmentInput] = useState("");
  const [riskInput, setRiskInput] = useState("");

  const canEdit = canEditTemplateLibrary(user);

  useEffect(() => {
    if (templateId) {
      const existing = state.templates.find((t) => t.id === templateId);
      if (existing && existing.id !== template.id) {
        setTemplate({ ...existing, milestones: existing.milestones.map((m) => ({ ...m, steps: [...m.steps] })) });
      }
    }
  }, [templateId, state.templates, template.id]);

  const totalSteps = useMemo(
    () => template.milestones.reduce((acc, m) => acc + m.steps.length, 0),
    [template.milestones],
  );

  const updateTemplate = (patch: Partial<ProjectTemplate>) => {
    setTemplate((prev) => ({ ...prev, ...patch }));
  };

  const updateMilestone = (id: string, patch: Partial<TemplateMilestone>) => {
    setTemplate((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  };

  const updateStep = (milestoneId: string, stepId: string, patch: Partial<TemplateStep>) => {
    setTemplate((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestoneId
          ? { ...m, steps: m.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)) }
          : m,
      ),
    }));
  };

  const addMilestone = () => {
    const id = newId("tm");
    setTemplate((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id,
          name: `New milestone ${prev.milestones.length + 1}`,
          order: prev.milestones.length + 1,
          estimatedDurationDays: 30,
          steps: [],
          approvalRequired: false,
          budgetCheckpoint: false,
        },
      ],
    }));
    setExpanded((prev) => ({ ...prev, [id]: true }));
  };

  const addStep = (milestoneId: string) => {
    const id = newId("ts");
    setTemplate((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              steps: [
                ...m.steps,
                { id, name: `Step ${m.steps.length + 1}`, requiredAttachment: false, dependsOnPrevious: m.steps.length > 0, dueOffsetDays: 7 },
              ],
            }
          : m,
      ),
    }));
  };

  const removeMilestone = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      milestones: prev.milestones
        .filter((m) => m.id !== id)
        .map((m, idx) => ({ ...m, order: idx + 1 })),
    }));
  };

  const removeStep = (milestoneId: string, stepId: string) => {
    setTemplate((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, steps: m.steps.filter((s) => s.id !== stepId) } : m,
      ),
    }));
  };

  const handleSave = () => {
    if (!user) return;
    if (!template.name.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (!canEdit) {
      toast.error("Only Holding Admin can edit templates");
      return;
    }
    const next: ProjectTemplate = {
      ...template,
      version: templateId ? bumpVersion(template.version) : template.version || "v0.1",
    };
    setState((s) => saveTemplate(s, next, user));
    toast.success("Template saved");
    onDone();
  };

  if (!canEdit) {
    return (
      <Card className="p-6 text-center">
        <div className="text-sm font-medium">Access denied</div>
        <div className="text-xs text-muted-foreground mt-1">Only Holding Admin can edit Project Templates.</div>
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={onDone}>
            <ArrowLeft className="size-3.5" /> Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {templateId ? "Edit template" : "New template"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Add milestones, steps, approval rules, and other details. Projects you create from this
            template will keep their own copy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onDone}>
            <ArrowLeft className="size-3.5" /> Back
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="size-3.5" /> Save template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Template name</Label>
              <Input
                id="name"
                value={template.name}
                onChange={(e) => updateTemplate({ name: e.target.value })}
                placeholder="e.g. Infrastructure Development Project"
              />
            </div>
            <div>
              <Label htmlFor="category">Project category</Label>
              <select
                id="category"
                className="h-8 w-full text-xs border border-input bg-card px-2 rounded-none"
                value={template.category}
                onChange={(e) => updateTemplate({ category: e.target.value })}
              >
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={template.version}
                onChange={(e) => updateTemplate({ version: e.target.value })}
                placeholder="v1.0"
              />
            </div>
            <div>
              <Label htmlFor="defaultApprover">Default project approver role</Label>
              <select
                id="defaultApprover"
                className="h-8 w-full text-xs border border-input bg-card px-2 rounded-none"
                value={template.defaultApproverRole}
                onChange={(e) => updateTemplate({ defaultApproverRole: e.target.value })}
              >
                {APPROVER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {APPROVER_LABELS[r] ?? r}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                className="w-full text-xs border border-input bg-card px-2 py-1.5 rounded-none"
                value={template.description}
                onChange={(e) => updateTemplate({ description: e.target.value })}
                placeholder="Describe the purpose of this template..."
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="completion">Completion criteria</Label>
              <textarea
                id="completion"
                rows={2}
                className="w-full text-xs border border-input bg-card px-2 py-1.5 rounded-none"
                value={template.completionCriteria ?? ""}
                onChange={(e) => updateTemplate({ completionCriteria: e.target.value })}
                placeholder="Overall completion criteria for projects using this template."
              />
            </div>
          </div>
        </Card>
        <Card className="p-4 space-y-3">
          <div>
            <Label>Required attachments</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {template.requiredAttachments.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateTemplate({ requiredAttachments: template.requiredAttachments.filter((x) => x !== a) })}
                  className="text-[11px] bg-muted text-foreground px-2 py-1 rounded-sm"
                >
                  {a} ×
                </button>
              ))}
            </div>
            <div className="mt-1 flex gap-1">
              <Input
                value={attachmentInput}
                onChange={(e) => setAttachmentInput(e.target.value)}
                placeholder="Add attachment name"
                className="h-7 text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (attachmentInput.trim()) {
                    updateTemplate({ requiredAttachments: [...template.requiredAttachments, attachmentInput.trim()] });
                    setAttachmentInput("");
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
          <div>
            <Label>Risk checklist</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {template.riskChecklist.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => updateTemplate({ riskChecklist: template.riskChecklist.filter((x) => x !== r) })}
                  className="text-[11px] bg-warning/10 text-warning px-2 py-1 rounded-sm"
                >
                  {r} ×
                </button>
              ))}
            </div>
            <div className="mt-1 flex gap-1">
              <Input
                value={riskInput}
                onChange={(e) => setRiskInput(e.target.value)}
                placeholder="Add risk item"
                className="h-7 text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (riskInput.trim()) {
                    updateTemplate({ riskChecklist: [...template.riskChecklist, riskInput.trim()] });
                    setRiskInput("");
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Milestones</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {template.milestones.length} milestones · {totalSteps} steps
            </p>
          </div>
          <Button size="sm" onClick={addMilestone}>
            <Plus className="size-3.5" /> Add milestone
          </Button>
        </div>

        <div className="mt-3 space-y-2">
          {template.milestones.length === 0 ? (
            <div className="text-xs text-muted-foreground border border-dashed border-border p-4 text-center">
              No milestones yet. Add a milestone to start the structure.
            </div>
          ) : (
            template.milestones.map((milestone) => {
              const isOpen = expanded[milestone.id] ?? true;
              return (
                <Card key={milestone.id} className="ring-1 ring-inset ring-foreground/10">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setExpanded((prev) => ({ ...prev, [milestone.id]: !isOpen }))}
                      aria-label="Toggle milestone"
                    >
                      {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                    </button>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div>
                        <Label className="text-[10px] uppercase tracking-wide">Milestone</Label>
                        <Input
                          className="h-7 text-xs"
                          value={milestone.name}
                          onChange={(e) => updateMilestone(milestone.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase tracking-wide">Order</Label>
                        <Input
                          type="number"
                          className="h-7 text-xs"
                          value={milestone.order}
                          onChange={(e) => updateMilestone(milestone.id, { order: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase tracking-wide">Duration (days)</Label>
                        <Input
                          type="number"
                          className="h-7 text-xs"
                          value={milestone.estimatedDurationDays}
                          onChange={(e) => updateMilestone(milestone.id, { estimatedDurationDays: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase tracking-wide">Approval</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox
                            checked={milestone.approvalRequired}
                            onCheckedChange={(checked) => updateMilestone(milestone.id, { approvalRequired: !!checked })}
                          />
                          <span className="text-[11px] text-muted-foreground">Required</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(milestone.id)}
                      aria-label="Remove milestone"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  {isOpen ? (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Description</Label>
                          <textarea
                            className="w-full text-xs border border-input bg-card px-2 py-1.5 rounded-none"
                            rows={2}
                            value={milestone.description ?? ""}
                            onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Completion criteria</Label>
                          <textarea
                            className="w-full text-xs border border-input bg-card px-2 py-1.5 rounded-none"
                            rows={2}
                            value={milestone.completionCriteria ?? ""}
                            onChange={(e) => updateMilestone(milestone.id, { completionCriteria: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Approval role</Label>
                          <select
                            className="h-8 w-full text-xs border border-input bg-card px-2 rounded-none"
                            value={milestone.approvalRole ?? "subholding_admin"}
                            onChange={(e) => updateMilestone(milestone.id, { approvalRole: e.target.value })}
                          >
                            {APPROVER_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {APPROVER_LABELS[r] ?? r}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                          <Checkbox
                            checked={milestone.budgetCheckpoint}
                            onCheckedChange={(checked) => updateMilestone(milestone.id, { budgetCheckpoint: !!checked })}
                          />
                          <span className="text-xs text-muted-foreground">Budget checkpoint at this milestone</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-foreground">Steps</h3>
                        <Button size="sm" variant="outline" onClick={() => addStep(milestone.id)}>
                          <Plus className="size-3.5" /> Add step
                        </Button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {milestone.steps.length === 0 ? (
                          <div className="text-xs text-muted-foreground border border-dashed border-border p-2 text-center">
                            No steps in this milestone.
                          </div>
                        ) : (
                          milestone.steps.map((step) => (
                            <div
                              key={step.id}
                              className={cn(
                                "grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-2 rounded-sm ring-1 ring-inset ring-foreground/10 bg-muted/30",
                              )}
                            >
                              <Input
                                className="h-7 text-xs"
                                value={step.name}
                                onChange={(e) => updateStep(milestone.id, step.id, { name: e.target.value })}
                                placeholder="Step name"
                              />
                              <Input
                                className="h-7 text-xs"
                                value={step.assignedRole ?? ""}
                                onChange={(e) => updateStep(milestone.id, step.id, { assignedRole: e.target.value })}
                                placeholder="Assigned role"
                              />
                              <Input
                                type="number"
                                className="h-7 text-xs"
                                value={step.dueOffsetDays ?? 0}
                                onChange={(e) => updateStep(milestone.id, step.id, { dueOffsetDays: Number(e.target.value) })}
                                placeholder="Due offset (days)"
                              />
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={!!step.requiredAttachment}
                                  onCheckedChange={(checked) =>
                                    updateStep(milestone.id, step.id, { requiredAttachment: !!checked })
                                  }
                                />
                                <span className="text-[11px] text-muted-foreground">Required attachment</span>
                              </div>
                              <div className="flex items-center justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeStep(milestone.id, step.id)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : null}
                </Card>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

function bumpVersion(version: string): string {
  const match = version.match(/^v(\d+)\.(\d+)$/);
  if (!match) return "v1.0";
  return `v${match[1]}.${Number(match[2]) + 1}`;
}
