import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-[var(--hs-comp-icon-button-border-radii,50px)] transition-colors duration-150",
    "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "p-[12px]",
  ],
  {
    variants: {
      variant: {
        filled: [
          "bg-[var(--hs-comp-button-filled-bg)] text-[color:var(--hs-comp-button-filled-text)]",
          "hover:bg-[var(--hs-comp-button-filled-bg-hover)]",
          "active:bg-[var(--hs-comp-button-filled-bg-active)]",
        ],
        outlined: [
          "shadow-[inset_0_0_0_var(--hs-stroke-weight-base,1px)_var(--hs-comp-button-outlined-border)]",
          "bg-transparent text-[color:var(--hs-color-icon-base)]",
          "hover:bg-[var(--hs-color-fill-base)]",
        ],
        ghost: [
          "bg-transparent text-[color:var(--hs-color-icon-base)]",
          "hover:bg-[var(--hs-color-fill-base)]",
        ],
        tonal: [
          "bg-[var(--hs-comp-button-tonal-bg)] text-[color:var(--hs-comp-button-tonal-text)]",
          "hover:bg-[var(--hs-comp-button-tonal-bg-hover)]",
        ],
      },
      size: {
        small: "h-[40px] w-[40px]",
        medium: "h-[48px] w-[48px]",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "medium",
    },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: ReactNode;
  "aria-label": string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export interface IconButtonToggleableProps extends IconButtonProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  iconOn?: ReactNode;
}

const IconButtonToggleable = forwardRef<
  HTMLButtonElement,
  IconButtonToggleableProps
>(
  (
    { pressed = false, onPressedChange, icon, iconOn, onClick, ...props },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onPressedChange?.(!pressed);
      onClick?.(e);
    };

    return (
      <IconButton
        ref={ref}
        icon={pressed && iconOn ? iconOn : icon}
        aria-pressed={pressed}
        onClick={handleClick}
        variant={pressed ? "tonal" : "ghost"}
        {...props}
      />
    );
  }
);
IconButtonToggleable.displayName = "IconButtonToggleable";

export { IconButton, IconButtonToggleable, iconButtonVariants };
