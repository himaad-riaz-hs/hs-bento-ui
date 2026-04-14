import { forwardRef, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  position?: "left" | "right";
  width?: string;
  overlay?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      position = "right",
      width = "360px",
      overlay = true,
      header,
      footer,
      children,
      className,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      if (open) document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
      <>
        {overlay && (
          <div
            className="fixed inset-0 z-40 bg-hs-overlay-scrim animate-[fadeIn_150ms_ease-out]"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          style={{ width }}
          className={cn(
            "fixed top-0 bottom-0 z-50 flex flex-col bg-[var(--hs-color-fill-app)] border-[var(--hs-color-border-subtle)]",
            position === "left"
              ? "left-0 border-r shadow-[var(--hs-comp-menu-shadow)] animate-[slideInLeft_200ms_ease-out]"
              : "right-0 border-l shadow-[var(--hs-comp-menu-shadow)] animate-[slideInRight_200ms_ease-out]",
            className
          )}
          {...props}
        >
          {header && (
            <div className="flex items-center justify-between border-b border-[var(--hs-color-border-subtle)] px-[16px] py-[12px]">
              <div className="flex-1">{header}</div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-[50px] p-[4px] hover:bg-[var(--hs-color-fill-base)] transition-colors text-[color:var(--hs-color-icon-subtle)]"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-[16px]">{children}</div>
          {footer && (
            <div className="border-t border-[var(--hs-color-border-subtle)] px-[16px] py-[12px]">{footer}</div>
          )}
        </div>
      </>
    );
  }
);
Drawer.displayName = "Drawer";

export { Drawer };
