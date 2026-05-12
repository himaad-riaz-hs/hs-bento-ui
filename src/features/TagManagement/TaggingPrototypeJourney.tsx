import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { TagManagement } from "./TagManagement";
import { PostComposer } from "../TagComposer/PostComposer";
import { ComposerTagAdminFlow } from "../TagComposer/ComposerTagAdminFlow";
import type { TaggingDataPreset } from "./tagging-presets";
import type { TabValue } from "./types";

const FIGMA =
  "https://www.figma.com/design/FWbrDllz3IolgLMzPlqvyX/Tagging?node-id=3990-40445";

type HubStep = {
  kind: "hub";
  id: string;
  chapter: string;
  title: string;
  caption: string;
  preset: TaggingDataPreset;
  initialTab?: TabValue;
};

type SlideStep = {
  kind: "slide";
  id: string;
  chapter: string;
  title: string;
  body: string;
  bullets?: string[];
};

type ComposerStep = {
  kind: "composer";
  id: string;
  chapter: string;
  title: string;
  caption: string;
};

type ComposerAdminStep = {
  kind: "composerAdmin";
  id: string;
  chapter: string;
  title: string;
  caption: string;
};

type Step = SlideStep | HubStep | ComposerStep | ComposerAdminStep;

const STEPS: Step[] = [
  {
    kind: "slide",
    id: "start",
    chapter: "Start",
    title: "Tagging prototype",
    body: "Full-screen flow from an empty library through composer and tag admin — like Figma present mode, it advances on its own.",
    bullets: [
      "Figma: Tagging · Section 3990:40445.",
      "Space pauses or resumes when you are not typing in a field.",
    ],
  },
  {
    kind: "hub",
    id: "zero",
    chapter: "1 · Empty account",
    title: "No tag groups yet",
    caption: "Only “Ungrouped tags” exists and it’s empty — same as a brand-new customer.",
    preset: "empty",
  },
  {
    kind: "hub",
    id: "first-group",
    chapter: "2 · First group",
    title: "First group, no tags",
    caption: "After “+ Create group”, they see a group row with zero tags (expand to add tags in the real product).",
    preset: "singleEmpty",
  },
  {
    kind: "hub",
    id: "first-tags",
    chapter: "3 · First tags in a group",
    title: "Tags inside “Brand”",
    caption: "Two sample tags — enough to show colour dots, table, and row actions.",
    preset: "single",
  },
  {
    kind: "hub",
    id: "organized",
    chapter: "4 · Organized library",
    title: "Multiple groups & tags",
    caption: "Full sample library: several groups, permissions, and mixed tag counts.",
    preset: "default",
  },
  {
    kind: "hub",
    id: "scale",
    chapter: "5 · At scale",
    title: "Many groups",
    caption: "Scroll the list — long group lists match the dense Figma artboards.",
    preset: "many",
  },
  {
    kind: "hub",
    id: "ungrouped",
    chapter: "6 · Ungrouped work",
    title: "Ungrouped tags tab",
    caption: "Tags not in any group — bulk move, archive, and sort.",
    preset: "default",
    initialTab: "ungrouped",
  },
  {
    kind: "hub",
    id: "archived",
    chapter: "7 · Archived",
    title: "Archived tab",
    caption: "Restore or permanently delete archived tags and groups.",
    preset: "default",
    initialTab: "archived",
  },
  {
    kind: "composer",
    id: "composer",
    chapter: "8 · Composer",
    title: "Create a post",
    caption: "Picker, networks, and tag combobox — where most people apply tags day-to-day.",
  },
  {
    kind: "composerAdmin",
    id: "bridge",
    chapter: "9 · Composer ↔ Admin",
    title: "Jump into tag admin",
    caption: "Use “Manage tags” in the composer, then ← Back to composer when done.",
  },
  {
    kind: "slide",
    id: "end",
    chapter: "End",
    title: "End of the linear flow",
    body: "Use this for stakeholder review or compare pixels in Figma.",
    bullets: [
      "Back still remounts each chapter with clean seed data.",
      FIGMA,
    ],
  },
];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) return true;
  return Boolean(target.closest("[contenteditable='true']"));
}

function dwellForStep(step: Step): number {
  if (step.id === "end") return 0;
  if (step.id === "start") return 4800;
  if (step.kind === "slide") return 7200;
  if (step.kind === "composer" || step.kind === "composerAdmin") return 10000;
  return 7200;
}

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M12.5 4L6.5 10l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M7.5 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M7 5.5v9l7-4.5-7-4.5Z" fill="currentColor" />
    </svg>
  );
}

