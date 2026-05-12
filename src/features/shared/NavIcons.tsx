import type { ReactNode } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

/**
 * Nav icons extracted from the Figma `comp-main-nav` export (y-main-nav.svg).
 * Each icon uses the exact path data from the Figma file with a matching viewBox.
 * All icon paths use fill="currentColor" so hover/active states work via CSS color.
 * Brand colours (Cherry, Dark Teal) resolve via design tokens.
 */

// ─── Owl logo ──────────────────────────────────────────────────────────────
// Three paths from the Figma export: body (Cherry), face details (white), pupils (Cherry).
function SvgOwl() {
  const cherry = "var(--hs-palette-cherry)";
  const teal = "var(--hs-color-fill-brand)";
  return (
    <svg
      width="48"
      height="48"
      viewBox="14 6 52 52"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, display: "block" }}
    >
      {/* Body — Cherry */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={cherry}
        d="M20.5581 8.38125C20.6581 8.08125 21.0081 7.93066 21.3081 8.03066L37.4829 14.0238C38.231 13.8983 38.9742 13.8315 39.7075 13.8314C42.486 13.8314 45.1278 14.4379 47.7837 15.9652L63.2573 14.5805C63.4572 14.5805 63.6075 14.6807 63.7075 14.8305C63.8575 15.0305 63.7573 15.3309 63.5073 15.4809L53.9361 21.1889C54.093 21.3657 54.25 21.5465 54.4077 21.7309C58.8077 26.9309 61.5579 34.4813 62.8579 38.8813C63.6078 41.4811 63.1579 44.281 61.5581 46.4809C58.7081 50.4308 52.6078 55.8314 40.6079 55.8314C27.508 55.8314 20.7078 49.3813 17.4077 45.3812C16.0077 43.6812 15.6077 41.3307 16.4077 39.2807C18.2078 34.4306 21.9578 25.081 24.9077 21.6811C26.6183 19.7201 28.5907 18.0301 30.6782 16.725L20.7573 9.03066C20.5577 8.88067 20.4583 8.63101 20.5581 8.38125Z"
      />
      {/* Face / eyes — white */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
        d="M40.2073 42.1807C40.2572 42.1307 40.3078 42.1309 40.3577 42.1807C42.5077 43.3807 45.0577 43.5807 47.3577 42.6807C47.3579 42.6807 47.4074 42.6816 47.4573 42.7314C47.5073 42.7814 47.5073 42.8309 47.4573 42.8809L44.6077 46.0312C44.4077 46.2311 44.1074 46.231 43.9075 46.0811C42.8575 45.181 41.0573 43.231 40.2073 42.3311C40.1576 42.2812 40.1574 42.2306 40.2073 42.1807ZM33.5579 21.5811C34.4077 21.5811 35.258 21.6809 36.0579 21.8809C37.4077 22.1809 38.458 22.6815 39.5579 23.4814C40.6077 24.2814 41.6076 25.1816 42.6575 25.9814C43.5074 26.6312 44.6072 26.6807 45.5071 26.1309C46.9571 25.2809 48.3579 23.9807 50.0579 23.6807C51.8077 23.3809 53.4576 24.3814 54.6575 25.5312C56.0574 26.8312 57.0079 28.4808 57.8079 30.1807C59.4578 33.7306 60.1075 40.481 54.8079 41.5312C50.7579 42.3312 46.9575 38.2307 44.1575 34.4307C43.9074 34.0309 43.3572 33.9315 42.9573 34.2314C42.8575 34.2814 42.807 34.3309 42.7571 34.4307C40.9071 36.9806 36.4076 44.5808 29.5579 42.7812C23.058 41.0813 21.5576 33.7814 24.2073 28.7314C25.4073 26.4314 27.0079 24.0814 29.3079 22.7314C30.6078 21.9815 32.0579 21.5811 33.5579 21.5811ZM43.0579 36.3809C43.3579 36.131 43.7581 36.1307 44.0081 36.4307L47.6077 40.4307C47.6577 40.6806 47.6075 40.8805 47.4075 40.9805C46.3576 41.5304 45.2079 41.8308 44.0081 41.8809C42.4581 41.8809 40.8075 40.8809 40.1575 40.3809C40.0076 40.2808 40.0077 40.0308 40.1077 39.8809L43.0081 36.4805C43.0081 36.4306 43.008 36.3809 43.0579 36.3809Z"
      />
      {/* Pupils — Cherry */}
      <path
        fill={cherry}
        d="M52.7579 30.4809C53.6079 31.8309 53.2579 33.5809 51.9579 34.4809C50.6079 35.3309 48.8579 34.9809 47.9579 33.6809C47.1079 32.3809 47.4579 30.5809 48.7579 29.7309C50.0079 28.8309 51.7579 29.1309 52.6579 30.3809C52.6579 30.3809 52.7079 30.4309 52.7579 30.4809ZM34.7079 29.3809C33.4079 30.3309 33.0579 32.1309 34.0079 33.4309C34.9079 34.6809 36.6579 35.0309 37.9579 34.1809C39.2579 33.2309 39.6079 31.4309 38.6579 30.1309C37.7579 28.8809 36.0579 28.5309 34.7079 29.3809Z"
      />
      {/* Dark teal eye rings */}
      <circle cx="34" cy="31" r="5.5" fill="none" stroke={teal} strokeWidth="0" opacity="0" />
    </svg>
  );
}

