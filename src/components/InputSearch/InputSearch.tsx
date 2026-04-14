import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export interface InputSearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
  ({ className, onClear, value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState("");
    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = String(currentValue).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      onClear?.();
    };

    return (
      <div
        className={cn(
          "flex h-hs-12 w-full items-center rounded-hs-input",
          "bg-hs-comp-input-bg",
          "shadow-[inset_0_0_0_1px_var(--hs-comp-input-border)]",
          "hover:shadow-[inset_0_0_0_1px_var(--hs-comp-input-border-hover)]",
          "focus-within:shadow-[inset_0_0_0_2px_var(--hs-comp-input-border-focus)]",
          "transition-colors duration-150",
          className
        )}
      >
        <span className="flex items-center pl-hs-4 text-hs-icon-subtle">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          ref={ref}
          type="search"
          value={currentValue}
          onChange={handleChange}
          className={cn(
            "flex-1 bg-transparent px-hs-4 py-hs-3 outline-none",
            hsPrimitive.fieldText,
            "placeholder:text-hs-comp-input-placeholder",
            "[&::-webkit-search-cancel-button]:hidden"
          )}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center pr-hs-4 text-hs-icon-subtle hover:text-hs-icon-base transition-colors"
            aria-label="Clear search"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
InputSearch.displayName = "InputSearch";

export { InputSearch };