function Slide({
  title,
  body,
  bullets,
}: {
  title: string;
  body: string;
  bullets?: string[];
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        textAlign: "center",
        maxWidth: 640,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          fontSize: 28,
          lineHeight: "36px",
          fontWeight: 600,
          color: "var(--hs-color-text-base)",
        }}
      >
        {title}
      </h2>
      <p style={{ margin: "0 0 24px", fontSize: 18, lineHeight: "28px", color: "var(--hs-color-text-subtle)" }}>{body}</p>
      {bullets && bullets.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            textAlign: "left",
            fontSize: 16,
            lineHeight: "26px",
            color: "var(--hs-color-text-base)",
            maxWidth: 520,
          }}
        >
          {bullets.map((b) => (
            <li key={b} style={{ marginBottom: 8 }}>
              {b.startsWith("http") ? (
                <a href={b} style={{ color: "var(--hs-color-text-link)" }}>
                  Open Figma — Tagging
                </a>
              ) : (
                b
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export interface TaggingPrototypeJourneyProps {
  /**
   * When true (default), each step advances after a dwell time — Figma-style present mode.
   * Turn off to step only with the controls or keyboard.
   */
  autoPlay?: boolean;
  /**
   * Optional caption strip under the chrome for hub / composer steps (designer notes).
   * Default false so the viewport matches the Figma frames (product chrome only).
   */
  showCaptions?: boolean;
}

/**
 * Full-screen, linear prototype: empty library → scale → tabs → composer → admin bridge → outro.
 * Defaults to timed auto-advance with a slim control bar; pause with Space (when not typing).
 */
export function TaggingPrototypeJourney({ autoPlay = true, showCaptions = false }: TaggingPrototypeJourneyProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const step = STEPS[index]!;
  const total = STEPS.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const dwell = dwellForStep(step);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => Math.max(0, Math.min(total - 1, i + dir)));
    },
    [total],
  );

  useEffect(() => {
    setPaused(false);
  }, [index]);

  useEffect(() => {
    if (!autoPlay || isLast || dwell <= 0) {
      setProgress(isLast ? 1 : 0);
      return;
    }

    setProgress(0);
    const started = Date.now();
    let pauseAnchor: number | null = null;
    let pausedAccum = 0;

    const id = setInterval(() => {
      const now = Date.now();
      if (pausedRef.current) {
        if (pauseAnchor === null) pauseAnchor = now;
        return;
      }
      if (pauseAnchor !== null) {
        pausedAccum += now - pauseAnchor;
        pauseAnchor = null;
      }
      const effective = now - started - pausedAccum;
      const p = Math.min(1, effective / dwell);
      setProgress(p);
      if (effective >= dwell) {
        clearInterval(id);
        setIndex((i) => Math.min(total - 1, i + 1));
      }
    }, 50);

    return () => clearInterval(id);
  }, [index, autoPlay, isLast, dwell, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      if (e.key === " " || e.code === "Space") {
        if (!autoPlay) return;
        e.preventDefault();
        setPaused((p) => !p);
        return;
      }

      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (!isLast) go(1);
      }
      if (e.key === "ArrowLeft" || e.key === "Escape") {
        if (!isFirst) go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, isFirst, isLast, autoPlay]);

  const body = useMemo(() => {
    if (step.kind === "slide") {
      return <Slide title={step.title} body={step.body} bullets={step.bullets} />;
    }
    if (step.kind === "hub") {
      return (
        <TagManagement
          key={`${step.id}-${index}`}
          layout="hub"
          embedded
          dataPreset={step.preset}
          initialTab={step.initialTab}
        />
      );
    }
    if (step.kind === "composer") {
      return <PostComposer key={`composer-${index}`} />;
    }
    return <ComposerTagAdminFlow key={`flow-${index}`} />;
  }, [index, step]);

  const showProgress = autoPlay && !isLast && dwell > 0;

  return (
    <div
      data-prototype-journey
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        fontFamily: HS_FONT_FAMILY,
        background: "var(--hs-color-fill-app)",
        color: "var(--hs-color-text-base)",
      }}
    >
      <header
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 44,
          padding: "0 12px 0 8px",
          borderBottom: "1px solid var(--hs-color-border-subtle)",
          background: "var(--hs-color-fill-base)",
          boxSizing: "border-box",
        }}
      >
        <IconButton
          type="button"
          variant="ghost"
          size="small"
          aria-label="Previous step"
          disabled={isFirst}
          icon={<IconChevronLeft />}
          onClick={() => go(-1)}
        />
        {autoPlay && !isLast && dwell > 0 && (
          <IconButton
            type="button"
            variant="ghost"
            size="small"
            aria-label={paused ? "Resume auto-advance" : "Pause auto-advance"}
            icon={paused ? <IconPlay /> : <IconPause />}
            onClick={() => setPaused((p) => !p)}
          />
        )}
        <div style={{ minWidth: 0, flex: 1, padding: "0 8px" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--hs-color-text-subtle)",
              textTransform: "uppercase",
            }}
          >
            {step.chapter}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              lineHeight: "20px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {step.title}
          </div>
        </div>
        <span style={{ fontSize: 12, color: "var(--hs-color-text-subtle)", flexShrink: 0, paddingRight: 4 }}>
          {index + 1} / {total}
        </span>
        {isLast ? (
          <Button variant="primary" type="button" onClick={() => setIndex(0)}>
            Play again
          </Button>
        ) : (
          <IconButton
            type="button"
            variant="ghost"
            size="small"
            aria-label="Next step"
            disabled={isLast}
            icon={<IconChevronRight />}
            onClick={() => go(1)}
          />
        )}
      </header>

      {showProgress && (
        <div
          style={{
            height: 3,
            flexShrink: 0,
            background: "var(--hs-color-fill-subtle)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(progress * 10000) / 100}%`,
              background: "var(--hs-comp-button-filled-bg)",
              transition: paused ? "width 0.05s linear" : undefined,
            }}
          />
        </div>
      )}

      {showCaptions && step.kind !== "slide" && (
        <p
          style={{
            margin: 0,
            padding: "10px 20px",
            fontSize: 13,
            lineHeight: "20px",
            color: "var(--hs-color-text-subtle)",
            borderBottom: "1px solid var(--hs-color-border-subtle)",
            background: "var(--hs-color-fill-subtle)",
          }}
        >
          {"caption" in step ? step.caption : ""}
        </p>
      )}

      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0, overflow: step.kind === "slide" ? "auto" : "hidden" }}>{body}</div>
      </div>
    </div>
  );
}
