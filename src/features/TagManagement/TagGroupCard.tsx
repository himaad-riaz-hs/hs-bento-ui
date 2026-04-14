import { useState, useEffect, useRef, useMemo } from "react";
import { Checkbox } from "../../components/Checkbox";
import { IconButton } from "../../components/IconButton";
import type { Tag, TagGroup } from "./types";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { TagBulkToolbar } from "./TagBulkToolbar";

// ─── DropdownMenu (local) ─────────────────────────────────────────────────

function DropdownMenu({
  items,
  onClose,
}: {
  items: Array<{ label: string; onClick: () => void; destructive?: boolean }>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        right: 0,
        top: "100%",
        marginTop: 4,
        zIndex: 2000,
        minWidth: 200,
        borderRadius: 8,
        background: "var(--hs-color-fill-app)",
        boxShadow:
          "var(--hs-comp-menu-shadow)",
        fontFamily: HS_FONT_FAMILY,
        padding: "8px 0",
      }}
    >
      {items.map((item, i) => (
        <DropdownMenuItem key={i} {...item} />
      ))}
    </div>
  );
}

function DropdownMenuItem({
  label,
  onClick,
  destructive,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        textAlign: "left",
        padding: "0 16px",
        minHeight: 48,
        fontSize: 16,
        fontWeight: 400,
        color: destructive ? "var(--hs-color-text-critical)" : "var(--hs-color-text-base)",
        background: hovered ? "var(--hs-comp-badge-neutral-bg)" : "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: HS_FONT_FAMILY,
        transition: "background var(--hs-motion-duration-fast) var(--hs-motion-easing-standard)",
      }}
    >
      {label}
    </button>
  );
}

