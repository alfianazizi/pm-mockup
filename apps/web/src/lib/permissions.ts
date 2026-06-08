import type { DemoUser, Project, Role, Subholding } from "./domain";

export interface AccessResult {
  allowed: boolean;
  reason?: string;
}

const menuByRole: Record<Role, string[]> = {
  holding_admin: [
    "dashboard",
    "templates",
    "projects",
    "approvals",
  ],
  holding_executive: [
    "dashboard",
    "projects",
    "approvals",
  ],
  finance_controller: [
    "dashboard",
    "approvals",
  ],
  subholding_admin: [
    "dashboard",
    "templates",
    "projects",
    "approvals",
  ],
  project_owner: [
    "dashboard",
    "projects",
    "approvals",
  ],
  approver: [
    "dashboard",
    "approvals",
    "projects",
  ],
  viewer: [
    "dashboard",
    "projects",
  ],
};

const focusMenuKeys = new Set([
  "dashboard",
  "templates",
  "projects",
  "approvals",
]);

const outOfFocusRoutes = new Set([
  "/subholdings",
  "/budget-monitoring",
  "/reports",
  "/users",
  "/settings",
]);

export function isOutOfFocusRoute(pathname: string): boolean {
  return outOfFocusRoutes.has(pathname) || Array.from(outOfFocusRoutes).some((route) => pathname.startsWith(`${route}/`));
}

export function isFocusMenuKey(key: string): boolean {
  return focusMenuKeys.has(key);
}

export function canAccessMenu(user: DemoUser | undefined, key: string): boolean {
  if (!user) return false;
  return menuByRole[user.role].includes(key);
}

export function canAccessRoute(user: DemoUser | undefined, route: string): AccessResult {
  if (!user) return { allowed: false, reason: "Not signed in" };
  if (route === "/login") return { allowed: true };
  const menuKey = routeKey(route);
  if (!menuKey) return { allowed: true };
  if (!canAccessMenu(user, menuKey)) {
    return { allowed: false, reason: "You do not have access to this module." };
  }
  return { allowed: true };
}

function routeKey(route: string): string | null {
  if (route.startsWith("/dashboard")) return "dashboard";
  if (route.startsWith("/subholdings")) return "subholdings";
  if (route.startsWith("/templates")) return "templates";
  if (route.startsWith("/projects")) return "projects";
  if (route.startsWith("/budget-monitoring")) return "budget-monitoring";
  if (route.startsWith("/approvals")) return "approvals";
  if (route.startsWith("/reports")) return "reports";
  if (route.startsWith("/users")) return "users";
  if (route.startsWith("/settings")) return "settings";
  return null;
}

export function isHoldingWide(user: DemoUser | undefined): boolean {
  if (!user) return false;
  return (
    user.role === "holding_admin" ||
    user.role === "holding_executive" ||
    user.role === "finance_controller"
  );
}

export function canEditTemplateLibrary(user: DemoUser | undefined): boolean {
  return user?.role === "holding_admin";
}

export function canCreateProject(user: DemoUser | undefined): boolean {
  if (!user) return false;
  return user.role === "holding_admin" || user.role === "subholding_admin";
}

export function canManageProject(user: DemoUser | undefined, project: Project | undefined): boolean {
  if (!user || !project) return false;
  if (user.role === "holding_admin") return true;
  if (user.role === "subholding_admin") return user.subholdingId === project.subholdingId;
  if (user.role === "project_owner") return user.projectIds?.includes(project.id) ?? false;
  return false;
}

export function visibleSubholdingIds(user: DemoUser | undefined, all: Subholding[]): string[] | "all" {
  if (!user) return [];
  if (isHoldingWide(user)) return "all";
  if (user.subholdingId) return [user.subholdingId];
  return all.map((s) => s.id);
}
