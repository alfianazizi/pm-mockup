import type {
  ActivityLogEntry,
  AppState,
  ApprovalRequest,
  ApprovalStatus,
  AttachmentMetadata,
  DemoUser,
  MilestoneWorkStatus,
  Project,
  ProjectMilestone,
  ProjectTemplate,
  ProjectStep,
  TemplateMilestone,
  TemplateStep,
} from "./domain";
import { seedState } from "../data/seed";
import { saveState } from "./storage";

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

function appendLog(project: Project, entry: Omit<ActivityLogEntry, "id">): Project {
  const logEntry: ActivityLogEntry = { id: newId("act"), ...entry };
  return { ...project, activityLog: [logEntry, ...project.activityLog] };
}

function commit(state: AppState, mutate: (s: AppState) => AppState): AppState {
  const next = mutate(state);
  saveState(next);
  return next;
}

function setField<K extends keyof AppState>(state: AppState, key: K, value: AppState[K]): AppState {
  return commit(state, (s) => ({ ...s, [key]: value }));
}

export function login(state: AppState, userId: string): AppState {
  return setField(state, "currentUserId", userId);
}

export function logout(state: AppState): AppState {
  return setField(state, "currentUserId", undefined);
}

export function setGlobalDepartment(state: AppState, departmentId: string | undefined): AppState {
  return setField(state, "globalDepartmentId", departmentId);
}

export function setGlobalPeriod(
  state: AppState,
  period: "quarterly" | "semesterly" | "annually",
  year: number,
  quarter?: AppState["globalQuarter"],
  semester?: AppState["globalSemester"],
): AppState {
  return commit(state, (s) => ({
    ...s,
    globalPeriod: period,
    globalYear: year,
    globalQuarter: quarter,
    globalSemester: semester,
  }));
}

export function createProjectFromTemplate(
  state: AppState,
  params: {
    template: ProjectTemplate;
    name: string;
    description: string;
    departmentId: string;
    ownerId: string;
    approvedBudget: number;
    startDate: string;
    targetCompletionDate: string;
    priority: Project["priority"];
    category: string;
    submitForApproval: boolean;
    notes?: string;
    approverUserId: string;
  },
  currentUser: DemoUser,
): AppState {
  const projectId = newId("p");
  const milestones: ProjectMilestone[] = params.template.milestones.map((tm) =>
    snapshotMilestone(tm, projectId, params.startDate),
  );
  const project: Project = {
    id: projectId,
    name: params.name,
    description: params.description,
    departmentId: params.departmentId,
    templateId: params.template.id,
    templateName: params.template.name,
    templateVersion: params.template.version,
    ownerId: params.ownerId,
    category: params.category,
    approvedBudget: params.approvedBudget,
    committedCost: 0,
    actualSpending: 0,
    status: params.submitForApproval ? "waiting_approval" : "draft",
    startDate: params.startDate,
    targetCompletionDate: params.targetCompletionDate,
    priority: params.priority,
    notes: params.notes ?? "",
    milestones,
    spending: [],
    attachments: [
      {
        id: newId("att"),
        fileName: "Project Charter.pdf",
        fileType: "PDF",
        uploadedBy: currentUser.id,
        relatedType: "project",
        relatedId: projectId,
        uploadedAt: new Date().toISOString(),
        status: "verified",
      },
    ],
    activityLog: [
      {
        id: newId("act"),
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        action: "Project created",
        description: `Project created from template ${params.template.name} (${params.template.version}).`,
      },
    ],
  };
  return commit(state, (s) => ({
    ...s,
    projects: [project, ...s.projects],
    approvals: params.submitForApproval
      ? [
          {
            id: newId("apr"),
            type: "project_approval",
            projectId: project.id,
            departmentId: project.departmentId,
            requestedBy: currentUser.id,
            approverUserId: params.approverUserId,
            status: "pending",
            submittedAt: new Date().toISOString(),
            priority: project.priority,
          },
          ...s.approvals,
        ]
      : s.approvals,
  }));
}

function snapshotMilestone(templateMilestone: TemplateMilestone, projectId: string, startDate: string): ProjectMilestone {
  const start = new Date(startDate);
  const plannedStart = new Date(start.getTime() + (templateMilestone.order - 1) * 30 * 86400000);
  const plannedEnd = new Date(plannedStart.getTime() + templateMilestone.estimatedDurationDays * 86400000);
  return {
    id: newId("m"),
    templateMilestoneId: templateMilestone.id,
    name: templateMilestone.name,
    description: templateMilestone.description,
    order: templateMilestone.order,
    plannedStart: plannedStart.toISOString().slice(0, 10),
    plannedEnd: plannedEnd.toISOString().slice(0, 10),
    status: "not_started",
    approvalStatus: "pending",
    budgetCheckpoint: templateMilestone.budgetCheckpoint,
    completionCriteria: templateMilestone.completionCriteria,
    steps: templateMilestone.steps.map((ts) => snapshotStep(ts, plannedStart)),
  };
}

