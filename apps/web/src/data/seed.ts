import type {
  ActivityLogEntry,
  ApprovalRequest,
  AppState,
  DemoUser,
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
    description:
      "Power generation, transmission, and renewable energy initiatives across the holding.",
  },
  {
    id: "sub-infra",
    name: "Infrastructure Subholding",
    code: "INF",
    sector: "Infrastructure",
    status: "active",
    annualBudgetAllocation: 620,
    description:
      "Roads, bridges, ports, and large public infrastructure programs.",
  },
  {
    id: "sub-property",
    name: "Property Subholding",
    code: "PRP",
    sector: "Property & Real Estate",
    status: "active",
    annualBudgetAllocation: 380,
    description: "Commercial property developments, mixed-use towers, and facilities.",
  },
  {
    id: "sub-logistics",
    name: "Logistics Subholding",
    code: "LOG",
    sector: "Logistics",
    status: "active",
    annualBudgetAllocation: 210,
    description: "Warehousing, fleet, and distribution network expansions.",
  },
  {
    id: "sub-digital",
    name: "Digital Services Subholding",
    code: "DIG",
    sector: "Digital Services",
    status: "active",
    annualBudgetAllocation: 165,
    description: "IT platforms, data, and customer-facing digital products.",
  },
];

const templates: ProjectTemplate[] = [
  {
    id: "tpl-infra",
    name: "Infrastructure Development Project",
    category: "Infrastructure",
    version: "v1.2",
    description:
      "Standard structure for civil infrastructure delivery: land, design, construction, commissioning, and handover.",
    defaultApproverRole: "subholding_admin",
    requiredAttachments: ["Environmental permit", "Land acquisition report", "Construction contract"],
    riskChecklist: ["Permit risk", "Land acquisition risk", "Weather risk", "Vendor performance"],
    status: "active",
    createdBy: "user-001",
    lastUpdated: "2026-04-12",
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
    description: "Standard flow for enterprise IT implementation: discovery, design, build, deploy, and adoption.",
    defaultApproverRole: "subholding_admin",
    requiredAttachments: ["System specification", "Security assessment", "User acceptance sign-off"],
    riskChecklist: ["Vendor risk", "Data migration risk", "Adoption risk", "Cyber risk"],
    status: "active",
    createdBy: "user-001",
    lastUpdated: "2026-02-05",
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
        name: "Design",
        description: "Solution design, architecture, and security review.",
        order: 2,
        estimatedDurationDays: 45,
        approvalRequired: true,
        approvalRole: "subholding_admin",
        budgetCheckpoint: false,
        completionCriteria: "Design approved.",
        steps: [
          { id: "tpl-it-m2-s1", name: "Solution design", requiredAttachment: true, dueOffsetDays: 30, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-it-m2-s2", name: "Security review", requiredAttachment: true, dueOffsetDays: 40, dependsOnPrevious: true, assignedRole: "Subholding Admin" },
        ],
      },
      {
        id: "tpl-it-m3",
        name: "Build & Deploy",
        description: "Configuration, integration, data migration, and go-live.",
        order: 3,
        estimatedDurationDays: 90,
        approvalRequired: true,
        approvalRole: "holding_admin",
        budgetCheckpoint: true,
        completionCriteria: "System in production.",
        steps: [
          { id: "tpl-it-m3-s1", name: "Build & integrate", requiredAttachment: true, dueOffsetDays: 60, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-it-m3-s2", name: "User acceptance testing", requiredAttachment: true, dueOffsetDays: 80, dependsOnPrevious: true, assignedRole: "Project Owner" },
          { id: "tpl-it-m3-s3", name: "Go-live", requiredAttachment: false, dueOffsetDays: 90, dependsOnPrevious: true, assignedRole: "Project Owner" },
        ],
      },
    ],
  },
  {
    id: "tpl-facility",
    name: "Facility Renovation",
    category: "Facility",
    version: "v1.1",
    description: "Office or asset renovation covering assessment, design, construction, and operations handover.",
    defaultApproverRole: "subholding_admin",
    requiredAttachments: ["Facility assessment report", "Construction contract"],
    riskChecklist: ["Occupancy risk", "Budget risk"],
    status: "active",
    createdBy: "user-001",
    lastUpdated: "2026-03-20",
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
  {
    id: "tpl-procurement",
    name: "Procurement Project",
    category: "Procurement",
    version: "v1.0",
    description: "Strategic procurement of equipment, materials, or services at scale.",
    defaultApproverRole: "subholding_admin",
    requiredAttachments: ["Procurement plan", "Vendor evaluation"],
    riskChecklist: ["Vendor risk", "Price risk", "Delivery risk"],
    status: "active",
    createdBy: "user-001",
    lastUpdated: "2026-01-15",
    milestones: [
      {
        id: "tpl-procurement-m1",
        name: "Sourcing",
        description: "Vendor identification and evaluation.",
        order: 1,
        estimatedDurationDays: 30,
        approvalRequired: true,
        approvalRole: "subholding_admin",
        budgetCheckpoint: false,
        completionCriteria: "Vendor selected.",
        steps: [
          { id: "tpl-procurement-m1-s1", name: "Vendor shortlist", requiredAttachment: true, dueOffsetDays: 14, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-procurement-m1-s2", name: "Evaluation", requiredAttachment: true, dueOffsetDays: 28, dependsOnPrevious: true, assignedRole: "Subholding Admin" },
        ],
      },
      {
        id: "tpl-procurement-m2",
        name: "Award & Delivery",
        description: "Contract award, delivery, and acceptance.",
        order: 2,
        estimatedDurationDays: 60,
        approvalRequired: true,
        approvalRole: "holding_admin",
        budgetCheckpoint: true,
        completionCriteria: "Goods received and accepted.",
        steps: [
          { id: "tpl-procurement-m2-s1", name: "Contract award", requiredAttachment: true, dueOffsetDays: 20, dependsOnPrevious: false, assignedRole: "Subholding Admin" },
          { id: "tpl-procurement-m2-s2", name: "Delivery & acceptance", requiredAttachment: true, dueOffsetDays: 55, dependsOnPrevious: true, assignedRole: "Project Owner" },
        ],
      },
    ],
  },
  {
    id: "tpl-expansion",
    name: "Business Expansion Project",
    category: "Expansion",
    version: "v1.0",
    description: "Standard structure for entering a new market or launching a new line of business.",
    defaultApproverRole: "holding_admin",
    requiredAttachments: ["Market study", "Business case", "Risk register"],
    riskChecklist: ["Market risk", "Regulatory risk", "Talent risk"],
    status: "active",
    createdBy: "user-001",
    lastUpdated: "2026-05-02",
    milestones: [
      {
        id: "tpl-expansion-m1",
        name: "Strategy & Business Case",
        description: "Market study, financial case, and approval.",
        order: 1,
        estimatedDurationDays: 45,
        approvalRequired: true,
        approvalRole: "holding_admin",
        budgetCheckpoint: false,
        completionCriteria: "Business case approved.",
        steps: [
          { id: "tpl-expansion-m1-s1", name: "Market study", requiredAttachment: true, dueOffsetDays: 20, dependsOnPrevious: false, assignedRole: "Project Owner" },
          { id: "tpl-expansion-m1-s2", name: "Business case sign-off", requiredAttachment: true, dueOffsetDays: 40, dependsOnPrevious: true, assignedRole: "Holding Admin" },
        ],
      },
      {
        id: "tpl-expansion-m2",
        name: "Setup & Launch",
        description: "Entity setup, hiring, partner onboarding, and launch.",
        order: 2,
        estimatedDurationDays: 120,
        approvalRequired: true,
        approvalRole: "holding_admin",
        budgetCheckpoint: true,
        completionCriteria: "Operations live.",
        steps: [
          { id: "tpl-expansion-m2-s1", name: "Entity & hiring", requiredAttachment: true, dueOffsetDays: 60, dependsOnPrevious: false, assignedRole: "Subholding Admin" },
          { id: "tpl-expansion-m2-s2", name: "Launch readiness", requiredAttachment: true, dueOffsetDays: 110, dependsOnPrevious: true, assignedRole: "Project Owner" },
        ],
      },
    ],
  },
];

const users: DemoUser[] = [
  { id: "user-001", name: "Andini Pratiwi", email: "andini.pratiwi@holding.id", role: "holding_admin", status: "active", lastLogin: "2026-06-05 09:12", avatarColor: "#556ee6" },
  { id: "user-002", name: "Budi Santosa", email: "budi.santosa@holding.id", role: "holding_executive", status: "active", lastLogin: "2026-06-04 17:40", avatarColor: "#564ab1" },
  { id: "user-003", name: "Citra Mahardika", email: "citra.mahardika@holding.id", role: "finance_controller", status: "active", lastLogin: "2026-06-05 08:20", avatarColor: "#34c38f" },
  { id: "user-004", name: "Dewi Larasati", email: "dewi.larasati@energy.id", role: "subholding_admin", subholdingId: "sub-energy", status: "active", lastLogin: "2026-06-03 14:10", avatarColor: "#f1b44c" },
  { id: "user-005", name: "Eko Wibowo", email: "eko.wibowo@infrastructure.id", role: "subholding_admin", subholdingId: "sub-infra", status: "active", lastLogin: "2026-06-05 10:05", avatarColor: "#f46a6a" },
  { id: "user-006", name: "Fajar Nugroho", email: "fajar.nugroho@property.id", role: "subholding_admin", subholdingId: "sub-property", status: "active", lastLogin: "2026-06-04 11:30", avatarColor: "#50a5f1" },
  { id: "user-007", name: "Gita Pertiwi", email: "gita.pertiwi@logistics.id", role: "subholding_admin", subholdingId: "sub-logistics", status: "active", lastLogin: "2026-06-02 13:45", avatarColor: "#e83e8c" },
  { id: "user-008", name: "Hadi Kusuma", email: "hadi.kusuma@digital.id", role: "subholding_admin", subholdingId: "sub-digital", status: "active", lastLogin: "2026-06-05 07:55", avatarColor: "#556ee6" },
  { id: "user-009", name: "Indah Cahyani", email: "indah.cahyani@energy.id", role: "project_owner", subholdingId: "sub-energy", projectIds: ["p-001", "p-002"], status: "active", lastLogin: "2026-06-05 09:50", avatarColor: "#34c38f" },
  { id: "user-010", name: "Joko Riyanto", email: "joko.riyanto@infrastructure.id", role: "project_owner", subholdingId: "sub-infra", projectIds: ["p-003", "p-004", "p-005"], status: "active", lastLogin: "2026-06-05 09:20", avatarColor: "#f1b44c" },
  { id: "user-011", name: "Kartika Sari", email: "kartika.sari@property.id", role: "project_owner", subholdingId: "sub-property", projectIds: ["p-006", "p-007"], status: "active", lastLogin: "2026-06-04 16:00", avatarColor: "#f46a6a" },
  { id: "user-012", name: "Lutfi Ramadhan", email: "lutfi.ramadhan@logistics.id", role: "project_owner", subholdingId: "sub-logistics", projectIds: ["p-008"], status: "active", lastLogin: "2026-06-05 10:30", avatarColor: "#50a5f1" },
  { id: "user-013", name: "Made Surya", email: "made.surya@holding.id", role: "approver", status: "active", lastLogin: "2026-06-05 08:10", avatarColor: "#564ab1" },
  { id: "user-014", name: "Nadia Putri", email: "nadia.putri@holding.id", role: "approver", status: "active", lastLogin: "2026-06-04 18:00", avatarColor: "#e83e8c" },
  { id: "user-015", name: "Oscar Halim", email: "oscar.halim@holding.id", role: "viewer", subholdingId: "sub-infra", projectIds: ["p-003"], status: "active", lastLogin: "2026-06-01 11:00", avatarColor: "#adb5bd" },
  { id: "user-016", name: "Putri Anggraeni", email: "putri.anggraeni@holding.id", role: "approver", status: "active", lastLogin: "2026-06-03 12:25", avatarColor: "#556ee6" },
];

function snapshotMilestones(templateId: string, projectId: string, statusMix: "early" | "mid" | "late" | "done") {
  const tpl = templates.find((t) => t.id === templateId)!;
  let milestoneIndex = 0;
  if (statusMix === "early") milestoneIndex = 0;
  if (statusMix === "mid") milestoneIndex = Math.floor(tpl.milestones.length / 2);
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
  riskOverride?: Project["riskOverride"];
  mix: "early" | "mid" | "late" | "done";
  category: string;
  priority: Project["priority"];
  actualSpendingRatio: number;
  committedRatio: number;
}> = [
  { name: "Cibinong Solar Farm Phase 2", subholdingId: "sub-energy", templateId: "tpl-infra", ownerId: "user-009", approvedBudget: 120, status: "active", startDate: `${YEAR}-01-15`, targetCompletionDate: `${YEAR}-09-30`, riskOverride: "medium", mix: "mid", category: "Infrastructure", priority: "high", actualSpendingRatio: 0.72, committedRatio: 0.85 },
  { name: "Pekanbaru Grid Modernization", subholdingId: "sub-energy", templateId: "tpl-it", ownerId: "user-009", approvedBudget: 45, status: "active", startDate: `${YEAR}-02-01`, targetCompletionDate: `${YEAR}-07-30`, mix: "mid", category: "IT", priority: "high", actualSpendingRatio: 0.55, committedRatio: 0.7 },
  { name: "Tanjung Priok Port Expansion", subholdingId: "sub-infra", templateId: "tpl-infra", ownerId: "user-010", approvedBudget: 280, status: "active", startDate: `${YEAR}-01-10`, targetCompletionDate: `${YEAR}-12-20`, riskOverride: "high", mix: "late", category: "Infrastructure", priority: "high", actualSpendingRatio: 0.93, committedRatio: 0.98 },
  { name: "Trans-Sumatra Highway Section 4", subholdingId: "sub-infra", templateId: "tpl-infra", ownerId: "user-010", approvedBudget: 350, status: "active", startDate: `${YEAR}-01-05`, targetCompletionDate: `${YEAR}-12-15`, mix: "mid", category: "Infrastructure", priority: "high", actualSpendingRatio: 0.62, committedRatio: 0.78 },
  { name: "Bandung Smart Traffic System", subholdingId: "sub-infra", templateId: "tpl-it", ownerId: "user-010", approvedBudget: 32, status: "active", startDate: `${YEAR}-03-01`, targetCompletionDate: `${YEAR}-08-30`, mix: "early", category: "IT", priority: "medium", actualSpendingRatio: 0.18, committedRatio: 0.32 },
  { name: "Surabaya Mixed-Use Tower", subholdingId: "sub-property", templateId: "tpl-infra", ownerId: "user-011", approvedBudget: 180, status: "active", startDate: `${YEAR}-01-20`, targetCompletionDate: `${YEAR}-11-15`, riskOverride: "medium", mix: "mid", category: "Infrastructure", priority: "high", actualSpendingRatio: 0.68, committedRatio: 0.8 },
  { name: "Jakarta HQ Office Renovation", subholdingId: "sub-property", templateId: "tpl-facility", ownerId: "user-011", approvedBudget: 24, status: "active", startDate: `${YEAR}-04-01`, targetCompletionDate: `${YEAR}-07-15`, mix: "early", category: "Facility", priority: "medium", actualSpendingRatio: 0.22, committedRatio: 0.4 },
  { name: "East Java Distribution Center", subholdingId: "sub-logistics", templateId: "tpl-procurement", ownerId: "user-012", approvedBudget: 65, status: "active", startDate: `${YEAR}-02-15`, targetCompletionDate: `${YEAR}-08-30`, mix: "mid", category: "Procurement", priority: "high", actualSpendingRatio: 0.58, committedRatio: 0.7 },
  { name: "Fleet Electrification Phase 1", subholdingId: "sub-logistics", templateId: "tpl-procurement", ownerId: "user-012", approvedBudget: 42, status: "active", startDate: `${YEAR}-03-10`, targetCompletionDate: `${YEAR}-09-15`, mix: "early", category: "Procurement", priority: "medium", actualSpendingRatio: 0.12, committedRatio: 0.25 },
  { name: "Customer Data Platform Rollout", subholdingId: "sub-digital", templateId: "tpl-it", ownerId: "user-008", approvedBudget: 28, status: "active", startDate: `${YEAR}-02-01`, targetCompletionDate: `${YEAR}-06-30`, mix: "late", category: "IT", priority: "high", actualSpendingRatio: 0.82, committedRatio: 0.92 },
  { name: "Group ERP Stabilization", subholdingId: "sub-digital", templateId: "tpl-it", ownerId: "user-008", approvedBudget: 55, status: "delayed", startDate: `${YEAR}-01-15`, targetCompletionDate: `${YEAR}-08-30`, riskOverride: "critical", mix: "mid", category: "IT", priority: "high", actualSpendingRatio: 0.78, committedRatio: 0.95 },
  { name: "Branchless Banking Expansion", subholdingId: "sub-digital", templateId: "tpl-expansion", ownerId: "user-008", approvedBudget: 38, status: "waiting_approval", startDate: `${YEAR}-06-01`, targetCompletionDate: `${YEAR}-12-15`, mix: "early", category: "Expansion", priority: "medium", actualSpendingRatio: 0, committedRatio: 0.05 },
  { name: "Bali Resort Development", subholdingId: "sub-property", templateId: "tpl-infra", ownerId: "user-011", approvedBudget: 220, status: "draft", startDate: `${YEAR}-07-01`, targetCompletionDate: `${YEAR + 1}-12-15`, mix: "early", category: "Infrastructure", priority: "medium", actualSpendingRatio: 0, committedRatio: 0 },
  { name: "Cikarang Industrial Estate Phase 3", subholdingId: "sub-property", templateId: "tpl-infra", ownerId: "user-011", approvedBudget: 160, status: "active", startDate: `${YEAR}-01-20`, targetCompletionDate: `${YEAR}-10-30`, mix: "late", category: "Infrastructure", priority: "high", actualSpendingRatio: 0.88, committedRatio: 0.95 },
  { name: "Medan Data Center Build", subholdingId: "sub-digital", templateId: "tpl-facility", ownerId: "user-008", approvedBudget: 95, status: "active", startDate: `${YEAR}-02-20`, targetCompletionDate: `${YEAR}-09-30`, mix: "mid", category: "Facility", priority: "high", actualSpendingRatio: 0.5, committedRatio: 0.7 },
  { name: "South Sulawesi Wind Pilot", subholdingId: "sub-energy", templateId: "tpl-infra", ownerId: "user-009", approvedBudget: 75, status: "on_hold", startDate: `${YEAR}-01-15`, targetCompletionDate: `${YEAR}-10-15`, riskOverride: "high", mix: "early", category: "Infrastructure", priority: "medium", actualSpendingRatio: 0.18, committedRatio: 0.3 },
  { name: "Logistics Tracking Modernization", subholdingId: "sub-logistics", templateId: "tpl-it", ownerId: "user-012", approvedBudget: 18, status: "completed", startDate: `${YEAR - 1}-10-01`, targetCompletionDate: `${YEAR}-02-15`, mix: "done", category: "IT", priority: "medium", actualSpendingRatio: 1.0, committedRatio: 1.0 },
  { name: "Property Portfolio Audit", subholdingId: "sub-property", templateId: "tpl-facility", ownerId: "user-011", approvedBudget: 8, status: "completed", startDate: `${YEAR - 1}-09-01`, targetCompletionDate: `${YEAR}-01-30`, mix: "done", category: "Facility", priority: "low", actualSpendingRatio: 0.95, committedRatio: 1.0 },
  { name: "Energy Efficiency Program", subholdingId: "sub-energy", templateId: "tpl-expansion", ownerId: "user-009", approvedBudget: 30, status: "cancelled", startDate: `${YEAR}-02-01`, targetCompletionDate: `${YEAR}-09-15`, riskOverride: "low", mix: "early", category: "Expansion", priority: "low", actualSpendingRatio: 0.1, committedRatio: 0.1 },
  { name: "Subholding Network Refresh", subholdingId: "sub-digital", templateId: "tpl-procurement", ownerId: "user-008", approvedBudget: 22, status: "active", startDate: `${YEAR}-03-15`, targetCompletionDate: `${YEAR}-08-15`, mix: "mid", category: "Procurement", priority: "medium", actualSpendingRatio: 0.45, committedRatio: 0.6 },
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
      description: "Project owner, subholding admin and supporting team assigned.",
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
    riskOverride: p.riskOverride,
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
    if (project.status === "waiting_approval") {
      list.push({
        id: ID("apr", counter++),
        type: "project_approval",
        projectId: project.id,
        subholdingId: project.subholdingId,
        requestedBy: project.ownerId,
        approverUserId: "user-013",
        status: "pending",
        submittedAt: `${YEAR}-05-12T10:00:00`,
        priority: project.priority,
      });
    }
    for (const milestone of project.milestones) {
      if (milestone.status === "submitted" && milestone.approvalStatus === "pending") {
        list.push({
          id: ID("apr", counter++),
          type: "milestone_approval",
          projectId: project.id,
          subholdingId: project.subholdingId,
          milestoneId: milestone.id,
          requestedBy: project.ownerId,
          approverUserId: project.priority === "high" ? "user-013" : "user-014",
          status: "pending",
          submittedAt: `${YEAR}-05-15T09:00:00`,
          priority: project.priority,
        });
      }
    }
  }
  // add historical approvals
  list.push({
    id: ID("apr", counter++),
    type: "project_approval",
    projectId: "p-001",
    subholdingId: "sub-energy",
    requestedBy: "user-009",
    approverUserId: "user-013",
    status: "approved",
    submittedAt: `${YEAR - 1}-12-20T09:00:00`,
    decisionAt: `${YEAR - 1}-12-22T11:00:00`,
    decisionComment: "Approved with standard conditions.",
    priority: "high",
  });
  list.push({
    id: ID("apr", counter++),
    type: "milestone_approval",
    projectId: "p-001",
    subholdingId: "sub-energy",
    milestoneId: "p-001-m1",
    requestedBy: "user-009",
    approverUserId: "user-016",
    status: "approved",
    submittedAt: `${YEAR}-02-10T08:00:00`,
    decisionAt: `${YEAR}-02-12T08:00:00`,
    decisionComment: "Land acquisition verified.",
    priority: "high",
  });
  // attach to demo approver users
  const approverIds = users.filter((u) => u.role === "approver").map((u) => u.id);
  for (const approval of list) {
    const user = users.find((u) => u.id === approval.approverUserId);
    if (user) {
      user.approvalRequestIds = Array.from(new Set([...(user.approvalRequestIds ?? []), approval.id]));
    }
  }
  return list;
})();

