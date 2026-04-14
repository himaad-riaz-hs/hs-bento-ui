import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "../../components/Button";
import { InputSearch } from "../../components/InputSearch";
import { IconButton } from "../../components/IconButton";
import { Checkbox } from "../../components/Checkbox";
import { TagGroupCard, TagRow } from "./TagGroupCard";
import { TagBulkToolbar } from "./TagBulkToolbar";
import { CreateGroupModal } from "./CreateGroupModal";
import { CreateTagModal } from "./CreateTagModal";
import { sampleGroups, sampleArchivedTags, sampleArchivedGroups } from "./sample-data";
import type { Tag, TagGroup, TabValue } from "./types";
import { ProductNav } from "../shared/NavIcons";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

export interface TagManagementProps {
  /** When true, fills the parent height instead of 100vh (e.g. under a top bar). */
  embedded?: boolean;
}

const SETTINGS_TOP = [
  "Account",
  "Social account and team",
  "Tags",
];

const SETTINGS_BOTTOM = [
  "OwlyGPT",
  "Video AI",
  "Analytics",
  "Amplify",
  "Listening",
];

// ─── SVG Icons ───────────────────────────────────────────────────────────

function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill="var(--hs-color-fill-positive)" />
      <path d="M6 10l3 3 5-5" stroke="var(--hs-color-text-inverse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 4.5v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 12.5a6 6 0 101.5-6.5L3.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 7h12M6 7l1-3h6l1 3M5 7v9a2 2 0 002 2h6a2 2 0 002-2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        borderRadius: 8,
        background: "var(--hs-color-text-base)",
        color: "var(--hs-color-fill-app)",
        fontFamily: HS_FONT_FAMILY,
        fontSize: 14,
        fontWeight: 600,
        boxShadow: "0 8px 24px var(--hs-color-overlay-scrim)",
        animation: "fadeInUp var(--hs-motion-duration-slow) var(--hs-motion-easing-standard)",
      }}
    >
      <CheckCircleIcon />
      {message}
    </div>
  );
}

// ─── Confirmation Dialog ─────────────────────────────────────────────────

interface ConfirmDialogProps {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  destructive?: boolean;
}

function ConfirmDialog({
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel = "Confirm",
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 60, background: "var(--hs-color-overlay-scrim)" }}
        onClick={onCancel}
      />
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 70,
          width: 440,
          borderRadius: 12,
          background: "var(--hs-color-fill-app)",
          boxShadow: "var(--hs-shadow-modal)",
          border: "1px solid var(--hs-color-border-subtle)",
          fontFamily: HS_FONT_FAMILY,
          padding: "28px 30px",
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "var(--hs-color-text-base)",
            margin: "0 0 8px",
            lineHeight: 1.3,
            wordBreak: "break-word",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: "22px", color: "var(--hs-color-text-subtle)", margin: "0 0 24px" }}>
          {description}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: destructive ? "var(--hs-color-text-critical)" : "var(--hs-comp-button-filled-bg)",
              color: "var(--hs-color-fill-app)",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: HS_FONT_FAMILY,
              cursor: "pointer",
              lineHeight: "24px",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Nav Components ──────────────────────────────────────────────────────

function SettingsNavItem({ label, active }: { label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        textAlign: "left",
        padding: "16px",
        border: "none",
        borderRadius: 8,
        background: active
          ? "var(--hs-comp-badge-neutral-bg)"
          : hovered
            ? "var(--hs-comp-badge-neutral-bg)"
            : "transparent",
        cursor: "pointer",
        fontFamily: HS_FONT_FAMILY,
        fontSize: 16,
        lineHeight: "24px",
        fontWeight: active ? 600 : 400,
        color: "var(--hs-color-text-base)",
        transition: "background var(--hs-motion-duration-emphasis) var(--hs-motion-easing-standard)",
      }}
    >
      {label}
    </button>
  );
}

