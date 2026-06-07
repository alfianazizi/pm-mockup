import type { ReactNode } from "react";
import { Card } from "@project-management-mockup/ui/components/card";
import { cn } from "@project-management-mockup/ui/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  tabs,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  tabs?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="text-xs text-muted-foreground mt-1 max-w-2xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {tabs}
    </div>
  );
}

export function SectionCard({ title, description, action, children, className }: { title?: ReactNode; description?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("bg-card", className)}>
      {title ? (
        <div className="flex items-start justify-between gap-3 px-4 pt-3">
          <div>
            <div className="text-sm font-medium text-foreground">{title}</div>
            {description ? <div className="text-[11px] text-muted-foreground mt-0.5">{description}</div> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={cn(title ? "p-4 pt-3" : "p-4")}>{children}</div>
    </Card>
  );
}
