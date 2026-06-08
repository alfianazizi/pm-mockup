import type {
  ActivityLogEntry,
  ApprovalRequest,
  AppState,
  Project,
  ProjectMilestone,
  ProjectTemplate,
  Subholding,
} from "../lib/domain";

const YEAR = 2026;
const ID = (prefix: string, n: number) => `${prefix}-${String(n).padStart(3, "0")}`;

const subholdings: Subholding[] = [
  {
    id: "sub-energy",
    name: "Energy Subholding",
    code: "ENG",
    sector: "Energy",
    status: "active",
    annualBudgetAllocation: 450,
    description: "Power generation, transmission, and renewable energy initiatives.",
  },
  {
    id: "sub-infra",
    name: "Infrastructure Subholding",
    code: "INF",
    sector: "Infrastructure",
    status: "active",
    annualBudgetAllocation: 620,
    description: "Roads, bridges, ports, and large public infrastructure programs.",
  },
  {
    id: "sub-property",
    name: "Property Subholding",
    code: "PRP",
    sector: "Property & Real Estate",
    status: "active",
    annualBudgetAllocation: 380,
    description: "Commercial property developments and facilities.",
  },
  {
    id: "sub-logistics",
    name: "Logistics Subholding",
    code: "LOG",
    sector: "Logistics",
    status: "active",
    annualBudgetAllocation: 210,
    description: "Warehousing, fleet, and distribution network.",
  },
  {
    id: "sub-digital",
    name: "Digital Services Subholding",
    code: "DIG",
    sector: "Digital Services",
    status: "active",
    annualBudgetAllocation: 165,
    description: "IT platforms, data, and digital products.",
  },
];

