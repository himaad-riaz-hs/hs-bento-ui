import type { RefObject } from "react";
import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

export type AnnotationSide = "left" | "right";

export type AnnotationSpec = {
  id: string;
  /** Value of `data-annotate` on a descendant of the root node */
  target: string;
  /** Reserved for future (e.g. line bias); cards are stacked in the dock. */
  side: AnnotationSide;
  title: string;
  body: string;
};

type TargetHit = {
  spec: AnnotationSpec;
  rect: DOMRect;
};

const DOCK_W = 300;
const DOCK_GAP = 14;
const DOCK_EDGE = 16;
const DOCK_TOP = 56;
const DOCK_BOTTOM_MARGIN = 20;

type ConnectorGeom = {
  id: string;
  d: string;
  sx: number;
  sy: number;
  ex: number;
  ey: number;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Annotation mode: soft **ring** highlights on real UI, and a **right dock** of callout cards.
 * **Cubic** connector curves run from each card’s left edge to the target’s right edge (the side
 * facing the dock), with a faint glow stroke and endpoint nodes so the line reads clearly.
 */
export type TagAnnotationOverlayVariant = "annotations" | "figma-updates" | "call-feedback";

export function TagAnnotationOverlay({
  rootRef,
  enabled,
  items,
  variant = "annotations",
  zBase = 36,
}: {
  rootRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  items: AnnotationSpec[];
  /** `figma-updates` uses a distinct accent so it stacks cleanly with annotation mode. */
  variant?: TagAnnotationOverlayVariant;
  /** Base z-index for highlights and connectors (dock is zBase + 8). */
  zBase?: number;
}) {
  const accent =
    variant === "figma-updates"
      ? "var(--hs-color-text-discovery)"
      : variant === "call-feedback"
        ? "#f59e0b"
        : "var(--hs-color-text-link)";
  const dockTitle =
    variant === "figma-updates"
      ? "Figma comment updates"
      : variant === "call-feedback"
        ? "Call feedback changes"
        : "Annotations";
  const lineGlowFilterId = `ann-line-glow-${useId().replace(/:/g, "")}`;
  const dockRef = useRef<HTMLDivElement>(null);
  const [hits, setHits] = useState<TargetHit[]>([]);
  const [paths, setPaths] = useState<ConnectorGeom[]>([]);

  const computePaths = useCallback(() => {
    const dock = dockRef.current;
    if (!dock || hits.length === 0) {
      setPaths([]);
      return;
    }
    const nextPaths: ConnectorGeom[] = [];
    for (const { spec, rect } of hits) {
      const card = dock.querySelector(`[data-ann-card="${spec.id}"]`) as HTMLElement | null;
      if (!card) continue;
      const cr = card.getBoundingClientRect();
      const ex = rect.right;
      const ey = rect.top + rect.height / 2;
      const sx = cr.left;
      const sy = clamp(ey, cr.top + 12, cr.bottom - 12);
      const span = sx - ex;
      const tension = clamp(span * 0.42, 72, 200);
      const d = `M ${sx} ${sy} C ${sx - tension} ${sy}, ${ex + tension} ${ey}, ${ex} ${ey}`;
      nextPaths.push({ id: spec.id, d, sx, sy, ex, ey });
    }
    setPaths(nextPaths);
  }, [hits]);

  const measureTargets = useCallback(() => {
    const root = rootRef.current;
    if (!root || !enabled) {
      setHits([]);
      return;
    }
    const next: TargetHit[] = [];
    for (const spec of items) {
      const el = root.querySelector(`[data-annotate="${spec.target}"]`) as HTMLElement | null;
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 && rect.height < 2) continue;
      next.push({ spec, rect });
    }
    setHits(next);
  }, [rootRef, enabled, items]);

  useLayoutEffect(() => {
    measureTargets();
  }, [measureTargets]);

  useLayoutEffect(() => {
    if (!enabled || hits.length === 0) {
      setPaths([]);
      return;
    }
    const id = requestAnimationFrame(() => computePaths());
    return () => cancelAnimationFrame(id);
  }, [enabled, hits, computePaths]);

  useLayoutEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const ro = new ResizeObserver(() => measureTargets());
    ro.observe(root);
    window.addEventListener("scroll", measureTargets, true);
    window.addEventListener("resize", measureTargets);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measureTargets, true);
      window.removeEventListener("resize", measureTargets);
    };
  }, [enabled, measureTargets, rootRef]);

  useLayoutEffect(() => {
    const dock = dockRef.current;
    if (!enabled || !dock) return;
    dock.addEventListener("scroll", computePaths, { passive: true });
    const ro = new ResizeObserver(() => computePaths());
    ro.observe(dock);
    return () => {
      dock.removeEventListener("scroll", computePaths);
      ro.disconnect();
    };
  }, [enabled, computePaths]);

  if (!enabled || hits.length === 0 || typeof document === "undefined") return null;

  return createPortal(
    <>
      {hits.map(({ spec, rect }) => (
        <div
          key={`hl-${spec.id}`}
          style={{
            position: "fixed",
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            borderRadius: 12,
            boxSizing: "border-box",
            pointerEvents: "none",
            zIndex: zBase,
            boxShadow: `
              inset 0 0 0 2px ${accent},
              inset 0 0 0 4px color-mix(in srgb, ${accent} 18%, transparent),
              0 0 0 1px var(--hs-color-border-subtle),
              0 10px 40px color-mix(in srgb, ${accent} 12%, transparent)
            `,
          }}
        />
      ))}

      <svg
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: zBase + 1,
        }}
      >
        <defs>
          <filter id={lineGlowFilterId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {paths.map(({ id, d, sx, sy, ex, ey }) => (
          <g key={`ln-${id}`}>
            <path
              d={d}
              fill="none"
              stroke={accent}
              strokeWidth={9}
              strokeLinecap="round"
              opacity={0.08}
            />
            <path
              d={d}
              fill="none"
              stroke={accent}
              strokeWidth={2.25}
              strokeLinecap="round"
              opacity={0.22}
              filter={`url(#${lineGlowFilterId})`}
            />
            <path
              d={d}
              fill="none"
              stroke={accent}
              strokeWidth={1.35}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.92}
            />
            <circle cx={ex} cy={ey} r={5} fill="var(--hs-color-fill-base)" stroke={accent} strokeWidth={2} />
            <circle cx={sx} cy={sy} r={4} fill={accent} />
            <circle cx={sx} cy={sy} r={11} fill={accent} opacity={0.12} />
          </g>
        ))}
      </svg>

      <div
        ref={dockRef}
        style={{
          position: "fixed",
          top: DOCK_TOP,
          right: DOCK_EDGE,
          width: DOCK_W,
          maxHeight: `calc(100vh - ${DOCK_TOP + DOCK_BOTTOM_MARGIN}px)`,
          zIndex: zBase + 8,
          display: "flex",
          flexDirection: "column",
          gap: DOCK_GAP,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "14px 14px 16px",
          boxSizing: "border-box",
          pointerEvents: "auto",
          background: "color-mix(in srgb, var(--hs-color-fill-base) 88%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: 16,
          border: "1px solid color-mix(in srgb, var(--hs-color-border-subtle) 85%, transparent)",
          boxShadow:
            "0 4px 24px color-mix(in srgb, var(--hs-color-text-base) 6%, transparent), 0 1px 0 color-mix(in srgb, var(--hs-color-fill-base) 60%, transparent) inset",
        }}
      >
        <div style={{ flexShrink: 0, marginBottom: 2, paddingBottom: 10, borderBottom: "1px solid var(--hs-color-border-subtle)" }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--hs-color-text-subtle)",
              fontFamily: HS_FONT_FAMILY,
            }}
          >
            {dockTitle}
          </p>
        </div>
        {hits.map(({ spec }) => (
          <div
            key={spec.id}
            data-ann-card={spec.id}
            style={{
              flexShrink: 0,
              position: "relative",
              padding: "14px 16px 14px 18px",
              boxSizing: "border-box",
              width: "100%",
              background: "var(--hs-color-fill-base)",
              borderRadius: 12,
              border: "1px solid var(--hs-color-border-subtle)",
              fontFamily: HS_FONT_FAMILY,
              boxShadow:
                "0 1px 0 color-mix(in srgb, var(--hs-color-fill-base) 80%, transparent), 0 8px 28px color-mix(in srgb, var(--hs-color-text-base) 4%, transparent)",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 14,
                bottom: 14,
                width: 3,
                borderRadius: "0 3px 3px 0",
                background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 55%, transparent), ${accent})`,
                opacity: 0.85,
              }}
            />
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: 14,
                fontWeight: 700,
                lineHeight: "20px",
                color: "var(--hs-color-text-base)",
                letterSpacing: "-0.01em",
              }}
            >
              {spec.title}
            </h3>
            <p style={{ margin: 0, fontSize: 13, lineHeight: "20px", color: "var(--hs-color-text-subtle)" }}>{spec.body}</p>
          </div>
        ))}
      </div>
    </>,
    document.body
  );
}
