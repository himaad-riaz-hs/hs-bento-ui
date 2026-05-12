import type { ReactNode } from "react";
import { useState } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

/**
 * Raster URLs from Figma `comp-main-nav` (node `3993:47128`, file Tagging).
 * They are served from Figma’s MCP CDN and typically load when the viewer is
 * authenticated with Figma (or from Cursor’s Figma-connected context). They can
 * expire after several days — re-fetch via `get_design_context` on that node
 * and replace the constants below if icons break.
 */
const R = {
  owlUnion: "https://www.figma.com/api/mcp/asset/8210da30-f3c8-4c00-adca-bfdb1a3a70b4",
  owlUnion1: "https://www.figma.com/api/mcp/asset/15d844ef-9505-44f0-9374-af4863cfc934",
  owlVector: "https://www.figma.com/api/mcp/asset/b4fb92b0-0767-472b-bc7b-6f904bd80818",
  plan: "https://www.figma.com/api/mcp/asset/20171f50-7d85-458d-b262-e30b8c0f6394",
  create: "https://www.figma.com/api/mcp/asset/cb3096fd-a978-4026-a309-1aeb3494cebd",
  owlyGpt: "https://www.figma.com/api/mcp/asset/37018873-f1d2-4e32-a00d-55e2ef108339",
  inbox: "https://www.figma.com/api/mcp/asset/0382bfdf-6dab-4e72-8108-2955c45e50b1",
  analytics: "https://www.figma.com/api/mcp/asset/57141ac4-343a-4a98-bc5f-2c5ea2ee1647",
  amplify: "https://www.figma.com/api/mcp/asset/c47c55be-49af-4fd4-a9b9-d0cc134231c3",
  listening: "https://www.figma.com/api/mcp/asset/4ceb5095-873b-4aa1-a11a-14279354b60b",
  more: "https://www.figma.com/api/mcp/asset/fb6f478e-9b80-4f1e-aba2-ff4295b0122a",
  notifications: "https://www.figma.com/api/mcp/asset/90e2d2dc-4689-4a3e-a1ad-b2d740b6ed03",
  help: "https://www.figma.com/api/mcp/asset/1d54226b-7828-40b0-aaa6-81a7d9395fd4",
  avatar: "https://www.figma.com/api/mcp/asset/17f34aad-053e-415d-966c-f1386fe1b87e",
  drawerChevron: "https://www.figma.com/api/mcp/asset/c994e157-e68c-4661-a0d1-bbf55f9ef5bf",
} as const;

function RasterGlyph({
  src,
  inset,
  filled,
  onError,
  size = 24,
}: {
  src: string;
  inset: string;
  filled?: boolean;
  onError?: () => void;
  size?: number;
}) {
  return (
    <div style={{ position: "relative", width: size, height: size, overflow: "hidden", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset, display: "flex" }}>
        <img
          alt=""
          src={src}
          onError={onError}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            maxWidth: "none",
            filter: filled ? "brightness(0) invert(1)" : undefined,
          }}
        />
      </div>
    </div>
  );
}

function OwlLogoRaster({ onRasterError }: { onRasterError: () => void }) {
  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: "0 0.46% 0.35% 0" }}>
        <img
          alt=""
          src={R.owlUnion}
          onError={onRasterError}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none" }}
        />
      </div>
      <div style={{ position: "absolute", inset: "28.29% 10.43% 20.44% 14.51%" }}>
        <img
          alt=""
          src={R.owlUnion1}
          onError={onRasterError}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none" }}
        />
      </div>
      <div style={{ position: "absolute", inset: "43.57% 22.46% 43.87% 36.39%" }}>
        <img
          alt=""
          src={R.owlVector}
          onError={onRasterError}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none" }}
        />
      </div>
    </div>
  );
}

function AvatarRaster({ size, onRasterError }: { size: number; onRasterError: () => void }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <img
        alt=""
        src={R.avatar}
        onError={onRasterError}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

// ─── SVG fallback (offline / expired Figma URLs) — matches comp-main-nav labels ───

const svgWrap = (node: ReactNode) => (
  <div
    style={{
      position: "relative",
      width: 24,
      height: 24,
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
      <path d="M12 2l1.2 3.5L17 7l-3.8 1.5L12 12l-1.2-3.5L7 7l3.8-1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M18 14l.6 1.7 1.7.6-1.7.6L18 19l-.6-1.7-1.7-.6 1.7-.6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 15l.5 1.3 1.3.5-1.3.5L6 19l-.5-1.3-1.3-.5 1.3-.5z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>,
  );
}

function SvgInbox() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 14h4l2 2h8l2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 11V7M9.5 9.5L12 7l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M7 17V8M10 17v-5M13 17V6M16 17v-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  );
}

function SvgListening() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18h6a3 3 0 0 0 3-3v-4a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8V5M10 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      <path
        d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2ZM18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>,
  );
}

function SvgHelp() {
  return svgWrap(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.5 9a2.5 2.5 0 0 1 5 .2c0 1.5-2 1.7-2 3.3M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>,
  );
}

function SvgDrawerChevron() {
  return svgWrap(
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M7 5l3 5-3 5M12 5l3 5-3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  );
}

