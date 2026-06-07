Project: Project Management & Budget Monitoring Dashboard for a holding company.

Feature List:
- Mock authentication with selectable demo users and roles
- Role-based sidebar and page access
- Holding-level consolidated dashboard
- Subholding budget and project monitoring
- Quarterly, semesterly, and annual performance filters
- Project template management
- Dynamic milestone and step configuration inside templates
- Project creation wizard using predefined templates
- Project portfolio management
- Project detail view with overview, budget, milestones, steps, approvals, attachments, and activity log
- Budget monitoring across subholdings and projects
- Spending records and budget variance tracking
- Milestone tracking and approval workflow
- Centralized approval queue
- Mock attachment/document tracking
- Executive and finance reports
- User and role management
- Basic system settings
- Charts, tables, filters, status badges, progress bars, timelines, drawers, modals, and stepper forms
- Static mock data with realistic subholdings, projects, budgets, milestones, users, and approvals
- Responsive desktop/tablet UI suitable for stakeholder presentation

Goal:
Create a polished enterprise dashboard prototype that allows a holding company to monitor project budgets, milestones, approvals, and spending across multiple subholdings.

This is a prototype only:
- No real backend
- No real authentication
- Use mock data
- Use local state/static JSON
- Focus on UI/UX, page structure, navigation, tables, charts, forms, and stakeholder presentation quality

Recommended stack:
- React
- Vite
- TypeScript
- React Router
- Tailwind CSS
- ShadCN UI or similar component library
- Recharts
- Lucide icons
- pnpm

Main users/roles:
1. Holding Admin
   - Can access all modules and data across all subholdings

2. Holding Executive
   - Can view consolidated dashboards and reports
   - Mostly read-only

3. Finance Controller
   - Can view budget monitoring, spending, variance, and financial reports

4. Subholding Admin
   - Can manage projects and users only for their assigned subholding

5. Project Owner
   - Can manage assigned projects, update progress, submit milestones, and upload attachments

6. Approver
   - Can review, approve, reject, or request revision for approvals

7. Viewer
   - Can only view assigned dashboards and project details

Required app structure:
- Mock login page
- Main dashboard layout
- Sidebar navigation
- Top header
- Role-based menu visibility
- Subholding selector
- Period selector: quarterly, semesterly, annually
- Responsive desktop/tablet layout

Main routes:
- /login
- /dashboard
- /subholdings
- /subholdings/:id
- /templates
- /templates/new
- /templates/:id/edit
- /projects
- /projects/new
- /projects/:id
- /budget-monitoring
- /approvals
- /reports
- /users
- /settings

Sidebar menu:
- Dashboard
- Subholdings
- Project Templates
- Projects
- Budget Monitoring
- Milestones & Approvals
- Reports
- Users & Roles
- Settings

Required pages:

1. Login Page
- Mock login only
- Let user choose demo role
- Redirect to dashboard after login
- No backend validation needed

2. Dashboard Page
Purpose:
Consolidated holding-level monitoring dashboard.

Filters:
- Year
- Quarter
- Semester
- Subholding
- Project status
- Budget status
- Project category

Summary cards:
- Total Approved Budget
- Total Spending
- Remaining Budget
- Budget Utilization %
- Active Projects
- Completed Projects
- Delayed Projects
- Projects Awaiting Approval
- Budget Overrun Projects
- Average Project Progress

Charts:
- Budget vs Spending by Subholding
- Project Status Distribution
- Quarterly Spending Trend
- Budget Utilization by Project Category
- Milestone Completion Rate
- Top Projects by Budget
- Projects at Risk
- Approval Pending Aging

Tables:
- Subholding performance summary
- High-risk projects
- Budget overrun projects
- Upcoming milestones
- Pending approvals

3. Subholding Management
Subholding list table columns:
- Subholding Name
- Code
- Business Sector
- Total Projects
- Approved Budget
- Current Spending
- Budget Utilization
- Active Projects
- Delayed Projects
- Status

Actions:
- View details
- Edit
- Archive

Subholding detail page sections:
- Profile information
- Budget summary
- Project portfolio
- Spending trend
- Milestone performance
- Assigned users
- Risk indicators

4. Project Template Module
Template list columns:
- Template Name
- Category
- Number of Milestones
- Number of Steps
- Default Approval Flow
- Created By
- Last Updated
- Status

Actions:
- View
- Create New
- Duplicate
- Edit
- Archive

