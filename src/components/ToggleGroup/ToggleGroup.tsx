import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ToggleGroupItem {
  value: string;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: ToggleGroupItem[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  size?: "small" | "medium";
}

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, items, value, onChange, multiple = false, size = "medium", ...props }, ref) => {
    const selectedSet = new Set(Array.isArray(value) ? value : value ? [value] : []);

    const handleSelect = (itemValue: string) => {
      if (multiple) {
        const next = new Set(selectedSet);
        if (next.has(itemValue)) next.delete(itemValue);
        else next.add(itemValue);
        onChange?.(Array.from(next));
      } else {
        onChange?.(itemValue);
      }
    };

    const h = size === "small" ? "h-[40px]" : "h-[48px]";

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex rounded-hs-2 border border-[var(--hs-comp-toggle-group-border)] overflow-hidden",
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const selected = selectedSet.has(item.value);
          return (
            <button
              key={item.value}
              type="button"
              disabled={item.disabled}
              aria-pressed={selected}
              onClick={() => handleSelect(item.value)}
              className={cn(
                "inline-flex items-center justify-center gap-[4px] transition-colors",
                "font-[family-name:var(--hs-typeface-button-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)]",
                "border-r border-[var(--hs-comp-toggle-group-border)] last:border-r-0",
                h,
                size === "small"
                  ? "px-hs-3 text-hs-button-small"
                  : "px-hs-4 text-hs-button-medium",
                selected
                  ? "bg-[var(--hs-comp-toggle-group-bg-selected)] text-[color:var(--hs-comp-button-tonal-text)] font-semibold"
                  : "bg-hs-fill-app text-hs-text-base font-bold hover:bg-hs-fill-base",
                "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)] focus-visible:z-10",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              {item.icon && <span className="inline-flex shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

export { ToggleGroup };