function SvgOwl() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden style={{ flexShrink: 0, display: "block" }}>
      {/* Ear tufts */}
      <ellipse cx="16" cy="12" rx="4" ry="6.5" fill="#FF4C46" transform="rotate(-12 16 12)" />
      <ellipse cx="32" cy="12" rx="4" ry="6.5" fill="#FF4C46" transform="rotate(12 32 12)" />
      {/* Body */}
      <circle cx="24" cy="27" r="19" fill="#FF4C46" />
      {/* Eye whites */}
      <circle cx="17.5" cy="23.5" r="7" fill="white" />
      <circle cx="30.5" cy="23.5" r="7" fill="white" />
      {/* Pupils — inward offset for Owly's signature look */}
      <circle cx="19" cy="23.5" r="4" fill="#012B3A" />
      <circle cx="29" cy="23.5" r="4" fill="#012B3A" />
      {/* Eye shine */}
      <circle cx="21" cy="21.5" r="1.4" fill="white" />
      <circle cx="31" cy="21.5" r="1.4" fill="white" />
      {/* Beak */}
      <path d="M22 31 L24 35.5 L26 31Z" fill="#FFB224" />
    </svg>
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
        position: "relative",
        background: "var(--hs-color-fill-subtle)",
        border: "1px solid var(--hs-color-border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--hs-color-text-subtle)",
      }}
    >
      <svg width={Math.round(size * 0.5)} height={Math.round(size * 0.5)} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

type NavRow =
  | { label: "Home"; kind: "brand" }
  | { label: string; kind: "item"; svg: () => ReactNode; src: string; inset: string };

const NAV_ROWS_TOP: NavRow[] = [
  { label: "Home", kind: "brand" },
  { label: "Plan", kind: "item", svg: SvgPlan, src: R.plan, inset: "8.33% 12.5%" },
  { label: "Create", kind: "item", svg: SvgCreate, src: R.create, inset: "8.33%" },
  { label: "OwlyGPT", kind: "item", svg: SvgSparkles, src: R.owlyGpt, inset: "4.17%" },
  { label: "Inbox 2.0", kind: "item", svg: SvgInbox, src: R.inbox, inset: "12.5%" },
  { label: "Analytics", kind: "item", svg: SvgBarChart, src: R.analytics, inset: "16.67%" },
  { label: "Amplify", kind: "item", svg: SvgAmplify, src: R.amplify, inset: "8.33% 21.84% 8.33% 18.75%" },
  { label: "Listening", kind: "item", svg: SvgListening, src: R.listening, inset: "8.33% 20.71% 8.33% 20.83%" },
  { label: "More", kind: "item", svg: SvgMore, src: R.more, inset: "41.67% 16.67%" },
];

const NAV_ROWS_BOTTOM: { label: string; svg: () => ReactNode; src: string; inset: string }[] = [
  { label: "Notifications", svg: SvgBell, src: R.notifications, inset: "9.38% 16.67%" },
  { label: "Help", svg: SvgHelp, src: R.help, inset: "8.33%" },
];

interface ProductNavProps {
  activeItem?: string;
  onItemClick?: (label: string) => void;
  showDrawerRail?: boolean;
}

export function ProductNav({ onItemClick, showDrawerRail = false }: ProductNavProps) {
  // One error-state flag per item, plus the owl logo and avatar.
  const [svgFallbacks, setSvgFallbacks] = useState<Record<string, boolean>>({});
  const [owlSvg, setOwlSvg] = useState(false);
  const [avatarSvg, setAvatarSvg] = useState(false);

  const markSvg = (label: string) =>
    setSvgFallbacks((prev) => ({ ...prev, [label]: true }));

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
        <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          {/* Owl logo */}
          <div
            style={{
              width: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "8px",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            {owlSvg ? (
              <SvgOwl />
            ) : (
              <OwlLogoRaster onRasterError={() => setOwlSvg(true)} />
            )}
            <NavLabel label="Home" />
          </div>

          {NAV_ROWS_TOP.filter((r): r is Extract<NavRow, { kind: "item" }> => r.kind === "item").map((row) => {
            const useSvg = !!svgFallbacks[row.label];
            return (
              <NavButton key={row.label} label={row.label} onClick={onItemClick}>
                {useSvg ? (
                  <row.svg />
                ) : (
                  <RasterGlyph src={row.src} inset={row.inset} onError={() => markSvg(row.label)} />
                )}
              </NavButton>
            );
          })}
        </div>

        <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          {NAV_ROWS_BOTTOM.map((row) => {
            const useSvg = !!svgFallbacks[row.label];
            return (
              <IconOnlyNavButton key={row.label} label={row.label} onClick={onItemClick}>
                {useSvg ? (
                  <row.svg />
                ) : (
                  <RasterGlyph src={row.src} inset={row.inset} onError={() => markSvg(row.label)} />
                )}
              </IconOnlyNavButton>
            );
          })}

          <button
            type="button"
            onClick={() => onItemClick?.("Avatar")}
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
            {avatarSvg ? (
              <SvgAvatar size={48} />
            ) : (
              <AvatarRaster size={48} onRasterError={() => setAvatarSvg(true)} />
            )}
          </button>
        </div>
      </div>

      {showDrawerRail && (
        <div
          style={{
            width: 48,
            height: "100%",
            flexShrink: 0,
            position: "relative",
            background: "var(--hs-color-fill-base)",
            borderLeft: "1px solid var(--hs-color-border-subtle)",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => onItemClick?.("Toggle nav drawer")}
            aria-label="Toggle nav drawer"
            style={{
              position: "absolute",
              top: 8,
              left: 3,
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
              padding: 10,
              boxSizing: "border-box",
            }}
          >
            <RasterGlyph
              src={R.drawerChevron}
              inset="25% 20.83%"
              size={20}
              onError={() => markSvg("drawerChevron")}
            />
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
        fontSize: 14,
        lineHeight: "24px",
        fontWeight: 400,
        color: "var(--hs-color-text-base)",
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
    </button>
  );
}

/** Avatar used in composer chrome — same raster + SVG fallback as the main nav. */
export function AvatarImage({ size = 48 }: { size?: number }) {
  const [useSvg, setUseSvg] = useState(false);
  if (useSvg) return <SvgAvatar size={size} />;
  return <AvatarRaster size={size} onRasterError={() => setUseSvg(true)} />;
}
