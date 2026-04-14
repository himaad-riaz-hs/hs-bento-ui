import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? `radio-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-[8px] cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <span className="relative inline-flex items-center justify-center">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            disabled={disabled}
            className={cn(
              "peer h-[20px] w-[20px] appearance-none rounded-full border-2 transition-colors",
              "border-[var(--hs-color-border-base)] bg-[var(--hs-comp-input-bg)]",
              "checked:border-[var(--hs-comp-button-filled-bg)]",
              "hover:border-[var(--hs-color-border-strong)]",
              "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)]"
            )}
            {...props}
          />
          <span className="pointer-events-none absolute h-[10px] w-[10px] rounded-full bg-[var(--hs-comp-button-filled-bg)] opacity-0 peer-checked:opacity-100" />
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
Radio.displayName = "Radio";

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

function RadioGroup({
  name,
  value,
  onChange,
  children,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col gap-[12px]" : "flex-row gap-[16px]",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Radio, RadioGroup };
