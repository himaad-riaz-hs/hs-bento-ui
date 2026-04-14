import { forwardRef, useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";
import { Button, type ButtonProps } from "../Button";

export interface MenuButtonItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}

export interface MenuButtonProps extends Omit<ButtonProps, "onClick" | "onSelect"> {
  items: MenuButtonItem[];
  onSelect?: (value: string) => void;
}

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ items, onSelect, children, ...buttonProps }, ref) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
      <div ref={wrapperRef} className="relative inline-flex">
        <Button
          ref={ref}
          onClick={() => setOpen(!open)}
          aria-haspopup="menu"
          aria-expanded={open}
          trailingIcon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          {...buttonProps}
        >
          {children}
        </Button>
        {open && (
          <div
            role="menu"
            className="absolute top-full left-0 z-50 mt-hs-1 min-w-[180px] rounded-hs-input border border-hs-border-subtle bg-hs-fill-app shadow-hs-menu py-hs-1"
          >
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  onSelect?.(item.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-hs-2 px-hs-4 py-hs-3 text-left font-normal transition-colors",
                  item.destructive ? hsPrimitive.menuItemDestructive : hsPrimitive.menuItem,
                  "hover:bg-hs-fill-base",
                  "disabled:opacity-50 disabled:pointer-events-none"
                )}
              >
                {item.icon && <span className="inline-flex shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
MenuButton.displayName = "MenuButton";

export { MenuButton };
