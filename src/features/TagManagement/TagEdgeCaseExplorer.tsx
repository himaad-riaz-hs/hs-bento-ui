import { useEffect, useMemo, useState, type ReactNode } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import type { TaggingDataPreset } from "./tagging-presets";
import type { TabValue } from "./types";

/**
 * Edge case explorer — a slide-out catalog of Figma edge cases and states.
 *
 * Click any scenario card to apply it: the TagManagement surface remounts
 * with that scenario's config (data preset, initial tab, loading/error
 * simulation, etc.) and a floating banner appears at the top of the prototype
 * with what to notice and prev/next buttons for walking the full list.
 */
export type EdgeCaseConfig = {
  dataPreset?: TaggingDataPreset;
  initialTab?: TabValue;
  simulateGroupsLoading?: boolean;
  simulateGroupsLoadError?: boolean;
  surface?: "tags" | "composer";
};

export type EdgeCaseCategory =
  | "data"
  | "failure"
  | "archive"
  | "creation"
  | "delete"
  | "search"
  | "bulk"
  | "composer";

export type EdgeCaseScenario = {
  id: string;
  title: string;
  description: string;
  /** Shown on the active banner — the thing to notice once applied. */
  watchFor: string;
  /** Optional hint: click here to see it, etc. */
  manualAction?: string;
  category: EdgeCaseCategory;
  config: EdgeCaseConfig;
};

const CATEGORY_META: Record<EdgeCaseCategory, { label: string; accent: string; tint: string }> = {
  data: { label: "Data", accent: "#64748b", tint: "rgba(100, 116, 139, 0.14)" },
  failure: { label: "Failure", accent: "#dc2626", tint: "rgba(220, 38, 38, 0.12)" },
  archive: { label: "Archive", accent: "#ea580c", tint: "rgba(234, 88, 12, 0.14)" },
  creation: { label: "Creation", accent: "#059669", tint: "rgba(5, 150, 105, 0.14)" },
  delete: { label: "Delete", accent: "#b91c1c", tint: "rgba(185, 28, 28, 0.14)" },
  search: { label: "Search", accent: "#7c3aed", tint: "rgba(124, 58, 237, 0.14)" },
  bulk: { label: "Bulk", accent: "#0891b2", tint: "rgba(8, 145, 178, 0.14)" },
  composer: { label: "Composer", accent: "#2563eb", tint: "rgba(37, 99, 235, 0.14)" },
};

const CATEGORY_ORDER: EdgeCaseCategory[] = [
  "data",
  "failure",
  "archive",
  "creation",
  "delete",
  "search",
  "bulk",
  "composer",
];