export const seedState: AppState = {
  version: 1,
  globalYear: YEAR,
  globalPeriod: "quarterly",
  globalQuarter: "Q2",
  subholdings,
  users,
  templates,
  projects,
  approvals,
  reports: [
    { id: "rpt-1", name: "Quarterly Project Performance Report", period: "quarterly", description: "Project status, milestones, and risk distribution per quarter.", lastGenerated: "2026-04-05", format: "PDF/Excel" },
    { id: "rpt-2", name: "Semester Budget Utilization Report", period: "semesterly", description: "Approved budget, actual spending, and variance per semester.", lastGenerated: "2026-04-05", format: "PDF/Excel" },
    { id: "rpt-3", name: "Annual Portfolio Summary", period: "annually", description: "Full portfolio status, completion rate, and ROI by subholding.", lastGenerated: "2026-01-30", format: "PDF/Excel" },
    { id: "rpt-4", name: "Subholding Performance Report", period: "quarterly", description: "Subholding scorecard across financial and operational KPIs.", lastGenerated: "2026-04-05", format: "PDF" },
    { id: "rpt-5", name: "Project Delay Report", period: "quarterly", description: "Projects whose milestones have slipped past planned dates.", lastGenerated: "2026-04-05", format: "Excel" },
    { id: "rpt-6", name: "Budget Overrun Report", period: "semesterly", description: "Projects exceeding approved budget utilization thresholds.", lastGenerated: "2026-04-05", format: "Excel" },
    { id: "rpt-7", name: "Approval Aging Report", period: "quarterly", description: "Open approval requests aged by days and priority.", lastGenerated: "2026-04-05", format: "PDF" },
  ],
};
