import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@project-management-mockup/ui/components/button";
import { cn } from "@project-management-mockup/ui/lib/utils";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function LinkButton({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: LinkProps & ButtonVariantProps & { children?: ReactNode; className?: string }) {
  return (
    <Link {...props} className={cn(buttonVariants({ variant, size, className }))}>
      {children}
    </Link>
  );
}
