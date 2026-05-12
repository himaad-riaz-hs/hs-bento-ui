import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Button } from "../../components/Button";
import { InputSearch } from "../../components/InputSearch";
import { IconButton } from "../../components/IconButton";
import { Checkbox } from "../../components/Checkbox";
import { useFigmaCommentUpdatesEnabled } from "./FigmaCommentUpdatesContext";
import { FigmaUpdateNote } from "./FigmaUpdateNote";
import { figmaNoteForDescriptionAnnotate, FIGMA_UPDATE_COPY } from "./figma-comment-update-copy";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from "../../components/Table";
import { DropdownMenu, TagGroupCard, TagRow } from "./TagGroupCard";
import { TagBulkToolbar } from "./TagBulkToolbar";
import { CreateGroupModal } from "./CreateGroupModal";
import { CreateTagModal } from "./CreateTagModal";
import { MaterialArchiveIcon } from "./MaterialArchiveIcon";
import { sampleArchivedTags, sampleArchivedGroups } from "./sample-data";
import { getTaggingPreset, type TaggingDataPreset } from "./tagging-presets";
import type { Tag, TagGroup, TabValue } from "./types";
import { ProductNav } from "../shared/NavIcons";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

export interface TagManagementProps {
  /** When true, fills the parent height instead of 100vh (e.g. under a top bar). */
  embedded?: boolean;
  /**
   * `full` — product nav + Settings drawer + Tags (legacy settings shell).
   * `hub` — product nav + Tags only, **688px** centered column — matches Figma Tagging flows (Section 3990:40445).
   * @see https://www.figma.com/design/FWbrDllz3IolgLMzPlqvyX/Tagging?node-id=3990-40445
   */
  layout?: "full" | "hub";
  /** Story / demo seed — remount with a different `key` when changing preset. */
  dataPreset?: TaggingDataPreset;
  /** Initial tab (e.g. `archived` for archived-focused artboards). */
  initialTab?: TabValue;
  /**
   * `figma-mp` — hub matches [Tagging · Groups empty MP](https://www.figma.com/design/FWbrDllz3IolgLMzPlqvyX/Tagging?node-id=3996-50155):
   * gray workspace, white header, **Groups + Archived** only, header **Create tags / Create group**,
   * minimal chrome on empty states, centered **comp-feedback-empty-state** for zero groups.
   */
  hubWorkspace?: "legacy" | "figma-mp";
  /** Prototype: skeleton state for the Groups tab card list (Fabiana: loading for many cards). */
  groupsLoading?: boolean;
  /** Prototype: failed to load group cards — dedicated error + retry (Fabiana). */
  groupsLoadError?: boolean;
  onRetryGroupsLoad?: () => void;
  /** Optional delay so Create / Edit group primary button shows a loading state briefly. */
  modalSubmitHoldMs?: number;
  /** Prototype: callback to open the prototype panel (edge cases). Shows the >> button on the nav. */
  onOpenProtoPanel?: () => void;
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

function Toast({ message, description, onDismiss }: { message: string; description?: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
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
        alignItems: description ? "flex-start" : "center",
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
        maxWidth: 360,
      }}
    >
      <span style={{ flexShrink: 0, marginTop: description ? 2 : 0 }}><CheckCircleIcon /></span>
      <div>
        <div>{message}</div>
        {description && (
          <div style={{ fontSize: 13, fontWeight: 400, opacity: 0.75, marginTop: 2 }}>{description}</div>
        )}
      </div>
    </div>
  );
}

// ─── Confirmation Dialog ─────────────────────────────────────────────────

interface ConfirmDialogProps {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: (checkboxChecked?: boolean) => void;
  confirmLabel?: string;
  destructive?: boolean;
  /** Optional `data-annotate` on the description for Figma "updates" overlay targeting. */
  descriptionDataAnnotate?: string;
  /** Optional checkbox shown below description (e.g. "Also delete group"). */
  checkboxLabel?: string;
  /** Sub-text shown below the checkbox when it is checked. */
  checkboxDescription?: string;
  /** Whether the checkbox starts checked. Defaults to false. */
  checkboxDefaultChecked?: boolean;
}

function ConfirmDialog({
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel = "Confirm",
  destructive = false,
  descriptionDataAnnotate,
  checkboxLabel,
  checkboxDescription,
  checkboxDefaultChecked = false,
}: ConfirmDialogProps) {
  const figmaCommentUpdatesEnabled = useFigmaCommentUpdatesEnabled();
  const figmaDialogKey = figmaNoteForDescriptionAnnotate(descriptionDataAnnotate);
  const [checkboxChecked, setCheckboxChecked] = useState(checkboxDefaultChecked);
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
          background: "var(--hs-color-fill-base)",
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
        <p
          data-annotate={descriptionDataAnnotate}
          style={{
            fontSize: 14,
            lineHeight: "22px",
            color: "var(--hs-color-text-subtle)",
            margin: `0 0 ${figmaCommentUpdatesEnabled && figmaDialogKey ? 10 : checkboxLabel ? 16 : 24}px`,
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </p>
        {figmaCommentUpdatesEnabled && figmaDialogKey && (
          <FigmaUpdateNote style={{ marginBottom: checkboxLabel ? 16 : 24 }}>{FIGMA_UPDATE_COPY[figmaDialogKey]}</FigmaUpdateNote>
        )}
        {checkboxLabel && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
                style={{ marginTop: 3, flexShrink: 0, width: 16, height: 16, cursor: "pointer" }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)", lineHeight: "22px" }}>
                {checkboxLabel}
              </span>
            </label>
            {checkboxChecked && checkboxDescription && (
              <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--hs-color-text-subtle)", margin: "6px 0 0 26px" }}>
                {checkboxDescription}
              </p>
            )}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <button
            onClick={() => onConfirm(checkboxChecked)}
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

/** Outlined price tag — matches Figma empty-state tag artwork (not stacked "cards"). */
function TagEmptyIllustration() {
  return (
    <svg
      width={64}
      height={64}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ color: "var(--hs-color-text-base)" }}
    >
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.182 0l5.796-5.796a2.25 2.25 0 0 0 0-3.182L9.568 3Z"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h.008v.008H6V6Z"
      />
    </svg>
  );
}

function PlusSmallIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const FIGMA_FILE_UPLOAD_ICON = "https://www.figma.com/api/mcp/asset/db183b13-0af2-4191-be1b-c2d2983b2216";
const FIGMA_DOWNLOAD_ICON = "https://www.figma.com/api/mcp/asset/b2ba76b8-d0bd-4f58-8b1e-be2dae2e0d8d";

function UploadIcon() {
  return (
    <img alt="" src={FIGMA_FILE_UPLOAD_ICON} style={{ display: "block", width: 20, height: 20 }} />
  );
}

function DownloadIcon() {
  return (
    <img alt="" src={FIGMA_DOWNLOAD_ICON} style={{ display: "block", width: 20, height: 20 }} />
  );
}

function ChevronDoubleRightIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zm6 0L16.18 12l-4.59 4.59L13 18l6-6-6-6-1.41 1.41z" />
    </svg>
  );
}

// ─── Import Tags Modal ───────────────────────────────────────────────────────

function ExternalLinkIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
    </svg>
  );
}

function FileCheckIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="var(--hs-color-text-subtle)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke="var(--hs-color-text-subtle)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 15l2 2 4-4" stroke="var(--hs-color-fill-positive)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ImportTagsModalProps {
  onClose: () => void;
  onImport: (message: string) => void;
}

