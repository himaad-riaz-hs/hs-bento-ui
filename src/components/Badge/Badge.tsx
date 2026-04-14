import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

const variantStyles: Record<string, { bg: string; color: string }> = {
  neutral: { bg: "var(--hs-comp-badge-neutral-bg)", color: "var(--hs-comp-badge-neutral-text)" },
  overlay: { bg: "var(--hs-comp-badge-overlay-bg)", color: "var(--hs-comp-badge-overlay-text)" },
  positive: { bg: "var(--hs-comp-badge-positive-bg)", color: "var(--hs-comp-badge-positive-text)" },
  warning: { bg: "var(--hs-comp-badge-warning-bg)", color: "var(--hs-comp-badge-warning-text)" },
  negative: { bg: "var(--hs-comp-badge-negative-bg)", color: "var(--hs-comp-badge-negative-text)" },
  discovery: { bg: "var(--hs-comp-badge-discovery-bg)", color: "var(--hs-comp-badge-discovery-text)" },
  brand: { bg: "var(--hs-comp-badge-brand-bg)", color: "var(--hs-comp-badge-brand-text)" },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
  size?: "small" | "medium";
  leadingIcon?: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "neutral", size = "medium", leadingIcon, children, style, ...props }, ref) => {
    const vs = variantStyles[variant] || variantStyles.neutral;
    const h = size === "small" ? 20 : 28;
    const px = size === "small" ? 6 : 10;
    const fs = size === "small" ? 12 : 14;

    return (
      <span
        ref={ref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          height: h,
          minWidth: h,
          padding: `0 ${px}px`,
          borderRadius: 999,
          background: vs.bg,
          color: vs.color,
          fontSize: fs,
          lineHeight: `${h}px`,
          fontWeight: 700,
          fontFamily: "var(--hs-typeface-strong-font-family)",
          whiteSpace: "nowrap",
          ...style,
        }}
        {...props}
      >
        {leadingIcon && <span style={{ display: "inline-flex", flexShrink: 0 }}>{leadingIcon}</span>}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

const badgeVariants = null;
export { Badge, badgeVariants };
