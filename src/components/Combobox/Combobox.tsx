import { forwardRef, useState, useRef, useEffect, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
}

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  ({ className, label, helperText, errorText, options, value, onChange, id, placeholder, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value || "");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputId = id || (label ? `combobox-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
    const hasError = !!errorText;

    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    );

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
      <div ref={wrapperRef} className={cn("relative flex flex-col gap-hs-1", className)}>
        {label && (
          <label htmlFor={inputId} className={hsPrimitive.formLabel}>
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center rounded-hs-input border bg-hs-comp-combobox-bg transition-colors",
            "border-hs-comp-combobox-border",
            "px-hs-3 py-[6px]",
            hasError
              ? "border-[var(--hs-comp-input-border-error)]"
              : "hover:border-[var(--hs-comp-input-border-hover)]",
            "focus-within:border-[var(--hs-comp-input-border-focus)] focus-within:[box-shadow:var(--hs-focus-ring)]"
          )}
        >
          <input
            ref={ref}
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className={cn(
              "flex-1 bg-transparent outline-none",
              hsPrimitive.fieldText,
              "placeholder:text-hs-comp-input-placeholder"
            )}
            {...props}
          />
          <span className="flex items-center text-hs-icon-subtle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {open && filtered.length > 0 && (
          <ul
            role="listbox"
            className="absolute top-full left-0 right-0 z-50 mt-hs-1 max-h-[192px] overflow-auto rounded-hs-input border border-hs-border-subtle bg-hs-fill-app shadow-hs-menu"
          >
            {filtered.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={cn(
                  "cursor-pointer px-hs-4 py-hs-3",
                  hsPrimitive.menuItem,
                  "hover:bg-hs-fill-base",
                  opt.value === value && "bg-hs-fill-base font-semibold"
                )}
                onMouseDown={() => {
                  setQuery(opt.label);
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
        {hasError && errorText ? (
          <span className="text-hs-base-small text-hs-text-critical">{errorText}</span>
        ) : helperText ? (
          <span className="text-hs-base-small text-hs-text-subtle">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Combobox.displayName = "Combobox";

export { Combobox };
