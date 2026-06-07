import { cn } from "@project-management-mockup/ui/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger" | "info" | "muted";

const toneBg: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  muted: "bg-muted-foreground",
};

export function ProgressBar({ value, tone = "primary", className, label }: { value: number; tone?: Tone; className?: string; label?: string }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className={cn("w-full", className)}>
      {label ? <div className="mb-1 text-[11px] text-muted-foreground">{label}</div> : null}
      <div className="h-1.5 w-full overflow-hidden rounded-sm bg-muted">
        <div className={cn("h-full transition-all", toneBg[tone])} style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}
