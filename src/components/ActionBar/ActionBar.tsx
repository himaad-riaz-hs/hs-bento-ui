import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="toolbar"
        className={cn(
          "inline-flex items-center gap-[4px] rounded-[var(--hs-radii-2)] border border-[var(--hs-color-border-subtle)] bg-[var(--hs-color-fill-app)] p-[4px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ActionBar.displayName = "ActionBar";

function ActionBarDivider({ className }: { className?: string }) {
  return (
    <span
      role="separator"
      className={cn("mx-[4px] h-[24px] w-[1px] bg-[var(--hs-color-border-subtle)]", className)}
    />
  );
}
ActionBarDivider.displayName = "ActionBarDivider";

export { ActionBar, ActionBarDivider };
