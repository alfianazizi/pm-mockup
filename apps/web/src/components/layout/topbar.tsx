import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, Search } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Input } from "@project-management-mockup/ui/components/input";
import { Label } from "@project-management-mockup/ui/components/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@project-management-mockup/ui/components/dropdown-menu";

import { useAppState } from "@/lib/app-state";
import { logout } from "@/lib/actions";
import { ROLE_LABELS, type DemoUser } from "@/lib/domain";
import { initials } from "@/lib/formatters";
import { cn } from "@project-management-mockup/ui/lib/utils";

export function Topbar({ user, onOpenMobileNav }: { user: DemoUser; onOpenMobileNav: () => void }) {
  const navigate = useNavigate();
  const { setState, reset } = useAppState();

  return (
    <header className="h-14 bg-card border-b border-border px-3 md:px-4 flex items-center gap-3">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="md:hidden text-muted-foreground hover:text-foreground"
        aria-label="Open navigation"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search projects, milestones, subholdings..."
            className="pl-7 h-8 text-xs"
          />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <Button variant="ghost" size="sm" {...props} className={cn("gap-2 px-2", props.className)}>
              <span
                className="size-7 rounded-sm flex items-center justify-center text-[11px] font-medium text-white"
                style={{ background: user.avatarColor }}
              >
                {initials(user.name)}
              </span>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-medium text-foreground">{user.name}</span>
                <span className="text-[10px] text-muted-foreground">{ROLE_LABELS[user.role]}</span>
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          )}
        />
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <Label className="text-foreground text-xs font-medium">{user.name}</Label>
              <span className="text-[11px] text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setState((s) => logout(s));
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="size-4" /> Sign out
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (window.confirm("Reset all demo data to seed state?")) {
                reset();
              }
            }}
          >
            Reset demo data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