// ─── Tab Component ───────────────────────────────────────────────────────

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type="button"
      style={{
        minHeight: 48,
        padding: "10px 4px",
        border: "none",
        borderBottom: active ? "2px solid var(--hs-color-text-base)" : "2px solid transparent",
        background: "transparent",
        cursor: "pointer",
        fontFamily: HS_FONT_FAMILY,
        fontSize: 16,
        lineHeight: "24px",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--hs-comp-tab-selected-text, var(--hs-color-text-base))" : "var(--hs-color-text-subtle)",
        transition: "color var(--hs-motion-duration-fast) var(--hs-motion-easing-standard)",
        ...(hovered && !active ? { color: "var(--hs-color-text-base)" } : {}),
      }}
    >
      {label}{count !== undefined ? ` ${count}` : ""}
    </button>
  );
}

// ─── Archived Item Rows ─────────────────────────────────────────────────

function ArchivedTagRow({ tag, onRestore, onDelete }: { tag: Tag; onRestore: () => void; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 54,
        borderBottom: "1px solid var(--hs-color-border-subtle)",
        background: hovered ? "var(--hs-comp-badge-neutral-bg)" : "transparent",
        transition: "background var(--hs-motion-duration-fast) var(--hs-motion-easing-standard)",
      }}
    >
      <td style={{ padding: "0 16px", verticalAlign: "middle", minWidth: 0, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: tag.color || "var(--hs-color-border-base)", flexShrink: 0 }} />
          <span
            style={{
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "var(--hs-color-text-base)",
              fontFamily: HS_FONT_FAMILY,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tag.name}
          </span>
        </div>
      </td>
      <td style={{ width: 200, padding: "0 12px 0 16px", textAlign: "right", verticalAlign: "middle", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, flexWrap: "nowrap" }}>
          <Button variant="ghost" onClick={onRestore} leadingIcon={<RestoreIcon />}>
            Restore
          </Button>
          <IconButton
            variant="ghost"
            size="small"
            onClick={onDelete}
            aria-label="Delete permanently"
            icon={<DeleteIcon />}
            className="!text-[color:var(--hs-color-text-critical)] hover:!bg-[var(--hs-color-fill-subtle)]"
          />
        </div>
      </td>
    </tr>
  );
}

function ArchivedGroupRow({ group, onRestore, onDelete }: { group: TagGroup; onRestore: () => void; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 54,
        borderBottom: "1px solid var(--hs-color-border-subtle)",
        background: hovered ? "var(--hs-comp-badge-neutral-bg)" : "transparent",
        transition: "background var(--hs-motion-duration-fast) var(--hs-motion-easing-standard)",
      }}
    >
      <td style={{ padding: "0 16px", verticalAlign: "middle", minWidth: 0, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <rect x="3" y="3" width="14" height="14" rx="3" stroke="var(--hs-color-icon-base)" strokeWidth="1.5" />
            <path d="M7 10h6" stroke="var(--hs-color-icon-base)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "var(--hs-color-text-base)",
              fontFamily: HS_FONT_FAMILY,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {group.name}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
              color: "var(--hs-color-text-subtle)",
              fontFamily: HS_FONT_FAMILY,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid var(--hs-color-border-subtle)",
              background: "var(--hs-color-fill-subtle)",
            }}
          >
            Group
          </span>
        </div>
      </td>
      <td style={{ width: 200, padding: "0 12px 0 16px", textAlign: "right", verticalAlign: "middle", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, flexWrap: "nowrap" }}>
          <Button variant="ghost" onClick={onRestore} leadingIcon={<RestoreIcon />}>
            Restore
          </Button>
          <IconButton
            variant="ghost"
            size="small"
            onClick={onDelete}
            aria-label="Delete permanently"
            icon={<DeleteIcon />}
            className="!text-[color:var(--hs-color-text-critical)] hover:!bg-[var(--hs-color-fill-subtle)]"
          />
        </div>
      </td>
    </tr>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

