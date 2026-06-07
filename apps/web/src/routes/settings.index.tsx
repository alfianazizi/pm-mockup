import { createFileRoute } from "@tanstack/react-router";
import { Bell, BookOpen, Calendar, Folder, GitBranch, Layers, ShieldCheck } from "lucide-react";

import { Card } from "@project-management-mockup/ui/components/card";
import { Input } from "@project-management-mockup/ui/components/input";
import { Label } from "@project-management-mockup/ui/components/label";

import { PageHeader, SectionCard } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});

const PROJECT_CATEGORIES = ["Infrastructure", "IT", "Facility", "Procurement", "Expansion"];
const BUDGET_CATEGORIES = ["Equipment", "Contractor", "Consulting", "Materials", "Logistics", "Permits"];

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Global configuration for categories, fiscal calendar, notifications, and roles. Inputs are mocked in this prototype."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Project categories" description="Used across project templates and projects">
          <div className="flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((c) => (
              <StatusBadge key={c} tone="info" icon={<Folder className="size-3" />}>
                {c}
              </StatusBadge>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Budget categories" description="Used by spending records and budget monitoring">
          <div className="flex flex-wrap gap-2">
            {BUDGET_CATEGORIES.map((c) => (
              <StatusBadge key={c} tone="primary" icon={<Layers className="size-3" />}>
                {c}
              </StatusBadge>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Approval flow configuration" description="Default rules for project and milestone approval">
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <GitBranch className="size-3.5" />
              Project activation: routes to Subholding Admin by default
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5" />
              Milestone approval: routed to the milestone approver role
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="size-3.5" />
              Rejection comments are required
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Fiscal year settings" description="Calendar-year periods are used in the prototype">
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3.5" /> Start month: January
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3.5" /> Periods: Quarterly (Q1-Q4), Semesterly (S1-S2), Annual
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Notification settings" description="Email and in-app notifications">
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Bell className="size-3.5 text-muted-foreground" />
              <span>Approval requests pending for 3+ days</span>
              <StatusBadge tone="success">Enabled</StatusBadge>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="size-3.5 text-muted-foreground" />
              <span>Project over budget alert</span>
              <StatusBadge tone="success">Enabled</StatusBadge>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="size-3.5 text-muted-foreground" />
              <span>Milestone delayed alert</span>
              <StatusBadge tone="muted">Disabled</StatusBadge>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Role permissions" description="Capabilities per role">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-muted-foreground">Holding Admin</div>
            <div>Manage global templates, projects, users</div>
            <div className="text-muted-foreground">Subholding Admin</div>
            <div>Create projects, manage subholding users</div>
            <div className="text-muted-foreground">Project Owner</div>
            <div>Update progress, submit milestones</div>
            <div className="text-muted-foreground">Approver</div>
            <div>Approve or reject assigned requests</div>
            <div className="text-muted-foreground">Finance Controller</div>
            <div>Read-only access to budgets and reports</div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="System information" description="Prototype configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <Label className="text-muted-foreground">App name</Label>
            <Input value="Pratama Holding PMO" readOnly className="h-8 text-xs mt-1" />
          </div>
          <div>
            <Label className="text-muted-foreground">Currency</Label>
            <Input value="IDR (Rp) — Billions" readOnly className="h-8 text-xs mt-1" />
          </div>
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => toast.success("Demo data reset", { description: "All seeded records restored." })}
            className="text-xs text-primary hover:underline"
          >
            Reset demo data
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