// ─── Home (house) ──────────────────────────────────────────────────────────
function SvgHome() {
  return (
    <svg width="24" height="24" viewBox="28 93 24 22" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M40 98.19L45 102.69V110.5H43V104.5H37V110.5H35V102.69L40 98.19ZM40 95.5L30 104.5H33V112.5H39V106.5H41V112.5H47V104.5H50L40 95.5Z"
      />
    </svg>
  );
}

// ─── Plan (calendar) ───────────────────────────────────────────────────────
function SvgPlan() {
  return (
    <svg width="24" height="24" viewBox="29 180 22 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M47 184H46V182H44V184H36V182H34V184H33C31.89 184 31.01 184.9 31.01 186L31 200C31 201.1 31.89 202 33 202H47C48.1 202 49 201.1 49 200V186C49 184.9 48.1 184 47 184ZM47 200H33V190H47V200ZM47 188H33V186H47V188ZM37 194H35V192H37V194ZM41 194H39V192H41V194ZM45 194H43V192H45V194ZM37 198H35V196H37V198ZM41 198H39V196H41V198ZM45 198H43V196H45V198Z"
      />
    </svg>
  );
}

// ─── Create (dark-teal circle with white +) ────────────────────────────────
function SvgCreate() {
  return (
    <svg width="48" height="48" viewBox="14 254 52 52" fill="none" aria-hidden>
      {/* Dark teal background circle */}
      <path
        fill="var(--hs-color-fill-brand)"
        d="M16 280C16 266.745 26.7452 256 40 256C53.2548 256 64 266.745 64 280C64 293.255 53.2548 304 40 304C26.7452 304 16 293.255 16 280Z"
      />
      {/* White circle + plus */}
      <path
        fill="white"
        d="M40 270C34.48 270 30 274.48 30 280C30 285.52 34.48 290 40 290C45.52 290 50 285.52 50 280C50 274.48 45.52 270 40 270ZM45 281H41V285H39V281H35V279H39V275H41V279H45V281Z"
      />
    </svg>
  );
}

// ─── Monitor (eye / visibility icon) ───────────────────────────────────────
function SvgMonitor() {
  return (
    <svg width="24" height="24" viewBox="27 358 26 20" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M40 362.5C43.79 362.5 47.17 364.63 48.82 368C47.17 371.37 43.8 373.5 40 373.5C36.2 373.5 32.83 371.37 31.18 368C32.83 364.63 36.21 362.5 40 362.5ZM40 360.5C35 360.5 30.73 363.61 29 368C30.73 372.39 35 375.5 40 375.5C45 375.5 49.27 372.39 51 368C49.27 363.61 45 360.5 40 360.5ZM40 365.5C41.38 365.5 42.5 366.62 42.5 368C42.5 369.38 41.38 370.5 40 370.5C38.62 370.5 37.5 369.38 37.5 368C37.5 366.62 38.62 365.5 40 365.5ZM40 363.5C37.52 363.5 35.5 365.52 35.5 368C35.5 370.48 37.52 372.5 40 372.5C42.48 372.5 44.5 370.48 44.5 368C44.5 365.52 42.48 363.5 40 363.5Z"
      />
    </svg>
  );
}

