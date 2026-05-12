import type { ReactNode } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

/**
 * Nav icons extracted from the Figma `comp-main-nav` export.
 * Each icon uses the exact path data from the Figma file.
 * All icon paths use fill="currentColor" so hover/active states work via CSS color.
 * Brand colours (Cherry) resolve via design tokens.
 */

// ─── Owl logo ──────────────────────────────────────────────────────────────
// Three paths from the Figma export: body (Cherry), face details (white), pupils (Cherry).
function SvgOwl() {
  const cherry = "var(--hs-palette-cherry)";
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
        d="M20.5581 8.38137C20.6581 8.08137 21.0081 7.93079 21.3081 8.03079L37.4829 14.024C38.231 13.8984 38.9742 13.8316 39.7075 13.8316C42.486 13.8316 45.1278 14.438 47.7837 15.9654L63.2573 14.5806C63.4572 14.5806 63.6075 14.6808 63.7075 14.8306C63.8575 15.0306 63.7573 15.331 63.5073 15.481L53.9361 21.189C54.093 21.3658 54.25 21.5466 54.4077 21.731C58.8077 26.931 61.5579 34.4814 62.8579 38.8814C63.6078 41.4812 63.1579 44.2811 61.5581 46.481C58.7081 50.431 52.6078 55.8315 40.6079 55.8316C27.508 55.8316 20.7078 49.3814 17.4077 45.3814C16.0077 43.6814 15.6077 41.3308 16.4077 39.2808C18.2078 34.4307 21.9578 25.0811 24.9077 21.6812C26.6183 19.7203 28.5907 18.0302 30.6782 16.7251L20.7573 9.03079C20.5577 8.8808 20.4583 8.63113 20.5581 8.38137Z"
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
    </svg>
  );
}

// ─── Plan (calendar) ───────────────────────────────────────────────────────
function SvgPlan() {
  return (
    <svg width="24" height="24" viewBox="26 110 28 28" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M47 116H46V114H44V116H36V114H34V116H33C31.89 116 31.01 116.9 31.01 118L31 132C31 133.1 31.89 134 33 134H47C48.1 134 49 133.1 49 132V118C49 116.9 48.1 116 47 116ZM47 132H33V122H47V132ZM47 120H33V118H47V120ZM37 126H35V124H37V126ZM41 126H39V124H41V126ZM45 126H43V124H45V126ZM37 130H35V128H37V130ZM41 130H39V128H41V130ZM45 130H43V128H45V130Z"
      />
    </svg>
  );
}

// ─── Create (outline circle + plus) ───────────────────────────────────────
function SvgCreate() {
  return (
    <svg width="24" height="24" viewBox="26 198 28 28" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M41 207H39V211H35V213H39V217H41V213H45V211H41V207ZM40 202C34.48 202 30 206.48 30 212C30 217.52 34.48 222 40 222C45.52 222 50 217.52 50 212C50 206.48 45.52 202 40 202ZM40 220C35.59 220 32 216.41 32 212C32 207.59 35.59 204 40 204C44.41 204 48 207.59 48 212C48 216.41 44.41 220 40 220Z"
      />
    </svg>
  );
}

// ─── OwlyGPT (sparkle) ────────────────────────────────────────────────────
function SvgOwlyGPT() {
  return (
    <svg width="24" height="24" viewBox="25 285 30 30" fill="none" aria-hidden>
      <path fill="currentColor" d="M47 297L48.25 294.25L51 293L48.25 291.75L47 289L45.75 291.75L43 293L45.75 294.25L47 297Z" />
      <path fill="currentColor" d="M47 303L45.75 305.75L43 307L45.75 308.25L47 311L48.25 308.25L51 307L48.25 305.75L47 303Z" />
      <path fill="currentColor" d="M39.5 297.5L37 292L34.5 297.5L29 300L34.5 302.5L37 308L39.5 302.5L45 300L39.5 297.5ZM37.99 300.99L37 303.17L36.01 300.99L33.83 300L36.01 299.01L37 296.83L37.99 299.01L40.17 300L37.99 300.99Z" />
    </svg>
  );
}

