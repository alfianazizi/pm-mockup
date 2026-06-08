import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, Compass } from "lucide-react";

import { Card } from "@project-management-mockup/ui/components/card";
import { PageHeader } from "@/components/common/page-header";

interface FocusStubProps {
  title: string;
  description?: ReactNode;
  backTo?: string;
  backLabel?: string;
}

export function FocusStub({ title, description, backTo = "/projects", backLabel = "Back to projects" }: FocusStubProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description="This module is out of scope for the current prototype focus." />
      <Card className="p-6 ring-1 ring-inset ring-foreground/10">
        <div className="flex flex-col items-center text-center gap-3 max-w-md mx-auto">
          <div className="size-10 rounded-sm bg-muted text-muted-foreground flex items-center justify-center">
            <Compass className="size-5" />
          </div>
          <div className="text-sm font-medium text-foreground">Out of focus for the prototype</div>
          {description ? <div className="text-xs text-muted-foreground">{description}</div> : null}
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
          >
            <ArrowLeft className="size-3.5" /> {backLabel}
          </Link>
        </div>
      </Card>
    </div>
  );
}
