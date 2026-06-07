import { Outlet, createRootRouteWithContext, useLocation } from "@tanstack/react-router";
import { Toaster } from "@project-management-mockup/ui/components/sonner";
import { ShieldAlert } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/common/empty-state";
import { ThemeProvider } from "@/components/theme-provider";
import { AppStateProvider, useAppState } from "@/lib/app-state";
import { canAccessRoute } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/selectors";

import "../index.css";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
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
    return (
      <div className="h-svh flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="size-8 text-muted-foreground mx-auto" />
          <div className="mt-2 text-sm font-medium text-foreground">Not signed in</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Please use the login page to choose a demo user.
          </div>
        </div>
      </div>
    );
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
