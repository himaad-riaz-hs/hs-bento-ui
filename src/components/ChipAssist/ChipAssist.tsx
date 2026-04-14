import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ChipAssistProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leadingIcon?: ReactNode;
}

const ChipAssist = forwardRef<HTMLButtonElement, ChipAssistProps>(
  ({ className, leadingIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-[8px] rounded-[999px] border border-[var(--hs-color-border-base)]",
          "bg-[var(--hs-color-fill-app)] h-[40px]",
          "pl-[16px] pr-[12px] py-[8px]",
          "font-[family-name:var(--hs-typeface-strong-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)] text-hs-strong-medium text-[color:var(--hs-color-text-base)]",
          "hover:bg-[var(--hs-color-fill-base)] transition-colors",
          "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {leadingIcon && <span className="inline-flex shrink-0">{leadingIcon}</span>}
        {children}
      </button>
    );
  }
);
ChipAssist.displayName = "ChipAssist";

export { ChipAssist };
