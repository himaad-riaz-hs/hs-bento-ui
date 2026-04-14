import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? `switch-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-hs-3 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-40",
          className
        )}
      >
        <span className="relative inline-flex">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            id={inputId}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              "h-[24px] w-[44px] rounded-full border-2 border-transparent transition-colors duration-200",
              "bg-hs-border-base peer-checked:bg-hs-comp-button-filled-bg",
              "peer-focus-visible:[box-shadow:var(--hs-focus-ring)]"
            )}
          />
          <span
            className={cn(
              "absolute left-[2px] top-[2px] h-[20px] w-[20px] rounded-full bg-hs-fill-app transition-transform duration-200",
              "shadow-sm",
              "peer-checked:translate-x-[20px]"
            )}
          />
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
Switch.displayName = "Switch";

export { Switch };
