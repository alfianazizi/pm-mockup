export type Role =
  | "company_admin"
  | "company_executive"
  | "finance_controller"
  | "department_admin"
  | "project_owner"
  | "approver"
  | "viewer";

export const ROLE_LABELS: Record<Role, string> = {
  company_admin: "Company Admin",
  company_executive: "Company Executive",
  finance_controller: "Finance Controller",
  department_admin: "Department Admin",
  project_owner: "Project Owner",
  approver: "Approver",
  viewer: "Viewer",
};

export type ProjectLifecycleStatus =
  | "draft"
  | "waiting_approval"
  | "active"
  | "on_hold"
  | "delayed"
  | "completed"
  | "cancelled";

export const PROJECT_LIFECYCLE_LABELS: Record<ProjectLifecycleStatus, string> = {
  draft: "Draft",
  waiting_approval: "Waiting Approval",
  active: "Active",
  on_hold: "On Hold",
  delayed: "Delayed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PROJECT_LIFECYCLE_TONE: Record<ProjectLifecycleStatus, "muted" | "warning" | "success" | "info" | "danger" | "critical"> = {
  draft: "muted",
  waiting_approval: "warning",
  active: "success",
  on_hold: "info",
  delayed: "danger",
  completed: "success",
  cancelled: "muted",
};

export type MilestoneWorkStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "completed"
  | "delayed";

export const MILESTONE_WORK_LABELS: Record<MilestoneWorkStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  submitted: "Submitted",
  completed: "Completed",
  delayed: "Delayed",
};

export const MILESTONE_WORK_TONE: Record<MilestoneWorkStatus, "muted" | "info" | "warning" | "success" | "danger"> = {
  not_started: "muted",
  in_progress: "info",
  submitted: "warning",
  completed: "success",
  delayed: "danger",
};

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revision_required";

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  revision_required: "Revision Required",
};

export const APPROVAL_STATUS_TONE: Record<ApprovalStatus, "warning" | "success" | "danger" | "info"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  revision_required: "info",
};

export type BudgetStatus = "normal" | "near_limit" | "over_budget";

export const BUDGET_STATUS_LABELS: Record<BudgetStatus, string> = {
  normal: "Normal",
  near_limit: "Near Limit",
  over_budget: "Over Budget",
};

export const BUDGET_STATUS_TONE: Record<BudgetStatus, "success" | "warning" | "danger"> = {
  normal: "success",
  near_limit: "warning",
  over_budget: "danger",
};

export type RiskLevel = "low" | "medium" | "high" | "critical";

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const RISK_TONE: Record<RiskLevel, "success" | "info" | "warning" | "danger" | "critical"> = {
  low: "success",
  medium: "info",
  high: "warning",
  critical: "critical",
};

export const PROJECT_CATEGORIES = [
  "Infrastructure",
  "IT",
  "Facility",
  "Procurement",
  "Expansion",
] as const;

export type ApprovalType =
  | "project_approval"
  | "milestone_approval"
  | "budget_spending"
  | "budget_revision"
  | "completion_approval";

export const APPROVAL_TYPE_LABELS: Record<ApprovalType, string> = {
  project_approval: "Project approval",
  milestone_approval: "Milestone approval",
  budget_spending: "Budget spending approval",
  budget_revision: "Budget revision",
  completion_approval: "Completion approval",
};

export type Period = "quarterly" | "semesterly" | "annually";

export const PERIOD_LABELS: Record<Period, string> = {
  quarterly: "Quarterly",
  semesterly: "Semesterly",
  annually: "Annually",
};

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type Semester = "S1" | "S2";

export const QUARTER_LABELS: Record<Quarter, string> = {
  Q1: "Q1 (Jan-Mar)",
  Q2: "Q2 (Apr-Jun)",
  Q3: "Q3 (Jul-Sep)",
  Q4: "Q4 (Oct-Dec)",
};

