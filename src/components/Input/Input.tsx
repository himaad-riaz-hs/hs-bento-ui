import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  inputSize?: "small" | "medium";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputSize = "medium",
      error,
      label,
      helperText,
      errorText,
      leadingIcon,
      trailingIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
    const hasError = error || !!errorText;
    const h = inputSize === "small" ? "h-[40px]" : "h-[48px]";

    return (
      <div className={cn("flex flex-col gap-hs-1", className)}>
        {label && (
          <label htmlFor={inputId} className={hsPrimitive.formLabel}>
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex w-full items-center rounded-hs-input bg-hs-comp-input-bg transition-colors",
            h,
            hasError
              ? "shadow-[inset_0_0_0_2px_var(--hs-comp-input-border-error)]"
              : "shadow-[inset_0_0_0_1px_var(--hs-comp-input-border)] hover:shadow-[inset_0_0_0_1px_var(--hs-comp-input-border-hover)]",
            "focus-within:shadow-[inset_0_0_0_2px_var(--hs-comp-input-border-focus)]",
            disabled && "opacity-40 pointer-events-none"
          )}
        >
          {leadingIcon && (
            <span className="flex items-center pl-hs-4 text-hs-icon-subtle">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent px-hs-4 py-hs-3 outline-none",
              hsPrimitive.fieldText,
              "placeholder:text-hs-comp-input-placeholder",
              "disabled:cursor-not-allowed"
            )}
            {...props}
          />
          {trailingIcon && (
            <span className="flex items-center pr-hs-4 text-hs-icon-subtle">
              {trailingIcon}
            </span>
          )}
        </div>
        {(hasError && errorText) ? (
          <span className="text-hs-base-small text-hs-text-critical">{errorText}</span>
        ) : helperText ? (
          <span className="text-hs-base-small text-hs-comp-input-helper">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
