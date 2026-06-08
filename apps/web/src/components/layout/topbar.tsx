import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@project-management-mockup/ui/components/button";
import { Card } from "@project-management-mockup/ui/components/card";
import { Input } from "@project-management-mockup/ui/components/input";
import { Label } from "@project-management-mockup/ui/components/label";
import { cn } from "@project-management-mockup/ui/lib/utils";

import { useAppState } from "@/lib/app-state";
import { logout } from "@/lib/actions";
import { ROLE_LABELS, type DemoUser } from "@/lib/domain";
import { initials } from "@/lib/formatters";

export function Topbar({ user, onOpenMobileNav }: { user: DemoUser; onOpenMobileNav: () => void }) {
  const navigate = useNavigate();
  const { setState, reset } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const handleSignOut = () => {
    setState((s) => logout(s));
    setMenuOpen(false);
    navigate({ to: "/login" });
  };

  const handleReset = () => {
    if (window.confirm("Reset all demo data to seed state?")) {
      reset();
      setMenuOpen(false);
    }
  };

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
            placeholder="Search projects and templates..."
            className="pl-7 h-8 text-xs"
          />
        </div>
      </div>
      <div className="relative">
        <Button
          ref={triggerRef}
          type="button"
          variant="ghost"
          size="sm"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className={cn("gap-2 px-2", menuOpen && "bg-muted")}
        >
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
        {menuOpen ? (
          <div
            ref={menuRef}
            role="menu"
            className="absolute right-0 top-full mt-1 z-50 min-w-60"
          >
            <Card className="p-3 shadow-md ring-1 ring-inset ring-foreground/10">
              <div className="flex flex-col gap-0.5 pb-2 border-b border-border">
                <Label className="text-foreground text-xs font-medium">{user.name}</Label>
                <span className="text-[11px] text-muted-foreground">{user.email}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
              <div className="mt-2 flex flex-col">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-2 py-2 text-xs rounded-sm text-foreground hover:bg-muted"
                >
                  <LogOut className="size-3.5" /> Sign out
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-2 py-2 text-xs rounded-sm text-foreground hover:bg-muted"
                >
                  Reset demo data
                </button>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </header>
  );
}