Template form fields:
- Template name
- Description
- Project category
- Default estimated duration
- Default milestones
- Default steps/tasks
- Required attachments
- Approval roles/users
- Budget checkpoints
- Risk checklist
- Completion criteria

Each template milestone should include:
- Milestone name
- Description
- Sequence/order
- Estimated duration
- Required steps
- Required attachments
- Approval required yes/no
- Approval role/user
- Budget checkpoint yes/no
- Completion criteria

Each template step should include:
- Step name
- Description
- Assigned role
- Required evidence/attachment
- Due date offset
- Dependency on previous step

The template UI should allow adding/removing milestones and steps dynamically.

5. Project Management Module
Project list columns:
- Project Name
- Subholding
- Project Owner
- Template Used
- Approved Budget
- Spending
- Budget Utilization %
- Progress %
- Current Milestone
- Status
- Start Date
- Target Completion Date
- Risk Level

Project statuses:
- Draft
- Waiting Approval
- Active
- On Hold
- Delayed
- Completed
- Cancelled

Budget statuses:
- Normal
- Near Limit
- Over Budget

Risk levels:
- Low
- Medium
- High
- Critical

Project actions:
- View details
- Create project
- Edit project
- Update progress
- Submit approval
- Archive

6. Create Project Wizard
Steps:
1. Select subholding
2. Select project template
3. Fill project details
4. Define budget
5. Assign owner and users
6. Review generated milestones and steps
7. Save as draft or submit for approval

Project form fields:
- Project name
- Description
- Subholding
- Project category
- Selected template
- Project owner
- Project team members
- Approved budget
- Budget source
- Start date
- Target completion date
- Priority
- Attachments
- Notes

7. Project Detail Page
Use tabs:

Overview tab:
- Project summary
- Project owner
- Subholding
- Budget summary
- Progress bar
- Current milestone
- Status
- Risk level
- Timeline
- Key dates

Budget tab:
- Approved budget
- Actual spending
- Remaining budget
- Budget utilization %
- Spending by category
- Budget variance
- Budget history
- Spending records

Spending record fields:
- Date
- Description
- Category
- Amount
- Vendor
- Uploaded receipt/document
- Submitted by
- Approval status

Milestones tab:
- Milestone timeline
- Milestone name
- Planned date
- Actual date
- Status
- Completion %
- Approval status
- Attachments
- Comments

Milestone statuses:
- Not Started
- In Progress
- Submitted
- Approved
- Rejected
- Completed
- Delayed

Steps/Tasks tab:
- Steps grouped by milestone
- Step name
- Assigned user/role
- Due date
- Status
- Required attachment
- Completion evidence
- Comments

Approvals tab:
- Approval type
- Requested by
- Approver
- Status
- Submitted date
- Decision date
- Comment

Approval statuses:
- Pending
- Approved
- Rejected
- Revision Required

Attachments tab:
- File name
- File type
- Uploaded by
- Related milestone/step
- Upload date
- Status

Activity Log tab:
- Date/time
- User
- Action
- Description

8. Budget Monitoring Page
Purpose:
Dedicated financial monitoring across subholdings and projects.

Summary:
- Total budget by subholding
- Total spending by subholding
- Remaining budget
- Budget utilization
- Budget variance
- Over-budget projects
- Projects near budget limit

Budget table columns:
- Subholding
- Project
- Approved Budget
- Committed Cost
- Actual Spending
- Remaining Budget
- Utilization %
- Variance
- Status
- Last Updated

Filters:
- Year
- Quarter
- Semester
- Subholding
- Project
- Budget status
- Category

Row detail drawer/page:
- Budget summary
- Spending breakdown
- Spending history
- Related invoices/attachments
- Approval history
- Variance explanation

9. Milestones & Approvals Page
Pending approval list columns:
- Request Type
- Project
- Subholding
- Milestone
- Requested By
- Amount if budget-related
- Submitted Date
- Aging
- Priority
- Status

Request types:
- Project approval
- Milestone approval
- Budget spending approval
- Budget revision
- Completion approval

Actions:
- View details
- Approve
- Reject
- Request revision

Approval detail should show:
- Request summary
- Project information
- Budget impact
- Related attachments
- Comments
- Approval decision form

10. Reports Page
Mock report cards:
- Quarterly Project Performance Report
- Semester Budget Utilization Report
- Annual Portfolio Summary
- Subholding Performance Report
- Project Delay Report
- Budget Overrun Report
- Approval Aging Report

Each report card should include:
- Report name
- Period
- Description
- Last generated date
- Actions: View, Export PDF, Export Excel

No real export needed.

