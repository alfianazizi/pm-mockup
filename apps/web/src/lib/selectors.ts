import type {
  ApprovalRequest,
  ApprovalStatus,
  BudgetStatus,
  DemoUser,
  Project,
  ProjectMilestone,
  Quarter,
  RiskLevel,
  Semester,
  SpendingRecord,
  Department,
} from "./domain";
import { isCompanyWide } from "./permissions";

export function getCurrentUser(state: { users: DemoUser[]; currentUserId?: string }): DemoUser | undefined {
  if (!state.currentUserId) return undefined;
  return state.users.find((u) => u.id === state.currentUserId);
}

export function visibleDepartments(state: {
  departments: Department[];
  users: DemoUser[];
  currentUserId?: string;
}): Department[] {
  const user = getCurrentUser(state);
  if (!user) return [];
  const active = state.departments.filter((s) => !s.archivedAt);
  if (isCompanyWide(user)) return active;
  if (user.departmentId) return active.filter((s) => s.id === user.departmentId);
  return active;
}

export function scopedProjects(state: {
  projects: Project[];
  departments: Department[];
  users: DemoUser[];
  currentUserId?: string;
  globalDepartmentId?: string;
}): Project[] {
  const user = getCurrentUser(state);
  if (!user) return [];
  const all = state.projects.filter((p) => !p.archivedAt);
  const byDepartment = state.globalDepartmentId
    ? all.filter((p) => p.departmentId === state.globalDepartmentId)
    : all;
  if (user.role === "company_admin" || user.role === "company_executive" || user.role === "finance_controller") {
    return byDepartment;
  }
  if (user.role === "department_admin") {
    return byDepartment.filter((p) => p.departmentId === user.departmentId);
  }
  if (user.role === "project_owner" || user.role === "viewer") {
    return byDepartment.filter((p) => user.projectIds?.includes(p.id));
  }
  if (user.role === "approver") {
    const projectIds = new Set(
      state.projects
        .filter((p) => p.ownerId === user.id)
        .map((p) => p.id),
    );
    return byDepartment.filter((p) => projectIds.has(p.id));
  }
  return byDepartment;
}

export function scopedApprovals(state: {
  approvals: ApprovalRequest[];
  users: DemoUser[];
  currentUserId?: string;
}): ApprovalRequest[] {
  const user = getCurrentUser(state);
  if (!user) return [];
  if (user.role === "company_admin" || user.role === "company_executive" || user.role === "finance_controller") {
    return state.approvals;
  }
  if (user.role === "approver") {
    return state.approvals.filter((a) => a.approverUserId === user.id);
  }
  if (user.role === "department_admin") {
    return state.approvals.filter((a) => a.departmentId === user.departmentId);
  }
  if (user.role === "project_owner") {
    return state.approvals.filter((a) => a.requestedBy === user.id);
  }
  return state.approvals.filter((a) => a.approverUserId === user.id || a.requestedBy === user.id);
}

export function visibleTemplates<T extends { archivedAt?: string }>(state: { templates: T[] }): T[] {
  return state.templates.filter((t) => !t.archivedAt);
}

export function computeMilestoneProgress(milestone: ProjectMilestone): number {
  if (milestone.steps.length === 0) {
    if (milestone.status === "completed") return 1;
    if (milestone.status === "in_progress") return 0.5;
    if (milestone.status === "submitted") return 0.9;
    return 0;
  }
  const done = milestone.steps.filter((s) => s.completed).length;
  return done / milestone.steps.length;
}

export function computeProjectProgress(project: Project): number {
  if (project.milestones.length === 0) return 0;
  const total = project.milestones.reduce((acc, m) => acc + computeMilestoneProgress(m), 0);
  return total / project.milestones.length;
}

export function computeBudgetStatus(project: Project): BudgetStatus {
  if (project.approvedBudget <= 0) return "normal";
  const ratio = project.actualSpending / project.approvedBudget;
  if (ratio > 1) return "over_budget";
  if (ratio >= 0.8) return "near_limit";
  return "normal";
}