function snapshotStep(templateStep: TemplateStep, plannedStart: Date): ProjectStep {
  const due = new Date(plannedStart.getTime() + (templateStep.dueOffsetDays ?? 0) * 86400000);
  return {
    id: newId("s"),
    templateStepId: templateStep.id,
    name: templateStep.name,
    description: templateStep.description,
    assignedRole: templateStep.assignedRole,
    dueDate: due.toISOString().slice(0, 10),
    completed: false,
    requiredAttachmentNames: templateStep.requiredAttachmentNames ?? [],
  };
}

export function submitProjectForApproval(state: AppState, projectId: string, currentUser: DemoUser, approverUserId: string): AppState {
  return commit(state, (s) => ({
    ...s,
    projects: s.projects.map((p) =>
      p.id === projectId
        ? appendLog({ ...p, status: "waiting_approval" }, {
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            action: "Submitted for approval",
            description: "Project submitted to approver for activation.",
          })
        : p,
    ),
    approvals: [
      {
        id: newId("apr"),
        type: "project_approval",
        projectId,
        departmentId: s.projects.find((p) => p.id === projectId)?.departmentId ?? "",
        requestedBy: currentUser.id,
        approverUserId,
        status: "pending",
        submittedAt: new Date().toISOString(),
        priority: s.projects.find((p) => p.id === projectId)?.priority ?? "medium",
      },
      ...s.approvals,
    ],
  }));
}

export function decideProjectApproval(
  state: AppState,
  approvalId: string,
  decision: ApprovalStatus,
  comment: string,
  currentUser: DemoUser,
): AppState {
  const approval = state.approvals.find((a) => a.id === approvalId);
  if (!approval) return state;
  return commit(state, (s) => ({
    ...s,
    approvals: s.approvals.map((a) =>
      a.id === approvalId
        ? { ...a, status: decision, decisionAt: new Date().toISOString(), decisionComment: comment }
        : a,
    ),
    projects: s.projects.map((p) => {
      if (p.id !== approval.projectId) return p;
      let nextStatus = p.status;
      if (decision === "approved") nextStatus = "active";
      if (decision === "rejected" || decision === "revision_required") nextStatus = "draft";
      return appendLog({ ...p, status: nextStatus }, {
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        action: `Project approval ${decision}`,
        description: comment || "Project approval decision recorded.",
      });
    }),
  }));
}

export function submitMilestoneForApproval(
  state: AppState,
  projectId: string,
  milestoneId: string,
  currentUser: DemoUser,
  approverUserId: string,
): AppState {
  return commit(state, (s) => ({
    ...s,
    projects: s.projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            milestones: p.milestones.map((m) =>
              m.id === milestoneId
                ? {
                    ...m,
                    status: "submitted" as MilestoneWorkStatus,
                    approvalStatus: "pending" as ApprovalStatus,
                    approvalRequestId: newId("apr"),
                  }
                : m,
            ),
          }
        : p,
    ),
    approvals: [
      {
        id: newId("apr"),
        type: "milestone_approval",
        projectId,
        departmentId: s.projects.find((p) => p.id === projectId)?.departmentId ?? "",
        milestoneId,
        requestedBy: currentUser.id,
        approverUserId,
        status: "pending",
        submittedAt: new Date().toISOString(),
        priority: s.projects.find((p) => p.id === projectId)?.priority ?? "medium",
      },
      ...s.approvals,
    ],
  }));
}

export function decideMilestoneApproval(
  state: AppState,
  approvalId: string,
  decision: ApprovalStatus,
  comment: string,
  currentUser: DemoUser,
): AppState {
  const approval = state.approvals.find((a) => a.id === approvalId);
  if (!approval || !approval.milestoneId) return state;
  return commit(state, (s) => ({
    ...s,
    approvals: s.approvals.map((a) =>
      a.id === approvalId
        ? { ...a, status: decision, decisionAt: new Date().toISOString(), decisionComment: comment }
        : a,
    ),
    projects: s.projects.map((p) => {
      if (p.id !== approval.projectId) return p;
      return appendLog(
        {
          ...p,
          milestones: p.milestones.map((m) => {
            if (m.id !== approval.milestoneId) return m;
            const nextStatus: MilestoneWorkStatus =
              decision === "approved" ? "completed" : decision === "revision_required" ? "in_progress" : "submitted";
            return { ...m, status: nextStatus, approvalStatus: decision };
          }),
        },
        {
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          action: `Milestone approval ${decision}`,
          description: comment || "Milestone approval decision recorded.",
        },
      );
    }),
  }));
}

