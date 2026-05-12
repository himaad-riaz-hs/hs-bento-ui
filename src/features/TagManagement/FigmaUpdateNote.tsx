import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

/**
 * Inline callout for “Figma comment updates” mode — white card, subtle border, soft shadow
 * (matches the reference note treatment next to real UI).
 */
export function FigmaUpdateNote({
  children,
  style,
  "aria-label": ariaLabel = "Figma comment update",
  ...rest
}: {
  children: ReactNode;
  style?: CSSProperties;
  "aria-label"?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "style" | "children">) {
  return (
    <div
      role="note"
      aria-label={ariaLabel}
      {...rest}
      style={{
        marginTop: 10,
        padding: "12px 14px",
        borderRadius: 8,
        background: "var(--hs-color-fill-app)",
        border: "1px solid var(--hs-color-border-subtle)",
        boxShadow: "0 1px 3px color-mix(in srgb, var(--hs-color-text-base) 8%, transparent)",
        fontFamily: HS_FONT_FAMILY,
        fontSize: 14,
        lineHeight: "22px",
        fontWeight: 400,
        color: "var(--hs-color-text-base)",
        maxWidth: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