11. Users & Roles Page
User list columns:
- Name
- Email
- Role
- Assigned Subholding
- Assigned Projects
- Status
- Last Login

Actions:
- Create user
- Edit user
- Deactivate

User form fields:
- Full name
- Email
- Role
- Subholding access
- Project access
- Approval authority
- Status

12. Settings Page
Mock settings sections:
- Project categories
- Budget categories
- Approval flow configuration
- Fiscal year settings
- Notification settings
- Role permissions

Mock data requirements:
Create realistic mock data for:

Subholdings:
At least 5:
- Energy Subholding
- Infrastructure Subholding
- Property Subholding
- Logistics Subholding
- Digital Services Subholding

Projects:
At least 20 projects with mixed:
- Statuses
- Budgets
- Progress percentages
- Risk levels
- Spending amounts
- Milestones

Templates:
At least 5:
- Infrastructure Development Project
- IT System Implementation
- Facility Renovation
- Procurement Project
- Business Expansion Project

Users:
At least 15 users with different roles and subholding assignments.

Budgets:
Include:
- Approved budget
- Actual spending
- Committed cost
- Remaining budget
- Budget category
- Spending history
- Variance

Milestones:
Each project should have multiple milestones with mixed statuses and approval states.

Suggested local data model:

type Subholding = {
  id: string;
  name: string;
  code: string;
  sector: string;
  status: "active" | "inactive";
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  subholdingId?: string;
  projectIds?: string[];
};

type ProjectTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  milestones: TemplateMilestone[];
  requiredAttachments: string[];
  approvalFlow: ApprovalStep[];
};

type TemplateMilestone = {
  id: string;
  name: string;
  description: string;
  order: number;
  estimatedDurationDays: number;
  steps: TemplateStep[];
  approvalRequired: boolean;
};

type TemplateStep = {
  id: string;
  name: string;
  description: string;
  assignedRole: string;
  requiredAttachment: boolean;
};

type Project = {
  id: string;
  name: string;
  subholdingId: string;
  templateId: string;
  ownerId: string;
  approvedBudget: number;
  committedCost: number;
  actualSpending: number;
  progress: number;
  status: string;
  budgetStatus: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  startDate: string;
  targetCompletionDate: string;
  milestones: ProjectMilestone[];
};

type ProjectMilestone = {
  id: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: string;
  progress: number;
  approvalStatus: string;
};

Required mock interactions:
- Login as different demo users
- Show/hide menus depending on selected role
- Filter dashboard by year, quarter, semester, and subholding
- View consolidated metrics
- View subholding detail
- Create project from template
- Add/edit project template milestones and steps
- Update project progress
- Submit milestone for approval
- Approve or reject mock approval request
- View budget usage and variance
- View project detail tabs
- Search and filter tables

Design System / Color Palette:

Use the provided CSS variables as the main design palette. Create a global CSS file, for example:

src/styles/theme.css

Add the full :root palette below into the global stylesheet and import it in main.tsx or index.css.

Important:
- Do not invent a new color palette.
- Use these CSS variables consistently across the UI.
- Prefer semantic mapping instead of hardcoding hex colors everywhere.
- The dashboard should use this palette to create a corporate enterprise look.

Primary color usage:
- Primary actions: var(--royalblue-100)
- Primary hover: var(--royalblue-200)
- Primary soft background: var(--royalblue-900)
- Primary border/subtle highlight: var(--royalblue-400)

Secondary/accent usage:
- Info charts and links: var(--cornflowerblue-100)
- Secondary accent: var(--slateblue-100)
- Optional highlight/accent: var(--hotpink-100)

Status color usage:
- Success / on-track / approved: var(--mediumseagreen-100)
- Success soft background: var(--mediumseagreen-600)
- Warning / near limit / pending: var(--goldenrod-100)
- Warning soft background: var(--goldenrod-600)
- Danger / delayed / rejected / over budget: var(--salmon-100)
- Danger soft background: var(--salmon-500)
- Critical risk: var(--tomato-100)

Layout color usage:
- App background: var(--whitesmoke-300)
- Card background: var(--white-100)
- Sidebar background: var(--darkslategray-600)
- Sidebar active item: var(--royalblue-100)
- Header background: var(--white-100)
- Border color: var(--aliceblue-100)
- Main text: var(--black-300)
- Muted text: var(--slategray-100)
- Disabled/inactive text: var(--darkgray-100)

Recommended semantic CSS tokens:

