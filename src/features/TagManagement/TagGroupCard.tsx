import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { IconButton } from "../../components/IconButton";
import type { Tag, TagGroup } from "./types";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { useFigmaCommentUpdatesEnabled } from "./FigmaCommentUpdatesContext";
import { FigmaUpdateNote } from "./FigmaUpdateNote";
import { FIGMA_UPDATE_COPY } from "./figma-comment-update-copy";
import { TagBulkToolbar } from "./TagBulkToolbar";
import { MoveToGroupMenu } from "./MoveToGroupMenu";

// ─── DropdownMenu (local) ─────────────────────────────────────────────────

export function DropdownMenu({
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
        background: "var(--hs-color-fill-base)",
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
  /** When set, “Delete group” moves tags to Ungrouped then removes the group (preferred over bulk-deleting tags). */
  onDeleteGroup?: () => void;
  /** Parent-owned selection for the hub list (enforces one-group bulk selection). */
  selectedTagIds?: Set<string>;
  onToggleTagSelect?: (tagId: string) => void;
  onToggleAllDisplayedTags?: (tags: Tag[]) => void;
  onClearGroupSelection?: () => void;
  /** When set and different from this card’s `group.id`, row/header checkboxes are disabled. */
  selectionLockGroupId?: string | null;
  availableGroups?: Array<{ id: string; name: string }>;
  /** Controlled expansion (e.g. expand/collapse all from parent). Omit for local-only toggle. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * When set, the tag table lists these tags instead of `group.tags` (e.g. global search).
   * Header meta and counts still use the full `group` (e.g. total tag count).
   */
  tagsTableOverride?: Tag[];
  /** Shown when `tagsTableOverride` hides some tags; reveals every tag in the group without clearing search. */
  onShowAllTagsInGroup?: () => void;
  /**
   * MP hub: “Ungrouped tags” appears as a card on the Groups list — show kebab with Create tag only
   * (Figma 4035:112847); omit archive/edit/delete group for this pseudo-row.
   */
  ungroupedMpHubMenu?: boolean;
  /** First matching group card on the hub: Figma “updates” pin for header meta / total tag count. */
  figmaAnnotateGroupMeta?: boolean;
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
  onDeleteGroup,
  selectedTagIds,
  onToggleTagSelect,
  onToggleAllDisplayedTags,
  onClearGroupSelection,
  selectionLockGroupId = null,
  availableGroups = [],
  expanded: expandedProp,
  onExpandedChange,
  tagsTableOverride,
  onShowAllTagsInGroup,
  ungroupedMpHubMenu = false,
  figmaAnnotateGroupMeta = false,
}: TagGroupCardProps) {
  const figmaCommentUpdatesEnabled = useFigmaCommentUpdatesEnabled();
  const [expandedInternal, setExpandedInternal] = useState(false);
  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : expandedInternal;
  const selectionControlled = selectedTagIds !== undefined;
  const [internalSelectedTags, setInternalSelectedTags] = useState<Set<string>>(new Set());
  const selectedTags = selectionControlled ? selectedTagIds! : internalSelectedTags;
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const isUngrouped = group.id === "ungrouped";

  const displayTags = tagsTableOverride ?? group.tags;

  const showSearchShowAllRow =
    tagsTableOverride !== undefined &&
    onShowAllTagsInGroup &&
    tagsTableOverride.length < group.tags.length;

  useEffect(() => {
    if (selectionControlled) return;
    const allowed = new Set(displayTags.map((t) => t.id));
    setInternalSelectedTags((prev) => {
      let changed = false;
      const next = new Set<string>();
      for (const id of prev) {
        if (allowed.has(id)) next.add(id);
        else changed = true;
      }
      if (!changed && next.size === prev.size) return prev;
      return next;
    });
  }, [displayTags, selectionControlled]);

  const selectedInDisplay = useMemo(
    () => displayTags.filter((t) => selectedTags.has(t.id)).length,
    [displayTags, selectedTags]
  );

  const toggleTag = (id: string) => {
    if (onToggleTagSelect) {
      onToggleTagSelect(id);
      return;
    }
    const next = new Set(selectedTags);
    next.has(id) ? next.delete(id) : next.add(id);
    setInternalSelectedTags(next);
  };

  const toggleAll = () => {
    if (onToggleAllDisplayedTags) {
      onToggleAllDisplayedTags(displayTags);
      return;
    }
    if (selectedTags.size === displayTags.length) setInternalSelectedTags(new Set());
    else setInternalSelectedTags(new Set(displayTags.map((t) => t.id)));
  };

  const clearSelection = () => {
    if (onClearGroupSelection) onClearGroupSelection();
    else setInternalSelectedTags(new Set());
  };

  const toggleExpanded = () => {
    const prev = expanded;
    const next = !prev;
    if (prev && !next && selectedTags.size > 0) {
      return;
    }
    if (prev) {
      clearSelection();
      setMoreMenuOpen(false);
    }
    if (isControlled) onExpandedChange?.(next);
    else setExpandedInternal(next);
  };

  const showCheckboxes = displayTags.length >= 2;
  const checkboxColumnLocked = selectionLockGroupId != null && selectionLockGroupId !== group.id;
  const showBulkToolbar = expanded && selectedTags.size > 0 && showCheckboxes;
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
      {/* Card header — Figma .ignore-nested-dropdown-item/tree: arrow_left column + content + kebab (Modal-Exploration Tagging) */}
      <div
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={`${expanded ? "Collapse" : "Expand"} ${group.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpanded();
          }
        }}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          minHeight: 80,
          padding: "16px",
          cursor: expanded && selectedTags.size > 0 ? "not-allowed" : "pointer",
          background: "transparent",
          /* Single hairline between header meta and table — match row dividers, not border-base */
          borderBottom: expanded
            ? "1px solid var(--hs-color-border-subtle)"
            : "none",
        }}
      >
        {/* container-expand — chevron aligns with title row (pt matches Figma container-expand) */}
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            alignItems: "flex-start",
            justifyContent: "center",
            minWidth: 24,
            paddingTop: 16,
          }}
          aria-hidden
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            {expanded ? (
              <path
                d="M7 10l5 5 5-5"
                stroke="var(--hs-color-icon-base)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M10 7l5 5-5 5"
                stroke="var(--hs-color-icon-base)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>

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
            data-annotate={figmaAnnotateGroupMeta ? "figma-tag-group-meta" : undefined}
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
            <span aria-hidden style={{ color: "var(--hs-color-border-subtle)" }}>
              •
            </span>
            <span>
              {group.visibility === "everyone"
                ? "Visible to everyone"
                : "Visible to workspace admins only"}
            </span>
            <span aria-hidden style={{ color: "var(--hs-color-border-subtle)" }}>
              •
            </span>
            <span>
              {group.tags.length === 0
                ? "No tag yet"
                : `${group.tags.length} ${group.tags.length === 1 ? "tag" : "tags"}`}
            </span>
          </div>
          {figmaCommentUpdatesEnabled && figmaAnnotateGroupMeta && (
            <FigmaUpdateNote style={{ marginTop: 8 }}>
              {FIGMA_UPDATE_COPY.groupHeaderMeta}
            </FigmaUpdateNote>
          )}
          {group.visibility !== "everyone" && figmaCommentUpdatesEnabled && (
            <FigmaUpdateNote data-annotate="figma-group-visibility-disclaimer" style={{ marginTop: 8 }}>
              {FIGMA_UPDATE_COPY.groupVisibilityDisclaimer}
            </FigmaUpdateNote>
          )}
        </div>

        {(!isUngrouped || ungroupedMpHubMenu) && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexShrink: 0,
              paddingTop: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative" }} data-annotate="call-card-overflow-menu">
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
                  items={
                    ungroupedMpHubMenu
                      ? [
                          {
                            label: "Add tags",
                            onClick: () => {
                              setMoreMenuOpen(false);
                              onCreateTag?.();
                            },
                          },
                        ]
                      : group.tags.length > 0
                        ? [
                            {
                              label: "Add tags",
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
                              label: "Archive tags",
                              onClick: () => {
                                setMoreMenuOpen(false);
                                onArchiveGroup?.();
                              },
                            },
                          ]
                        : [
                            {
                              label: "Add tags",
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
                              label: "Delete",
                              destructive: true,
                              onClick: () => {
                                setMoreMenuOpen(false);
                                if (onDeleteGroup) onDeleteGroup();
                                else onBulkDelete?.(group.tags.map((t) => t.id));
                              },
                            },
                          ]
                  }
                  onClose={() => setMoreMenuOpen(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded section */}
      {expanded && (
        <div>
          {/* Table — Figma comp-table; bulk selection row replaces sort header when items selected */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--hs-color-fill-base)",
                  borderBottom: "1px solid var(--hs-color-border-subtle)",
                }}
              >
                {showCheckboxes && (
                  <th
                    data-annotate="call-tag-card-checkboxes"
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
                      disabled={checkboxColumnLocked}
                    />
                  </th>
                )}
                {showBulkToolbar ? (
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0 16px",
                      minHeight: 56,
                      verticalAlign: "middle",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <TagBulkToolbar
                      count={selectedTags.size}
                      availableGroups={availableGroups}
                      bulkMoveOpen={bulkMoveOpen}
                      onToggleBulkMove={() => setBulkMoveOpen((v) => !v)}
                      onBulkMove={handleBulkMove}
                      onBulkArchive={handleBulkArchive}
                      onCloseBulkMove={() => setBulkMoveOpen(false)}
                    />
                  </th>
                ) : (
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
                )}
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
                  Actions
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
                  showCheckbox={showCheckboxes}
                  checkboxDisabled={checkboxColumnLocked}
                />
              ))}
              {displayTags.length === 0 && (
                <tr>
                  <td
                    colSpan={showCheckboxes ? 3 : 2}
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
          {showSearchShowAllRow && (
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--hs-color-border-subtle)",
                background: "var(--hs-color-fill-base)",
              }}
            >
              <Button variant="secondary" type="button" onClick={onShowAllTagsInGroup}>
                Show all {group.tags.length} tags in {group.name}
              </Button>
            </div>
          )}
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
  showCheckbox = true,
  checkboxDisabled = false,
}: {
  tag: Tag;
  selected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onMove: (targetGroupId: string) => void;
  availableGroups: Array<{ id: string; name: string }>;
  showCheckbox?: boolean;
  checkboxDisabled?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rowBg = selected ? "var(--hs-comp-badge-neutral-bg)" : "var(--hs-color-fill-base)";

  return (
    <tr
      style={{
        minHeight: 56,
        borderBottom: "1px solid var(--hs-color-border-subtle)",
        background: rowBg,
      }}
    >
      {showCheckbox && (
        <td
          style={{
            padding: "16px",
            verticalAlign: "middle",
          }}
        >
          <Checkbox checked={selected} onChange={onToggle} disabled={checkboxDisabled} />
        </td>
      )}
      <td
        style={{
          padding: "16px",
          verticalAlign: "middle",
        }}
      >
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
                  label: "Archive",
                  onClick: () => {
                    setMenuOpen(false);
                    onArchive();
                  },
                },
              ]}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
