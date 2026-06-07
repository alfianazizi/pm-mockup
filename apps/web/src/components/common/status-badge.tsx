import type { ReactNode } from "react";
import { cn } from "@project-management-mockup/ui/lib/utils";

type Tone = "muted" | "info" | "success" | "warning" | "danger" | "critical" | "primary" | "secondary";

const toneClasses: Record<Tone, string> = {
  muted: "bg-muted text-muted-foreground ring-foreground/10",
  info: "bg-info/10 text-info ring-info/20",
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/10 text-warning ring-warning/20",
  danger: "bg-danger/10 text-danger ring-danger/20",
  critical: "bg-critical/10 text-critical ring-critical/20",
  primary: "bg-primary/10 text-primary ring-primary/20",
  secondary: "bg-secondary/10 text-secondary ring-secondary/20",
};

export function StatusBadge({ tone = "muted", children, className, icon }: { tone?: Tone; children: ReactNode; className?: string; icon?: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