:root {
  --color-primary: var(--royalblue-100);
  --color-primary-hover: var(--royalblue-200);
  --color-primary-soft: var(--royalblue-900);

  --color-secondary: var(--slateblue-100);
  --color-info: var(--cornflowerblue-100);
  --color-success: var(--mediumseagreen-100);
  --color-warning: var(--goldenrod-100);
  --color-danger: var(--salmon-100);
  --color-critical: var(--tomato-100);

  --color-bg: var(--whitesmoke-300);
  --color-surface: var(--white-100);
  --color-sidebar: var(--darkslategray-600);
  --color-border: var(--aliceblue-100);

  --color-text: var(--black-300);
  --color-text-muted: var(--slategray-100);
  --color-text-disabled: var(--darkgray-100);
}

Tailwind integration:
If using Tailwind, extend tailwind.config.js or tailwind.config.ts using CSS variables.

Example:

theme: {
  extend: {
    colors: {
      primary: "var(--color-primary)",
      "primary-hover": "var(--color-primary-hover)",
      "primary-soft": "var(--color-primary-soft)",
      secondary: "var(--color-secondary)",
      info: "var(--color-info)",
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      danger: "var(--color-danger)",
      critical: "var(--color-critical)",
      background: "var(--color-bg)",
      surface: "var(--color-surface)",
      sidebar: "var(--color-sidebar)",
      border: "var(--color-border)",
      text: "var(--color-text)",
      muted: "var(--color-text-muted)"
    }
  }
}

Component color rules:
- Buttons:
  - Primary button uses primary background and white text
  - Secondary button uses white background, border color, and primary text
  - Danger button uses danger background and white text

- Badges:
  - Approved / Completed / On Track: success
  - Pending / Waiting Approval / Near Limit: warning
  - Rejected / Delayed / Over Budget: danger
  - Critical Risk: critical
  - Draft / Inactive: muted gray

- Charts:
  Use the palette variables for chart series:
  - var(--royalblue-100)
  - var(--cornflowerblue-100)
  - var(--mediumseagreen-100)
  - var(--goldenrod-100)
  - var(--salmon-100)
  - var(--slateblue-100)
  - var(--hotpink-100)

- Sidebar:
  Use var(--darkslategray-600) as sidebar background.
  Active menu item should use var(--royalblue-100).
  Sidebar text should use light/white variants.

- Cards:
  Use var(--white-100) background.
  Use var(--aliceblue-100) or var(--whitesmoke-400) for borders.
  Use soft shadows with black alpha variables.

Full palette to include in global CSS:

