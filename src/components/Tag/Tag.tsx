import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const tagVariants = cva(
  [
    "inline-flex items-center rounded-[50px]",
    "font-[family-name:var(--hs-typeface-button-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)]",
    "text-hs-others-label",
    "transition-colors duration-150",
    "pl-[16px]",
  ],
  {
    variants: {
      variant: {
        default: "bg-hs-comp-tag-bg text-hs-comp-tag-text",
        brand: "bg-hs-comp-tag-bg text-hs-comp-tag-text",
        positive: "bg-hs-comp-tag-surface-positive text-hs-text-positive",
        critical: "bg-hs-comp-tag-surface-critical text-hs-text-critical",
        warning: "bg-hs-comp-tag-surface-warning text-hs-text-warning",
        info: "bg-hs-comp-tag-surface-info text-hs-text-info",
        discovery: "bg-hs-comp-tag-surface-discovery text-hs-text-discovery",
      },
      size: {
        small: "h-[32px] py-[6px] gap-[8px]",
        medium: "h-[36px] py-[8px] gap-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "small",
    },
  }
);

export interface TagProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  leadingIcon?: ReactNode;
  onDismiss?: () => void;
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, leadingIcon, onDismiss, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ variant, size }), !onDismiss && "pr-[16px]", className)}
        {...props}
      >
        {leadingIcon && <span className="inline-flex shrink-0">{leadingIcon}</span>}
        <span className="whitespace-nowrap">{children}</span>
        {onDismiss && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="inline-flex shrink-0 items-center justify-center rounded-full p-[10px] hover:bg-black/5 transition-colors"
            aria-label="Remove"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);
Tag.displayName = "Tag";

export { Tag, tagVariants };
