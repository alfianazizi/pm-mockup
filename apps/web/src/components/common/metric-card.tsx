import type { ReactNode } from "react";
import { Card } from "@project-management-mockup/ui/components/card";
import { cn } from "@project-management-mockup/ui/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
  trend,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "muted";
  trend?: ReactNode;
  className?: string;
}) {
  const toneRing = {
    primary: "ring-primary/20",
    success: "ring-success/20",
    warning: "ring-warning/20",
    danger: "ring-danger/20",
    info: "ring-info/20",
    muted: "ring-foreground/10",
  }[tone];
  return (
    <Card size="sm" className={cn("ring-1 ring-inset", toneRing, className)}>
      <div className="px-3 py-3 flex items-start gap-3">
        {icon ? (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-sm ring-1 ring-inset",
              tone === "primary" && "bg-primary/10 text-primary ring-primary/20",
              tone === "success" && "bg-success/10 text-success ring-success/20",
              tone === "warning" && "bg-warning/10 text-warning ring-warning/20",
              tone === "danger" && "bg-danger/10 text-danger ring-danger/20",
              tone === "info" && "bg-info/10 text-info ring-info/20",
              tone === "muted" && "bg-muted text-muted-foreground ring-foreground/10",
            )}
          >
            {icon}
          </div>
        ) : null}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-1 text-lg font-semibold text-foreground leading-tight truncate">{value}</div>
          {hint ? <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div> : null}
        </div>
        {trend ? <div className="text-[11px] text-muted-foreground shrink-0">{trend}</div> : null}
      </div>
    </Card>
  );
}