:root {
/* royalblue */
--royalblue-100: #556ee6;
--royalblue-200: #4458b8;
--royalblue-300: #485ec4;
--royalblue-400: rgba(85,110,230,0.25);
--royalblue-500: rgba(85,110,230,.25);
--royalblue-600: #435fe3;
--royalblue-700: rgba(85,110,230,.18);
--royalblue-800: rgba(85,110,230,.4);
--royalblue-900: rgba(85,110,230,.1);
--royalblue-1000: #5e76e7;

/* slateblue */
--slateblue-100: #564ab1;
--slateblue-200: #6f42c1;

/* hotpink */
--hotpink-100: #e83e8c;
--hotpink-200: rgba(232,62,140,.18);
--hotpink-300: rgba(232,62,140,.4);
--hotpink-400: rgba(232,62,140,.1);

/* salmon */
--salmon-100: #f46a6a;
--salmon-200: rgba(244,106,106,0.25);
--salmon-300: rgba(244,106,106,.18);
--salmon-400: rgba(244,106,106,.4);
--salmon-500: rgba(244,106,106,.1);

/* coral */
--coral-100: #f1734f;

/* goldenrod */
--goldenrod-100: #f1b44c;
--goldenrod-200: rgba(241,180,76,0.25);
--goldenrod-300: #f0ac39;
--goldenrod-400: rgba(241,180,76,.18);
--goldenrod-500: rgba(241,180,76,.4);
--goldenrod-600: rgba(241,180,76,.1);

/* mediumseagreen */
--mediumseagreen-100: #34c38f;
--mediumseagreen-200: rgba(52,195,143,0.25);
--mediumseagreen-300: #30b383;
--mediumseagreen-400: rgba(52,195,143,.18);
--mediumseagreen-500: rgba(52,195,143,.4);
--mediumseagreen-600: rgba(52,195,143,.1);

/* black */
--black-100: #050505;
--black-200: #000;
--black-300: #212529;
--black-400: #222736;
--black-500: rgba(18,38,63,0.03);
--black-600: rgba(0,0,0,0.075);
--black-700: rgba(0,0,0,0.175);
--black-800: rgba(0,0,0,0.125);
--black-900: rgba(0,0,0,0.2);
--black-1000: rgba(0,0,0,.8);

/* cornflowerblue */
--cornflowerblue-100: #50a5f1;
--cornflowerblue-200: #99a8f0;
--cornflowerblue-300: #778beb;
--cornflowerblue-400: rgba(80,165,241,0.25);
--cornflowerblue-500: #3d9bef;
--cornflowerblue-600: rgba(80,165,241,.18);
--cornflowerblue-700: rgba(80,165,241,.4);
--cornflowerblue-800: rgba(80,165,241,.1);

/* white */
--white-100: #fff;
--white-200: #fcfcfd;
--white-300: rgba(255,255,255,0.15);
--white-400: rgba(255,255,255,0);
--white-500: rgba(255,255,255,0.55);
--white-600: rgba(255,255,255,0.75);
--white-700: rgba(255,255,255,0.25);
--white-800: rgba(255,255,255,0.1);
--white-900: rgba(255,255,255,.15);
--white-1000: rgba(255,255,255,.5);

/* slategray */
--slategray-100: #74788d;
--slategray-200: #636678;
--slategray-300: rgba(116,120,141,0.25);
--slategray-400: #6b6e82;
--slategray-500: rgba(116,120,141,.18);
--slategray-600: rgba(116,120,141,.4);
--slategray-700: rgba(116,120,141,.1);
--slategray-800: #6a7187;

/* darkslategray */
--darkslategray-100: #343a40;
--darkslategray-200: #495057;
--darkslategray-300: #2e3038;
--darkslategray-400: #154e39;
--darkslategray-500: #204260;
--darkslategray-600: #2a3042;
--darkslategray-700: #32394e;
--darkslategray-800: #464855;
--darkslategray-900: #353d55;
--darkslategray-1000: #484e53;

/* whitesmoke */
--whitesmoke-100: #f8f9fa;
--whitesmoke-200: #f6f6f6;
--whitesmoke-300: #f8f8fb;
--whitesmoke-400: #e9ecef;
--whitesmoke-500: #f2f2f5;
--whitesmoke-600: #eee;
--whitesmoke-700: #f5f5f5;
--whitesmoke-800: #f6f8fa;

/* aliceblue */
--aliceblue-100: #eff2f7;
--aliceblue-200: #e1e7f0;
--aliceblue-300: rgba(239,242,247,.18);
--aliceblue-400: rgba(239,242,247,.4);
--aliceblue-500: rgba(239,242,247,.1);

/* lightgray */
--lightgray-100: #ced4da;
--lightgray-200: #cccdd1;
--lightgray-300: #c6d5e3;
--lightgray-400: #cbced2;

/* darkgray */
--darkgray-100: #adb5bd;
--darkgray-200: #acaebb;
--darkgray-300: #a2adb7;
--darkgray-400: #a2a2a2;

/* additional palette */
--darkslateblue-100: #222c5c;
--darkslateblue-200: #33428a;
--darkslateblue-300: #4053ad;
--saddlebrown-100: #60481e;
--sienna-100: #622a2a;
--lightsteelblue-100: #bbc5f5;
--lightsteelblue-200: #b9dbf9;
--lightsteelblue-300: #a6b0cf;
--lightsteelblue-400: #c3cbe4;
--lightsteelblue-500: #c7cbe1;
--lightsteelblue-600: #ccd4f8;
--silver-100: #c7c9d1;
--silver-200: #bfc2c6;
--silver-300: #b3b6b9;
--paleturquoise-100: #aee7d2;
--wheat-100: #f9e1b7;
--pink-100: #fbc3c3;
--beige-100: #fcf8e3;
--mediumaquamarine-100: #85dbbc;
--lightskyblue-100: #96c9f7;
--navajowhite-100: #f7d294;
--lightpink-100: #f8a6a6;
--seagreen-100: #1f7556;
--seagreen-200: #2ca67a;
--seagreen-300: #2a9c72;
--seagreen-400: #27926b;
--steelblue-100: #306391;
--steelblue-200: #448ccd;
--steelblue-300: #4084c1;
--steelblue-400: #3c7cb5;
--peru-100: #916c2e;
--peru-200: #cd9941;
--peru-300: #c1903d;
--peru-400: #b58739;
--indianred-100: #924040;
--indianred-200: #cf5a5a;
--indianred-300: #c35555;
--indianred-400: #b75050;
--lavender-100: #dde2fa;
--lavender-200: #dcedfc;
--gainsboro-100: #e3e4e8;
--gainsboro-200: #d7dade;
--lightcyan-100: #d6f3e9;
--powderblue-100: #c1dbd2;
--antiquewhite-100: #fcf0db;
--antiquewhite-200: #e3d8c5;
--mistyrose-100: #fde1e1;
--mistyrose-200: #e4cbcb;
--dimgray-100: #5d6071;
--dimgray-200: #575a6a;
--dimgray-300: #52585d;
--dimgray-400: #5d6166;
--dimgray-500: #555b6d;
--dimgray-600: #545a6d;
--mediumvioletred-100: #c53577;
--mediumvioletred-200: #ba3270;
--mediumvioletred-300: #ae2f69;
--ghostwhite-100: #f3f3f9;
--ghostwhite-200: #ebebf4;
--tomato-100: #f35757;
--deeppink-100: #e62c81;
--gray-100: #7f8387;
--lightslategray-100: #79829c;

/* semantic tokens */
--color-primary: var(--royalblue-100);
--color-primary-hover: var(--royalblue-200);
--color-primary-soft: var(--royalblue-900);
--color-secondary: var(--slateblue-100);
--color-info: var(--cornflowerblue-100);
--color-success: var(--mediumseagreen-100);
--color-warning: var(--goldenrod-100);
--color-danger: var(--salmon-100);
--color-critical: var(--tomato-100);
--color-bg: var(--whitesmoke-300);
--color-surface: var(--white-100);
--color-sidebar: var(--darkslategray-600);
--color-border: var(--aliceblue-100);
--color-text: var(--black-300);
--color-text-muted: var(--slategray-100);
--color-text-disabled: var(--darkgray-100);
}

