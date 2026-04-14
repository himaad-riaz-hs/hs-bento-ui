import { useRef, useEffect, useState } from "react";
import { IconButton } from "../../components/IconButton";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

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
        boxShadow: "var(--hs-comp-menu-shadow)",
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
      type="button"
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
        left: 0,
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

const iconBtn = "var(--hs-color-text-base)";

export function TagBulkToolbar({
  count,
  availableGroups,
  bulkMoveOpen,
  onToggleBulkMove,
  onBulkMove,
  onBulkArchive,
  onBulkDelete,
  onCloseBulkMove,
  onClearSelection,
  onBulkView,
}: {
  count: number;
  availableGroups: Array<{ id: string; name: string }>;
  bulkMoveOpen: boolean;
  onToggleBulkMove: () => void;
  onBulkMove: (targetGroupId: string) => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onCloseBulkMove: () => void;
  onClearSelection: () => void;
  /** Optional — default no-op */
  onBulkView?: () => void;
}) {
  const [kebabOpen, setKebabOpen] = useState(false);

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexWrap: "wrap",
        padding: "10px 16px",
        background: "var(--hs-color-fill-subtle)",
        borderBottom: "1px solid var(--hs-color-border-subtle)",
        fontFamily: HS_FONT_FAMILY,
      }}
    >
      <span
        style={{
          fontSize: 14,
          lineHeight: "22px",
          fontWeight: 700,
          color: "var(--hs-color-text-base)",
          marginRight: 8,
        }}
      >
        {count} {count === 1 ? "item" : "items"} selected
      </span>

      <IconButton
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 10s2.5-4.5 7.5-4.5 7.5 4.5 7.5 4.5-2.5 4.5-7.5 4.5S2.5 10 2.5 10z"
              stroke={iconBtn}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="10" r="2.5" stroke={iconBtn} strokeWidth="1.5" />
          </svg>
        }
        aria-label="View selected"
        variant="ghost"
        size="small"
        onClick={() => onBulkView?.()}
      />

      <div style={{ position: "relative" }}>
        <IconButton
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 7h12M6 7l1-3h6l1 3M7 7v8M10 7v8M13 7v8M5 7v9a2 2 0 002 2h6a2 2 0 002-2V7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          aria-label="Move to group"
          variant="ghost"
          size="small"
          onClick={onToggleBulkMove}
        />
        {bulkMoveOpen && (
          <MoveToGroupMenu
            availableGroups={availableGroups}
            onSelect={onBulkMove}
            onClose={onCloseBulkMove}
          />
        )}
      </div>

      <IconButton
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 12l6-6 6 6M10 6v10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        }
        aria-label="Download"
        variant="ghost"
        size="small"
        onClick={() => {
          /* export placeholder */
        }}
      />

      <span
        style={{
          width: 1,
          height: 20,
          background: "var(--hs-color-border-subtle)",
          margin: "0 4px",
          flexShrink: 0,
        }}
        aria-hidden
      />

      <IconButton
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 7h12M6 7l1-3h6l1 3M5 7v9a2 2 0 002 2h6a2 2 0 002-2V7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        aria-label="Delete"
        variant="ghost"
        size="small"
        onClick={onBulkDelete}
      />

      <div style={{ position: "relative", marginLeft: "auto" }}>
        <IconButton
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="5" cy="10" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="15" cy="10" r="1.5" fill="currentColor" />
            </svg>
          }
          aria-label="More bulk actions"
          variant="ghost"
          size="small"
          onClick={() => setKebabOpen((v) => !v)}
        />
        {kebabOpen && (
          <DropdownMenu
            items={[
              {
                label: "Archive",
                onClick: () => {
                  setKebabOpen(false);
                  onBulkArchive();
                },
              },
              {
                label: "Clear selection",
                onClick: () => {
                  setKebabOpen(false);
                  onClearSelection();
                },
              },
            ]}
            onClose={() => setKebabOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
