import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const cardVariants = cva(
  "rounded-[var(--hs-comp-card-radius)] bg-[var(--hs-color-fill-app)] transition-shadow",
  {
    variants: {
      variant: {
        flat: "border border-[var(--hs-color-border-subtle)]",
        raised: "shadow-[var(--hs-comp-card-shadow-raised)]",
        interactive: [
          "border border-[var(--hs-color-border-subtle)] cursor-pointer",
          "hover:shadow-[var(--hs-comp-card-shadow-raised)] hover:border-[var(--hs-color-border-strong)]",
        ],
      },
      padding: {
        none: "",
        small: "p-[12px]",
        medium: "p-[16px]",
        large: "p-[24px]",
      },
    },
    defaultVariants: {
      variant: "flat",
      padding: "medium",
    },
  }
);

export interface CardSurfaceProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  header?: ReactNode;
  footer?: ReactNode;
}

const CardSurface = forwardRef<HTMLDivElement, CardSurfaceProps>(
  ({ className, variant, padding, header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding: header || footer ? "none" : padding }),
          className
        )}
        {...props}
      >
        {header && (
          <div className="border-b border-[var(--hs-color-border-subtle)] px-[16px] py-[12px]">{header}</div>
        )}
        <div className={cn((header || footer) && "px-[16px] py-[16px]")}>
          {children}
        </div>
        {footer && (
          <div className="border-t border-[var(--hs-color-border-subtle)] px-[16px] py-[12px]">{footer}</div>
        )}
      </div>
    );
  }
);
CardSurface.displayName = "CardSurface";

export { CardSurface, cardVariants };
