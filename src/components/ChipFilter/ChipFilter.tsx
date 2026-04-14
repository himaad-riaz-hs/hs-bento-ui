import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ChipFilterProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

const ChipFilter = forwardRef<HTMLButtonElement, ChipFilterProps>(
  ({ selected = false, onSelectedChange, onClick, children, disabled, style, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onSelectedChange?.(!selected);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={selected}
        disabled={disabled}
        onClick={handleClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 40,
          paddingLeft: 16,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: 999,
          border: selected ? "none" : "1px solid var(--hs-comp-chip-filter-border)",
          background: selected ? "var(--hs-comp-chip-filter-bg-selected)" : "var(--hs-comp-chip-filter-bg)",
          color: selected ? "var(--hs-comp-chip-filter-text-selected)" : "var(--hs-comp-chip-filter-text)",
          fontSize: 16,
          lineHeight: "24px",
          fontWeight: 600,
          fontFamily: "var(--hs-typeface-strong-font-family)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          transition: "all 150ms",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...style,
        }}
        {...props}
      >
        {selected && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
ChipFilter.displayName = "ChipFilter";

export { ChipFilter };
