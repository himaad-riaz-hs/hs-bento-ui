import { forwardRef, useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export interface SplitButtonItem {
  label: string;
  value: string;
}

export interface SplitButtonProps {
  label: ReactNode;
  onAction?: () => void;
  items: SplitButtonItem[];
  onSelect?: (value: string) => void;
  variant?: "filled" | "outlined" | "tonal";
  size?: "small" | "medium";
  disabled?: boolean;
  className?: string;
}

const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  ({ label, onAction, items, onSelect, variant = "filled", size = "medium", disabled, className }, ref) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const baseClasses = {
      filled: "bg-[var(--hs-comp-button-filled-bg)] text-[color:var(--hs-comp-button-filled-text)] hover:bg-[var(--hs-comp-button-filled-bg-hover)]",
      outlined: "shadow-[inset_0_0_0_var(--hs-stroke-weight-base,1px)_var(--hs-comp-button-outlined-border)] bg-transparent text-[color:var(--hs-comp-button-outlined-text)] hover:bg-[var(--hs-comp-button-outlined-bg-hover)]",
      tonal: "bg-[var(--hs-comp-button-tonal-bg)] text-[color:var(--hs-comp-button-tonal-text)] hover:bg-[var(--hs-comp-button-tonal-bg-hover)]",
    };

    return (
      <div ref={ref || wrapperRef} className={cn("relative inline-flex font-[family-name:var(--hs-typeface-button-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)]", className)}>
        <div ref={wrapperRef} className="inline-flex gap-[1px]">
          <button
            type="button"
            disabled={disabled}
            onClick={onAction}
            className={cn(
              "inline-flex items-center justify-center px-[24px] py-[12px] font-bold transition-colors",
              "text-[length:var(--hs-font-size-button-medium)] leading-[length:var(--hs-line-height-button-medium)]",
              baseClasses[variant],
              "rounded-l-[var(--hs-comp-button-border-radii)] rounded-r-none",
              "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)] focus-visible:z-10",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            {label}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen(!open)}
            aria-haspopup="menu"
            aria-expanded={open}
            className={cn(
              "inline-flex items-center justify-center w-[48px] h-[48px] transition-colors",
              baseClasses[variant],
              "rounded-r-[var(--hs-comp-button-border-radii)] rounded-l-none",
              "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)] focus-visible:z-10",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {open && (
          <div
            role="menu"
            className="absolute top-full left-0 z-50 mt-hs-1 min-w-full rounded-hs-input border border-hs-border-subtle bg-hs-fill-app shadow-hs-menu py-hs-1"
          >
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                role="menuitem"
                onClick={() => { onSelect?.(item.value); setOpen(false); }}
                className={cn(
                  "flex w-full px-hs-4 py-hs-3 text-left font-normal transition-colors",
                  hsPrimitive.menuItem,
                  "hover:bg-hs-fill-base"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
SplitButton.displayName = "SplitButton";

export { SplitButton };
