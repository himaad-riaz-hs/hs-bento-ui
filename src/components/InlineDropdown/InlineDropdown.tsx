import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface InlineDropdownOption {
  value: string;
  label: string;
}

export interface InlineDropdownProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: InlineDropdownOption[];
  label?: string;
  size?: "small" | "medium";
}

const InlineDropdown = forwardRef<HTMLSelectElement, InlineDropdownProps>(
  ({ className, options, label, size = "medium", disabled, ...props }, ref) => {
    return (
      <span className={cn("inline-flex items-center gap-[8px]", className)}>
        {label && (
          <span className="font-[family-name:var(--hs-typeface-base-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)] text-[16px] leading-[24px] text-[color:var(--hs-color-text-subtle)]">
            {label}
          </span>
        )}
        <span
          className={cn(
            "relative inline-flex items-center rounded-[var(--hs-comp-input-border-radii)] transition-colors",
            "bg-transparent",
            "hover:bg-[var(--hs-color-fill-base)]",
            "focus-within:[box-shadow:var(--hs-focus-ring)]",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              "appearance-none bg-transparent outline-none cursor-pointer",
              "pl-[12px] pr-[16px]",
              "font-[family-name:var(--hs-typeface-strong-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)] font-semibold text-[color:var(--hs-comp-dropdown-inline-text)]",
              size === "small"
                ? "text-[14px] leading-[24px] py-[4px]"
                : "text-[16px] leading-[24px] py-[8px]",
              "disabled:cursor-not-allowed"
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-[4px] text-[color:var(--hs-comp-dropdown-inline-text)]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </span>
    );
  }
);
InlineDropdown.displayName = "InlineDropdown";

export { InlineDropdown };