export function computeRiskLevel(project: Project): RiskLevel {
  if (project.riskOverride) return project.riskOverride;
  let score = 0;
  if (project.status === "delayed") score += 2;
  if (computeBudgetStatus(project) === "over_budget") score += 2;
  if (computeBudgetStatus(project) === "near_limit") score += 1;
  const delayedMilestones = project.milestones.filter((m) => m.status === "delayed").length;
  score += delayedMilestones;
  const progress = computeProjectProgress(project);
  if (progress < 0.3 && new Date(project.targetCompletionDate).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 60) {
    score += 1;
  }
  if (score >= 4) return "critical";
  if (score >= 3) return "high";
  if (score >= 1) return "medium";
  return "low";
}

export function approvalTone(status: ApprovalStatus): "warning" | "success" | "danger" | "info" {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "revision_required":
      return "info";
    default:
      return "warning";
  }
}

export function totalBudgetAllocation(departments: Department[]): number {
  return departments.reduce((acc, s) => acc + s.annualBudgetAllocation, 0);
}

export function totalSpending(projects: Project[]): number {
  return projects.reduce((acc, p) => acc + p.actualSpending, 0);
}

export function totalCommittedCost(projects: Project[]): number {
  return projects.reduce((acc, p) => acc + p.committedCost, 0);
}

export function departmentPerformance(department: Department, projects: Project[]) {
  const subs = projects.filter((p) => p.departmentId === department.id);
  const approved = subs.reduce((acc, p) => acc + p.approvedBudget, 0);
  const spending = subs.reduce((acc, p) => acc + p.actualSpending, 0);
  const committed = subs.reduce((acc, p) => acc + p.committedCost, 0);
  const active = subs.filter((p) => p.status === "active").length;
  const delayed = subs.filter((p) => p.status === "delayed").length;
  const completed = subs.filter((p) => p.status === "completed").length;
  const awaiting = subs.filter((p) => p.status === "waiting_approval").length;
  return {
    department,
    projects: subs,
    approved,
    spending,
    committed,
    active,
    delayed,
    completed,
    awaiting,
    utilization: approved > 0 ? spending / approved : 0,
  };
}

export function inPeriod(project: Project, year: number, period: "quarterly" | "semesterly" | "annually", q?: Quarter, s?: Semester): boolean {
  const start = new Date(project.startDate);
  if (start.getFullYear() !== year && new Date(project.targetCompletionDate).getFullYear() !== year) {
    return year === start.getFullYear();
  }
  if (period === "annually") return true;
  if (period === "quarterly" && q) {
    const month = start.getMonth() + 1;
    const projectQuarter = `Q${Math.ceil(month / 3)}` as Quarter;
    return projectQuarter === q;
  }
  if (period === "semesterly" && s) {
    const month = start.getMonth() + 1;
    const projectSemester = month <= 6 ? "S1" : "S2";
    return projectSemester === s;
  }
  return true;
}

export function upcomingMilestones(projects: Project[], limit = 5): Array<{ project: Project; milestone: ProjectMilestone }> {
  const today = Date.now();
  const items = projects
    .flatMap((p) => p.milestones.map((m) => ({ project: p, milestone: m })))
    .filter((entry) => entry.milestone.status !== "completed" && entry.milestone.status !== "delayed")
    .sort((a, b) => new Date(a.milestone.plannedEnd).getTime() - new Date(b.milestone.plannedEnd).getTime());
  return items.filter((i) => new Date(i.milestone.plannedEnd).getTime() >= today - 7 * 86400000).slice(0, limit);
}

export function pendingApprovalsForQueue(approvals: ApprovalRequest[]): ApprovalRequest[] {
  return approvals
    .filter((a) => a.status === "pending")
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
}

export function totalSpendingByCategory(projects: Project[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const project of projects) {
    for (const record of project.spending) {
      const key = record.category;
      out[key] = (out[key] ?? 0) + record.amount;
    }
  }
  return out;
}

export function spendingRecords(projects: Project[]): SpendingRecord[] {
  return projects.flatMap((p) => p.spending);
}