export function TagManagement({ embedded = false }: TagManagementProps = {}) {
  const [groups, setGroups] = useState<TagGroup[]>(sampleGroups);
  const [archivedTags, setArchivedTags] = useState<Tag[]>(sampleArchivedTags);
  const [archivedGroups, setArchivedGroups] = useState<TagGroup[]>(sampleArchivedGroups);
  const [activeTab, setActiveTab] = useState<TabValue>("groups");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TagGroup | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [preselectedGroupId, setPreselectedGroupId] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    destructive: boolean;
    onConfirm: () => void;
  } | null>(null);
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  /** Which group cards are expanded on the Groups tab (controlled for expand/collapse all). */
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set());

  const showToast = useCallback((msg: string) => setToastMessage(msg), []);

  // ─ Derived data ────────────────────────────────────────────────────────

  const realGroups = useMemo(() => groups.filter((g) => g.id !== "ungrouped"), [groups]);
  const ungroupedGroup = useMemo(() => groups.find((g) => g.id === "ungrouped"), [groups]);
  const ungroupedTags = useMemo(() => ungroupedGroup?.tags ?? [], [ungroupedGroup]);

  const availableGroupsList = useMemo(
    () => realGroups.filter((g) => !g.archived).map((g) => ({ id: g.id, name: g.name })),
    [realGroups]
  );

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return realGroups;
    const q = search.toLowerCase();
    return realGroups
      .map((g) => ({ ...g, tags: g.tags.filter((t) => t.name.toLowerCase().includes(q)) }))
      .filter((g) => g.name.toLowerCase().includes(q) || g.tags.length > 0);
  }, [realGroups, search]);

  const filteredUngrouped = useMemo(() => {
    let tags = ungroupedTags;
    if (search.trim()) {
      const q = search.toLowerCase();
      tags = tags.filter((t) => t.name.toLowerCase().includes(q));
    }
    return [...tags].sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }, [ungroupedTags, search, sortAsc]);

  const filteredArchivedTags = useMemo(() => {
    if (!search.trim()) return archivedTags;
    const q = search.toLowerCase();
    return archivedTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [archivedTags, search]);

  const filteredArchivedGroups = useMemo(() => {
    if (!search.trim()) return archivedGroups;
    const q = search.toLowerCase();
    return archivedGroups.filter((g) => g.name.toLowerCase().includes(q));
  }, [archivedGroups, search]);

  const groupCount = realGroups.length;
  const ungroupedCount = ungroupedTags.length;

  useEffect(() => { setSelectedTags(new Set()); }, [activeTab]);

  useEffect(() => {
    const visible = new Set(filteredGroups.map((g) => g.id));
    setExpandedGroupIds((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        if (visible.has(id)) next.add(id);
      }
      if (next.size === prev.size && [...prev].every((id) => next.has(id))) return prev;
      return next;
    });
  }, [filteredGroups]);

  const expandAllGroups = useCallback(() => {
    setExpandedGroupIds(new Set(filteredGroups.map((g) => g.id)));
  }, [filteredGroups]);

  const collapseAllGroups = useCallback(() => {
    setExpandedGroupIds(new Set());
  }, []);

  // ─ CRUD Actions ────────────────────────────────────────────────────────

  const handleCreateGroup = (data: { name: string; visibility: string; permissions: string; required: boolean }) => {
    const newGroup: TagGroup = {
      id: `g${Date.now()}`,
      name: data.name,
      required: data.required,
      visibility: data.visibility as "everyone" | "admins",
      permissions: data.permissions as "admin" | "everyone",
      tags: [],
    };
    setGroups((prev) => [...prev, newGroup]);
    showToast("Group created successfully");
  };

  const handleCreateTag = (data: { name: string; groupId: string; color: string }) => {
    const newTag: Tag = {
      id: `t${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name,
      groupId: data.groupId === "ungrouped" ? null : data.groupId,
      color: data.color,
    };
    setGroups((prev) =>
      prev.map((g) => g.id === data.groupId ? { ...g, tags: [...g.tags, newTag] } : g)
    );
    showToast("Tag created successfully");
  };

  const handleEditGroup = (data: { name: string; visibility: string; permissions: string; required: boolean }) => {
    if (!editingGroup) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === editingGroup.id
          ? { ...g, name: data.name, visibility: data.visibility as "everyone" | "admins", permissions: data.permissions as "admin" | "everyone", required: data.required }
          : g
      )
    );
    setEditingGroup(null);
    showToast("Group updated successfully");
  };

  const handleEditTag = (data: { name: string; groupId: string; color: string }) => {
    if (!editingTag) return;
    const newGroupId = data.groupId === "ungrouped" ? null : data.groupId;
    setGroups((prev) => {
      let tag: Tag | null = null;
      const stripped = prev.map((g) => ({
        ...g,
        tags: g.tags.filter((t) => {
          if (t.id === editingTag.id) { tag = { ...t, name: data.name, color: data.color, groupId: newGroupId }; return false; }
          return true;
        }),
      }));
      if (!tag) return prev;
      const targetGroupId = data.groupId;
      return stripped.map((g) => g.id === targetGroupId ? { ...g, tags: [...g.tags, tag!] } : g);
    });
    setEditingTag(null);
    showToast("Tag updated successfully");
  };

  // ─ Archive / Delete / Move ─────────────────────────────────────────────

  const archiveTags = useCallback((tagIds: string[]) => {
    const tagSet = new Set(tagIds);
    const archived: Tag[] = [];
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        tags: g.tags.filter((t) => {
          if (tagSet.has(t.id)) { archived.push({ ...t, archived: true }); return false; }
          return true;
        }),
      }))
    );
    setArchivedTags((prev) => [...prev, ...archived]);
    setSelectedTags(new Set());
    showToast(`${tagIds.length} tag${tagIds.length > 1 ? "s" : ""} archived`);
  }, [showToast]);

  const deleteTags = useCallback((tagIds: string[]) => {
    const tagSet = new Set(tagIds);
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        tags: g.tags.filter((t) => !tagSet.has(t.id)),
      }))
    );
    setSelectedTags(new Set());
    showToast(`${tagIds.length} tag${tagIds.length > 1 ? "s" : ""} deleted`);
  }, [showToast]);

  const moveTagsToGroup = useCallback((tagIds: string[], targetGroupId: string) => {
    const tagSet = new Set(tagIds);
    const moved: Tag[] = [];
    const targetGroup = groups.find((g) => g.id === targetGroupId);
    const targetName = targetGroup?.name ?? "group";
    setGroups((prev) => {
      const stripped = prev.map((g) => ({
        ...g,
        tags: g.tags.filter((t) => {
          if (tagSet.has(t.id)) { moved.push({ ...t, groupId: targetGroupId === "ungrouped" ? null : targetGroupId }); return false; }
          return true;
        }),
      }));
      return stripped.map((g) => g.id === targetGroupId ? { ...g, tags: [...g.tags, ...moved] } : g);
    });
    setSelectedTags(new Set());
    showToast(`${tagIds.length} tag${tagIds.length > 1 ? "s" : ""} moved to ${targetName}`);
  }, [groups, showToast]);

  const archiveGroup = useCallback((groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setArchivedGroups((prev) => [...prev, { ...group, archived: true }]);
    const tagIds = group.tags.map((t) => t.id);
    if (tagIds.length > 0) {
      setArchivedTags((prev) => [...prev, ...group.tags.map((t) => ({ ...t, archived: true }))]);
    }
    showToast("Group archived");
  }, [groups, showToast]);

  const restoreTag = useCallback((tagId: string) => {
    const tag = archivedTags.find((t) => t.id === tagId);
    if (!tag) return;
    setArchivedTags((prev) => prev.filter((t) => t.id !== tagId));
    const restored: Tag = { ...tag, archived: false };
    setGroups((prev) =>
      prev.map((g) => g.id === "ungrouped" ? { ...g, tags: [...g.tags, restored] } : g)
    );
    showToast("Tag restored");
  }, [archivedTags, showToast]);

  const restoreGroup = useCallback((groupId: string) => {
    const group = archivedGroups.find((g) => g.id === groupId);
    if (!group) return;
    setArchivedGroups((prev) => prev.filter((g) => g.id !== groupId));
    setGroups((prev) => [...prev, { ...group, archived: false }]);
    showToast("Group restored");
  }, [archivedGroups, showToast]);

  const deleteArchivedTag = useCallback((tagId: string) => {
    setArchivedTags((prev) => prev.filter((t) => t.id !== tagId));
    showToast("Tag deleted permanently");
  }, [showToast]);

  const deleteArchivedGroup = useCallback((groupId: string) => {
    setArchivedGroups((prev) => prev.filter((g) => g.id !== groupId));
    showToast("Group deleted permanently");
  }, [showToast]);

  // ─ Confirmation wrappers ───────────────────────────────────────────────

  const confirmArchiveSingle = useCallback((tagId: string) => {
    setConfirmDialog({
      title: "Archive 1 tag?",
      description: "This tag will be archived and won't be visible in Composer, Plan, or Analytics.",
      confirmLabel: "Confirm",
      destructive: false,
      onConfirm: () => { archiveTags([tagId]); setConfirmDialog(null); },
    });
  }, [archiveTags]);

  const confirmDeleteSingle = useCallback((tagId: string) => {
    setConfirmDialog({
      title: "Delete 1 tag?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => { deleteTags([tagId]); setConfirmDialog(null); },
    });
  }, [deleteTags]);

  const confirmBulkArchive = useCallback((tagIds: string[]) => {
    setConfirmDialog({
      title: `Archive ${tagIds.length} tag${tagIds.length > 1 ? "s" : ""}?`,
      description: "These tags will be archived and won't be visible in Composer, Plan, or Analytics.",
      confirmLabel: "Confirm",
      destructive: false,
      onConfirm: () => { archiveTags(tagIds); setConfirmDialog(null); },
    });
  }, [archiveTags]);

  const confirmBulkDelete = useCallback((tagIds: string[]) => {
    setConfirmDialog({
      title: `Delete ${tagIds.length} tag${tagIds.length > 1 ? "s" : ""}?`,
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => { deleteTags(tagIds); setConfirmDialog(null); },
    });
  }, [deleteTags]);

  const confirmArchiveGroup = useCallback((groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    setConfirmDialog({
      title: `Archive group "${group?.name}"?`,
      description: `This group and its ${group?.tags.length ?? 0} tags will be archived.`,
      confirmLabel: "Confirm",
      destructive: false,
      onConfirm: () => { archiveGroup(groupId); setConfirmDialog(null); },
    });
  }, [groups, archiveGroup]);

  const confirmDeleteArchivedTag = useCallback((tagId: string) => {
    setConfirmDialog({
      title: "Delete this tag?",
      description: "This permanently removes the tag. This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => { deleteArchivedTag(tagId); setConfirmDialog(null); },
    });
  }, [deleteArchivedTag]);

  const confirmDeleteArchivedGroup = useCallback((groupId: string) => {
    setConfirmDialog({
      title: "Delete this group?",
      description: "This permanently removes the group and related data. This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => { deleteArchivedGroup(groupId); setConfirmDialog(null); },
    });
  }, [deleteArchivedGroup]);

  // ─ Selection ───────────────────────────────────────────────────────────

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = (tags: Tag[]) => {
    if (selectedTags.size === tags.length && tags.length > 0) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(tags.map((t) => t.id)));
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        height: embedded ? "100%" : "100vh",
        minHeight: embedded ? 0 : undefined,
        fontFamily: HS_FONT_FAMILY,
        background: "var(--hs-comp-badge-neutral-bg)",
      }}
    >
      {/* ── Left product nav (80px) ─────────────────────────────────── */}
      <ProductNav activeItem="" onItemClick={() => {}} />

      {/* ── Settings drawer (304px — Figma comp-nav-drawer) ───────────── */}
      <nav
        style={{
          width: 304,
          minWidth: 304,
          background: "var(--hs-color-fill-app)",
          borderRight: "1px solid var(--hs-color-border-subtle)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px" }}>
          <span style={{ fontFamily: HS_FONT_FAMILY, fontWeight: 600, fontSize: 26, lineHeight: "32px", color: "var(--hs-color-text-base)" }}>Settings</span>
          <IconButton icon={<CloseIcon size={18} />} aria-label="Close settings" variant="ghost" size="small" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0 16px" }}>
          {SETTINGS_TOP.map((item) => (
            <SettingsNavItem key={item} label={item} active={item === "Tags"} />
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ borderTop: "1px solid var(--hs-color-border-subtle)", paddingTop: 8, marginTop: 8 }}>
            {SETTINGS_BOTTOM.map((item) => (
              <SettingsNavItem key={item} label={item} active={false} />
            ))}
          </div>
        </div>
      </nav>

      {/* ── Tags panel (flex-1) ─────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          background: "var(--hs-comp-badge-neutral-bg)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Figma comp-header: 64px, fill-base, divider subtle bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 64,
            padding: "0 24px",
            background: "var(--hs-color-fill-base)",
            boxShadow: "inset 0 -1px 0 0 var(--hs-color-border-subtle)",
          }}
        >
          <h1
            style={{
              fontFamily: HS_FONT_FAMILY,
              fontWeight: 600,
              fontSize: 26,
              lineHeight: "32px",
              color: "var(--hs-color-text-base)",
              margin: 0,
            }}
          >
            Tags
          </h1>
          <IconButton icon={<CloseIcon />} aria-label="Close" variant="ghost" />
        </div>

        <div style={{ flex: 1, width: "100%", background: "var(--hs-color-fill-base)" }}>
          <div
            style={{
              maxWidth: 1008,
              width: "100%",
              margin: "0 auto",
              padding: 24,
              boxSizing: "border-box",
            }}
          >
          {/* Description + Action buttons (Figma comp-label + comp-button-action) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
            <p
              style={{
                fontFamily: HS_FONT_FAMILY,
                fontWeight: 600,
                fontSize: 18,
                lineHeight: "24px",
                color: "var(--hs-color-text-base)",
                margin: 0,
              }}
            >
              Manage tag groups
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Button variant="ghost" onClick={() => setShowCreateTag(true)}>+ Create tag</Button>
              <Button variant="outlined" onClick={() => setShowCreateGroup(true)}>+ Create group</Button>
            </div>
          </div>

          {/* Tabs — comp-tabs: gap 16, indicator on selected */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid var(--hs-color-border-subtle)", marginBottom: 24 }}
          >
            <TabButton label="Groups" count={groupCount} active={activeTab === "groups"} onClick={() => setActiveTab("groups")} />
            <TabButton label="Ungrouped tags" count={ungroupedCount} active={activeTab === "ungrouped"} onClick={() => setActiveTab("ungrouped")} />
            <TabButton label="Archived" active={activeTab === "archived"} onClick={() => setActiveTab("archived")} />
          </div>

          {/* Search bar + group list controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 200px", minWidth: 0 }}>
              <InputSearch
                placeholder="Search tags"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />
            </div>
            {activeTab === "groups" && filteredGroups.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <Button type="button" variant="ghost" onClick={expandAllGroups}>
                  Expand all
                </Button>
                <Button type="button" variant="ghost" onClick={collapseAllGroups}>
                  Collapse all
                </Button>
              </div>
            )}
          </div>

          {/* ── Tab Content ──────────────────────────────────────────── */}

          {/* Groups Tab */}
          {activeTab === "groups" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredGroups.map((group) => (
                <TagGroupCard
                  key={group.id}
                  group={group}
                  expanded={expandedGroupIds.has(group.id)}
                  onExpandedChange={(open) => {
                    setExpandedGroupIds((prev) => {
                      const next = new Set(prev);
                      if (open) next.add(group.id);
                      else next.delete(group.id);
                      return next;
                    });
                  }}
                  onEditGroup={() => setEditingGroup(group)}
                  onEditTag={(tag) => setEditingTag(tag)}
                  onCreateTag={() => {
                    setPreselectedGroupId(group.id);
                    setShowCreateTag(true);
                  }}
                  onArchiveGroup={() => confirmArchiveGroup(group.id)}
                  onArchiveTag={(tagId) => confirmArchiveSingle(tagId)}
                  onDeleteTag={(tagId) => confirmDeleteSingle(tagId)}
                  onMoveTag={(tagId, targetGroupId) => moveTagsToGroup([tagId], targetGroupId)}
                  onBulkArchive={(tagIds) => confirmBulkArchive(tagIds)}
                  onBulkMove={(tagIds, targetGroupId) => moveTagsToGroup(tagIds, targetGroupId)}
                  onBulkDelete={(tagIds) => confirmBulkDelete(tagIds)}
                  availableGroups={availableGroupsList}
                />
              ))}
              {filteredGroups.length === 0 && (
                <div style={{ borderRadius: 8, border: "1px solid var(--hs-color-border-subtle)", background: "var(--hs-color-fill-app)", padding: "48px 24px", textAlign: "center" }}>
                  <p style={{ fontFamily: HS_FONT_FAMILY, fontWeight: 500, fontSize: 14, color: "var(--hs-color-text-subtle)", margin: 0 }}>
                    {search ? "No groups match your search." : "No groups yet. Create one to get started."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ungrouped Tags Tab */}
          {activeTab === "ungrouped" && (
            <div style={{ borderRadius: 8, border: "1px solid var(--hs-color-border-subtle)", overflow: "visible" }}>
              {selectedTags.size > 0 && (
                <TagBulkToolbar
                  count={selectedTags.size}
                  availableGroups={availableGroupsList}
                  bulkMoveOpen={bulkMoveOpen}
                  onToggleBulkMove={() => setBulkMoveOpen((v) => !v)}
                  onBulkMove={(gid) => {
                    setBulkMoveOpen(false);
                    moveTagsToGroup(Array.from(selectedTags), gid);
                  }}
                  onBulkArchive={() => confirmBulkArchive(Array.from(selectedTags))}
                  onBulkDelete={() => confirmBulkDelete(Array.from(selectedTags))}
                  onCloseBulkMove={() => setBulkMoveOpen(false)}
                  onClearSelection={() => setSelectedTags(new Set())}
                />
              )}
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: HS_FONT_FAMILY }}>
                <thead>
                  <tr style={{ background: "var(--hs-color-fill-base)", borderBottom: "1px solid var(--hs-color-border-subtle)" }}>
                    <th style={{ width: 56, padding: "16px", textAlign: "left", verticalAlign: "middle" }}>
                      <Checkbox
                        checked={selectedTags.size === filteredUngrouped.length && filteredUngrouped.length > 0}
                        indeterminate={selectedTags.size > 0 && selectedTags.size < filteredUngrouped.length}
                        onChange={() => toggleAll(filteredUngrouped)}
                      />
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "16px",
                        cursor: "pointer",
                        userSelect: "none",
                        verticalAlign: "middle",
                      }}
                      onClick={() => setSortAsc(!sortAsc)}
                    >
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, color: "var(--hs-color-text-base)" }}>
                          Tag name
                        </span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                          <path
                            d={sortAsc ? "M6 8l4 4 4-4" : "M6 12l4-4 4 4"}
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
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUngrouped.map((tag) => (
                    <TagRow
                      key={tag.id}
                      tag={tag}
                      selected={selectedTags.has(tag.id)}
                      onToggle={() => toggleTag(tag.id)}
                      onEdit={() => setEditingTag(tag)}
                      onArchive={() => confirmArchiveSingle(tag.id)}
                      onDelete={() => confirmDeleteSingle(tag.id)}
                      onMove={(gid) => moveTagsToGroup([tag.id], gid)}
                      availableGroups={availableGroupsList}
                    />
                  ))}
                  {filteredUngrouped.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: "32px 16px", textAlign: "center", fontSize: 14, color: "var(--hs-color-text-subtle)" }}>
                        {search ? "No tags match your search." : "No ungrouped tags."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Archived Tab */}
          {activeTab === "archived" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {filteredArchivedGroups.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: HS_FONT_FAMILY, fontSize: 12, fontWeight: 700, color: "var(--hs-color-text-base)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Archived groups
                  </h3>
                  <div style={{ borderRadius: 8, border: "1px solid var(--hs-color-border-subtle)", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: HS_FONT_FAMILY, tableLayout: "fixed" }}>
                      <colgroup>
                        <col />
                        <col style={{ width: 200 }} />
                      </colgroup>
                      <tbody>
                        {filteredArchivedGroups.map((g) => (
                          <ArchivedGroupRow
                            key={g.id}
                            group={g}
                            onRestore={() => restoreGroup(g.id)}
                            onDelete={() => confirmDeleteArchivedGroup(g.id)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {filteredArchivedTags.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: HS_FONT_FAMILY, fontSize: 12, fontWeight: 700, color: "var(--hs-color-text-base)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Archived tags
                  </h3>
                  <div style={{ borderRadius: 8, border: "1px solid var(--hs-color-border-subtle)", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: HS_FONT_FAMILY, tableLayout: "fixed" }}>
                      <colgroup>
                        <col />
                        <col style={{ width: 200 }} />
                      </colgroup>
                      <tbody>
                        {filteredArchivedTags.map((t) => (
                          <ArchivedTagRow
                            key={t.id}
                            tag={t}
                            onRestore={() => restoreTag(t.id)}
                            onDelete={() => confirmDeleteArchivedTag(t.id)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {filteredArchivedGroups.length === 0 && filteredArchivedTags.length === 0 && (
                <div style={{ borderRadius: 8, border: "1px solid var(--hs-color-border-subtle)", background: "var(--hs-color-fill-app)", padding: "48px 24px", textAlign: "center" }}>
                  <p style={{ fontFamily: HS_FONT_FAMILY, fontWeight: 500, fontSize: 14, color: "var(--hs-color-text-subtle)", margin: 0 }}>
                    {search ? "No archived items match your search." : "No archived tags or groups."}
                  </p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </main>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onSave={handleCreateGroup}
      />
      <CreateGroupModal
        open={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        onSave={handleEditGroup}
        editMode
        initialData={
          editingGroup
            ? { name: editingGroup.name, visibility: editingGroup.visibility, permissions: editingGroup.permissions, required: editingGroup.required }
            : undefined
        }
      />
      <CreateTagModal
        open={showCreateTag}
        onClose={() => { setShowCreateTag(false); setPreselectedGroupId(undefined); }}
        onSave={handleCreateTag}
        groups={groups}
        preselectedGroupId={preselectedGroupId}
      />
      <CreateTagModal
        open={!!editingTag}
        onClose={() => setEditingTag(null)}
        onSave={handleEditTag}
        groups={groups}
        editMode
        initialData={
          editingTag
            ? { name: editingTag.name, groupId: editingTag.groupId || "ungrouped", color: editingTag.color }
            : undefined
        }
      />

      {/* ── Confirmation dialog ─────────────────────────────────────── */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmLabel={confirmDialog.confirmLabel}
          destructive={confirmDialog.destructive}
          onCancel={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────── */}
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