export function updateStepCompletion(
  state: AppState,
  projectId: string,
  milestoneId: string,
  stepId: string,
  completed: boolean,
  currentUser: DemoUser,
): AppState {
  return commit(state, (s) => ({
    ...s,
    projects: s.projects.map((p) => {
      if (p.id !== projectId) return p;
      return appendLog(
        {
          ...p,
          milestones: p.milestones.map((m) => {
            if (m.id !== milestoneId) return m;
            const steps = m.steps.map((step) => (step.id === stepId ? { ...step, completed } : step));
            const anyInProgress = steps.some((s) => s.completed);
            const allDone = steps.length > 0 && steps.every((s) => s.completed);
            const nextStatus: MilestoneWorkStatus = m.status === "completed"
              ? m.status
              : allDone
                ? "completed"
                : anyInProgress
                  ? "in_progress"
                  : m.status;
            return { ...m, steps, status: nextStatus };
          }),
        },
        {
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          action: completed ? "Step completed" : "Step reopened",
          description: `Step ${stepId} marked ${completed ? "completed" : "incomplete"}.`,
        },
      );
    }),
  }));
}

export function addAttachment(
  state: AppState,
  projectId: string,
  attachment: Omit<AttachmentMetadata, "id" | "uploadedAt">,
  currentUser: DemoUser,
): AppState {
  const record: AttachmentMetadata = {
    ...attachment,
    id: newId("att"),
    uploadedAt: new Date().toISOString(),
    uploadedBy: currentUser.id,
  };
  return commit(state, (s) => ({
    ...s,
    projects: s.projects.map((p) =>
      p.id === projectId
        ? appendLog({ ...p, attachments: [record, ...p.attachments] }, {
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            action: "Attachment uploaded",
            description: `${record.fileName} (${record.fileType}) uploaded.`,
          })
        : p,
    ),
  }));
}

export function removeAttachment(state: AppState, projectId: string, attachmentId: string, currentUser: DemoUser): AppState {
  return commit(state, (s) => ({
    ...s,
    projects: s.projects.map((p) =>
      p.id === projectId
        ? appendLog({ ...p, attachments: p.attachments.filter((a) => a.id !== attachmentId) }, {
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            action: "Attachment removed",
            description: `Attachment ${attachmentId} removed.`,
          })
        : p,
    ),
  }));
}

export function archiveProject(state: AppState, projectId: string, currentUser: DemoUser): AppState {
  return commit(state, (s) => ({
    ...s,
    projects: s.projects.map((p) =>
      p.id === projectId
        ? appendLog({ ...p, archivedAt: new Date().toISOString() }, {
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            action: "Project archived",
            description: "Project archived.",
          })
        : p,
    ),
  }));
}

export function archiveDepartment(state: AppState, departmentId: string, currentUser: DemoUser): AppState {
  return commit(state, (s) => ({
    ...s,
    departments: s.departments.map((department) =>
      department.id === departmentId ? { ...department, archivedAt: new Date().toISOString() } : department,
    ),
    users: s.users.map((u) =>
      u.departmentId === departmentId ? u : u,
    ),
  }));
}

export function archiveTemplate(state: AppState, templateId: string, currentUser: DemoUser): AppState {
  return commit(state, (s) => ({
    ...s,
    templates: s.templates.map((t) =>
      t.id === templateId
        ? { ...t, archivedAt: new Date().toISOString(), status: "archived" as const }
        : t,
    ),
  }));
}

export function saveTemplate(state: AppState, template: ProjectTemplate, currentUser: DemoUser): AppState {
  return commit(state, (s) => {
    const existing = s.templates.find((t) => t.id === template.id);
    if (existing) {
      return {
        ...s,
        templates: s.templates.map((t) =>
          t.id === template.id
            ? { ...template, lastUpdated: new Date().toISOString().slice(0, 10) }
            : t,
        ),
        projects: s.projects.map((p) =>
          p.templateId === template.id
            ? appendLog(p, {
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                action: "Template updated",
                description: `Source template ${template.name} updated; project snapshot retained.`,
              })
            : p,
        ),
      };
    }
    return {
      ...s,
      templates: [
        { ...template, createdBy: currentUser.id, lastUpdated: new Date().toISOString().slice(0, 10) },
        ...s.templates,
      ],
    };
  });
}

export function resetDemoData(): AppState {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("pmm.appState.v1");
  }
  return { ...seedState };
}