function MoveToGroupMenu({
  availableGroups,
  onSelect,
  onClose,
}: {
  availableGroups: Array<{ id: string; name: string }>;
  onSelect: (groupId: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        right: 0,
        top: "100%",
        marginTop: 4,
        zIndex: 2000,
        minWidth: 220,
        borderRadius: 8,
        background: "var(--hs-color-fill-app)",
        boxShadow: "var(--hs-comp-menu-shadow)",
        fontFamily: HS_FONT_FAMILY,
        padding: "8px 0",
      }}
    >
      <div
        style={{
          padding: "8px 16px",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--hs-color-text-subtle)",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Move to group
      </div>
      {availableGroups.map((g) => (
        <DropdownMenuItem key={g.id} label={g.name} onClick={() => onSelect(g.id)} />
      ))}
      {availableGroups.length === 0 && (
        <div style={{ padding: "12px 16px", fontSize: 14, color: "var(--hs-color-text-disabled)" }}>
          No groups available
        </div>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────

interface TagGroupCardProps {
  group: TagGroup;
  onEditGroup?: () => void;
  onEditTag?: (tag: Tag) => void;
  onCreateTag?: () => void;
  onArchiveGroup?: () => void;
  onArchiveTag?: (tagId: string) => void;
  onDeleteTag?: (tagId: string) => void;
  onMoveTag?: (tagId: string, targetGroupId: string) => void;
  onBulkArchive?: (tagIds: string[]) => void;
  onBulkMove?: (tagIds: string[], targetGroupId: string) => void;
  onBulkDelete?: (tagIds: string[]) => void;
  availableGroups?: Array<{ id: string; name: string }>;
  /** Controlled expansion (e.g. expand/collapse all from parent). Omit for local-only toggle. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function TagGroupCard({
  group,
  onEditGroup,
  onEditTag,
  onCreateTag,
  onArchiveGroup,
  onArchiveTag,
  onDeleteTag,
  onMoveTag,
  onBulkArchive,
  onBulkMove,
  onBulkDelete,
  availableGroups = [],
  expanded: expandedProp,
  onExpandedChange,
}: TagGroupCardProps) {
  const [expandedInternal, setExpandedInternal] = useState(false);
  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : expandedInternal;
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const isUngrouped = group.id === "ungrouped";

  /** Parent applies global search; no per-card filter. */
  const displayTags = group.tags;

  const selectedInDisplay = useMemo(
    () => displayTags.filter((t) => selectedTags.has(t.id)).length,
    [displayTags, selectedTags]
  );

  const toggleTag = (id: string) => {
    const next = new Set(selectedTags);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedTags(next);
  };

  const toggleAll = () => {
    if (selectedTags.size === displayTags.length) setSelectedTags(new Set());
    else setSelectedTags(new Set(displayTags.map((t) => t.id)));
  };

  const clearSelection = () => setSelectedTags(new Set());

  const toggleExpanded = () => {
    const prev = expanded;
    const next = !prev;
    if (prev) {
      clearSelection();
      setMoreMenuOpen(false);
    }
    if (isControlled) onExpandedChange?.(next);
    else setExpandedInternal(next);
  };

  const showBulkToolbar = expanded && selectedTags.size > 0;
  const [tagNameSortDesc, setTagNameSortDesc] = useState(false);

  const sortedDisplayTags = useMemo(() => {
    const t = [...displayTags];
    t.sort((a, b) =>
      tagNameSortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    );
    return t;
  }, [displayTags, tagNameSortDesc]);

  const handleBulkArchive = () => {
    onBulkArchive?.(Array.from(selectedTags));
    clearSelection();
  };

  const handleBulkDelete = () => {
    onBulkDelete?.(Array.from(selectedTags));
    clearSelection();
  };

  const handleBulkMove = (targetGroupId: string) => {
    onBulkMove?.(Array.from(selectedTags), targetGroupId);
    clearSelection();
    setBulkMoveOpen(false);
  };

  return (
    <div
      style={{
        borderRadius: 8,
        border: "1px solid var(--hs-color-border-subtle)",
        background: "var(--hs-color-fill-base)",
        /* Must not clip kebab / row menus (position: absolute below trigger) */
        overflow: "visible",
        fontFamily: HS_FONT_FAMILY,
      }}
    >
      {/* Card header — Figma nested-list-item: min 80px, tag count + arrow, kebab only */}
      <div
        onClick={toggleExpanded}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          minHeight: 80,
          padding: "16px",
          cursor: "pointer",
          background: "transparent",
          borderBottom: expanded
            ? "1px solid var(--hs-color-border-base)"
            : "none",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "var(--hs-color-text-base)",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {group.name}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
              fontSize: 16,
              lineHeight: "24px",
              color: "var(--hs-color-text-subtle)",
              marginTop: 0,
            }}
          >
            <span>{group.required ? "Required" : "Not required"}</span>
            <span aria-hidden>•</span>
            <span>
              {group.visibility === "everyone"
                ? "Visible to everyone"
                : "Admins only"}
            </span>
            <span aria-hidden>•</span>
            <span>
              {group.permissions === "admin"
                ? "Admin can add tags"
                : "Everyone can add tags"}
            </span>
            <span aria-hidden>•</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0,
                margin: 0,
                padding: 0,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: HS_FONT_FAMILY,
                fontSize: 16,
                lineHeight: "24px",
                color: "var(--hs-color-text-base)",
              }}
            >
              <span style={{ textDecoration: "underline" }}>
                {group.tags.length} tags
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                {expanded ? (
                  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M10 7l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {!isUngrouped && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexShrink: 0,
              paddingTop: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative" }}>
              <IconButton
                icon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="5" cy="10" r="1.5" fill="currentColor" />
                    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                  </svg>
                }
                aria-label="Group actions"
                variant="ghost"
                size="small"
                onClick={() => setMoreMenuOpen((v) => !v)}
              />
              {moreMenuOpen && (
                <DropdownMenu
                  items={[
                    {
                      label: "Create tag",
                      onClick: () => {
                        setMoreMenuOpen(false);
                        onCreateTag?.();
                      },
                    },
                    {
                      label: "Edit",
                      onClick: () => {
                        setMoreMenuOpen(false);
                        onEditGroup?.();
                      },
                    },
                    {
                      label: "Archive",
                      onClick: () => {
                        setMoreMenuOpen(false);
                        onArchiveGroup?.();
                      },
                    },
                    {
                      label: "Delete group",
                      destructive: true,
                      onClick: () => {
                        setMoreMenuOpen(false);
                        onBulkDelete?.(group.tags.map((t) => t.id));
                      },
                    },
                  ]}
                  onClose={() => setMoreMenuOpen(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--hs-color-border-subtle)" }}>
          {showBulkToolbar && (
            <TagBulkToolbar
              count={selectedTags.size}
              availableGroups={availableGroups}
              bulkMoveOpen={bulkMoveOpen}
              onToggleBulkMove={() => setBulkMoveOpen((v) => !v)}
              onBulkMove={handleBulkMove}
              onBulkArchive={handleBulkArchive}
              onBulkDelete={handleBulkDelete}
              onCloseBulkMove={() => setBulkMoveOpen(false)}
              onClearSelection={clearSelection}
            />
          )}
          {/* Table — Figma comp-table: Tag name + Action (140px), menu button per row */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--hs-color-fill-base)",
                  borderBottom: "1px solid var(--hs-color-border-subtle)",
                }}
              >
                <th
                  style={{
                    width: 56,
                    minHeight: 56,
                    padding: "16px",
                    textAlign: "left",
                    verticalAlign: "middle",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={
                      selectedInDisplay === displayTags.length &&
                      displayTags.length > 0
                    }
                    indeterminate={
                      selectedInDisplay > 0 &&
                      selectedInDisplay < displayTags.length
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    minHeight: 56,
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTagNameSortDesc((v) => !v);
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        lineHeight: "24px",
                        fontWeight: 600,
                        color: "var(--hs-color-text-base)",
                      }}
                    >
                      Tag name
                    </span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                      <path
                        d={tagNameSortDesc ? "M6 8l4 4 4-4" : "M6 12l4-4 4 4"}
                        stroke="var(--hs-color-text-base)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </th>
                <th
                  style={{
                    width: 140,
                    padding: "16px",
                    textAlign: "left",
                    fontSize: 16,
                    lineHeight: "24px",
                    fontWeight: 600,
                    color: "var(--hs-color-text-base)",
                    verticalAlign: "middle",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDisplayTags.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
                  selected={selectedTags.has(tag.id)}
                  onToggle={() => toggleTag(tag.id)}
                  onEdit={() => onEditTag?.(tag)}
                  onArchive={() => onArchiveTag?.(tag.id)}
                  onDelete={() => onDeleteTag?.(tag.id)}
                  onMove={(targetGroupId) => onMoveTag?.(tag.id, targetGroupId)}
                  availableGroups={availableGroups}
                />
              ))}
              {displayTags.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: "24px 16px",
                      textAlign: "center",
                      fontSize: 16,
                      color: "var(--hs-color-text-subtle)",
                    }}
                  >
                    No tags found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── TagRow (exported for Ungrouped tab — matches Figma comp-table row) ───

export function TagRow({
  tag,
  selected,
  onToggle,
  onEdit,
  onArchive,
  onDelete,
  onMove,
  availableGroups,
}: {
  tag: Tag;
  selected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onMove: (targetGroupId: string) => void;
  availableGroups: Array<{ id: string; name: string }>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const rowBg = selected ? "var(--hs-comp-badge-neutral-bg)" : "var(--hs-color-fill-base)";

  return (
    <tr
      style={{
        minHeight: 56,
        borderBottom: "1px solid var(--hs-color-border-subtle)",
        background: rowBg,
      }}
    >
      <td
        style={{
          padding: "16px",
          verticalAlign: "middle",
        }}
      >
        <Checkbox checked={selected} onChange={onToggle} />
      </td>
      <td
        style={{
          padding: "16px",
          verticalAlign: "middle",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: tag.color || "var(--hs-color-border-base)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 400,
              color: "var(--hs-color-text-base)",
            }}
          >
            {tag.name}
          </span>
        </div>
      </td>
      <td
        style={{
          width: 140,
          padding: "8px 16px",
          verticalAlign: "middle",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <IconButton
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="5" cy="10" r="1.5" fill="currentColor" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                <circle cx="15" cy="10" r="1.5" fill="currentColor" />
              </svg>
            }
            aria-label="Row actions"
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
              setMoveOpen(false);
            }}
          />
          {menuOpen && (
            <DropdownMenu
              items={[
                {
                  label: "Edit",
                  onClick: () => {
                    setMenuOpen(false);
                    onEdit();
                  },
                },
                {
                  label: "Move to group",
                  onClick: () => {
                    setMenuOpen(false);
                    setMoveOpen(true);
                  },
                },
                {
                  label: "Archive",
                  onClick: () => {
                    setMenuOpen(false);
                    onArchive();
                  },
                },
                {
                  label: "Delete",
                  destructive: true,
                  onClick: () => {
                    setMenuOpen(false);
                    onDelete();
                  },
                },
              ]}
              onClose={() => setMenuOpen(false)}
            />
          )}
          {moveOpen && (
            <MoveToGroupMenu
              availableGroups={availableGroups}
              onSelect={(gid) => {
                setMoveOpen(false);
                onMove(gid);
              }}
              onClose={() => setMoveOpen(false)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