export const EDGE_CASE_SCENARIOS: EdgeCaseScenario[] = [
  {
    id: "empty-zero",
    title: "Zero state — no groups, no tags",
    description: "Truly empty tag library. Shows the compact empty state and primary CTAs.",
    watchFor: "Compact empty state with Create group / Create tags CTAs and no archived items.",
    category: "data",
    config: { dataPreset: "empty", initialTab: "groups" },
  },
  {
    id: "empty-group",
    title: "Group with zero tags",
    description: "One user-created group exists but contains no tags yet.",
    watchFor: "Expanded group shows the empty row; Required toggle gating applies in Edit group.",
    category: "data",
    config: { dataPreset: "singleEmpty", initialTab: "groups" },
  },
  {
    id: "single-group",
    title: "Single group with tags",
    description: "Minimal realistic starting point — one group with two tags.",
    watchFor: "Because the group has 2+ tags, bulk selection checkboxes appear on expand.",
    category: "data",
    config: { dataPreset: "single", initialTab: "groups" },
  },
  {
    id: "many-groups",
    title: "Many groups — scale",
    description: "15+ groups with mixed required / visibility / permissions metadata.",
    watchFor: "Scroll performance, long list rendering, and varied meta lines on every card.",
    category: "data",
    config: { dataPreset: "many", initialTab: "groups" },
  },
  {
    id: "loading",
    title: "Groups loading skeleton",
    description: "Shimmer placeholders while the group list resolves.",
    watchFor: "Skeleton cards cover the list; header controls remain interactive.",
    category: "failure",
    config: { dataPreset: "default", simulateGroupsLoading: true, initialTab: "groups" },
  },
  {
    id: "load-error",
    title: "Groups load error + retry",
    description: "Dedicated failure state with retry action — not a fake empty library.",
    watchFor: "Error surface with Retry; archived tab is still reachable from the tab bar.",
    category: "failure",
    config: { dataPreset: "default", simulateGroupsLoadError: true, initialTab: "groups" },
  },
  {
    id: "archived-empty",
    title: "Archived tab — empty",
    description: "No archived groups or tags to restore.",
    watchFor: "Flat archived table shows its empty state; no info banner noise.",
    category: "archive",
    config: { dataPreset: "empty", initialTab: "archived" },
  },
  {
    id: "archived-populated",
    title: "Archived tab — populated",
    description: "Groups and tags mixed in the single flat archive table.",
    watchFor: "Sort chevron flips A-Z / Z-A, Type badge distinguishes group vs tag, Group column shows source.",
    category: "archive",
    config: { dataPreset: "default", initialTab: "archived" },
  },
  {
    id: "archive-group-dialog",
    title: "Archive group dialog",
    description: "Copy clarifies existing posts keep tags; pickers hide the group until restored.",
    watchFor: "Confirm dialog copy contrasts archive vs permanent delete.",
    manualAction: "Open a group's 3-dot menu → Archive.",
    category: "archive",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "multi-create",
    title: "Multi-create tags (comma-separated)",
    description: "Create many tags at once with a single comma-separated input.",
    watchFor: "Live count of parsed tags under the textarea; button reads Create N tags.",
    manualAction: "Click Create tags in the header and type: brand, campaign, country",
    category: "creation",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "duplicate-name",
    title: "Create group — duplicate name",
    description: "Blur-based duplicate validation with error border + inline message.",
    watchFor: "Error fires on blur, Create button stays enabled, guard runs again on submit.",
    manualAction: "Click Create group, type Brand (which exists), then tab out of the field.",
    category: "creation",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "required-gated",
    title: "Required toggle gated until edit",
    description: "Required for publishing only appears in Edit mode once the group has 1+ tag.",
    watchFor: "Create group hides Required; Edit group shows it when tags exist.",
    manualAction: "Open Edit on a group that already has tags.",
    category: "creation",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "delete-group-with-tags",
    title: "Delete group → tags go to Ungrouped",
    description: "Previously a stub. Now relocates tags instead of silently losing them.",
    watchFor: "Tags from the deleted group reappear under Ungrouped — nothing lost.",
    manualAction: "Open a group's 3-dot menu → Delete group.",
    category: "delete",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "permanent-delete",
    title: "Permanent delete from Archived",
    description: "Archive vs delete distinction — delete removes reporting references too.",
    watchFor: "Confirm dialog copy contrasts archive with permanent delete.",
    manualAction: "Open any archived row's 3-dot menu → Delete permanently.",
    category: "delete",
    config: { dataPreset: "default", initialTab: "archived" },
  },
  {
    id: "search-no-results",
    title: "Search — no results",
    description: "Empty search inside the hub reads as a card state, not a full hero.",
    watchFor: "Compact no-results block with reduced spacing and no hero illustration.",
    manualAction: "Type a nonsense query like 'zzzzz' into the search at the top.",
    category: "search",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "search-across",
    title: "Search spans groups and tags",
    description: "Query filters both group names and tag names within groups.",
    watchFor: "Groups auto-expand to reveal matching tags; Show all footer when partial.",
    manualAction: "Type brand into search — watch matching groups expand.",
    category: "search",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "bulk-single-tag",
    title: "Single-tag group hides checkboxes",
    description: "Bulk only makes sense with 2+ items — checkbox column hides otherwise.",
    watchFor: "No checkbox column when a group has exactly one tag.",
    manualAction: "Expand a group that has only one tag.",
    category: "bulk",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "bulk-cross-group-lock",
    title: "Cross-group selection lock",
    description: "Starting a selection in one card greys out checkboxes everywhere else.",
    watchFor: "Checkboxes in other expanded cards become disabled and dimmed.",
    manualAction: "Expand two groups, check any tag in one, watch the other card.",
    category: "bulk",
    config: { dataPreset: "default", initialTab: "groups" },
  },
  {
    id: "composer-tags",
    title: "Composer — tag field",
    description: "How admin tags appear when writing a post.",
    watchFor: "Tag picker reflects the library; Manage tags jumps back to tag settings when wired.",
    category: "composer",
    config: { surface: "composer" },
  },
  {
    id: "composer-required-missing",
    title: "Composer — required tag missing",
    description: "Post composer with required tag validation visible below the tag picker.",
    watchFor: "Required tags missing badge stays visible until a required Brand/Campaign tag is selected.",
    manualAction: "Clear all tags from the tag field.",
    category: "composer",
    config: { surface: "composer" },
  },
  {
    id: "composer-search-create",
    title: "Composer — search and create tag",
    description: "Search inside the tag combobox and create a new ungrouped tag from the composer.",
    watchFor: "No-results create action adds a tag and selects it immediately.",
    manualAction: "Open Tag, search a non-existing tag, then create it.",
    category: "composer",
    config: { surface: "composer" },
  },
  {
    id: "composer-manage-tags",
    title: "Composer — Manage tags bridge",
    description: "Composer handoff into the admin hub.",
    watchFor: "Manage tags switches to the admin surface without losing the prototype shell.",
    manualAction: "Open Tag and click Manage tags.",
    category: "composer",
    config: { surface: "composer" },
  },
];

