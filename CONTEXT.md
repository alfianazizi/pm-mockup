# Project Management Dashboard Prototype Glossary

> Glossary-only documentation. No implementation details.

## Holding

The parent organization that consolidates business units, projects, budgets, and performance across the group.

## Subholding

A business unit under the Holding. A Subholding owns its own Projects, users, budget allocation, and performance rollups.

## Demo User

A named fake identity used in the prototype login screen. Each Demo User has a Role, a Data Scope, and access to mock actions. The login page lists Demo Users as selectable cards.

## Role

The job-level capability of a Demo User. Roles in the prototype:
- Holding Admin: full access, can edit the global Project Template library.
- Holding Executive: read-mostly access across the Holding.
- Finance Controller: read access to budgets, spending, variance, and financial reports.
- Subholding Admin: manages Projects and users for the assigned Subholding.
- Project Owner: manages assigned Projects, updates progress, submits Milestones, uploads Attachments.
- Approver: reviews assigned Approval Requests and decides on them.
- Viewer: read-only access to assigned Projects and dashboards.

## Data Scope

The set of records a Demo User is allowed to see. Holding-wide roles see all records. Scoped roles see only records for their assigned Subholding, Projects, or Approval Requests. The dashboard and tables filter visible data by Data Scope before rendering.

## Project Template

A reusable blueprint that defines the default structure of a Project: metadata, default Milestones, default Steps, required Attachments, Approval Rules, Budget checkpoints, Risk checklist, and Completion criteria. Project Templates are centrally governed by Holding Admin.

## Template Snapshot

A copy of a Project Template's Milestones and Steps that lives inside a Project at the time the Project was created. Editing the original Project Template does not mutate existing Project snapshots. Projects retain the template id and version label for traceability.

## Template Version

A simple visible label on a Project Template, e.g. `v1.0`. The label is incremented in mock data when the template is meaningfully edited. The version used by a Project is recorded on the Project itself.

## Project

A time-bound initiative owned by a Subholding. A Project has a lifecycle status, approved budget, spending, Milestones, Approvals, Attachments, and an Activity Log.

## Project Lifecycle Status

The execution state of a Project. The interactive lifecycle in the prototype is `Draft` -> `Waiting Approval` -> `Active` -> `Completed`. `On Hold`, `Delayed`, and `Cancelled` are also visible as realistic status examples but do not have deep workflow rules.

## Milestone

A named checkpoint within a Project. Every Milestone belongs to exactly one Project. Milestones may require Approval and may trigger budget checkpoints.

## Milestone Status

The work state of a Milestone. Values: `Not Started`, `In Progress`, `Submitted`, `Completed`, `Delayed`.

## Step

A small unit of work inside a Milestone. Every Step belongs to exactly one Milestone.

## Project Progress

A derived percentage computed from Milestone progress and Step progress. Project Progress is not edited directly.

## Approval Request

A request for review created when a Project or Milestone is submitted, or when a budget/completion action needs decision. Approval Requests are routed to specific Demo Approver users.

## Approval Status

The decision state of an Approval Request. Values: `Pending`, `Approved`, `Rejected`, `Revision Required`. This is intentionally separate from Milestone work status.

## Approver

A Demo User with the role `Approver` who can decide on Approval Requests routed to them.

## Budget Allocation

The annual approved amount assigned to a Subholding. Project budgets and spending consume this allocation.

## Budget Status

The state of a Project's actual spending versus its approved budget. Values: `Normal` below 80% utilization, `Near Limit` from 80% through 100%, `Over Budget` above 100%.

## Risk Level

A signal of how likely a Project is to miss goals. Values: `Low`, `Medium`, `High`, `Critical`. Risk Level is computed from signals such as delayed Milestones, over-budget status, and low progress near the target date, with an optional seeded override for storytelling.

## Attachment

A file metadata row recorded against a Project, Milestone, or Step. The prototype stores metadata only and does not store file contents.

## Activity Log

A chronological list of Events on a Project, including seeded rows and appended entries for key local interactions such as Project creation, template edit, progress update, Approval decision, and attachment upload.

## Archived

A soft state on a Project, Project Template, or Subholding. Archived records are hidden from default active lists but remain visible through a status filter and are never deleted.
