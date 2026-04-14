import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ButtonChoiceItem {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ButtonChoiceProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: ButtonChoiceItem[];
  value?: string[];
  onChange?: (value: string[]) => void;
  columns?: 1 | 2 | 3;
}

const ButtonChoice = forwardRef<HTMLDivElement, ButtonChoiceProps>(
  ({ className, items, value = [], onChange, columns = 2, ...props }, ref) => {
    const selectedSet = new Set(value);

    const toggle = (itemValue: string) => {
      const next = new Set(selectedSet);
      if (next.has(itemValue)) next.delete(itemValue);
      else next.add(itemValue);
      onChange?.(Array.from(next));
    };

    const gridCols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" } as const;

    return (
      <div
        ref={ref}
        role="group"
        className={cn("grid gap-hs-2", gridCols[columns], className)}
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
              onClick={() => toggle(item.value)}
              className={cn(
                "flex items-center gap-hs-2 rounded-hs-2 border px-hs-4 py-hs-3 transition-colors text-left text-hs-base-medium",
                selected
                  ? "border-hs-border-brand bg-hs-comp-button-tonal-bg text-hs-text-brand font-semibold"
                  : "border-hs-border-subtle bg-hs-fill-app text-hs-text-base hover:bg-hs-fill-base",
                "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)]",
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
ButtonChoice.displayName = "ButtonChoice";

export { ButtonChoice };
