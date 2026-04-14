import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const hyperlinkVariants = cva(
  [
    "inline-flex items-center gap-[4px] underline underline-offset-2",
    "font-[family-name:var(--hs-typeface-base-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)] font-normal",
    "text-[color:var(--hs-color-text-link)]",
    "hover:text-[color:var(--hs-color-text-link-hover)]",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)] focus-visible:rounded-sm",
  ],
  {
    variants: {
      size: {
        small: "text-hs-link-small",
        medium: "text-hs-link-medium",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

export interface HyperlinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof hyperlinkVariants> {}

const Hyperlink = forwardRef<HTMLAnchorElement, HyperlinkProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(hyperlinkVariants({ size }), className)}
        {...props}
      >
        {children}
      </a>
    );
  }
);
Hyperlink.displayName = "Hyperlink";

export { Hyperlink, hyperlinkVariants };
