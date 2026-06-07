import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { X } from "lucide-react";

import { cn } from "@project-management-mockup/ui/lib/utils";

import { useAppState } from "@/lib/app-state";
import { getCurrentUser, visibleSubholdings } from "@/lib/selectors";
import { canAccessMenu } from "@/lib/permissions";

import { GlobalFilters } from "./global-filters";
import { NAV, Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useAppState();
  const user = getCurrentUser(state);
  const subholdings = visibleSubholdings(state);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const items = NAV.filter((n) => canAccessMenu(user, n.key));

  return (
    <div className="flex h-svh bg-background text-foreground">
      <Sidebar items={items} currentPath={location.pathname} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} onOpenMobileNav={() => setMobileOpen(true)} />
        <GlobalFilters user={user} subholdings={subholdings} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-3 md:px-4 py-4 md:py-6 max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col">
            <div className="h-14 px-4 flex items-center justify-between border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-sm bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  PH
                </div>
                <span className="text-sm font-semibold">Pratama Holding</span>
              </div>
              <button
                type="button"
                className="text-sidebar-muted hover:text-sidebar-foreground"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3">
              <ul className="space-y-0.5 px-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
