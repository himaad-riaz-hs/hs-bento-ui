import { useState, type ReactNode } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { MaterialArchiveIcon } from "./MaterialArchiveIcon";
import { MoveToGroupMenu } from "./MoveToGroupMenu";

/** Figma Modal-Exploration Tagging — bulk row: icon + hs-sys/text/button-small label */
function BulkToolbarTextButton({
  children,
  icon,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        margin: 0,
        padding: "8px 10px",
        border: "none",
        borderRadius: "var(--hs-comp-icon-button-border-radii, 50px)",
        background: hovered ? "var(--hs-comp-badge-neutral-bg)" : "transparent",
        cursor: "pointer",
        fontFamily: HS_FONT_FAMILY,
        fontSize: "var(--hs-font-size-button-small, 14px)",
        lineHeight: "var(--hs-line-height-button-small, 24px)",
        fontWeight: "var(--hs-font-weight-button-small, 700)",
        color: "var(--hs-color-text-base)",
        transition: "background var(--hs-motion-duration-fast) var(--hs-motion-easing-standard)",
      }}
    >
      <span style={{ display: "inline-flex", flexShrink: 0, color: "var(--hs-color-icon-base)" }}>{icon}</span>
      <span>{children}</span>
    </button>
  );
}

/** Folder — “move into a group” (replaces old glyph that read like a clothes rack). */
function MoveToGroupIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7a2 2 0 012-2h4l2 2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Bulk selection actions — matches Figma nested-table bulk row (checkbox column + this strip + Action column).
 * @see https://www.figma.com/design/c3BEZwzN2E8wEdBOhnrp4U/Modal-Exploration---Tagging?node-id=43-4916
 */
export function TagBulkToolbar({
  count,
  availableGroups,
  bulkMoveOpen,
  onToggleBulkMove,
  onBulkMove,
  onBulkArchive,
  onCloseBulkMove,
}: {
  count: number;
  availableGroups: Array<{ id: string; name: string }>;
  bulkMoveOpen: boolean;
  onToggleBulkMove: () => void;
  onBulkMove: (targetGroupId: string) => void;
  onBulkArchive: () => void;
  onCloseBulkMove: () => void;
}) {
  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        minHeight: 56,
        fontFamily: HS_FONT_FAMILY,
      }}
    >
      <span
        style={{
          fontSize: 16,
          lineHeight: "24px",
          fontWeight: 400,
          color: "var(--hs-color-text-base)",
          whiteSpace: "nowrap",
        }}
      >
        {count} selected
      </span>

      <BulkToolbarTextButton icon={<MaterialArchiveIcon size={20} />} ariaLabel="Archive selected" onClick={onBulkArchive}>
        Archive
      </BulkToolbarTextButton>

      <div style={{ position: "relative" }}>
        <BulkToolbarTextButton icon={<MoveToGroupIcon />} ariaLabel="Move to group" onClick={onToggleBulkMove}>
          Move to group
        </BulkToolbarTextButton>
        {bulkMoveOpen && (
          <MoveToGroupMenu
            align="start"
            availableGroups={availableGroups}
            onSelect={onBulkMove}
            onClose={onCloseBulkMove}
          />
        )}
      </div>
    </div>
  );
}