function ImportTagsModal({ onClose, onImport }: ImportTagsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  function handleUpload() {
    onImport("8 tags imported: 2 new, 5 moved, 1 unchanged.");
    onClose();
  }

  function handleDownloadTemplate() {
    const csv = "tagName,groupName\nSummer Campaign,Campaign\nProduct Launch,Campaign\nUS,Country\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tags-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 40, background: "var(--hs-color-overlay-scrim)" }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          width: 560,
          maxWidth: "calc(100vw - 48px)",
          borderRadius: 12,
          background: "var(--hs-color-fill-base)",
          boxShadow: "var(--hs-comp-menu-shadow)",
          border: "1px solid var(--hs-color-border-subtle)",
          fontFamily: HS_FONT_FAMILY,
          padding: "28px 30px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 26, fontWeight: 600, lineHeight: "32px", color: "var(--hs-color-text-base)", margin: 0 }}>
            Import tags
          </h2>
          <IconButton icon={<CloseIcon />} aria-label="Close" variant="ghost" size="small" onClick={onClose} />
        </div>

        {/* Description */}
        <p style={{ fontSize: 14, lineHeight: "22px", color: "var(--hs-color-text-subtle)", margin: "0 0 20px" }}>
          Upload a CSV with <code style={{ fontFamily: "monospace", fontSize: 13, background: "var(--hs-comp-badge-neutral-bg)", padding: "1px 5px", borderRadius: 4, color: "var(--hs-color-text-base)" }}>tagName</code> and <code style={{ fontFamily: "monospace", fontSize: 13, background: "var(--hs-comp-badge-neutral-bg)", padding: "1px 5px", borderRadius: 4, color: "var(--hs-color-text-base)" }}>groupName</code> columns to create new tags or move existing tags into groups. Tags not in the file won't be affected. Empty <code style={{ fontFamily: "monospace", fontSize: 13, background: "var(--hs-comp-badge-neutral-bg)", padding: "1px 5px", borderRadius: 4, color: "var(--hs-color-text-base)" }}>groupName</code> = ungrouped. Names must be unique org-wide.
        </p>

        {/* Drop zone / file selected */}
        {file ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 8,
              border: "1px solid var(--hs-color-border-subtle)",
              background: "var(--hs-color-fill-base)",
              marginBottom: 14,
            }}
          >
            <FileCheckIcon />
            <span
              style={{
                flex: 1,
                fontSize: 14,
                color: "var(--hs-color-text-base)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {file.name}
            </span>
            <IconButton
              icon={<CloseIcon size={16} />}
              aria-label="Remove file"
              variant="ghost"
              size="small"
              onClick={() => {
                setFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            />
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            style={{
              border: `1.5px dashed ${dragOver ? "var(--hs-color-text-link)" : "var(--hs-color-border-subtle)"}`,
              borderRadius: 8,
              padding: "36px 24px",
              textAlign: "center",
              marginBottom: 14,
              background: dragOver ? "var(--hs-color-fill-base)" : "transparent",
              transition: "background 120ms ease, border-color 120ms ease",
            }}
          >
            <p style={{ fontSize: 14, color: "var(--hs-color-text-subtle)", margin: "0 0 14px" }}>
              Drop your csv file here to upload
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: HS_FONT_FAMILY,
                borderRadius: 8,
                border: "1.5px solid var(--hs-color-border-subtle)",
                background: "var(--hs-color-fill-base)",
                color: "var(--hs-color-text-base)",
                cursor: "pointer",
              }}
            >
              Browse files
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Download template */}
        <div style={{ marginBottom: 24 }}>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: 14,
              color: "var(--hs-color-text-link)",
              cursor: "pointer",
              fontFamily: HS_FONT_FAMILY,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              textDecoration: "underline",
            }}
          >
            Download CSV template
            <ExternalLinkIcon />
          </button>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleUpload} disabled={!file}>Upload</Button>
        </div>
      </div>
    </>
  );
}

/** Figma `comp-feedback-empty-state` — no groups or tags match (e.g. 4035:108394). */
function SearchOffIllustration() {
  return (
    <svg width={64} height={64} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: "var(--hs-color-text-base)" }}>
      <path
        d="M10.5 10.5a5 5 0 1 1 0-7.07 5 5 0 0 1 0 7.07Zm0 0L16 16"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function GroupsSearchNoMatchesFigma({ query, compact }: { query: string; compact?: boolean }) {
  const figmaCommentUpdatesEnabled = useFigmaCommentUpdatesEnabled();
  return (
    <div
      data-annotate={compact ? "figma-groups-search-empty-compact" : "tag-groups-search-empty"}
      style={{
        minHeight: compact ? 200 : 360,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: compact ? "12px 16px 20px" : "16px",
        boxSizing: "border-box",
        gap: compact ? 12 : 24,
      }}
    >
      {!compact && <SearchOffIllustration />}
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 4 : 8, maxWidth: 520 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: HS_FONT_FAMILY,
            fontWeight: 600,
            fontSize: compact ? 16 : 18,
            lineHeight: compact ? "22px" : "24px",
            color: "var(--hs-color-text-base)",
          }}
        >
          No matches found for "{query}"
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: HS_FONT_FAMILY,
            fontSize: compact ? 14 : 16,
            lineHeight: compact ? "20px" : "24px",
            color: "var(--hs-color-text-subtle)",
          }}
        >
          {compact
            ? "Try another keyword, or clear search to see all groups again."
            : "No groups or tags match your search. Try a different keyword."}
        </p>
        {figmaCommentUpdatesEnabled && compact && (
          <FigmaUpdateNote style={{ marginTop: 14, textAlign: "left" }}>
            {FIGMA_UPDATE_COPY.groupsSearchEmptyCompact}
          </FigmaUpdateNote>
        )}
      </div>
    </div>
  );
}

function GroupsEmptyStateFigma({ onCreateGroup, compact }: { onCreateGroup: () => void; compact?: boolean }) {
  const figmaCommentUpdatesEnabled = useFigmaCommentUpdatesEnabled();
  return (
    <div
      data-annotate="tag-group-cards"
      style={{
        minHeight: compact ? 260 : 420,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: compact ? "12px 16px" : "16px",
        boxSizing: "border-box",
      }}
    >
      <div data-annotate={compact ? "figma-groups-empty-compact" : undefined} style={{ width: "100%", maxWidth: 440 }}>
        {!compact && (
          <div style={{ marginBottom: 24 }}>
            <TagEmptyIllustration />
          </div>
        )}
        <h2
          style={{
            margin: compact ? "0 0 6px" : "0 0 8px",
            fontFamily: HS_FONT_FAMILY,
            fontWeight: 600,
            fontSize: compact ? 16 : 18,
            lineHeight: compact ? "22px" : "24px",
            color: "var(--hs-color-text-base)",
          }}
        >
          No tag groups yet
        </h2>
        <p
          style={{
            margin: compact ? "0 0 16px" : "0 0 24px",
            maxWidth: 520,
            fontFamily: HS_FONT_FAMILY,
            fontSize: compact ? 14 : 16,
            lineHeight: compact ? "20px" : "24px",
            color: "var(--hs-color-text-subtle)",
          }}
        >
          {compact
            ? "Create a group to organize tags (Brand, Campaign, …). Groups also power Analytics filters."
            : "Tag groups help organize your tags into categories like Brand, Campaign, or Region. Each group also becomes a filter in Analytics."}
        </p>
        <Button
          variant="primary"
          onClick={onCreateGroup}
          leadingIcon={
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          }
        >
          Create your first group
        </Button>
        {figmaCommentUpdatesEnabled && compact && (
          <FigmaUpdateNote style={{ marginTop: 16, textAlign: "left" }}>
            {FIGMA_UPDATE_COPY.groupsEmptyCompact}
          </FigmaUpdateNote>
        )}
      </div>
    </div>
  );
}

function ArchivedEmptyStateFigma({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div
      style={{
        minHeight: 360,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "16px",
        boxSizing: "border-box",
        gap: 24,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, maxWidth: 520 }}>
        <span style={{ color: "var(--hs-color-text-base)" }}>
          <MaterialArchiveIcon size={64} />
        </span>
        <h2
          style={{
            margin: 0,
            fontFamily: HS_FONT_FAMILY,
            fontWeight: 600,
            fontSize: 18,
            lineHeight: "24px",
            color: "var(--hs-color-text-base)",
          }}
        >
          Nothing archived yet
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: HS_FONT_FAMILY,
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 400,
            color: "var(--hs-color-text-base)",
          }}
        >
          {hasSearch
            ? "No archived items match your search."
            : "Archived tags and groups will appear here. You can restore or permanently delete them from this tab."}
        </p>
      </div>
    </div>
  );
}

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