export const SEMESTER_LABELS: Record<Semester, string> = {
  S1: "S1 (Jan-Jun)",
  S2: "S2 (Jul-Dec)",
};

export interface Department {
  id: string;
  name: string;
  code: string;
  sector: string;
  status: "active" | "inactive";
  annualBudgetAllocation: number;
  archivedAt?: string;
  description?: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string;
  projectIds?: string[];
  approvalRequestIds?: string[];
  status: "active" | "inactive";
  lastLogin: string;
  avatarColor: string;
}

export interface TemplateStep {
  id: string;
  name: string;
  description?: string;
  assignedRole?: string;
  requiredAttachmentNames?: string[];
  dueOffsetDays?: number;
  dependsOnPrevious?: boolean;
}

export interface TemplateMilestone {
  id: string;
  name: string;
  description?: string;
  order: number;
  estimatedDurationDays: number;
  steps: TemplateStep[];
  approvalRequired: boolean;
  approvalRole?: string;
  budgetCheckpoint: boolean;
  completionCriteria?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  defaultApproverRole: string;
  requiredAttachments: string[];
  riskChecklist: string[];
  milestones: TemplateMilestone[];
  status: "active" | "archived";
  createdBy: string;
  lastUpdated: string;
  archivedAt?: string;
  completionCriteria?: string;
}

export interface ProjectStep {
  id: string;
  templateStepId?: string;
  name: string;
  description?: string;
  assignedRole?: string;
  assignedUserId?: string;
  dueDate?: string;
  completed: boolean;
  requiredAttachmentNames: string[];
  attachmentIds?: string[];
}

export interface ProjectMilestone {
  id: string;
  templateMilestoneId?: string;
  name: string;
  description?: string;
  order: number;
  plannedStart: string;
  plannedEnd: string;
  actualEnd?: string;
  status: MilestoneWorkStatus;
  approvalStatus: ApprovalStatus;
  approvalRequestId?: string;
  steps: ProjectStep[];
  budgetCheckpoint: boolean;
  completionCriteria?: string;
}

export interface SpendingRecord {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  vendor: string;
  submittedBy: string;
  approvalStatus: ApprovalStatus;
  attachmentId?: string;
}

export interface AttachmentMetadata {
  id: string;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  relatedType: "project" | "milestone" | "step" | "spending";
  relatedId: string;
  uploadedAt: string;
  status: "pending" | "verified" | "rejected";
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  templateId: string;
  templateName: string;
  templateVersion: string;
  ownerId: string;
  category: string;
  approvedBudget: number;
  committedCost: number;
  actualSpending: number;
  status: ProjectLifecycleStatus;
  startDate: string;
  targetCompletionDate: string;
  priority: "low" | "medium" | "high";
  riskOverride?: RiskLevel;
  archivedAt?: string;
  notes?: string;
  milestones: ProjectMilestone[];
  spending: SpendingRecord[];
  attachments: AttachmentMetadata[];
  activityLog: ActivityLogEntry[];
}

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  projectId: string;
  departmentId: string;
  milestoneId?: string;
  requestedBy: string;
  approverUserId: string;
  status: ApprovalStatus;
  submittedAt: string;
  decisionAt?: string;
  amount?: number;
  comment?: string;
  decisionComment?: string;
  priority: "low" | "medium" | "high";
}

export interface ReportCard {
  id: string;
  name: string;
  period: Period;
  description: string;
  lastGenerated: string;
  format: "PDF" | "Excel" | "PDF/Excel";
}

export interface AppState {
  version: number;
  currentUserId?: string;
  globalDepartmentId?: string;
  globalYear: number;
  globalPeriod: Period;
  globalQuarter?: Quarter;
  globalSemester?: Semester;
  departments: Department[];
  users: DemoUser[];
  templates: ProjectTemplate[];
  projects: Project[];
  approvals: ApprovalRequest[];
  reports: ReportCard[];
}