// ─── Inbox 2.0 (tray with download arrow) ─────────────────────────────────
function SvgInbox() {
  return (
    <svg width="24" height="24" viewBox="27 375 26 26" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M44 385H41.45V382H38.55V385H36L40 389L44 385ZM47 379H32.99C31.88 379 31 379.9 31 381V395C31 396.1 31.88 397 32.99 397H47C48.1 397 49 396.1 49 395V381C49 379.9 48.1 379 47 379ZM47 395H33V392H36.56C37.25 393.19 38.53 394 40.01 394C41.49 394 42.76 393.19 43.46 392H47V395ZM47 390H42.01C42.01 391.1 41.11 392 40.01 392C38.91 392 38.01 391.1 38.01 390H33L32.99 381H47V390Z"
      />
    </svg>
  );
}

// ─── Analytics (3 bars) ────────────────────────────────────────────────────
function SvgAnalytics() {
  return (
    <svg width="24" height="24" viewBox="28 464 24 24" fill="none" aria-hidden>
      <path fill="currentColor" d="M36 473H32V484H36V473Z" />
      <path fill="currentColor" d="M48 477H44V484H48V477Z" />
      <path fill="currentColor" d="M42 468H38V484H42V468Z" />
    </svg>
  );
}

// ─── Amplify (4 rounded vertical bars) ────────────────────────────────────
function SvgAmplify() {
  return (
    <svg width="24" height="24" viewBox="28 550 24 28" fill="none" aria-hidden>
      <path fill="currentColor" d="M44.8526 573.047C44.8526 573.572 45.2854 574 45.8059 574C46.3264 574 46.7438 573.588 46.7593 573.067V554.953C46.7593 554.428 46.3264 554 45.8059 554C45.2803 554 44.8526 554.428 44.8526 554.953V573.047Z" />
      <path fill="currentColor" d="M36.6174 569.439C36.6174 569.965 37.0503 570.393 37.5708 570.393C38.0913 570.393 38.5242 569.96 38.5242 569.439V557.071C38.5242 556.546 38.0913 556.118 37.5708 556.118C37.0452 556.118 36.6174 556.551 36.6174 557.071V569.439Z" />
      <path fill="currentColor" d="M32.5 567.548C32.5 568.074 32.9329 568.501 33.4534 568.501C33.9738 568.501 34.4067 568.084 34.4067 567.563V561.848C34.4067 561.323 33.979 560.895 33.4534 560.895C32.9277 560.895 32.5 561.328 32.5 561.848V567.548Z" />
      <path fill="currentColor" d="M41.6882 572.14C41.1678 572.14 40.7349 571.712 40.7349 571.186V559.298C40.7349 558.777 41.1626 558.344 41.6882 558.344C42.2087 558.344 42.6416 558.772 42.6416 559.298V571.202C42.6261 571.712 42.2087 572.14 41.6882 572.14Z" />
    </svg>
  );
}

// ─── Listening (ear / lightbulb with bolt) ─────────────────────────────────
function SvgListening() {
  return (
    <svg width="24" height="24" viewBox="28 638 24 28" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M37.41 656.03C36.68 656.03 36.23 655.59 36.11 655.1L35.8 654.09C33.89 652.85 33 651.05 33 648.43C33 644.64 35.91 642 40.07 642C41.97 642 43.7 642.58 44.94 643.64C46.31 644.82 47.03 646.47 47.03 648.43C47.03 650.77 46.01 652.75 44.15 654.05L43.79 655.12C43.66 655.61 43.22 656.03 42.49 656.03H37.41ZM43 658.53C43 658.75 42.86 658.93 42.68 658.93H37.35C37.17 658.93 37.03 658.75 37.03 658.53V657.4C37.03 657.18 37.17 657 37.35 657H42.68C42.86 657 43 657.18 43 657.4V658.53ZM42.03 661.5C42.03 661.77 41.85 662 41.63 662H38.4C38.18 662 38 661.77 38 661.5V660.56C38 660.28 38.18 660.06 38.4 660.06H41.63C41.85 660.06 42.03 660.28 42.03 660.56V661.5ZM39.82 645.57L37.36 650.95C37.34 650.99 37.36 651.04 37.4 651.04H39.92C39.95 651.04 39.97 651.08 39.96 651.12L39.16 653.85C39.14 653.91 39.2 653.96 39.24 653.91L42.66 649.19C42.69 649.15 42.67 649.09 42.63 649.09L40.57 649.1C40.54 649.1 40.52 649.04 40.54 649L42.24 645.64C42.26 645.6 42.24 645.54 42.2 645.54H39.86C39.85 645.54 39.83 645.55 39.82 645.57Z"
      />
    </svg>
  );
}

