import type { ReactNode } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
// All icons are inline SVGs — no external CDN dependencies.

const svgWrap = (node: ReactNode, size = 24) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "inherit",
    }}
  >
    {node}
  </div>
);

function SvgOwl() {
  // Brand colours resolved from tokens at render time via CSS custom properties
  const cherry = "var(--hs-palette-cherry)";
  const teal = "var(--hs-color-fill-brand)";
  const beak = "var(--hs-palette-owl-beak)";
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden style={{ flexShrink: 0, display: "block" }}>
      {/* Body */}
      <ellipse cx="24" cy="28" rx="19" ry="18" fill={cherry} />
      {/* Ear tufts */}
      <ellipse cx="15.5" cy="13" rx="4" ry="7" fill={cherry} transform="rotate(-10 15.5 13)" />
      <ellipse cx="32.5" cy="13" rx="4" ry="7" fill={cherry} transform="rotate(10 32.5 13)" />
      {/* Eye sockets */}
      <circle cx="17.5" cy="24" r="7.5" fill="white" />
      <circle cx="30.5" cy="24" r="7.5" fill="white" />
      {/* Bridge of nose */}
      <path d="M22 24 Q24 22 26 24" stroke={cherry} strokeWidth="1.5" fill="none" />
      {/* Pupils */}
      <circle cx="19.2" cy="24" r="4.2" fill={teal} />
      <circle cx="28.8" cy="24" r="4.2" fill={teal} />
      {/* Eye shine */}
      <circle cx="21" cy="22" r="1.5" fill="white" />
      <circle cx="30.6" cy="22" r="1.5" fill="white" />
      {/* Beak */}
      <path d="M21.5 30.5 L24 35 L26.5 30.5Z" fill={beak} />
      {/* Chest feather detail */}
      <ellipse cx="24" cy="36" rx="7" ry="5" fill={cherry} opacity="0.6" />
    </svg>
  );
}

function SvgPlan() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  );
}

function SvgCreate() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  );
}

function SvgSparkles() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5.5 15l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>,
  );
}

function SvgInbox() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 12h-5l-1.5 2.5h-7L7 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  );
}

function SvgBarChart() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 17V10M12 17V6M18 17v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  );
}

function SvgAmplify() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 18V6M8 18V9M12 18V4M16 18V9M20 18V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  );
}

function SvgListening() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 10a7 7 0 0 1-14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 17v4M9 21h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  );
}

function SvgMore() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="1.75" fill="currentColor" />
      <circle cx="12" cy="12" r="1.75" fill="currentColor" />
      <circle cx="18" cy="12" r="1.75" fill="currentColor" />
    </svg>,
  );
}

function SvgBell() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  );
}

function SvgHelp() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 .2c0 1.5-2 1.7-2 3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>,
  );
}

function SvgAvatar({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--hs-color-fill-subtle)",
        border: "1px solid var(--hs-color-border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--hs-color-text-subtle)",
      }}
    >
      <svg width={Math.round(size * 0.5)} height={Math.round(size * 0.5)} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 21v-1a7 7 0 0 1 14 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SvgDrawerChevrons() {
  return svgWrap(
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    20,
  );
}

// ─── Nav structure ────────────────────────────────────────────────────────────

const NAV_ROWS_TOP: { label: string; icon: () => ReactNode }[] = [
  { label: "Plan", icon: SvgPlan },
  { label: "Create", icon: SvgCreate },
  { label: "OwlyGPT", icon: SvgSparkles },
  { label: "Inbox 2.0", icon: SvgInbox },
  { label: "Analytics", icon: SvgBarChart },
  { label: "Amplify", icon: SvgAmplify },
  { label: "Listening", icon: SvgListening },
  { label: "More", icon: SvgMore },
];

const NAV_ROWS_BOTTOM: { label: string; icon: () => ReactNode }[] = [
  { label: "Notifications", icon: SvgBell },
  { label: "Help", icon: SvgHelp },
];

// ─── Components ───────────────────────────────────────────────────────────────

interface ProductNavProps {
  activeItem?: string;
  onItemClick?: (label: string) => void;
  showDrawerRail?: boolean;
}

export function ProductNav({ onItemClick, showDrawerRail = false }: ProductNavProps) {
  return (
    <aside
      style={{
        width: showDrawerRail ? 128 : 80,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        alignItems: "stretch",
        background: "var(--hs-color-fill-base)",
        borderRight: "1px solid var(--hs-color-border-subtle)",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: HS_FONT_FAMILY,
      }}
    >
      {/* Main 80px column */}
      <div
        style={{
          width: 80,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Top: logo + nav items */}
        <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          {/* Owl logo / Home */}
          <button
            type="button"
            onClick={() => onItemClick?.("Home")}
            style={{
              width: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "8px",
              boxSizing: "border-box",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <SvgOwl />
            <NavLabel label="Home" />
          </button>

          {NAV_ROWS_TOP.map(({ label, icon: Icon }) => (
            <NavButton key={label} label={label} onClick={onItemClick}>
              <Icon />
            </NavButton>
          ))}
        </div>

        {/* Bottom: notifications, help, avatar */}
        <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          {NAV_ROWS_BOTTOM.map(({ label, icon: Icon }) => (
            <IconOnlyNavButton key={label} label={label} onClick={onItemClick}>
              <Icon />
            </IconOnlyNavButton>
          ))}

          <button
            type="button"
            onClick={() => onItemClick?.("Avatar")}
            aria-label="Account"
            style={{
              width: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <SvgAvatar size={48} />
          </button>
        </div>
      </div>

      {/* Optional drawer-collapse rail (48px) */}
      {showDrawerRail && (
        <div
          style={{
            width: 48,
            height: "100%",
            flexShrink: 0,
            background: "var(--hs-color-fill-base)",
            borderLeft: "1px solid var(--hs-color-border-subtle)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 4,
          }}
        >
          <button
            type="button"
            onClick={() => onItemClick?.("Toggle nav drawer")}
            aria-label="Toggle nav drawer"
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              borderRadius: 50,
              cursor: "pointer",
              color: "var(--hs-color-icon-base)",
            }}
          >
            <SvgDrawerChevrons />
          </button>
        </div>
      )}
    </aside>
  );
}

function NavLabel({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        lineHeight: "16px",
        fontWeight: 400,
        color: "var(--hs-color-text-subtle)",
        textAlign: "center",
        whiteSpace: "nowrap",
        fontFamily: HS_FONT_FAMILY,
      }}
    >
      {label}
    </span>
  );
}

function NavButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: (label: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(label)}
      style={{
        width: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        boxSizing: "border-box",
        flexShrink: 0,
        color: "var(--hs-color-icon-base)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
          background: "transparent",
          color: "inherit",
          flexShrink: 0,
        }}
      >
        {children}
      </div>
      <NavLabel label={label} />
    </button>
  );
}

function IconOnlyNavButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: (label: string) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => onClick?.(label)}
      style={{
        width: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0 8px",
        height: 48,
        boxSizing: "border-box",
        flexShrink: 0,
        color: "var(--hs-color-icon-base)",
      }}
    >
      {children}
    </button>
  );
}

/** Avatar used in composer chrome. */
export function AvatarImage({ size = 48 }: { size?: number }) {
  return <SvgAvatar size={size} />;
}
