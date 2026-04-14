import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

const variantStyles: Record<string, { bg: string; iconColor: string }> = {
  info: { bg: "var(--hs-comp-alert-info-bg)", iconColor: "var(--hs-comp-alert-info-icon)" },
  positive: { bg: "var(--hs-comp-alert-positive-bg)", iconColor: "var(--hs-comp-alert-positive-icon)" },
  warning: { bg: "var(--hs-comp-alert-warning-bg)", iconColor: "var(--hs-comp-alert-warning-icon)" },
  critical: { bg: "var(--hs-comp-alert-critical-bg)", iconColor: "var(--hs-comp-alert-critical-icon)" },
  discovery: { bg: "var(--hs-comp-alert-discovery-bg)", iconColor: "var(--hs-comp-alert-discovery-icon)" },
};

const defaultIcons: Record<string, (color: string) => ReactNode> = {
  info: (c) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5" />
      <path d="M10 9v4M10 7h.01" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  positive: (c) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5" />
      <path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (c) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3l8 14H2L10 3z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8.5v3M10 14h.01" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  critical: (c) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5" />
      <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  discovery: (c) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5" />
      <path d="M10 6v4l2.5 2.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "positive" | "warning" | "critical" | "discovery";
  icon?: ReactNode;
  title?: string;
  actions?: ReactNode;
  onDismiss?: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", icon, title, actions, onDismiss, children, style, ...props }, ref) => {
    const vs = variantStyles[variant] || variantStyles.info;

    return (
      <div
        ref={ref}
        role="alert"
        style={{
          display: "flex",
          gap: 16,
          borderRadius: "var(--hs-radii-2)",
          padding: 16,
          background: vs.bg,
          fontFamily: "var(--hs-typeface-base-font-family)",
          fontSize: 16,
          lineHeight: "24px",
          color: "var(--hs-color-text-base)",
          ...style,
        }}
        {...props}
      >
        <span style={{ flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24 }}>
          {icon || defaultIcons[variant]?.(vs.iconColor)}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <p style={{ fontWeight: 600, fontSize: 16, lineHeight: "24px", color: "var(--hs-color-text-base)", margin: "0 0 4px" }}>{title}</p>
          )}
          <div style={{ fontWeight: 400 }}>{children}</div>
          {actions && <div style={{ marginTop: 12, display: "flex", gap: 8 }}>{actions}</div>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            style={{ flexShrink: 0, border: "none", background: "none", cursor: "pointer", padding: 4, borderRadius: 50, color: "var(--hs-color-icon-subtle)", display: "flex" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const alertVariants = null;
export { Alert, alertVariants };
