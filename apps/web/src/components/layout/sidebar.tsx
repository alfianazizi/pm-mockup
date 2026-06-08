import { Link, useLocation } from "@tanstack/react-router";
import {
  CheckSquare,
  FolderKanban,
  Gauge,
  LayoutTemplate,
} from "lucide-react";
import type { ComponentType } from "react";

import { cn } from "@project-management-mockup/ui/lib/utils";

interface NavItem {
  to: string;
  label: string;
  key: string;
  icon: ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", key: "dashboard", icon: Gauge },
  { to: "/templates", label: "Project Templates", key: "templates", icon: LayoutTemplate },
  { to: "/projects", label: "Projects", key: "projects", icon: FolderKanban },
  { to: "/approvals", label: "Milestones & Approvals", key: "approvals", icon: CheckSquare },
];

export function Sidebar({ items, currentPath }: { items: NavItem[]; currentPath: string }) {
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 bg-sidebar text-sidebar-foreground">
      <div className="h-14 px-4 flex items-center gap-2 border-b border-sidebar-border">
        <div className="size-7 rounded-sm bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
          PH
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Pratama Holding</span>
          <span className="text-[10px] text-sidebar-muted uppercase tracking-wide">PMO Console</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        <ul className="space-y-0.5 px-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = currentPath === item.to || currentPath.startsWith(`${item.to}/`);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 text-xs rounded-sm transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-4 py-3 border-t border-sidebar-border text-[11px] text-sidebar-muted">
        Prototype build &middot; v1.0
      </div>
    </aside>
  );
}

export { NAV };