const templates: ProjectTemplate[] = [
  {
    id: "tpl-infra",
    name: "Infrastructure Development Project",
    category: "Infrastructure",
    version: "v1.2",
    description: "Civil infrastructure delivery: land, design, construction, commissioning, handover.",
    defaultApproverRole: "subholding_admin",
    requiredAttachments: ["Environmental permit", "Land acquisition report", "Construction contract"],
    riskChecklist: ["Permit risk", "Land acquisition risk", "Weather risk", "Vendor performance"],
    status: "active",
    createdBy: "user-001",
    lastUpdated: "2026-04-12",
    completionCriteria: "Asset handed over and operational.",
    milestones: [
      {
        id: "tpl-infra-m1",
        name: "Land Acquisition & Permits",
        description: "Acquire land, secure permits, and finalize legal documents.",
        order: 1,
        estimatedDurationDays: 90,
        approvalRequired: true,
        approvalRole: "subholding_admin",
        budgetCheckpoint: true,
        completionCriteria: "All land titles transferred and permits active.",
        steps: [
          { id: "tpl-infra-m1-s1", name: "Land survey", requiredAttachment: true, dueOffsetDays: 14, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-infra-m1-s2", name: "Permit submission", requiredAttachment: true, dueOffsetDays: 45, dependsOnPrevious: true, assignedRole: "Subholding Admin" },
        ],
      },
      {
        id: "tpl-infra-m2",
        name: "Design & Engineering",
        description: "Detailed design, engineering studies, and procurement planning.",
        order: 2,
        estimatedDurationDays: 75,
        approvalRequired: true,
        approvalRole: "subholding_admin",
        budgetCheckpoint: false,
        completionCriteria: "Detailed design approved by stakeholders.",
        steps: [
          { id: "tpl-infra-m2-s1", name: "Concept design", requiredAttachment: false, dueOffsetDays: 20, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-infra-m2-s2", name: "Detailed engineering", requiredAttachment: true, dueOffsetDays: 60, dependsOnPrevious: true, assignedRole: "Project Owner" },
        ],
      },
      {
        id: "tpl-infra-m3",
        name: "Construction",
        description: "Execution of construction works.",
        order: 3,
        estimatedDurationDays: 240,
        approvalRequired: true,
        approvalRole: "holding_admin",
        budgetCheckpoint: true,
        completionCriteria: "Construction complete and inspected.",
        steps: [
          { id: "tpl-infra-m3-s1", name: "Mobilization", requiredAttachment: false, dueOffsetDays: 15, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-infra-m3-s2", name: "Civil works", requiredAttachment: true, dueOffsetDays: 180, dependsOnPrevious: true, assignedRole: "Project Owner" },
          { id: "tpl-infra-m3-s3", name: "Mechanical & electrical", requiredAttachment: true, dueOffsetDays: 220, dependsOnPrevious: true, assignedRole: "Project Owner" },
        ],
      },
      {
        id: "tpl-infra-m4",
        name: "Commissioning & Handover",
        description: "Testing, commissioning, and handover to operations.",
        order: 4,
        estimatedDurationDays: 60,
        approvalRequired: true,
        approvalRole: "holding_admin",
        budgetCheckpoint: false,
        completionCriteria: "Asset handed over and operational.",
        steps: [
          { id: "tpl-infra-m4-s1", name: "Testing & commissioning", requiredAttachment: true, dueOffsetDays: 30, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-infra-m4-s2", name: "Handover package", requiredAttachment: true, dueOffsetDays: 55, dependsOnPrevious: true, assignedRole: "Project Owner" },
        ],
      },
    ],
  },
  {
    id: "tpl-it",
    name: "IT System Implementation",
    category: "IT",
    version: "v1.0",
    description: "Enterprise IT implementation: discovery, design, build, deploy, adoption.",
    defaultApproverRole: "subholding_admin",
    requiredAttachments: ["System specification", "Security assessment", "User acceptance sign-off"],
    riskChecklist: ["Vendor risk", "Data migration risk", "Adoption risk", "Cyber risk"],
    status: "active",
    createdBy: "user-001",
    lastUpdated: "2026-02-05",
    completionCriteria: "System in production and adopted by target users.",
    milestones: [
      {
        id: "tpl-it-m1",
        name: "Discovery",
        description: "Stakeholder interviews, requirements, current-state analysis.",
        order: 1,
        estimatedDurationDays: 30,
        approvalRequired: true,
        approvalRole: "subholding_admin",
        budgetCheckpoint: false,
        completionCriteria: "Requirements approved.",
        steps: [
          { id: "tpl-it-m1-s1", name: "Stakeholder workshops", requiredAttachment: false, dueOffsetDays: 10, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-it-m1-s2", name: "Requirements sign-off", requiredAttachment: true, dueOffsetDays: 25, dependsOnPrevious: true, assignedRole: "Subholding Admin" },
        ],
      },
      {
        id: "tpl-it-m2",
        name: "Build & Deploy",
        description: "Configuration, integration, data migration, and go-live.",
        order: 2,
        estimatedDurationDays: 90,
        approvalRequired: true,
        approvalRole: "holding_admin",
        budgetCheckpoint: true,
        completionCriteria: "System in production.",
        steps: [
          { id: "tpl-it-m2-s1", name: "Build & integrate", requiredAttachment: true, dueOffsetDays: 60, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-it-m2-s2", name: "User acceptance testing", requiredAttachment: true, dueOffsetDays: 80, dependsOnPrevious: true, assignedRole: "Project Owner" },
          { id: "tpl-it-m2-s3", name: "Go-live", requiredAttachment: false, dueOffsetDays: 90, dependsOnPrevious: true, assignedRole: "Project Owner" },
        ],
      },
    ],
  },
  {
    id: "tpl-facility",
    name: "Facility Renovation",
    category: "Facility",
    version: "v1.1",
    description: "Office or asset renovation covering assessment, design, construction, and handover.",
    defaultApproverRole: "subholding_admin",
    requiredAttachments: ["Facility assessment report", "Construction contract"],
    riskChecklist: ["Occupancy risk", "Budget risk"],
    status: "active",
    createdBy: "user-001",
    lastUpdated: "2026-03-20",
    completionCriteria: "Renovation works complete and operations resumed.",
    milestones: [
      {
        id: "tpl-facility-m1",
        name: "Assessment & Plan",
        description: "Condition assessment and renovation plan.",
        order: 1,
        estimatedDurationDays: 30,
        approvalRequired: true,
        approvalRole: "subholding_admin",
        budgetCheckpoint: false,
        completionCriteria: "Plan approved.",
        steps: [
          { id: "tpl-facility-m1-s1", name: "Site assessment", requiredAttachment: true, dueOffsetDays: 14, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-facility-m1-s2", name: "Plan sign-off", requiredAttachment: true, dueOffsetDays: 25, dependsOnPrevious: true, assignedRole: "Subholding Admin" },
        ],
      },
      {
        id: "tpl-facility-m2",
        name: "Execution",
        description: "Construction and fit-out.",
        order: 2,
        estimatedDurationDays: 90,
        approvalRequired: true,
        approvalRole: "subholding_admin",
        budgetCheckpoint: true,
        completionCriteria: "Renovation works complete.",
        steps: [
          { id: "tpl-facility-m2-s1", name: "Construction", requiredAttachment: true, dueOffsetDays: 70, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-facility-m2-s2", name: "Snagging & handover", requiredAttachment: true, dueOffsetDays: 88, dependsOnPrevious: true, assignedRole: "Project Owner" },
        ],
      },
    ],
  },
];

const users = [
  {
    id: "user-001",
    name: "Andini Pratiwi",
    email: "andini.pratiwi@holding.id",
    role: "holding_admin" as const,
    status: "active" as const,
    lastLogin: "2026-06-08 09:12",
    avatarColor: "#556ee6",
    approvalRequestIds: [] as string[],
  },
  {
    id: "user-002",
    name: "Indah Cahyani",
    email: "indah.cahyani@infra.id",
    role: "project_owner" as const,
    subholdingId: "sub-infra",
    projectIds: ["p-001", "p-002"],
    status: "active" as const,
    lastLogin: "2026-06-08 09:50",
    avatarColor: "#34c38f",
    approvalRequestIds: [] as string[],
  },
];

function snapshotMilestones(templateId: string, projectId: string, statusMix: "early" | "mid" | "late" | "done") {
  const tpl = templates.find((t) => t.id === templateId)!;
  let milestoneIndex = 0;
  if (statusMix === "early") milestoneIndex = 0;
  if (statusMix === "mid") milestoneIndex = Math.max(0, Math.floor(tpl.milestones.length / 2));
  if (statusMix === "late") milestoneIndex = Math.max(0, tpl.milestones.length - 1);
  if (statusMix === "done") milestoneIndex = tpl.milestones.length;

  return tpl.milestones.map<ProjectMilestone>((tm, idx) => {
    let workStatus: ProjectMilestone["status"] = "not_started";
    let approvalStatus: ProjectMilestone["approvalStatus"] = "pending";
    if (idx < milestoneIndex) {
      workStatus = "completed";
      approvalStatus = "approved";
    } else if (idx === milestoneIndex) {
      workStatus = "in_progress";
      approvalStatus = "pending";
    }
    const plannedStart = new Date(YEAR, idx * 2, 1);
    const plannedEnd = new Date(YEAR, idx * 2 + 1, 15);
    return {
      id: ID(`${projectId}-m`, idx + 1),
      templateMilestoneId: tm.id,
      name: tm.name,
      description: tm.description,
      order: tm.order,
      plannedStart: plannedStart.toISOString().slice(0, 10),
      plannedEnd: plannedEnd.toISOString().slice(0, 10),
      actualEnd: workStatus === "completed" ? plannedEnd.toISOString().slice(0, 10) : undefined,
      status: workStatus,
      approvalStatus,
      budgetCheckpoint: tm.budgetCheckpoint,
      completionCriteria: tm.completionCriteria,
      steps: tm.steps.map((ts, sidx) => {
        const stepDone = workStatus === "completed" || (workStatus === "in_progress" && sidx === 0);
        return {
          id: ID(`${projectId}-m${idx + 1}-s`, sidx + 1),
          templateStepId: ts.id,
          name: ts.name,
          description: ts.description,
          assignedRole: ts.assignedRole,
          dueDate: plannedStart.toISOString().slice(0, 10),
          completed: stepDone,
          requiredAttachment: !!ts.requiredAttachment,
        };
      }),
    };
  });
}

const projectSeed: Array<{
  name: string;
  subholdingId: string;
  templateId: string;
  ownerId: string;
  approvedBudget: number;
  status: Project["status"];
  startDate: string;
  targetCompletionDate: string;
  mix: "early" | "mid" | "late" | "done";
  category: string;
  priority: Project["priority"];
  actualSpendingRatio: number;
  committedRatio: number;
}> = [
  { name: "Tanjung Priok Port Expansion", subholdingId: "sub-infra", templateId: "tpl-infra", ownerId: "user-002", approvedBudget: 280, status: "active", startDate: `${YEAR}-01-10`, targetCompletionDate: `${YEAR}-12-20`, mix: "late", category: "Infrastructure", priority: "high", actualSpendingRatio: 0.82, committedRatio: 0.95 },
  { name: "Bandung Smart Traffic System", subholdingId: "sub-infra", templateId: "tpl-it", ownerId: "user-002", approvedBudget: 32, status: "active", startDate: `${YEAR}-03-01`, targetCompletionDate: `${YEAR}-08-30`, mix: "early", category: "IT", priority: "medium", actualSpendingRatio: 0.18, committedRatio: 0.32 },
  { name: "Cibinong Solar Farm Phase 2", subholdingId: "sub-energy", templateId: "tpl-infra", ownerId: "user-001", approvedBudget: 120, status: "active", startDate: `${YEAR}-01-15`, targetCompletionDate: `${YEAR}-09-30`, mix: "mid", category: "Infrastructure", priority: "high", actualSpendingRatio: 0.72, committedRatio: 0.85 },
  { name: "Pekanbaru Grid Modernization", subholdingId: "sub-energy", templateId: "tpl-it", ownerId: "user-001", approvedBudget: 45, status: "active", startDate: `${YEAR}-02-01`, targetCompletionDate: `${YEAR}-07-30`, mix: "mid", category: "IT", priority: "high", actualSpendingRatio: 0.55, committedRatio: 0.7 },
  { name: "Surabaya Mixed-Use Tower", subholdingId: "sub-property", templateId: "tpl-infra", ownerId: "user-001", approvedBudget: 180, status: "active", startDate: `${YEAR}-01-20`, targetCompletionDate: `${YEAR}-11-15`, mix: "mid", category: "Infrastructure", priority: "high", actualSpendingRatio: 0.68, committedRatio: 0.8 },
  { name: "Jakarta HQ Office Renovation", subholdingId: "sub-property", templateId: "tpl-facility", ownerId: "user-001", approvedBudget: 24, status: "active", startDate: `${YEAR}-04-01`, targetCompletionDate: `${YEAR}-07-15`, mix: "early", category: "Facility", priority: "medium", actualSpendingRatio: 0.22, committedRatio: 0.4 },
  { name: "East Java Distribution Center", subholdingId: "sub-logistics", templateId: "tpl-facility", ownerId: "user-001", approvedBudget: 65, status: "active", startDate: `${YEAR}-02-15`, targetCompletionDate: `${YEAR}-08-30`, mix: "mid", category: "Facility", priority: "high", actualSpendingRatio: 0.58, committedRatio: 0.7 },
  { name: "Customer Data Platform Rollout", subholdingId: "sub-digital", templateId: "tpl-it", ownerId: "user-001", approvedBudget: 28, status: "active", startDate: `${YEAR}-02-01`, targetCompletionDate: `${YEAR}-06-30`, mix: "late", category: "IT", priority: "high", actualSpendingRatio: 0.82, committedRatio: 0.92 },
];

const projects: Project[] = projectSeed.map((p, i) => {
  const tpl = templates.find((t) => t.id === p.templateId)!;
  const milestones = snapshotMilestones(p.templateId, ID("p", i + 1), p.mix);
  const actualSpending = Math.round(p.approvedBudget * p.actualSpendingRatio * 10) / 10;
  const committedCost = Math.round(p.approvedBudget * p.committedRatio * 10) / 10;
  const spending = actualSpending > 0
    ? Array.from({ length: 6 }).map((_, k) => ({
        id: `${ID("p", i + 1)}-spend-${k + 1}`,
        date: `${YEAR}-${String((k + 1) * 2).padStart(2, "0")}-15`,
        description: ["Equipment", "Contractor invoice", "Consulting", "Materials", "Logistics", "Permits"][k % 6],
        category: ["Equipment", "Contractor", "Consulting", "Materials", "Logistics", "Permits"][k % 6],
        amount: Math.round((actualSpending / 6) * 10) / 10,
        vendor: ["PT Andalan", "PT Mitra", "CV Sumber", "PT Cipta", "PT Nusa", "PT Global"][k % 6],
        submittedBy: p.ownerId,
        approvalStatus: "approved" as const,
      }))
    : [];
  const attachments = [
    {
      id: `${ID("p", i + 1)}-att-1`,
      fileName: "Project Charter.pdf",
      fileType: "PDF",
      uploadedBy: p.ownerId,
      relatedType: "project" as const,
      relatedId: ID("p", i + 1),
      uploadedAt: `${p.startDate}T08:00:00`,
      status: "verified" as const,
    },
  ];
  const activityLog: ActivityLogEntry[] = [
    {
      id: `${ID("p", i + 1)}-act-1`,
      timestamp: `${p.startDate}T08:00:00`,
      userId: p.ownerId,
      action: "Project created",
      description: `Project created from template ${tpl.name} (${tpl.version}).`,
    },
    {
      id: `${ID("p", i + 1)}-act-2`,
      timestamp: `${p.startDate}T09:00:00`,
      userId: p.ownerId,
      action: "Team assigned",
      description: "Project owner and supporting team assigned.",
    },
  ];
  return {
    id: ID("p", i + 1),
    name: p.name,
    description: `${p.name} is executed under ${tpl.name}.`,
    subholdingId: p.subholdingId,
    templateId: p.templateId,
    templateName: tpl.name,
    templateVersion: tpl.version,
    ownerId: p.ownerId,
    category: p.category,
    approvedBudget: p.approvedBudget,
    committedCost,
    actualSpending,
    status: p.status,
    startDate: p.startDate,
    targetCompletionDate: p.targetCompletionDate,
    priority: p.priority,
    notes: "",
    milestones,
    spending,
    attachments,
    activityLog,
  };
});

const approvals: ApprovalRequest[] = (() => {
  const list: ApprovalRequest[] = [];
  let counter = 1;
  for (const project of projects) {
    for (const milestone of project.milestones) {
      if (milestone.status === "in_progress" && milestone.approvalStatus === "pending") {
        const approver = "user-001";
        list.push({
          id: ID("apr", counter++),
          type: "milestone_approval",
          projectId: project.id,
          subholdingId: project.subholdingId,
          milestoneId: milestone.id,
          requestedBy: project.ownerId,
          approverUserId: approver,
          status: "pending",
          submittedAt: `${YEAR}-05-15T09:00:00`,
          priority: project.priority,
        });
      }
    }
  }
  for (const approval of list) {
    const user = users.find((u) => u.id === approval.approverUserId);
    if (user) {
      user.approvalRequestIds = Array.from(new Set([...(user.approvalRequestIds ?? []), approval.id]));
    }
  }
  return list;
})();

export const seedState: AppState = {
  version: 2,
  globalYear: YEAR,
  globalPeriod: "quarterly",
  globalQuarter: "Q2",
  subholdings,
  users: users as unknown as AppState["users"],
  templates,
  projects,
  approvals,
  reports: [
    { id: "rpt-1", name: "Quarterly Project Performance Report", period: "quarterly", description: "Project status, milestones, and risk distribution per quarter.", lastGenerated: "2026-04-05", format: "PDF/Excel" },
    { id: "rpt-2", name: "Semester Budget Utilization Report", period: "semesterly", description: "Approved budget, actual spending, and variance per semester.", lastGenerated: "2026-04-05", format: "PDF/Excel" },
    { id: "rpt-3", name: "Annual Portfolio Summary", period: "annually", description: "Full portfolio status, completion rate, and ROI by subholding.", lastGenerated: "2026-01-30", format: "PDF/Excel" },
  ],
};