// ─── More (three dots horizontal) ──────────────────────────────────────────
function SvgMore() {
  return (
    <svg width="24" height="24" viewBox="28 732 24 16" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M34 738C32.9 738 32 738.9 32 740C32 741.1 32.9 742 34 742C35.1 742 36 741.1 36 740C36 738.9 35.1 738 34 738ZM46 738C44.9 738 44 738.9 44 740C44 741.1 44.9 742 46 742C47.1 742 48 741.1 48 740C48 738.9 47.1 738 46 738ZM40 738C38.9 738 38 738.9 38 740C38 741.1 38.9 742 40 742C41.1 742 42 741.1 42 740C42 738.9 41.1 738 40 738Z"
      />
    </svg>
  );
}

// ─── Bell (notification) ──────────────────────────────────────────────────
function SvgBell() {
  return (
    <svg width="24" height="24" viewBox="28 832 24 28" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M40 855.75C41.1 855.75 42 854.85 42 853.75H38C38 854.85 38.9 855.75 40 855.75ZM46 849.75V844.75C46 841.68 44.37 839.11 41.5 838.43V837.75C41.5 836.92 40.83 836.25 40 836.25C39.17 836.25 38.5 836.92 38.5 837.75V838.43C35.64 839.11 34 841.67 34 844.75V849.75L32 851.75V852.75H48V851.75L46 849.75ZM44 850.75H36V844.75C36 842.27 37.51 840.25 40 840.25C42.49 840.25 44 842.27 44 844.75V850.75Z"
      />
    </svg>
  );
}

// ─── Help (circle with ?) ─────────────────────────────────────────────────
function SvgHelp() {
  return (
    <svg width="24" height="24" viewBox="26 880 28 28" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M39 900H41V898H39V900ZM40 884C34.48 884 30 888.48 30 894C30 899.52 34.48 904 40 904C45.52 904 50 899.52 50 894C50 888.48 45.52 884 40 884ZM40 902C35.59 902 32 898.41 32 894C32 889.59 35.59 886 40 886C44.41 886 48 889.59 48 894C48 898.41 44.41 902 40 902ZM40 888C37.79 888 36 889.79 36 892H38C38 890.9 38.9 890 40 890C41.1 890 42 890.9 42 892C42 894 39 893.75 39 897H41C41 894.75 44 894.5 44 892C44 889.79 42.21 888 40 888Z"
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
// Exact paths from the Figma comp-main-nav export, viewBox "88 17 28 22"
function SvgDrawerChevrons() {
  return (
    <svg width="20" height="20" viewBox="88 17 28 22" fill="none" aria-hidden>
      <path fill="currentColor" d="M99.3415 23L98.1665 24.175L101.983 28L98.1665 31.825L99.3415 33L104.342 28L99.3415 23Z" />
      <path fill="currentColor" d="M104.833 23L103.658 24.175L107.475 28L103.658 31.825L104.833 33L109.833 28L104.833 23Z" />
    </svg>
  );
}

// ─── Nav structure ─────────────────────────────────────────────────────────

const NAV_ROWS_TOP: { label: string; icon: () => ReactNode }[] = [
  { label: "Plan", icon: SvgPlan },
  { label: "Create", icon: SvgCreate },
  { label: "OwlyGPT", icon: SvgOwlyGPT },
  { label: "Inbox 2.0", icon: SvgInbox },
  { label: "Analytics", icon: SvgAnalytics },
  { label: "Amplify", icon: SvgAmplify },
  { label: "Listening", icon: SvgListening },
];

const NAV_ROWS_BOTTOM: { label: string; icon: () => ReactNode }[] = [
  { label: "More", icon: SvgMore },
  { label: "Bell", icon: SvgBell },
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
        {/* Top: owl (home) + nav items */}
        <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          {/* Owl / branding — acts as Home button */}
          <button
            type="button"
            onClick={() => onItemClick?.("Home")}
            aria-label="Home"
            style={{
              width: 80,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              padding: 0,
            }}
          >
            <SvgOwl />
          </button>

          {NAV_ROWS_TOP.map(({ label, icon: Icon }) => (
            <NavButton key={label} label={label} onClick={onItemClick}>
              <Icon />
            </NavButton>
          ))}
        </div>

        {/* Bottom: more, bell, help, avatar */}
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
