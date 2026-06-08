import type { DemoUser, Project, Role, Department } from "./domain";

export interface AccessResult {
  allowed: boolean;
  reason?: string;
}

const menuByRole: Record<Role, string[]> = {
  company_admin: [
    "dashboard",
    "templates",
    "projects",
    "approvals",
  ],
  company_executive: [
    "dashboard",
    "projects",
    "approvals",
  ],
  finance_controller: [
    "dashboard",
    "approvals",
  ],
  department_admin: [
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
  "/departments",
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
  if (route.startsWith("/departments")) return "departments";
  if (route.startsWith("/templates")) return "templates";
  if (route.startsWith("/projects")) return "projects";
  if (route.startsWith("/budget-monitoring")) return "budget-monitoring";
  if (route.startsWith("/approvals")) return "approvals";
  if (route.startsWith("/reports")) return "reports";
  if (route.startsWith("/users")) return "users";
  if (route.startsWith("/settings")) return "settings";
  return null;
}

export function isCompanyWide(user: DemoUser | undefined): boolean {
  if (!user) return false;
  return (
    user.role === "company_admin" ||
    user.role === "company_executive" ||
    user.role === "finance_controller"
  );
}

export function canEditTemplateLibrary(user: DemoUser | undefined): boolean {
  return user?.role === "company_admin";
}

export function canCreateProject(user: DemoUser | undefined): boolean {
  if (!user) return false;
  return user.role === "company_admin" || user.role === "department_admin";
}

export function canManageProject(user: DemoUser | undefined, project: Project | undefined): boolean {
  if (!user || !project) return false;
  if (user.role === "company_admin") return true;
  if (user.role === "department_admin") return user.departmentId === project.departmentId;
  if (user.role === "project_owner") return user.projectIds?.includes(project.id) ?? false;
  return false;
}

export function visibleDepartmentIds(user: DemoUser | undefined, all: Department[]): string[] | "all" {
  if (!user) return [];
  if (isCompanyWide(user)) return "all";
  if (user.departmentId) return [user.departmentId];
  return all.map((s) => s.id);
}
