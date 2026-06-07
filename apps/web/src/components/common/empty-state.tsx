import type { ReactNode } from "react";

import { Card } from "@project-management-mockup/ui/components/card";

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <Card className="items-center text-center">
      <div className="flex flex-col items-center gap-3 px-6 py-10">
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description ? <div className="text-xs text-muted-foreground max-w-md">{description}</div> : null}
        {action}
      </div>
    </Card>
  );
}