// ─── Archived tab (Figma MP hub) — one flat table (same shell as Ungrouped / Groups tag table). ─

function MoreHorizIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="5" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

type ArchivedMpFlatRow =
  | { kind: "tag"; tag: Tag; groupLabel: string }
  | { kind: "emptyGroup"; group: TagGroup };

function ArchivedFlatTagTableRow({
  tag,
  selected,
  onToggleSelected,
  onRestore,
  onDelete,
}: {
  tag: Tag;
  selected: boolean;
  onToggleSelected: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <tr style={{ borderBottom: "1px solid var(--hs-color-border-subtle)", background: "var(--hs-color-fill-base)" }}>
      <td style={{ width: 56, padding: "16px", verticalAlign: "middle" }}>
        <Checkbox checked={selected} onChange={onToggleSelected} />
      </td>
      <td style={{ padding: "16px", verticalAlign: "middle" }}>
        <span
          style={{
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 400,
            color: "var(--hs-color-text-base)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {tag.name}
        </span>
      </td>
      <td style={{ width: 140, padding: "8px 16px", verticalAlign: "middle", textAlign: "right" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <IconButton
            icon={<MoreHorizIcon />}
            aria-label={`Actions for ${tag.name}`}
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
                { label: "Restore", onClick: () => { setMenuOpen(false); onRestore(); } },
                { label: "Delete permanently", destructive: true, onClick: () => { setMenuOpen(false); onDelete(); } },
              ]}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

function ArchivedFlatEmptyGroupTableRow({
  group,
  selected,
  onToggleSelected,
  onRestoreGroup,
  onDeleteGroup,
}: {
  group: TagGroup;
  selected: boolean;
  onToggleSelected: () => void;
  onRestoreGroup: () => void;
  onDeleteGroup: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <tr style={{ borderBottom: "1px solid var(--hs-color-border-subtle)", background: "var(--hs-color-fill-base)" }}>
      <td style={{ width: 56, padding: "16px", verticalAlign: "middle" }}>
        <Checkbox checked={selected} onChange={onToggleSelected} />
      </td>
      <td style={{ padding: "16px", verticalAlign: "middle" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
          <span
            style={{
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "var(--hs-color-text-base)",
            }}
          >
            {group.name}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--hs-color-text-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid var(--hs-color-border-subtle)",
              background: "var(--hs-color-fill-subtle)",
            }}
          >
            Empty group
          </span>
        </div>
      </td>
      <td style={{ width: 140, padding: "8px 16px", verticalAlign: "middle", textAlign: "right" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <IconButton
            icon={<MoreHorizIcon />}
            aria-label={`${group.name} actions`}
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
                { label: "Restore group", onClick: () => { setMenuOpen(false); onRestoreGroup(); } },
                { label: "Delete permanently", destructive: true, onClick: () => { setMenuOpen(false); onDeleteGroup(); } },
              ]}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

function findGroupIdForTagId(tagId: string, groupsList: TagGroup[]): string | null {
  for (const g of groupsList) {
    if (g.tags.some((t) => t.id === tagId)) return g.id;
  }
  return null;
}

type ArchivedCatalogFlatRow =
  | { kind: "group"; id: string; name: string }
  | { kind: "tag"; id: string; name: string; groupName: string };

/** Legacy / full-layout Archived tab — flat `Table` with Name · Type · Group · actions. */
function ArchivedFlatCatalogRow({
  row,
  onRestore,
  onDelete,
}: {
  row: ArchivedCatalogFlatRow;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <TableRow>
      <TableCell
        style={{
          color: "var(--hs-color-text-subtle)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {row.name}
      </TableCell>
      <TableCell style={{ width: 100 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background: row.kind === "group" ? "var(--hs-comp-badge-discovery-bg)" : "var(--hs-comp-badge-neutral-bg)",
            color: row.kind === "group" ? "var(--hs-comp-badge-discovery-text)" : "var(--hs-comp-badge-neutral-text)",
          }}
        >
          {row.kind === "group" ? "Group" : "Tag"}
        </span>
      </TableCell>
      <TableCell style={{ width: 200, color: "var(--hs-color-text-subtle)" }}>
        {row.kind === "tag" ? (row.groupName ?? "Ungrouped") : "—"}
      </TableCell>
      <TableCell style={{ width: 56 }}>
        <div style={{ position: "relative" }}>
          <IconButton
            icon={<MoreHorizIcon />}
            aria-label="Actions"
            variant="ghost"
            size="small"
            onClick={() => setMenuOpen((v) => !v)}
          />
          {menuOpen && (
            <DropdownMenu
              items={[
                { label: "Restore", onClick: () => { setMenuOpen(false); onRestore(); } },
                { label: "Delete permanently", destructive: true, onClick: () => { setMenuOpen(false); onDelete(); } },
              ]}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

export function TagManagement({
  embedded = false,
  layout = "full",
  dataPreset = "default",
  initialTab,
  hubWorkspace = "legacy",
  groupsLoading = false,
  groupsLoadError = false,
  onRetryGroupsLoad,
  modalSubmitHoldMs = 0,
  onOpenProtoPanel,
}: TagManagementProps = {}) {
  const [groups, setGroups] = useState<TagGroup[]>(() => getTaggingPreset(dataPreset).groups);
  const [archivedTags, setArchivedTags] = useState<Tag[]>(() => getTaggingPreset(dataPreset).archivedTags);
  const [archivedGroups, setArchivedGroups] = useState<TagGroup[]>(() => getTaggingPreset(dataPreset).archivedGroups);
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab ?? "groups");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TagGroup | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [preselectedGroupId, setPreselectedGroupId] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<{ message: string; description?: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    destructive: boolean;
    onConfirm: (checkboxChecked?: boolean) => void;
    descriptionDataAnnotate?: string;
    checkboxLabel?: string;
    checkboxDescription?: string;
    checkboxDefaultChecked?: boolean;
  } | null>(null);
  const [archivedInfoBannerDismissed, setArchivedInfoBannerDismissed] = useState(() => {
    if (typeof sessionStorage === "undefined") return false;
    return sessionStorage.getItem("tagging-mp-archived-info-banner-dismissed") === "1";
  });
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  /** Which group cards are expanded on the Groups tab (controlled). */
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set());
  /** MP hub: per-group "show every tag in this card" while global search stays active (Groups tab). */
  const [mpGroupsSearchShowAllIds, setMpGroupsSearchShowAllIds] = useState<Set<string>>(new Set());
  /** MP hub Archived tab: sort flat table by tag / empty-group name (same chevron behavior as Ungrouped). */
  const [archivedMpSortAsc, setArchivedMpSortAsc] = useState(true);
  const [archivedMpSelectedIds, setArchivedMpSelectedIds] = useState<Set<string>>(new Set());
  /** Legacy / full-layout Archived tab — flat catalog table sort. */
  const [legacyArchivedSortDesc, setLegacyArchivedSortDesc] = useState(false);

  const showToast = useCallback((msg: string, description?: string) => setToastMessage({ message: msg, description }), []);

  const handleExport = useCallback(() => {
    const rows = ["tagName,groupName"];
    for (const g of groups) {
      const groupName = g.id === "ungrouped" ? "" : g.name;
      for (const t of g.tags) {
        rows.push(`"${t.name.replace(/"/g, '""')}","${groupName.replace(/"/g, '""')}"`);
      }
    }
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tags-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Tags exported as CSV");
  }, [groups, showToast]);

  // ─ Derived data ────────────────────────────────────────────────────────

  const realGroups = useMemo(() => groups.filter((g) => g.id !== "ungrouped"), [groups]);
  const ungroupedGroup = useMemo(() => groups.find((g) => g.id === "ungrouped"), [groups]);
  const ungroupedTags = useMemo(() => ungroupedGroup?.tags ?? [], [ungroupedGroup]);

  const availableGroupsList = useMemo(
    () => realGroups.filter((g) => !g.archived).map((g) => ({ id: g.id, name: g.name })),
    [realGroups]
  );

  const existingNamesForCreateModal = useMemo(() => realGroups.map((g) => g.name), [realGroups]);
  const existingNamesForEditModal = useMemo(
    () => (editingGroup ? realGroups.filter((g) => g.id !== editingGroup.id).map((g) => g.name) : []),
    [realGroups, editingGroup]
  );

  const isFigmaMpHub = layout === "hub" && hubWorkspace === "figma-mp";
  const figmaCommentUpdatesEnabled = useFigmaCommentUpdatesEnabled();

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return realGroups;
    const q = search.toLowerCase();
    if (isFigmaMpHub) {
      return realGroups.filter(
        (g) => g.name.toLowerCase().includes(q) || g.tags.some((t) => t.name.toLowerCase().includes(q))
      );
    }
    return realGroups
      .map((g) => ({ ...g, tags: g.tags.filter((t) => t.name.toLowerCase().includes(q)) }))
      .filter((g) => g.name.toLowerCase().includes(q) || g.tags.length > 0);
  }, [realGroups, search, isFigmaMpHub]);

  /**
   * MP hub: "Ungrouped tags" is a fifth row on Groups (no separate tab) — Figma 4035:112847 / tab count "Groups 5".
   * With an active query, hide the row unless the pseudo-group or one of its tags matches.
   */
  const groupsForTab = useMemo(() => {
    if (!isFigmaMpHub) return filteredGroups;
    const ug = ungroupedGroup;
    if (!ug || ug.tags.length === 0) return filteredGroups;
    if (filteredGroups.some((g) => g.id === "ungrouped")) return filteredGroups;
    const q = search.trim().toLowerCase();
    if (q) {
      const nameHit = ug.name.toLowerCase().includes(q);
      const tagHit = ug.tags.some((t) => t.name.toLowerCase().includes(q));
      if (!nameHit && !tagHit) return filteredGroups;
    }
    return [...filteredGroups, ug];
  }, [isFigmaMpHub, filteredGroups, ungroupedGroup, search]);

  const figmaMetaAnnotateGroupId = useMemo(() => {
    const nonUg = groupsForTab.find((g) => g.id !== "ungrouped");
    return nonUg?.id ?? groupsForTab[0]?.id;
  }, [groupsForTab]);

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

  const allGroupNamesMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const g of groups) m.set(g.id, g.name);
    for (const g of archivedGroups) m.set(g.id, g.name);
    return m;
  }, [groups, archivedGroups]);

  const archivedCatalogRows = useMemo((): ArchivedCatalogFlatRow[] | null => {
    if (isFigmaMpHub) return null;
    const rows: ArchivedCatalogFlatRow[] = [
      ...filteredArchivedGroups.map((g) => ({ kind: "group" as const, id: g.id, name: g.name })),
      ...filteredArchivedTags.map((t) => ({
        kind: "tag" as const,
        id: t.id,
        name: t.name,
        groupName: (t.groupId && t.groupId !== "ungrouped" && allGroupNamesMap.get(t.groupId)) || "Ungrouped",
      })),
    ];
    rows.sort((a, b) =>
      legacyArchivedSortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    );
    return rows;
  }, [isFigmaMpHub, filteredArchivedGroups, filteredArchivedTags, allGroupNamesMap, legacyArchivedSortDesc]);

  const tagSelectionLockGroupId = useMemo(() => {
    if (selectedTags.size === 0) return null;
    const first = [...selectedTags][0];
    return findGroupIdForTagId(first, groupsForTab);
  }, [selectedTags, groupsForTab]);

  const minimalFigmaGroupsEmpty =
    isFigmaMpHub && activeTab === "groups" && realGroups.length === 0 && ungroupedTags.length === 0 && !search.trim();
  const minimalFigmaArchivedEmpty =
    isFigmaMpHub &&
    activeTab === "archived" &&
    filteredArchivedGroups.length === 0 &&
    filteredArchivedTags.length === 0 &&
    !search.trim();
  const showHubSearchAndManage =
    layout === "full" ||
    (layout === "hub" &&
      (!minimalFigmaGroupsEmpty || groupsLoading || groupsLoadError) &&
      !minimalFigmaArchivedEmpty);

  const archivedMpFlatRowsBase = useMemo((): ArchivedMpFlatRow[] | null => {
    if (!isFigmaMpHub) return null;
    const q = search.trim().toLowerCase();
    const gidSet = new Set(archivedGroups.map((g) => g.id));
    const groupById = new Map(archivedGroups.map((g) => [g.id, g]));
    const rows: ArchivedMpFlatRow[] = [];

    for (const tag of archivedTags) {
      const inArchivedGroup = !!(tag.groupId && gidSet.has(tag.groupId));
      const group = tag.groupId ? groupById.get(tag.groupId) : undefined;
      const groupLabel = inArchivedGroup && group ? group.name : "Not in a group";
      if (q) {
        const nameHit = tag.name.toLowerCase().includes(q);
        const parentHit = groupLabel.toLowerCase().includes(q);
        if (!nameHit && !parentHit) continue;
      }
      rows.push({ kind: "tag", tag, groupLabel });
    }

    const tagsPerArchivedGroup = new Map<string, number>();
    for (const t of archivedTags) {
      if (t.groupId && gidSet.has(t.groupId)) {
        tagsPerArchivedGroup.set(t.groupId, (tagsPerArchivedGroup.get(t.groupId) ?? 0) + 1);
      }
    }
    for (const g of archivedGroups) {
      if ((tagsPerArchivedGroup.get(g.id) ?? 0) > 0) continue;
      if (q && !g.name.toLowerCase().includes(q)) continue;
      rows.push({ kind: "emptyGroup", group: g });
    }

    return rows;
  }, [isFigmaMpHub, archivedGroups, archivedTags, search]);

  const archivedMpFlatRows = useMemo(() => {
    if (!archivedMpFlatRowsBase) return null;
    const sorted = [...archivedMpFlatRowsBase];
    sorted.sort((a, b) => {
      const nameA = a.kind === "tag" ? a.tag.name : a.group.name;
      const nameB = b.kind === "tag" ? b.tag.name : b.group.name;
      return archivedMpSortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    return sorted;
  }, [archivedMpFlatRowsBase, archivedMpSortAsc]);

  const archivedMpTabCount = useMemo(() => {
    if (!isFigmaMpHub) return undefined;
    const emptyArchivedGroups = archivedGroups.filter((g) => !archivedTags.some((t) => t.groupId === g.id));
    return archivedTags.length + emptyArchivedGroups.length;
  }, [isFigmaMpHub, archivedTags, archivedGroups]);

  const archivedMpRowIds = useMemo(
    () => archivedMpFlatRows?.map((row) => (row.kind === "tag" ? `tag:${row.tag.id}` : `group:${row.group.id}`)) ?? [],
    [archivedMpFlatRows]
  );
  const archivedMpVisibleSelectedCount = useMemo(
    () => archivedMpRowIds.filter((id) => archivedMpSelectedIds.has(id)).length,
    [archivedMpRowIds, archivedMpSelectedIds]
  );
  const archivedMpAllVisibleSelected =
    archivedMpRowIds.length > 0 && archivedMpVisibleSelectedCount === archivedMpRowIds.length;
  const archivedMpSomeVisibleSelected =
    archivedMpVisibleSelectedCount > 0 && archivedMpVisibleSelectedCount < archivedMpRowIds.length;

  const hubSearchPlaceholder = isFigmaMpHub ? "Search groups or tags" : "Search tags";

  const groupCount = realGroups.length;
  /** MP tab badge counts the Ungrouped row when it appears on Groups (Figma "Groups 5"). */
  const groupsTabBadgeCount = isFigmaMpHub && ungroupedTags.length > 0 ? groupCount + 1 : groupCount;
  const ungroupedCount = ungroupedTags.length;

  useEffect(() => {
    if (isFigmaMpHub && activeTab === "ungrouped") setActiveTab("groups");
  }, [isFigmaMpHub, activeTab]);

  useEffect(() => { setSelectedTags(new Set()); }, [activeTab]);

  useEffect(() => {
    const alive = new Set<string>();
    for (const g of groups) for (const t of g.tags) alive.add(t.id);
    setSelectedTags((prev) => {
      const next = new Set<string>();
      let changed = false;
      for (const id of prev) {
        if (alive.has(id)) next.add(id);
        else changed = true;
      }
      if (!changed && next.size === prev.size) return prev;
      return next;
    });
  }, [groups]);

  useEffect(() => {
    setMpGroupsSearchShowAllIds(new Set());
  }, [search]);

  useEffect(() => {
    const visible = new Set(groupsForTab.map((g) => g.id));
    const q = search.trim().toLowerCase();
    setExpandedGroupIds((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        if (visible.has(id)) next.add(id);
      }
      if (isFigmaMpHub && q) {
        for (const g of groupsForTab) {
          const nameHit = g.name.toLowerCase().includes(q);
          if (g.tags.length === 0 && nameHit) {
            next.delete(g.id);
            continue;
          }
          const hasTagMatch = g.tags.some((t) => t.name.toLowerCase().includes(q));
          if (g.tags.length > 0 && hasTagMatch && !nameHit) {
            next.add(g.id);
          }
        }
      }
      if (prev.size === next.size && [...prev].every((id) => next.has(id))) return prev;
      return next;
    });
  }, [groupsForTab, search, isFigmaMpHub]);

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
    setExpandedGroupIds((prev) => new Set(prev).add(newGroup.id));
    showToast(`"${data.name}" group created`, "Start adding tags to this group, or create another one");
  };

  const handleCreateTag = (data: { names: string[]; groupId: string; color: string }) => {
    const gid = data.groupId;
    const base = Date.now();
    const newTags: Tag[] = data.names.map((name, i) => ({
      id: `t${base}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      groupId: gid === "ungrouped" ? null : gid,
      color: data.color,
    }));
    setGroups((prev) => prev.map((g) => (g.id === gid ? { ...g, tags: [...g.tags, ...newTags] } : g)));
    const groupName = gid === "ungrouped" ? "Ungrouped" : (groups.find((g) => g.id === gid)?.name ?? gid);
    showToast(`${newTags.length} tag${newTags.length !== 1 ? "s" : ""} added to "${groupName}"`);
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

  const handleEditTag = (data: { names: string[]; groupId: string; color: string }) => {
    if (!editingTag) return;
    const name = data.names[0] ?? "";
    const newGroupId = data.groupId === "ungrouped" ? null : data.groupId;
    setGroups((prev) => {
      let tag: Tag | null = null;
      const stripped = prev.map((g) => ({
        ...g,
        tags: g.tags.filter((t) => {
          if (t.id === editingTag.id) { tag = { ...t, name, color: data.color, groupId: newGroupId }; return false; }
          return true;
        }),
      }));
      if (!tag) return prev;
      const targetGroupId = data.groupId;
      return stripped.map((g) => g.id === targetGroupId ? { ...g, tags: [...g.tags, tag!] } : g);
    });
    setEditingTag(null);
    showToast(`Tag updated to "${name}"`);
  };

  const deleteGroupMoveTagsToUngrouped = useCallback(
    (groupId: string) => {
      if (groupId === "ungrouped") return;
      setGroups((prev) => {
        const g = prev.find((x) => x.id === groupId);
        if (!g) return prev;
        const moved = g.tags.map((t) => ({ ...t, groupId: null }));
        return prev
          .filter((x) => x.id !== groupId)
          .map((x) => (x.id === "ungrouped" ? { ...x, tags: [...x.tags, ...moved] } : x));
      });
      setExpandedGroupIds((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      setSelectedTags((prev) => {
        const g = groups.find((x) => x.id === groupId);
        if (!g) return prev;
        const next = new Set(prev);
        for (const t of g.tags) next.delete(t.id);
        return next;
      });
      showToast("Group deleted — tags moved to Ungrouped");
    },
    [groups, showToast]
  );

  const confirmDeleteGroup = useCallback(
    (groupId: string) => {
      const group = groups.find((g) => g.id === groupId);
      setConfirmDialog({
        title: `Delete "${group?.name ?? "this group"}" group?`,
        description: "This group has no tags and will be permanently deleted. This action can't be undone.",
        confirmLabel: "Delete group",
        destructive: false,
        onConfirm: () => {
          deleteGroupMoveTagsToUngrouped(groupId);
          setConfirmDialog(null);
        },
      });
    },
    [groups, deleteGroupMoveTagsToUngrouped]
  );

  // ─ Archive / Delete / Move ─────────────────────────────────────────────

  const archiveTags = useCallback((tagIds: string[]) => {
    // Look up tag name before mutation so the toast can reference it by name.
    const singleTag = tagIds.length === 1
      ? groups.flatMap((g) => g.tags).find((t) => t.id === tagIds[0])
      : undefined;
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
    if (singleTag) {
      showToast(`"${singleTag.name}" tag archived`);
    } else {
      showToast(`${tagIds.length} tags archived`);
    }
  }, [groups, showToast]);

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
    showToast(`"${group.name}" group archived`);
  }, [groups, showToast]);

  const restoreTag = useCallback((tagId: string) => {
    const tag = archivedTags.find((t) => t.id === tagId);
    if (!tag) return;
    setArchivedTags((prev) => prev.filter((t) => t.id !== tagId));
    const restored: Tag = { ...tag, archived: false };
    setGroups((prev) =>
      prev.map((g) => g.id === "ungrouped" ? { ...g, tags: [...g.tags, restored] } : g)
    );
    showToast(`"${tag.name}" tag restored`);
  }, [archivedTags, showToast]);

  const restoreGroup = useCallback((groupId: string) => {
    const group = archivedGroups.find((g) => g.id === groupId);
    if (!group) return;
    setArchivedGroups((prev) => prev.filter((g) => g.id !== groupId));
    setGroups((prev) => [...prev, { ...group, archived: false, required: false }]);
    showToast(`"${group.name}" group restored`);
  }, [archivedGroups, showToast]);

  const deleteArchivedTag = useCallback((tagId: string) => {
    const tag = archivedTags.find((t) => t.id === tagId);
    setArchivedTags((prev) => prev.filter((t) => t.id !== tagId));
    showToast(tag ? `"${tag.name}" tag deleted` : "Tag deleted");
  }, [archivedTags, showToast]);

  const deleteArchivedGroup = useCallback((groupId: string) => {
    const group = archivedGroups.find((g) => g.id === groupId);
    setArchivedGroups((prev) => prev.filter((g) => g.id !== groupId));
    showToast(group ? `"${group.name}" group deleted` : "Group deleted");
  }, [archivedGroups, showToast]);

  // ─ Confirmation wrappers ───────────────────────────────────────────────

  const confirmArchiveSingle = useCallback((tagId: string) => {
    setConfirmDialog({
      title: "Archive 1 tag?",
      description: "Archived tags can't be added to new posts or messages, but will remain on any existing content. They can be restored from the Archived tab.",
      confirmLabel: "Archive tag",
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
    const n = tagIds.length;
    setConfirmDialog({
      title: `Archive ${n} tag${n !== 1 ? "s" : ""}?`,
      description: "Archived tags can't be added to new posts or messages, but will remain on any existing content. They can be restored from the Archived tab.",
      confirmLabel: `Archive ${n} tag${n !== 1 ? "s" : ""}`,
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
    if (!group) return;
    const n = group.tags.length;
    const groupName = group.name;
    setConfirmDialog({
      title: `Archive ${n} tag${n !== 1 ? "s" : ""} from "${groupName}"?`,
      description: `This will permanently remove the "${groupName}" group. The group's mandatory publish settings will also be removed. All tags inside will be archived and can be restored from the Archived tab.`,
      confirmLabel: `Archive ${n} tag${n !== 1 ? "s" : ""}`,
      destructive: false,
      descriptionDataAnnotate: "figma-archive-group-dialog",
      checkboxLabel: `Also delete "${groupName}" group`,
      checkboxDescription: "The group will be permanently removed. All tags inside will be archived.",
      onConfirm: (checkboxChecked?: boolean) => {
        // Archive the tags
        if (group.tags.length > 0) {
          setArchivedTags((prev) => [...prev, ...group.tags.map((t) => ({ ...t, archived: true }))]);
        }
        // Remove from active groups
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        if (checkboxChecked) {
          // Permanently remove the group — no archived entry
          showToast(`"${groupName}" group removed. ${n} tag${n !== 1 ? "s" : ""} archived.`);
        } else {
          // Move group to archived (can be restored later)
          setArchivedGroups((prev) => [...prev, { ...group, archived: true }]);
          showToast(`"${groupName}" group archived`);
        }
        setConfirmDialog(null);
      },
    });
  }, [groups, showToast]);

  const confirmDeleteArchivedTag = useCallback((tagId: string) => {
    const tag = archivedTags.find((t) => t.id === tagId);
    setConfirmDialog({
      title: `Delete "${tag?.name ?? "this tag"}" permanently?`,
      description: "This tag will be permanently deleted and removed from all historical post data, reports, and analytics.\n\nThis action can't be undone.",
      confirmLabel: "Delete permanently",
      destructive: true,
      descriptionDataAnnotate: "figma-delete-archived-tag-dialog",
      onConfirm: () => { deleteArchivedTag(tagId); setConfirmDialog(null); },
    });
  }, [archivedTags, deleteArchivedTag]);

  const confirmDeleteArchivedGroup = useCallback((groupId: string) => {
    const group = archivedGroups.find((g) => g.id === groupId);
    setConfirmDialog({
      title: `Delete "${group?.name ?? "this group"}" permanently?`,
      description: "This group and any tags within it will be permanently deleted and removed from all historical post data, reports, and analytics.\n\nThis action can't be undone.",
      confirmLabel: "Delete permanently",
      destructive: true,
      descriptionDataAnnotate: "figma-delete-archived-group-dialog",
      onConfirm: () => { deleteArchivedGroup(groupId); setConfirmDialog(null); },
    });
  }, [archivedGroups, deleteArchivedGroup]);

  const restoreArchivedSelection = useCallback(() => {
    const ids = Array.from(archivedMpSelectedIds);
    ids.forEach((id) => {
      if (id.startsWith("tag:")) restoreTag(id.slice(4));
      if (id.startsWith("group:")) restoreGroup(id.slice(6));
    });
    setArchivedMpSelectedIds(new Set());
  }, [archivedMpSelectedIds, restoreGroup, restoreTag]);

  const confirmDeleteArchivedSelection = useCallback(() => {
    const ids = Array.from(archivedMpSelectedIds);
    if (ids.length === 0) return;
    setConfirmDialog({
      title: `Delete ${ids.length} archived item${ids.length > 1 ? "s" : ""} permanently?`,
      description: "These items will be permanently deleted and removed from historical post data, reports, and analytics.\n\nThis action can't be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => {
        ids.forEach((id) => {
          if (id.startsWith("tag:")) deleteArchivedTag(id.slice(4));
          if (id.startsWith("group:")) deleteArchivedGroup(id.slice(6));
        });
        setArchivedMpSelectedIds(new Set());
        setConfirmDialog(null);
      },
    });
  }, [archivedMpSelectedIds, deleteArchivedGroup, deleteArchivedTag]);

  // ─ Selection ───────────────────────────────────────────────────────────

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      const gid = findGroupIdForTagId(id, groupsForTab);
      if (prev.size > 0) {
        const first = [...prev][0];
        const firstGid = findGroupIdForTagId(first, groupsForTab);
        if (gid !== firstGid) return prev;
      }
      next.add(id);
      return next;
    });
  };

  const toggleAllDisplayedInGroup = useCallback(
    (tags: Tag[]) => {
      const ids = tags.map((t) => t.id);
      const allSelected = ids.length > 0 && ids.every((id) => selectedTags.has(id));
      if (allSelected) {
        setSelectedTags((prev) => {
          const next = new Set(prev);
          ids.forEach((i) => next.delete(i));
          return next;
        });
        return;
      }
      setSelectedTags((prev) => {
        if (prev.size === 0) return new Set(ids);
        const first = [...prev][0];
        const firstG = findGroupIdForTagId(first, groupsForTab);
        const candG = findGroupIdForTagId(ids[0]!, groupsForTab);
        if (firstG !== candG) return prev;
        const next = new Set(prev);
        ids.forEach((i) => next.add(i));
        return next;
      });
    },
    [selectedTags, groupsForTab]
  );

  const clearGroupSelection = useCallback((groupId: string) => {
    setSelectedTags((prev) => {
      const g = groups.find((x) => x.id === groupId);
      if (!g) return prev;
      const next = new Set(prev);
      for (const t of g.tags) next.delete(t.id);
      return next;
    });
  }, [groups]);

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
      {/* ── Left product nav ── */}
      <div style={{ position: "relative", flexShrink: 0, width: 128 }}>
        <ProductNav activeItem="Create" showDrawerRail onItemClick={() => {}} />
      </div>

      {/* ── Settings drawer (304px) — only in `full` layout ─────────── */}
      {layout === "full" && (
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
      )}

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
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            minHeight: 64,
            padding: "12px 24px",
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
              paddingTop: 4,
            }}
          >
            Tags
          </h1>
          {isFigmaMpHub && (
            <div data-annotate="tag-manage-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <IconButton
                icon={<UploadIcon />}
                aria-label="Import tags"
                variant="ghost"
                onClick={() => setShowImportModal(true)}
              />
              <IconButton
                icon={<DownloadIcon />}
                aria-label="Export tags"
                variant="ghost"
                onClick={handleExport}
              />
              <Button variant="ghost" onClick={() => setShowCreateTag(true)} leadingIcon={<PlusSmallIcon />}>
                Create tags
              </Button>
              <Button variant="outlined" onClick={() => setShowCreateGroup(true)} leadingIcon={<PlusSmallIcon />}>
                Create groups
              </Button>
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            width: "100%",
            background: isFigmaMpHub ? "var(--hs-comp-badge-neutral-bg)" : "var(--hs-color-fill-base)",
          }}
        >
          <div
            style={{
              maxWidth: layout === "hub" ? 688 : 1008,
              width: "100%",
              margin: "0 auto",
              padding: layout === "hub" ? "24px 24px 40px" : 24,
              boxSizing: "border-box",
            }}
          >
          {/* Figma `full`: title row above tabs. `hub`: tabs → search → title/actions (matches Tagging artboards). */}
          {layout === "full" && (
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
                <Button variant="ghost" onClick={() => setShowCreateTag(true)}>+ Create tags</Button>
                <Button variant="outlined" onClick={() => setShowCreateGroup(true)}>+ Create groups</Button>
              </div>
            </div>
          )}

          {/* Tabs — comp-tabs; hub: 24px rhythm below tabs per Figma Frame 1686556786 */}
          <div
            data-annotate="tag-tabs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              borderBottom: "1px solid var(--hs-color-border-subtle)",
              marginBottom: layout === "hub" ? 24 : 24,
            }}
          >
            <TabButton label="Groups" count={groupsTabBadgeCount} active={activeTab === "groups"} onClick={() => setActiveTab("groups")} />
            {!isFigmaMpHub && (
              <TabButton label="Ungrouped tags" count={ungroupedCount} active={activeTab === "ungrouped"} onClick={() => setActiveTab("ungrouped")} />
            )}
            <TabButton
              label="Archived"
              count={archivedMpTabCount}
              active={activeTab === "archived"}
              onClick={() => setActiveTab("archived")}
            />
          </div>

          {showHubSearchAndManage && (
            <>
              <div data-annotate="tag-search" style={{ marginBottom: layout === "hub" ? 24 : 16 }}>
                <InputSearch
                  placeholder={hubSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch("")}
                />
              </div>

              {layout === "hub" && !isFigmaMpHub && (
                <div
                  data-annotate="tag-manage-actions"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}
                >
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
                    <Button variant="ghost" onClick={() => setShowCreateTag(true)}>+ Create tags</Button>
                    <Button variant="outlined" onClick={() => setShowCreateGroup(true)}>+ Create groups</Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Tab Content ──────────────────────────────────────────── */}

          {/* Groups Tab */}
          {activeTab === "groups" && (
            <>
              {groupsLoadError ? (
                <>
                  <div
                    data-annotate="figma-tag-groups-load-error"
                    style={{
                      borderRadius: 8,
                      border: "1px solid var(--hs-color-border-subtle)",
                      background: "var(--hs-color-fill-base)",
                      padding: "28px 24px",
                      textAlign: "center",
                      fontFamily: HS_FONT_FAMILY,
                    }}
                  >
                    <p style={{ margin: "0 0 16px", fontSize: 16, lineHeight: "24px", color: "var(--hs-color-text-base)" }}>
                      We couldn&apos;t load tag groups. Check your connection and try again.
                    </p>
                    <Button variant="primary" onClick={() => onRetryGroupsLoad?.()}>
                      Try again
                    </Button>
                  </div>
                  {figmaCommentUpdatesEnabled && (
                    <FigmaUpdateNote style={{ marginTop: 4 }}>{FIGMA_UPDATE_COPY.groupsLoadError}</FigmaUpdateNote>
                  )}
                </>
              ) : groupsLoading ? (
                <>
                  <div
                    data-annotate="figma-tag-groups-loading"
                    style={{ display: "flex", flexDirection: "column", gap: 10 }}
                    aria-busy
                    aria-label="Loading tag groups"
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          height: 88,
                          borderRadius: 8,
                          border: "1px solid var(--hs-color-border-subtle)",
                          background: "linear-gradient(90deg, var(--hs-color-fill-base) 0%, var(--hs-comp-badge-neutral-bg) 50%, var(--hs-color-fill-base) 100%)",
                          backgroundSize: "200% 100%",
                          animation: "tagShimmer 1.2s ease-in-out infinite",
                        }}
                      />
                    ))}
                    <style>{`@keyframes tagShimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
                  </div>
                  {figmaCommentUpdatesEnabled && (
                    <FigmaUpdateNote style={{ marginTop: 4 }}>{FIGMA_UPDATE_COPY.groupsLoading}</FigmaUpdateNote>
                  )}
                </>
              ) : minimalFigmaGroupsEmpty ? (
                <GroupsEmptyStateFigma compact={isFigmaMpHub} onCreateGroup={() => setShowCreateGroup(true)} />
              ) : (
                <div data-annotate="tag-group-cards" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {groupsForTab.map((group) => {
                    const q = search.trim().toLowerCase();
                    const mpScopedSearch = isFigmaMpHub && !!q;
                    const nameHit = mpScopedSearch && group.name.toLowerCase().includes(q);
                    const showAllForGroup = mpGroupsSearchShowAllIds.has(group.id);
                    let tagsTableOverride: Tag[] | undefined;
                    if (mpScopedSearch && !showAllForGroup && !nameHit) {
                      tagsTableOverride = group.tags.filter((t) => t.name.toLowerCase().includes(q));
                    }
                    const onShowAllTagsInGroup =
                      tagsTableOverride !== undefined && tagsTableOverride.length < group.tags.length
                        ? () =>
                            setMpGroupsSearchShowAllIds((prev) => {
                              const next = new Set(prev);
                              next.add(group.id);
                              return next;
                            })
                        : undefined;
                    return (
                      <TagGroupCard
                        key={group.id}
                        group={group}
                        figmaAnnotateGroupMeta={isFigmaMpHub && !!figmaMetaAnnotateGroupId && group.id === figmaMetaAnnotateGroupId}
                        ungroupedMpHubMenu={isFigmaMpHub && group.id === "ungrouped"}
                        tagsTableOverride={tagsTableOverride}
                        onShowAllTagsInGroup={onShowAllTagsInGroup}
                        expanded={expandedGroupIds.has(group.id)}
                        onExpandedChange={(open) => {
                          setExpandedGroupIds((prev) => {
                            const next = new Set(prev);
                            if (open) next.add(group.id);
                            else next.delete(group.id);
                            return next;
                          });
                        }}
                        onEditGroup={group.id === "ungrouped" ? undefined : () => setEditingGroup(group)}
                        onEditTag={(tag) => setEditingTag(tag)}
                        onCreateTag={() => {
                          setPreselectedGroupId(group.id);
                          setShowCreateTag(true);
                        }}
                        onArchiveGroup={group.id === "ungrouped" ? undefined : () => confirmArchiveGroup(group.id)}
                        onArchiveTag={(tagId) => archiveTags([tagId])}
                        onDeleteTag={(tagId) => confirmDeleteSingle(tagId)}
                        onMoveTag={(tagId, targetGroupId) => moveTagsToGroup([tagId], targetGroupId)}
                        onBulkArchive={(tagIds) => confirmBulkArchive(tagIds)}
                        onBulkMove={(tagIds, targetGroupId) => moveTagsToGroup(tagIds, targetGroupId)}
                        onBulkDelete={group.id === "ungrouped" ? undefined : (tagIds) => confirmBulkDelete(tagIds)}
                        onDeleteGroup={group.id === "ungrouped" ? undefined : () => confirmDeleteGroup(group.id)}
                        selectedTagIds={selectedTags}
                        onToggleTagSelect={toggleTag}
                        onToggleAllDisplayedTags={toggleAllDisplayedInGroup}
                        onClearGroupSelection={() => clearGroupSelection(group.id)}
                        selectionLockGroupId={tagSelectionLockGroupId}
                        availableGroups={availableGroupsList}
                      />
                    );
                  })}
                  {groupsForTab.length === 0 &&
                    (isFigmaMpHub && search.trim() ? (
                      <GroupsSearchNoMatchesFigma compact={isFigmaMpHub} query={search.trim()} />
                    ) : (
                      <div
                        style={{
                          borderRadius: 8,
                          border: "1px solid var(--hs-color-border-subtle)",
                          background: "var(--hs-color-fill-base)",
                          padding: "48px 24px",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: HS_FONT_FAMILY,
                            fontWeight: 500,
                            fontSize: 14,
                            color: "var(--hs-color-text-subtle)",
                            margin: 0,
                          }}
                        >
                          {search ? "No groups match your search." : "No groups yet. Create one to get started."}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}

          {/* Ungrouped Tags Tab */}
          {activeTab === "ungrouped" && (
            <div data-annotate="ungrouped-table" style={{ borderRadius: 8, border: "1px solid var(--hs-color-border-subtle)", overflow: "visible" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: HS_FONT_FAMILY }}>
                <thead>
                  <tr style={{ background: "var(--hs-color-fill-base)", borderBottom: "1px solid var(--hs-color-border-subtle)" }}>
                    {filteredUngrouped.length >= 2 && (
                      <th style={{ width: 56, padding: "16px", textAlign: "left", verticalAlign: "middle" }}>
                        <Checkbox
                          checked={selectedTags.size === filteredUngrouped.length && filteredUngrouped.length > 0}
                          indeterminate={selectedTags.size > 0 && selectedTags.size < filteredUngrouped.length}
                          onChange={() => toggleAll(filteredUngrouped)}
                        />
                      </th>
                    )}
                    {selectedTags.size > 0 && filteredUngrouped.length >= 2 ? (
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0 16px",
                          minHeight: 56,
                          verticalAlign: "middle",
                        }}
                      >
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
                          onCloseBulkMove={() => setBulkMoveOpen(false)}
                        />
                      </th>
                    ) : (
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
                      onArchive={() => archiveTags([tag.id])}
                      onDelete={() => confirmDeleteSingle(tag.id)}
                      onMove={(gid) => moveTagsToGroup([tag.id], gid)}
                      availableGroups={availableGroupsList}
                      showCheckbox={filteredUngrouped.length >= 2}
                    />
                  ))}
                  {filteredUngrouped.length === 0 && (
                    <tr>
                      <td colSpan={filteredUngrouped.length >= 2 ? 3 : 2} style={{ padding: "32px 16px", textAlign: "center", fontSize: 14, color: "var(--hs-color-text-subtle)" }}>
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
            <div data-annotate="archived-flow" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {isFigmaMpHub && archivedMpFlatRows ? (
                <>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: HS_FONT_FAMILY,
                      fontSize: 16,
                      lineHeight: "24px",
                      color: "var(--hs-color-text-base)",
                    }}
                  >
                    Archived tags can&apos;t be added to new posts or messages, but will remain on any existing content
                  </p>
                  {archivedMpFlatRows.length === 0 ? (
                    <ArchivedEmptyStateFigma hasSearch={!!search.trim()} />
                  ) : (
                    <div
                      data-annotate="archived-mp-flat-table"
                      style={{
                        borderRadius: 8,
                        border: "1px solid var(--hs-color-border-subtle)",
                        overflow: "visible",
                      }}
                    >
                      {archivedMpVisibleSelectedCount > 0 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            minHeight: 56,
                            padding: "0 16px",
                            background: "var(--hs-color-fill-base)",
                            borderBottom: "1px solid var(--hs-color-border-subtle)",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: HS_FONT_FAMILY,
                              fontSize: 16,
                              lineHeight: "24px",
                              color: "var(--hs-color-text-base)",
                            }}
                          >
                            {archivedMpVisibleSelectedCount} selected
                          </span>
                          <Button variant="ghost" leadingIcon={<RestoreIcon />} onClick={restoreArchivedSelection}>
                            Restore
                          </Button>
                          <Button variant="ghost" leadingIcon={<DeleteIcon />} onClick={confirmDeleteArchivedSelection}>
                            Delete
                          </Button>
                        </div>
                      )}
                      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: HS_FONT_FAMILY }}>
                        <thead>
                          <tr
                            style={{
                              background: "var(--hs-color-fill-base)",
                              borderBottom: "1px solid var(--hs-color-border-subtle)",
                            }}
                          >
                            <th style={{ width: 56, padding: "16px", textAlign: "left", verticalAlign: "middle" }}>
                              <Checkbox
                                checked={archivedMpAllVisibleSelected}
                                indeterminate={archivedMpSomeVisibleSelected}
                                onChange={() =>
                                  setArchivedMpSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    if (archivedMpAllVisibleSelected) archivedMpRowIds.forEach((id) => next.delete(id));
                                    else archivedMpRowIds.forEach((id) => next.add(id));
                                    return next;
                                  })
                                }
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
                              onClick={() => setArchivedMpSortAsc((v) => !v)}
                            >
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
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
                                    d={archivedMpSortAsc ? "M6 8l4 4 4-4" : "M6 12l4-4 4 4"}
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
                                textAlign: "right",
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
                          {archivedMpFlatRows.map((row) =>
                            row.kind === "tag" ? (
                              <ArchivedFlatTagTableRow
                                key={`t-${row.tag.id}`}
                                tag={row.tag}
                                selected={archivedMpSelectedIds.has(`tag:${row.tag.id}`)}
                                onToggleSelected={() =>
                                  setArchivedMpSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    const id = `tag:${row.tag.id}`;
                                    if (next.has(id)) next.delete(id);
                                    else next.add(id);
                                    return next;
                                  })
                                }
                                onRestore={() => restoreTag(row.tag.id)}
                                onDelete={() => confirmDeleteArchivedTag(row.tag.id)}
                              />
                            ) : (
                              <ArchivedFlatEmptyGroupTableRow
                                key={`g-${row.group.id}`}
                                group={row.group}
                                selected={archivedMpSelectedIds.has(`group:${row.group.id}`)}
                                onToggleSelected={() =>
                                  setArchivedMpSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    const id = `group:${row.group.id}`;
                                    if (next.has(id)) next.delete(id);
                                    else next.add(id);
                                    return next;
                                  })
                                }
                                onRestoreGroup={() => restoreGroup(row.group.id)}
                                onDeleteGroup={() => confirmDeleteArchivedGroup(row.group.id)}
                              />
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {archivedCatalogRows && archivedCatalogRows.length > 0 && (
                    <div
                      style={{
                        borderRadius: 8,
                        border: "1px solid var(--hs-color-border-subtle)",
                        overflow: "auto",
                        fontFamily: HS_FONT_FAMILY,
                      }}
                    >
                      <Table>
                        <TableHeader>
                          <TableHeaderRow>
                            <TableHead>
                              <button
                                type="button"
                                onClick={() => setLegacyArchivedSortDesc((v) => !v)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  letterSpacing: "0.04em",
                                  textTransform: "uppercase",
                                  color: "var(--hs-color-text-subtle)",
                                  padding: 0,
                                }}
                              >
                                Name
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                  <path
                                    d={legacyArchivedSortDesc ? "M6 8l4 4 4-4" : "M6 12l4-4 4 4"}
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </TableHead>
                            <TableHead style={{ width: 100 }}>Type</TableHead>
                            <TableHead style={{ width: 200 }}>Group</TableHead>
                            <TableHead style={{ width: 56 }} />
                          </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                          {archivedCatalogRows.map((row) => (
                            <ArchivedFlatCatalogRow
                              key={`${row.kind}-${row.id}`}
                              row={row}
                              onRestore={() =>
                                row.kind === "group" ? restoreGroup(row.id) : restoreTag(row.id)
                              }
                              onDelete={() =>
                                row.kind === "group"
                                  ? confirmDeleteArchivedGroup(row.id)
                                  : confirmDeleteArchivedTag(row.id)
                              }
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {archivedCatalogRows && archivedCatalogRows.length === 0 && (
                    <div style={{ borderRadius: 8, border: "1px solid var(--hs-color-border-subtle)", background: "var(--hs-color-fill-base)", padding: "48px 24px", textAlign: "center" }}>
                      <p style={{ fontFamily: HS_FONT_FAMILY, fontWeight: 500, fontSize: 14, color: "var(--hs-color-text-subtle)", margin: 0 }}>
                        {search ? "No archived items match your search." : "No archived tags or groups."}
                      </p>
                    </div>
                  )}
                </>
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
        existingGroupNames={existingNamesForCreateModal}
        submitHoldMs={modalSubmitHoldMs}
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
        existingGroupNames={existingNamesForEditModal}
        submitHoldMs={modalSubmitHoldMs}
        tagCount={editingGroup?.tags.length ?? 0}
      />
      <CreateTagModal
        open={showCreateTag}
        onClose={() => { setShowCreateTag(false); setPreselectedGroupId(undefined); }}
        onSave={handleCreateTag}
        groups={groups}
        preselectedGroupId={preselectedGroupId}
        submitHoldMs={modalSubmitHoldMs}
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
        submitHoldMs={modalSubmitHoldMs}
      />

      {/* ── Confirmation dialog ─────────────────────────────────────── */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmLabel={confirmDialog.confirmLabel}
          destructive={confirmDialog.destructive}
          descriptionDataAnnotate={confirmDialog.descriptionDataAnnotate}
          checkboxLabel={confirmDialog.checkboxLabel}
          checkboxDescription={confirmDialog.checkboxDescription}
          checkboxDefaultChecked={confirmDialog.checkboxDefaultChecked}
          onCancel={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
        />
      )}

      {/* ── Import tags modal ───────────────────────────────────────── */}
      {showImportModal && (
        <ImportTagsModal
          onClose={() => setShowImportModal(false)}
          onImport={(msg) => showToast(msg)}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────── */}
      {toastMessage && (
        <Toast message={toastMessage.message} description={toastMessage.description} onDismiss={() => setToastMessage(null)} />
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
