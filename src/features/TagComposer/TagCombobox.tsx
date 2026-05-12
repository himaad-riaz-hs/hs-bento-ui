import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "../../lib/cn";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import type { ComposerTag, ComposerTagGroup } from "./types";

interface TagComboboxProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  groups: ComposerTagGroup[];
  ungrouped: ComposerTag[];
  selected: ComposerTag[];
  onSelect: (tag: ComposerTag) => void;
  onDeselect: (tagId: string) => void;
  onClearAll: () => void;
  onFavorite: (tagId: string) => void;
  onUnfavorite: (tagId: string) => void;
  onCreateTag?: (name: string) => void;
  onManageTags?: () => void;
  className?: string;
}

export function TagCombobox({
  label,
  required,
  helperText,
  groups,
  ungrouped,
  selected,
  onSelect,
  onDeselect,
  onClearAll,
  onFavorite,
  onUnfavorite,
  onCreateTag,
  onManageTags,
  className,
}: TagComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set([...groups.filter((g) => g.required).map((g) => g.id), "favorites"])
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedIds = new Set(selected.map((t) => t.id));

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setInputValue("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Sorted: required groups A-Z first, then optional A-Z — matches Figma spec
  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      if (a.required !== b.required) return a.required ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [groups]);

  const allTags = useMemo(
    () => [...sortedGroups.flatMap((g) => g.tags), ...ungrouped],
    [sortedGroups, ungrouped]
  );
  const favoriteTags = useMemo(
    () => allTags.filter((t) => t.favorited),
    [allTags]
  );

  const q = inputValue.toLowerCase().trim();
  const filteredGroups = useMemo(() => {
    if (!q) return sortedGroups;
    return sortedGroups
      .map((g) => ({ ...g, tags: g.tags.filter((t) => t.name.toLowerCase().includes(q)) }))
      .filter((g) => g.tags.length > 0);
  }, [sortedGroups, q]);
  const filteredUngrouped = useMemo(() => {
    if (!q) return ungrouped;
    return ungrouped.filter((t) => t.name.toLowerCase().includes(q));
  }, [ungrouped, q]);
  const filteredFavorites = useMemo(() => {
    if (!q) return favoriteTags;
    return favoriteTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [favoriteTags, q]);
  const totalResults =
    filteredGroups.reduce((s, g) => s + g.tags.length, 0) +
    filteredUngrouped.length +
    filteredFavorites.length;

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggle = (tag: ComposerTag) =>
    selectedIds.has(tag.id) ? onDeselect(tag.id) : onSelect(tag);

  return (
    <div ref={wrapperRef} className={cn("relative", className)} style={{ fontFamily: HS_FONT_FAMILY }}>
      {/* ── Label row ── */}
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, color: "var(--hs-color-text-base)" }}>
              {label}
            </span>
            {required && (
              <span style={{ fontSize: 16, lineHeight: "24px", fontWeight: 400, color: "var(--hs-color-text-subtle)" }}>
                (required)
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Helper text ── */}
      {helperText && (
        <p style={{ fontSize: 14, lineHeight: "20px", color: "var(--hs-color-text-subtle)", margin: "0 0 8px" }}>
          {helperText}
        </p>
      )}

      {/* ── Trigger + "Manage tags" ── */}
      <div style={{ display: "flex", alignItems: "start", gap: 8 }}>
        {/* combobox field */}
        <div
          onClick={() => { setOpen(true); inputRef.current?.focus(); }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            minHeight: 40,
            borderRadius: "var(--hs-comp-input-border-radii)",
            paddingLeft: 16,
            paddingRight: 16,
            background: "var(--hs-comp-input-bg)",
            cursor: "text",
            position: "relative",
            boxShadow: open
              ? "0 0 0 2px var(--hs-comp-input-border-focus), inset 0 0 0 1px var(--hs-comp-input-border-focus)"
              : "inset 0 0 0 1px var(--hs-comp-input-border)",
            transition: "box-shadow var(--hs-motion-duration-medium) var(--hs-motion-easing-standard)",
          }}
        >
          {/* chips + text input */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "4px 8px",
              paddingTop: 4,
              paddingBottom: 4,
              minHeight: 32,
            }}
          >
            {selected.map((tag) => (
              <span
                key={tag.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minWidth: 48,
                  maxWidth: 216,
                  borderRadius: 999,
                  background: "var(--hs-color-fill-inverse)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    padding: "4px 8px",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 16,
                      lineHeight: "24px",
                      fontWeight: 600,
                      color: "var(--hs-color-text-inverse)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tag.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDeselect(tag.id); }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    borderRadius: 50,
                    background: "var(--hs-color-fill-inverse)",
                    color: "var(--hs-color-text-inverse)",
                    border: "none",
                    padding: 4,
                    cursor: "pointer",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4.67 4.67l6.66 6.66M11.33 4.67l-6.66 6.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); if (!open) setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder={selected.length === 0 ? "Select tags" : ""}
              style={{
                flex: 1,
                minWidth: 80,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 16,
                lineHeight: "24px",
                color: "var(--hs-comp-input-text)",
                padding: 0,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* trailing icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexShrink: 0,
            }}
          >
            {selected.length > 0 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClearAll(); }}
                style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "var(--hs-color-text-muted)", display: "flex" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" fill="currentColor" fillOpacity="0.65" />
                  <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "var(--hs-color-icon-base)", flexShrink: 0 }}>
              <path d="M6.25 8.75l3.75 3.75 3.75-3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Manage tags link */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onManageTags?.();
          }}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: "40px",
            fontWeight: 700,
            color: "var(--hs-color-text-base)",
            whiteSpace: "nowrap",
            fontFamily: "inherit",
          }}
        >
          Manage tags
        </button>
      </div>

      {/* ── Dropdown ── */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "calc(100% - 130px)",
            marginTop: 4,
            borderRadius: "var(--hs-comp-input-border-radii)",
            border: "1px solid var(--hs-color-border-subtle)",
            background: "var(--hs-color-fill-base)",
            boxShadow: "var(--hs-comp-menu-shadow)",
            maxHeight: 456,
            minWidth: 160,
            overflowY: "auto",
            zIndex: 50,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          {/* Favourites group */}
          {filteredFavorites.length > 0 && (
            <>
              <GroupRow
                name="Favourites"
                expanded={expandedGroups.has("favorites")}
                onToggle={() => toggleGroup("favorites")}
                fontFamily={HS_FONT_FAMILY}
              />
              {expandedGroups.has("favorites") &&
                filteredFavorites.map((t) => (
                  <TagRow key={`fav-${t.id}`} tag={t} selected={selectedIds.has(t.id)} onToggle={() => toggle(t)} onFavorite={onFavorite} onUnfavorite={onUnfavorite} indent fontFamily={HS_FONT_FAMILY} />
                ))}
            </>
          )}

          {/* Regular groups */}
          {filteredGroups.map((g) => {
            const selectedInGroup = g.tags.filter((t) => selectedIds.has(t.id)).length;
            const displayName = selectedInGroup > 0 ? `${g.name} (${selectedInGroup})` : g.name;
            return (
            <div key={g.id}>
              <GroupRow
                name={displayName}
                required={g.required}
                expanded={expandedGroups.has(g.id)}
                onToggle={() => toggleGroup(g.id)}
                fontFamily={HS_FONT_FAMILY}
              />
              {expandedGroups.has(g.id) &&
                g.tags.map((t) => (
                  <TagRow key={t.id} tag={t} selected={selectedIds.has(t.id)} onToggle={() => toggle(t)} onFavorite={onFavorite} onUnfavorite={onUnfavorite} indent fontFamily={HS_FONT_FAMILY} />
                ))}
            </div>
            );
          })}

          {/* Ungrouped tags — show section header when items exist */}
          {filteredUngrouped.length > 0 && (
            <>
              {(() => {
                const selectedUngroupedCount = filteredUngrouped.filter(t => selectedIds.has(t.id)).length;
                const ungroupedDisplayName = selectedUngroupedCount > 0 ? `Ungrouped tags (${selectedUngroupedCount})` : "Ungrouped tags";
                return (
                  <GroupRow
                    name={ungroupedDisplayName}
                    expanded={expandedGroups.has("ungrouped")}
                    onToggle={() => toggleGroup("ungrouped")}
                    fontFamily={HS_FONT_FAMILY}
                  />
                );
              })()}
              {expandedGroups.has("ungrouped") &&
                filteredUngrouped.map((t) => (
                  <TagRow key={t.id} tag={t} selected={selectedIds.has(t.id)} onToggle={() => toggle(t)} onFavorite={onFavorite} onUnfavorite={onUnfavorite} indent fontFamily={HS_FONT_FAMILY} />
                ))}
            </>
          )}

          {/* No results */}
          {q && totalResults === 0 && (
            <div style={{ padding: 16, textAlign: "center" }}>
              <p style={{ fontSize: 16, color: "var(--hs-color-text-subtle)", marginBottom: 12 }}>
                No matches found for "{inputValue}"
              </p>
              <p style={{ fontSize: 14, color: "var(--hs-color-text-muted)", marginBottom: 16 }}>
                Double check your spelling or try a different search term.
              </p>
              {onCreateTag && (
                <button
                  type="button"
                  onClick={() => { onCreateTag(inputValue); setInputValue(""); }}
                  style={{
                    height: 40,
                    padding: "8px 16px",
                    borderRadius: "var(--hs-comp-button-border-radii)",
                    background: "var(--hs-comp-button-filled-bg)",
                    color: "var(--hs-comp-button-filled-text)",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Create "{inputValue}"
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ transition: "transform var(--hs-motion-duration-medium) var(--hs-motion-easing-standard)", transform: expanded ? "rotate(90deg)" : "rotate(0)", flexShrink: 0 }}
    >
      <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckboxIcon({ state }: { state: "none" | "some" | "all" }) {
  const checked = state === "all";
  const indeterminate = state === "some";
  const active = checked || indeterminate;
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, flexShrink: 0 }}>
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: `2px solid ${active ? "var(--hs-comp-combobox-checkbox-selected-fill)" : "var(--hs-color-border-base)"}`,
          background: active ? "var(--hs-comp-combobox-checkbox-selected-fill)" : "var(--hs-comp-input-bg)",
          display: "block",
          transition: "background 120ms, border-color 120ms",
        }}
      />
      {checked && (
        <svg style={{ position: "absolute", width: 12, height: 12 }} viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && (
        <svg style={{ position: "absolute", width: 12, height: 12 }} viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6h7" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

function GroupRow({
  name,
  required,
  expanded,
  onToggle,
  fontFamily,
}: {
  name: string;
  required?: boolean;
  expanded: boolean;
  onToggle: () => void;
  fontFamily: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: 48,
        padding: "0 16px",
        cursor: "pointer",
        fontFamily,
      }}
      onClick={onToggle}
    >
      <span style={{ marginRight: 8, color: "var(--hs-color-icon-base)" }}>
        <Chevron expanded={expanded} />
      </span>
      <span style={{ flex: 1, fontSize: 16, lineHeight: "24px", fontWeight: 600, color: "var(--hs-color-text-base)" }}>
        {name}
      </span>
      {required && (
        <span style={{ fontSize: 14, lineHeight: "24px", fontWeight: 400, color: "var(--hs-color-text-subtle)" }}>
          Required
        </span>
      )}
    </div>
  );
}

function TagRow({
  tag,
  selected,
  onToggle,
  onFavorite,
  onUnfavorite,
  indent,
  fontFamily,
}: {
  tag: ComposerTag;
  selected: boolean;
  onToggle: () => void;
  onFavorite: (id: string) => void;
  onUnfavorite: (id: string) => void;
  indent?: boolean;
  fontFamily: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: 48,
        paddingLeft: indent ? 44 : 16,
        paddingRight: 16,
        cursor: "pointer",
        background: selected
          ? "var(--hs-comp-combobox-list-row-selected-bg)"
          : hovered
            ? "var(--hs-comp-badge-neutral-bg)"
            : "transparent",
        transition: "background var(--hs-motion-duration-fast) var(--hs-motion-easing-standard)",
        fontFamily,
      }}
    >
      <span style={{ marginRight: 12 }}>
        <CheckboxIcon state={selected ? "all" : "none"} />
      </span>
      <span style={{ flex: 1, fontSize: 16, lineHeight: "24px", fontWeight: 400, color: "var(--hs-color-text-base)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {tag.name}
      </span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); tag.favorited ? onUnfavorite(tag.id) : onFavorite(tag.id); }}
        title={tag.favorited ? "Unfavourite" : "Favourite"}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: 2,
          marginLeft: 8,
          color: tag.favorited ? "var(--hs-color-icon-base)" : "var(--hs-color-text-muted)",
          opacity: tag.favorited || hovered ? 1 : 0,
          transition: "opacity var(--hs-motion-duration-fast) var(--hs-motion-easing-standard)",
          display: "flex",
          flexShrink: 0,
        }}
      >
        {tag.favorited ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.98 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.98 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" stroke="currentColor" strokeWidth="1.5" /></svg>
        )}
      </button>
    </div>
  );
}
