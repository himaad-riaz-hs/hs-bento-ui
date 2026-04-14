import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center min-w-[48px]",
    "font-[family-name:var(--hs-typeface-button-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)]",
    "[font-weight:var(--hs-font-weight-button-small,700)]",
    "text-[length:var(--hs-font-size-button-small,14px)] leading-[length:var(--hs-line-height-button-small,24px)]",
    "rounded-[var(--hs-comp-button-border-radii,8px)]",
    "transition-colors duration-150 overflow-clip",
    "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--hs-comp-button-primary-color-fill,var(--hs-comp-button-filled-bg))]",
          /* Theme token utility so color wins over inherited table/body text */
          "text-hs-comp-button-filled-text",
          "hover:bg-[var(--hs-comp-button-filled-bg-hover)]",
          "active:bg-[var(--hs-comp-button-filled-bg-active)]",
        ],
        secondary: [
          "bg-[var(--hs-comp-button-secondary-color-fill,var(--hs-comp-button-secondary-fill))]",
          "text-[color:var(--hs-comp-button-secondary-color-text)]",
          "hover:bg-[var(--hs-comp-button-tonal-bg-hover)]",
        ],
        outlined: [
          "border-0",
          "shadow-[inset_0_0_0_var(--hs-stroke-weight-base,1px)_var(--hs-comp-button-outlined-color-border,var(--hs-comp-button-outlined-border))]",
          "bg-[var(--hs-comp-button-outlined-color-fill,transparent)]",
          "text-[color:var(--hs-comp-button-outlined-color-text)]",
          "hover:bg-[var(--hs-comp-button-outlined-bg-hover)]",
        ],
        ghost: [
          "bg-[var(--hs-comp-button-ghost-color-fill,transparent)]",
          "text-[color:var(--hs-comp-button-ghost-color-text)]",
          "hover:bg-[var(--hs-comp-button-text-bg-hover)]",
        ],
        /** On imagery / video — Figma `comp-button-overlay` filled */
        overlayFilled: [
          "bg-[var(--hs-comp-button-overlay-filled-bg)]",
          "text-[color:var(--hs-comp-button-overlay-filled-text)]",
          "hover:bg-[var(--hs-comp-button-overlay-filled-bg-hover)]",
        ],
        overlayFilledInverse: [
          "bg-[var(--hs-comp-button-overlay-filled-inverse-bg)]",
          "text-[color:var(--hs-comp-button-overlay-filled-inverse-text)]",
          "hover:bg-[var(--hs-comp-button-overlay-filled-inverse-bg-hover)]",
        ],
        overlayGhost: [
          "bg-transparent",
          "text-[color:var(--hs-comp-button-overlay-ghost-text)]",
          "hover:bg-[var(--hs-comp-button-overlay-ghost-hover)]",
        ],
        overlayGhostInverse: [
          "bg-transparent",
          "text-[color:var(--hs-comp-button-overlay-ghost-inverse-text)]",
          "hover:bg-[var(--hs-comp-button-overlay-ghost-inverse-hover)]",
        ],
      },
      hasIcon: {
        true: "gap-[8px] pl-[12px] pr-[16px]",
        false: "gap-[0px] px-[16px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      hasIcon: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "hasIcon"> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      fullWidth,
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref
  ) => {
    const hasIcon = !!(leadingIcon || trailingIcon);
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, hasIcon }),
          "py-[8px]",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {leadingIcon && (
          <span className="inline-flex shrink-0">{leadingIcon}</span>
        )}
        {children}
        {trailingIcon && (
          <span className="inline-flex shrink-0">{trailingIcon}</span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