UI/UX style:
- Corporate enterprise dashboard
- Clean and professional
- Dashboard-first
- Data-heavy but readable
- White cards
- Neutral background
- Dark sidebar
- Blue or indigo primary color
- Green for healthy/on-track
- Yellow/orange for warning
- Red for delayed/over-budget/critical
- Gray for draft/inactive
- Clear typography
- Dense but usable tables
- Status badges
- Progress bars
- Charts
- Tabs
- Drawers
- Modals
- Stepper forms
- Timelines

Recommended folder structure:

src/
  app/
  components/
    layout/
    charts/
    tables/
    forms/
    cards/
    status/
  data/
    mockSubholdings.ts
    mockProjects.ts
    mockTemplates.ts
    mockUsers.ts
    mockBudgets.ts
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    SubholdingsPage.tsx
    SubholdingDetailPage.tsx
    TemplatesPage.tsx
    TemplateFormPage.tsx
    ProjectsPage.tsx
    ProjectCreatePage.tsx
    ProjectDetailPage.tsx
    BudgetMonitoringPage.tsx
    ApprovalsPage.tsx
    ReportsPage.tsx
    UsersPage.tsx
    SettingsPage.tsx
  types/
  utils/
  main.tsx

Implementation plan:
1. Create the Vite React project structure using pnpm.
2. Install and configure routing, Tailwind, UI components, charts, and icons using pnpm.
3. Define TypeScript types for subholdings, projects, templates, users, budgets, milestones, approvals, and reports.
4. Create realistic mock data files.
5. Build mock authentication with selectable demo users.
6. Build the main layout with sidebar, header, breadcrumbs, filters, and user menu.
7. Implement role-based menu visibility and basic access behavior.
8. Build the dashboard page with summary cards, charts, filters, and monitoring tables.
9. Build the subholding list and subholding detail pages.
10. Build the project template list and template create/edit form with dynamic milestones and steps.
11. Build the project list page with filters, table, status badges, and actions.
12. Build the create project wizard using project templates.
13. Build the project detail page with tabs for overview, budget, milestones, steps, approvals, attachments, and activity log.
14. Build the budget monitoring page with financial summary, filters, table, and detail drawer.
15. Build the milestones and approvals page with approval actions.
16. Build reports, users, roles, and settings pages.
17. Add reusable components for metric cards, status badges, progress bars, charts, tables, filters, timelines, and forms.
18. Ensure the prototype is responsive and visually polished.
19. Ensure all routes work.
20. Ensure the app can run with:
    pnpm install
    pnpm dev

Final deliverable:
A working frontend-only React Vite prototype suitable for stakeholder presentation, showing how the holding company can monitor project budget, spending, milestones, approvals, and performance across subholdings.