// ─── Reply (curved arrow) ──────────────────────────────────────────────────
function SvgReply() {
  return (
    <svg width="24" height="24" viewBox="29 446 22 20" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M38 452.5V448.5L31 455.5L38 462.5V458.4C43 458.4 46.5 460 49 463.5C48 458.5 45 453.5 38 452.5Z"
      />
    </svg>
  );
}

// ─── Analyze (bar chart — three bars) ──────────────────────────────────────
function SvgAnalyze() {
  return (
    <svg width="24" height="24" viewBox="30 534 20 20" fill="none" aria-hidden>
      <path fill="currentColor" d="M36 541H32V552H36V541Z" />
      <path fill="currentColor" d="M48 545H44V552H48V545Z" />
      <path fill="currentColor" d="M42 536H38V552H42V536Z" />
    </svg>
  );
}

// ─── More (three dots horizontal) ──────────────────────────────────────────
function SvgMore() {
  return (
    <svg width="24" height="24" viewBox="28 768 24 12" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M34 772C32.9 772 32 772.9 32 774C32 775.1 32.9 776 34 776C35.1 776 36 775.1 36 774C36 772.9 35.1 772 34 772ZM46 772C44.9 772 44 772.9 44 774C44 775.1 44.9 776 46 776C47.1 776 48 775.1 48 774C48 772.9 47.1 772 46 772ZM40 772C38.9 772 38 772.9 38 774C38 775.1 38.9 776 40 776C41.1 776 42 775.1 42 774C42 772.9 41.1 772 40 772Z"
      />
    </svg>
  );
}

// ─── Help (circle with ?) ─────────────────────────────────────────────────
function SvgHelp() {
  return (
    <svg width="24" height="24" viewBox="28 850 24 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M39 868H41V866H39V868ZM40 852C34.48 852 30 856.48 30 862C30 867.52 34.48 872 40 872C45.52 872 50 867.52 50 862C50 856.48 45.52 852 40 852ZM40 870C35.59 870 32 866.41 32 862C32 857.59 35.59 854 40 854C44.41 854 48 857.59 48 862C48 866.41 44.41 870 40 870ZM40 856C37.79 856 36 857.79 36 860H38C38 858.9 38.9 858 40 858C41.1 858 42 858.9 42 860C42 862 39 861.75 39 865H41C41 862.75 44 862.5 44 860C44 857.79 42.21 856 40 856Z"
      />
    </svg>
  );
}

// ─── Avatar (user silhouette) ─────────────────────────────────────────────
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
        border: "1.5px solid var(--hs-color-border-subtle)",
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

// ─── Drawer chevrons (>>) ──────────────────────────────────────────────────
function SvgDrawerChevrons() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Nav structure ─────────────────────────────────────────────────────────

const NAV_ROWS_TOP: { label: string; icon: () => ReactNode; large?: boolean }[] = [
  { label: "Home", icon: SvgHome },
  { label: "Plan", icon: SvgPlan },
  { label: "Create", icon: SvgCreate, large: true },
  { label: "Monitor", icon: SvgMonitor },
  { label: "Reply", icon: SvgReply },
  { label: "Analyze", icon: SvgAnalyze },
];

const NAV_ROWS_BOTTOM: { label: string; icon: () => ReactNode }[] = [
  { label: "More", icon: SvgMore },
  { label: "Help", icon: SvgHelp },
];

// ─── Components ───────────────────────────────────────────────────────────

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
        {/* Top: owl + nav items */}
        <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          {/* Owl / branding — no label */}
          <div
            style={{
              width: 80,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SvgOwl />
          </div>

          {NAV_ROWS_TOP.map(({ label, icon: Icon, large }) => (
            <NavButton key={label} label={label} onClick={onItemClick} large={large}>
              <Icon />
            </NavButton>
          ))}
        </div>

        {/* Bottom: more, help, avatar */}
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

      {/* Optional 48px drawer-collapse rail */}
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
            paddingTop: 12,
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
        lineHeight: "14px",
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
  large,
}: {
  label: string;
  children: ReactNode;
  onClick?: (label: string) => void;
  large?: boolean;
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
        padding: large ? "4px 8px" : "8px",
        boxSizing: "border-box",
        flexShrink: 0,
        color: "var(--hs-color-icon-base)",
      }}
    >
      <div
        style={{
          width: large ? 56 : 48,
          height: large ? 56 : 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: large ? 999 : 50,
          background: "transparent",
          color: "inherit",
          flexShrink: 0,
        }}
      >
        {children}
      </div>
      {!large && <NavLabel label={label} />}
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