export function edgeCaseSurface(scenario: EdgeCaseScenario): "tags" | "composer" {
  return scenario.config.surface === "composer" ? "composer" : "tags";
}

function FilterChip({
  label,
  active,
  accent,
  tint,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  accent: string;
  tint: string;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${active ? accent : "var(--hs-color-border-subtle)"}`,
        background: active ? tint : "transparent",
        color: active ? accent : "var(--hs-color-text-base)",
        fontFamily: HS_FONT_FAMILY,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 140ms ease",
      }}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 999,
            background: active ? `color-mix(in srgb, ${accent} 22%, transparent)` : "var(--hs-comp-badge-neutral-bg)",
            color: active ? accent : "var(--hs-color-text-subtle)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ScenarioCard({
  scenario,
  active,
  onClick,
}: {
  scenario: EdgeCaseScenario;
  active: boolean;
  onClick: () => void;
}) {
  const meta = CATEGORY_META[scenario.category];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "14px 14px 14px 20px",
        borderRadius: 12,
        border: `1px solid ${active ? meta.accent : "var(--hs-color-border-subtle)"}`,
        background: active ? meta.tint : "var(--hs-color-fill-base)",
        cursor: "pointer",
        fontFamily: HS_FONT_FAMILY,
        transition: "all 160ms ease",
        boxShadow: active
          ? `0 4px 16px color-mix(in srgb, ${meta.accent} 18%, transparent)`
          : "0 1px 2px color-mix(in srgb, var(--hs-color-text-base) 4%, transparent)",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.borderColor = meta.accent;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.borderColor = "var(--hs-color-border-subtle)";
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 12,
          bottom: 12,
          width: 4,
          borderRadius: "0 4px 4px 0",
          background: `linear-gradient(180deg, color-mix(in srgb, ${meta.accent} 55%, transparent), ${meta.accent})`,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "1px 8px",
            borderRadius: 999,
            background: meta.tint,
            color: meta.accent,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {meta.label}
        </span>
        {scenario.manualAction && (
          <span
            title="Requires a click to see"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "1px 8px",
              borderRadius: 999,
              background: "var(--hs-comp-badge-neutral-bg)",
              color: "var(--hs-color-text-subtle)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M3 3 L7 5 L3 7 Z" fill="currentColor" />
            </svg>
            Click to see
          </span>
        )}
        {active && (
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              color: meta.accent,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: meta.accent,
                boxShadow: `0 0 0 4px color-mix(in srgb, ${meta.accent} 24%, transparent)`,
              }}
            />
            Active
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 14,
          lineHeight: "20px",
          fontWeight: 600,
          color: "var(--hs-color-text-base)",
          marginBottom: 4,
          letterSpacing: "-0.005em",
        }}
      >
        {scenario.title}
      </div>
      <div style={{ fontSize: 12, lineHeight: "17px", color: "var(--hs-color-text-subtle)" }}>{scenario.description}</div>
    </button>
  );
}

const DRAWER_W = 400;

export function TagEdgeCaseExplorer({
  open,
  onClose,
  activeId,
  onSelect,
  headerOffset = 0,
  surface,
  onSwitchSurface,
}: {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  headerOffset?: number;
  surface?: "tags" | "composer";
  onSwitchSurface?: (s: "tags" | "composer") => void;
}) {
  const [filter, setFilter] = useState<EdgeCaseCategory | "all">("all");
  const [query, setQuery] = useState("");
  const scenarioSurface = surface ?? "tags";
  const availableScenarios = useMemo(
    () => EDGE_CASE_SCENARIOS.filter((s) => edgeCaseSurface(s) === scenarioSurface),
    [scenarioSurface]
  );

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: availableScenarios.length };
    for (const cat of CATEGORY_ORDER) m[cat] = 0;
    for (const s of availableScenarios) m[s.category] = (m[s.category] ?? 0) + 1;
    return m;
  }, [availableScenarios]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return availableScenarios.filter((s) => {
      if (filter !== "all" && s.category !== filter) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.watchFor.toLowerCase().includes(q) ||
        (s.manualAction?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [availableScenarios, filter, query]);

  useEffect(() => {
    if (filter !== "all" && counts[filter] === 0) setFilter("all");
  }, [counts, filter]);

  return (
    <aside
      aria-hidden={!open}
      style={{
        position: "fixed",
        top: headerOffset,
        left: open ? 0 : -(DRAWER_W + 24),
        bottom: 0,
        width: DRAWER_W,
        background: "color-mix(in srgb, var(--hs-color-fill-base) 94%, transparent)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRight: "1px solid var(--hs-color-border-subtle)",
        zIndex: 70,
        transition: "left 260ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        fontFamily: HS_FONT_FAMILY,
        boxShadow: open ? "10px 0 32px color-mix(in srgb, var(--hs-color-text-base) 8%, transparent)" : "none",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "16px 18px 12px",
          borderBottom: "1px solid var(--hs-color-border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--hs-color-text-subtle)",
              }}
            >
              Figma parity
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--hs-color-text-base)",
                letterSpacing: "-0.01em",
                marginTop: 2,
              }}
            >
              Edge case explorer
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edge case explorer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid var(--hs-color-border-subtle)",
              background: "transparent",
              color: "var(--hs-color-text-base)",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p style={{ margin: 0, fontSize: 12, lineHeight: "17px", color: "var(--hs-color-text-subtle)" }}>
          Tap any scenario to load it. Showing {scenarioSurface === "tags" ? "admin" : "composer"} cases only.
        </p>
        {onSwitchSurface && surface && (
          <div style={{ display: "flex", background: "var(--hs-comp-badge-neutral-bg)", borderRadius: 8, padding: 3, gap: 2 }}>
            {(["tags", "composer"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSwitchSurface(s)}
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: HS_FONT_FAMILY,
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  background: surface === s ? "var(--hs-color-fill-base)" : "transparent",
                  color: surface === s ? "var(--hs-color-text-base)" : "var(--hs-color-text-subtle)",
                  boxShadow: surface === s ? "0 1px 3px color-mix(in srgb, var(--hs-color-text-base) 10%, transparent)" : "none",
                  transition: "all 140ms ease",
                }}
              >
                {s === "tags" ? "Tags admin" : "Composer"}
              </button>
            ))}
          </div>
        )}
        <div style={{ position: "relative", marginTop: 2 }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--hs-color-text-subtle)",
            }}
          >
            <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m13 13 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter scenarios"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px 10px 8px 30px",
              fontSize: 13,
              fontFamily: HS_FONT_FAMILY,
              border: "1px solid var(--hs-color-border-subtle)",
              borderRadius: 8,
              background: "var(--hs-color-fill-base)",
              color: "var(--hs-color-text-base)",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: 6,
          padding: "10px 18px",
          overflowX: "auto",
          borderBottom: "1px solid var(--hs-color-border-subtle)",
        }}
      >
        <FilterChip
          label="All"
          active={filter === "all"}
          accent="var(--hs-color-text-base)"
          tint="var(--hs-comp-badge-neutral-bg)"
          count={counts.all}
          onClick={() => setFilter("all")}
        />
        {CATEGORY_ORDER.filter((cat) => counts[cat] > 0).map((cat) => {
          const meta = CATEGORY_META[cat];
          return (
            <FilterChip
              key={cat}
              label={meta.label}
              accent={meta.accent}
              tint={meta.tint}
              active={filter === cat}
              count={counts[cat]}
              onClick={() => setFilter(cat)}
            />
          );
        })}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "12px 14px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              fontSize: 13,
              color: "var(--hs-color-text-subtle)",
              border: "1px dashed var(--hs-color-border-subtle)",
              borderRadius: 12,
            }}
          >
            No scenarios match that filter.
          </div>
        )}
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} active={activeId === s.id} onClick={() => onSelect(s.id)} />
        ))}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "10px 18px",
          borderTop: "1px solid var(--hs-color-border-subtle)",
          fontSize: 11,
          color: "var(--hs-color-text-subtle)",
          letterSpacing: "0.02em",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          {filtered.length} of {availableScenarios.length} scenarios
        </span>
        {activeId && (
          <button
            type="button"
            onClick={() => onSelect("")}
            style={{
              background: "none",
              border: "none",
              color: "var(--hs-color-text-link)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: HS_FONT_FAMILY,
              padding: 0,
            }}
          >
            Clear active
          </button>
        )}
      </div>
    </aside>
  );
}

export function ActiveScenarioBanner({
  scenario,
  onPrev,
  onNext,
  onClear,
  index,
  total,
}: {
  scenario: EdgeCaseScenario;
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  index: number;
  total: number;
}) {
  const meta = CATEGORY_META[scenario.category];
  return (
    <div
      style={{
        position: "fixed",
        top: 72,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 65,
        width: "min(720px, calc(100vw - 48px))",
        padding: "12px 14px 12px 18px",
        borderRadius: 14,
        background: "color-mix(in srgb, var(--hs-color-fill-base) 95%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid color-mix(in srgb, ${meta.accent} 60%, var(--hs-color-border-subtle))`,
        boxShadow: `0 10px 32px ${meta.tint}, 0 1px 0 color-mix(in srgb, var(--hs-color-fill-base) 60%, transparent) inset`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: HS_FONT_FAMILY,
        animation: "hsEdgeBannerIn 260ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      <style>{`
        @keyframes hsEdgeBannerIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <div
        aria-hidden
        style={{
          flexShrink: 0,
          width: 4,
          alignSelf: "stretch",
          borderRadius: 4,
          background: `linear-gradient(180deg, color-mix(in srgb, ${meta.accent} 55%, transparent), ${meta.accent})`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "1px 8px",
              borderRadius: 999,
              background: meta.tint,
              color: meta.accent,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {meta.label}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "var(--hs-color-text-subtle)",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            {index + 1} / {total}
          </span>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--hs-color-text-base)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: "-0.005em",
            }}
          >
            {scenario.title}
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            lineHeight: "17px",
            color: "var(--hs-color-text-subtle)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {scenario.manualAction ? (
            <>
              <span style={{ color: meta.accent, fontWeight: 600 }}>To see it: </span>
              {scenario.manualAction}
            </>
          ) : (
            <>
              <span style={{ color: meta.accent, fontWeight: 600 }}>Watch for: </span>
              {scenario.watchFor}
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <BannerBtn label="Previous scenario" onClick={onPrev}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </BannerBtn>
        <BannerBtn label="Next scenario" onClick={onNext}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </BannerBtn>
        <BannerBtn label="Clear active scenario" onClick={onClear}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </BannerBtn>
      </div>
    </div>
  );
}

function BannerBtn({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 8,
        border: "1px solid var(--hs-color-border-subtle)",
        background: hovered ? "var(--hs-comp-badge-neutral-bg)" : "transparent",
        color: "var(--hs-color-text-base)",
        cursor: "pointer",
        transition: "background 140ms ease",
      }}
    >
      {children}
    </button>
  );
}

export function useEdgeCaseKeyboardNav({
  enabled,
  onPrev,
  onNext,
  onClear,
}: {
  enabled: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
}) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "Escape") {
        onClear();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onPrev, onNext, onClear]);
}
