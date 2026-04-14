import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  options: SelectOption[];
  placeholder?: string;
  size?: "small" | "medium";
  leadingIcon?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      error,
      options,
      placeholder,
      size = "medium",
      leadingIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `select-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
    const hasError = error || !!errorText;
    const h = size === "small" ? "h-[40px]" : "h-[48px]";

    return (
      <div className={cn("flex flex-col gap-hs-1", className)}>
        {label && (
          <label htmlFor={inputId} className={cn(hsPrimitive.formLabel, "flex flex-wrap items-baseline gap-hs-2")}>
            {label}
            {helperText && !hasError && (
              <span className="font-normal text-hs-base-medium text-hs-text-subtle">{helperText}</span>
            )}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center rounded-hs-input bg-hs-comp-input-bg transition-colors",
            h,
            hasError
              ? "shadow-[inset_0_0_0_2px_var(--hs-comp-input-border-error)]"
              : "shadow-[inset_0_0_0_1px_var(--hs-comp-input-border)] hover:shadow-[inset_0_0_0_1px_var(--hs-comp-input-border-hover)]",
            "focus-within:shadow-[inset_0_0_0_2px_var(--hs-comp-input-border-focus)]",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          {leadingIcon && (
            <span className="flex items-center pl-hs-4 text-hs-icon-subtle">
              {leadingIcon}
            </span>
          )}
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "flex-1 appearance-none bg-transparent outline-none",
              "px-hs-4 py-hs-3 pr-hs-8",
              hsPrimitive.fieldText,
              "disabled:cursor-not-allowed"
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-hs-3 text-hs-icon-subtle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {hasError && errorText ? (
          <span className="text-hs-base-small text-hs-text-critical">{errorText}</span>
        ) : null}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
