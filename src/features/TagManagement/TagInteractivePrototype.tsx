import { useCallback, useMemo, useState } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { PostComposer } from "../TagComposer/PostComposer";
import {
  ActiveScenarioBanner,
  EDGE_CASE_SCENARIOS,
  TagEdgeCaseExplorer,
  edgeCaseSurface,
  useEdgeCaseKeyboardNav,
} from "./TagEdgeCaseExplorer";
import { TagManagement } from "./TagManagement";

/**
 * Single-screen interactive prototype (no slideshow): real `TagManagement` starting empty,
 * optional **Composer** surface, **annotation mode**, and **Figma comment updates** (inline notes in the UI).
 */
export function TagInteractivePrototype({
  initialEdgeDrawerOpen = false,
  initialScenarioId,
}: {
  initialEdgeDrawerOpen?: boolean;
  /** Pre-select a scenario by ID so it's active on mount. */
  initialScenarioId?: string;
} = {}) {
  const [surface, setSurface] = useState<"tags" | "composer">("tags");
  const [simulateGroupsLoading, setSimulateGroupsLoading] = useState(false);
  const [simulateGroupsLoadError, setSimulateGroupsLoadError] = useState(false);
  const [edgeDrawerOpen, setEdgeDrawerOpen] = useState(initialEdgeDrawerOpen);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(initialScenarioId ?? null);

  const applyScenarioById = useCallback((id: string) => {
    if (!id) {
      setActiveScenarioId(null);
      setSimulateGroupsLoading(false);
      setSimulateGroupsLoadError(false);
      return;
    }
    const scenario = EDGE_CASE_SCENARIOS.find((s) => s.id === id);
    if (!scenario) return;
    setActiveScenarioId(id);
    const cfg = scenario.config;
    setSimulateGroupsLoading(!!cfg.simulateGroupsLoading);
    setSimulateGroupsLoadError(!!cfg.simulateGroupsLoadError);
    if (cfg.surface === "composer") setSurface("composer");
    else setSurface("tags");
  }, []);

  const activeScenario = useMemo(
    () => (activeScenarioId ? EDGE_CASE_SCENARIOS.find((s) => s.id === activeScenarioId) ?? null : null),
    [activeScenarioId]
  );
  const visibleScenarios = useMemo(
    () => EDGE_CASE_SCENARIOS.filter((s) => edgeCaseSurface(s) === surface),
    [surface]
  );
  const activeScenarioIndex = useMemo(
    () => (activeScenario ? visibleScenarios.findIndex((s) => s.id === activeScenario.id) : -1),
    [activeScenario, visibleScenarios]
  );

  const effectiveDataPreset = activeScenario?.config.dataPreset ?? "default";
  const effectiveInitialTab = activeScenario?.config.initialTab;
  const tagsSurfaceKey = activeScenarioId ? `tags-scenario-${activeScenarioId}` : "tags-surface-default";

  const goPrevScenario = useCallback(() => {
    if (activeScenarioIndex <= 0) return;
    applyScenarioById(visibleScenarios[activeScenarioIndex - 1].id);
  }, [activeScenarioIndex, applyScenarioById, visibleScenarios]);

  const goNextScenario = useCallback(() => {
    if (activeScenarioIndex < 0 || activeScenarioIndex >= visibleScenarios.length - 1) return;
    applyScenarioById(visibleScenarios[activeScenarioIndex + 1].id);
  }, [activeScenarioIndex, applyScenarioById, visibleScenarios]);

  const clearActiveScenario = useCallback(() => {
    applyScenarioById("");
  }, [applyScenarioById]);

  const switchSurface = useCallback(
    (nextSurface: "tags" | "composer") => {
      setSurface(nextSurface);
      if (activeScenario && edgeCaseSurface(activeScenario) !== nextSurface) {
        applyScenarioById("");
      }
    },
    [activeScenario, applyScenarioById]
  );

  useEdgeCaseKeyboardNav({
    enabled: !!activeScenario,
    onPrev: goPrevScenario,
    onNext: goNextScenario,
    onClear: clearActiveScenario,
  });

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: HS_FONT_FAMILY,
        background: "var(--hs-color-fill-app)",
        color: "var(--hs-color-text-base)",
        overflow: "hidden",
      }}
    >
      {/* ── Prototype top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 40,
          flexShrink: 0,
          background: "var(--hs-color-fill-base)",
          borderBottom: "1px solid var(--hs-color-border-subtle)",
          gap: 12,
        }}
      >
        {/* App label */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            fontFamily: HS_FONT_FAMILY,
            color: "var(--hs-color-text-base)",
            letterSpacing: "0.01em",
            flexShrink: 0,
          }}
        >
          HStagging
        </span>

        {/* Surface toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--hs-comp-badge-neutral-bg)",
            borderRadius: 8,
            padding: 3,
            gap: 2,
            border: "1px solid var(--hs-color-border-subtle)",
          }}
        >
          {(["tags", "composer"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => switchSurface(s)}
              style={{
                padding: "3px 12px",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: HS_FONT_FAMILY,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                lineHeight: "20px",
                background: surface === s ? "var(--hs-color-fill-app)" : "transparent",
                color: surface === s ? "var(--hs-color-text-base)" : "var(--hs-color-text-subtle)",
                boxShadow:
                  surface === s
                    ? "0 1px 3px color-mix(in srgb, var(--hs-color-text-base) 12%, transparent)"
                    : "none",
                transition: "all 120ms ease",
              }}
            >
              {s === "tags" ? "Admin" : "Composer"}
            </button>
          ))}
        </div>

        {/* Right side: Cases button */}
        <button
          type="button"
          onClick={() => setEdgeDrawerOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 12px",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: HS_FONT_FAMILY,
            borderRadius: 6,
            border: "1px solid var(--hs-color-border-subtle)",
            cursor: "pointer",
            lineHeight: "20px",
            background: edgeDrawerOpen ? "var(--hs-color-fill-inverse)" : "transparent",
            color: edgeDrawerOpen ? "var(--hs-color-text-inverse)" : "var(--hs-color-text-subtle)",
            transition: "all 120ms ease",
          }}
        >
          {/* grid / panel icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Cases
        </button>
      </div>

      {/* ── Active scenario banner (sits under the proto bar) ── */}
      {activeScenario && (
        <ActiveScenarioBanner
          scenario={activeScenario}
          index={activeScenarioIndex}
          total={visibleScenarios.length}
          onPrev={goPrevScenario}
          onNext={goNextScenario}
          onClear={clearActiveScenario}
        />
      )}

      {/* ── Main content area (fills remaining height) ── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", display: "flex", overflow: "hidden" }}>
        {/* Edge case explorer drawer (overlays from the right) */}
        <TagEdgeCaseExplorer
          open={edgeDrawerOpen}
          onClose={() => setEdgeDrawerOpen(false)}
          activeId={activeScenarioId}
          onSelect={(id) => applyScenarioById(id)}
          surface={surface}
          onSwitchSurface={switchSurface}
        />

        {/* Surface content */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
          {surface === "tags" ? (
            <TagManagement
              key={tagsSurfaceKey}
              embedded
              layout="hub"
              hubWorkspace="figma-mp"
              dataPreset={effectiveDataPreset}
              initialTab={effectiveInitialTab}
              groupsLoading={simulateGroupsLoading}
              groupsLoadError={simulateGroupsLoadError}
              onRetryGroupsLoad={() => setSimulateGroupsLoadError(false)}
              modalSubmitHoldMs={450}
              onOpenProtoPanel={() => setEdgeDrawerOpen((o) => !o)}
            />
          ) : (
            <PostComposer
              key="composer-surface"
              embedded
              showOwlyAssistant={false}
              onManageTags={() => setSurface("tags")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
