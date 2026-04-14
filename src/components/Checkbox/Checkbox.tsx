import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  indeterminate?: boolean;
  error?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate, error, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-[8px] cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-40",
          className
        )}
      >
        <span className="relative inline-flex items-center justify-center">
          <input
            ref={(el) => {
              if (el) el.indeterminate = !!indeterminate;
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
            }}
            type="checkbox"
            id={inputId}
            disabled={disabled}
            className={cn(
              "peer h-[18px] w-[18px] appearance-none rounded-[4px] border-[2px] transition-colors cursor-pointer",
              "border-[var(--hs-color-border-base)] bg-[var(--hs-comp-input-bg)]",
              "checked:border-[var(--hs-comp-button-filled-bg)] checked:bg-[var(--hs-comp-button-filled-bg)]",
              "indeterminate:border-[var(--hs-comp-button-filled-bg)] indeterminate:bg-[var(--hs-comp-button-filled-bg)]",
              "hover:border-[var(--hs-color-border-strong)]",
              "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)]",
              error && "border-[var(--hs-color-border-negative)]"
            )}
            {...props}
          />
          <svg
            className="pointer-events-none absolute h-[12px] w-[12px] text-white opacity-0 peer-checked:opacity-100"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg
            className="pointer-events-none absolute h-[12px] w-[12px] text-white opacity-0 peer-indeterminate:opacity-100"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M2.5 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        {label && (
          <span className={cn(hsPrimitive.controlLabel, "font-normal")}>
            {label}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
