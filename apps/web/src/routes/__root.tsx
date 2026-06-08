import { Outlet, createRootRouteWithContext, redirect, useLocation } from "@tanstack/react-router";
import { Toaster } from "@project-management-mockup/ui/components/sonner";
import { ShieldAlert } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/common/empty-state";
import { ThemeProvider } from "@/components/theme-provider";
import { AppStateProvider, useAppState } from "@/lib/app-state";
import { canAccessRoute } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/selectors";
import { readCurrentUserId } from "@/lib/storage";

import "../index.css";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/login") return;
    const userId = readCurrentUserId();
    if (!userId) {
      throw redirect({ to: "/login" });
    }
  },
  component: RootComponent,
  head: () => ({
    meta: [
      { title: "Pratama Holding PMO" },
      {
        name: "description",
        content: "Frontend-only project management and budget monitoring dashboard prototype.",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
});

function GuardedShell() {
  const { state } = useAppState();
  const user = getCurrentUser(state);
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  if (isLogin) {
    return <Outlet />;
  }

  if (!user) {
    throw redirect({ to: "/login" });
  }

  const access = canAccessRoute(user, location.pathname);
  if (!access.allowed) {
    return (
      <AppShell>
        <EmptyState
          icon={<ShieldAlert className="size-8" />}
          title="Access denied"
          description={access.reason}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <div className="h-svh bg-background text-foreground">
          <GuardedShell />
        </div>
        <Toaster richColors position="top-right" />
      </AppStateProvider>
    </ThemeProvider>
  );
}
