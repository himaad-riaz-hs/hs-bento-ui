import { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Switch } from "../../components/Switch";
import { IconButton } from "../../components/IconButton";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { useFigmaCommentUpdatesEnabled } from "./FigmaCommentUpdatesContext";
import { FigmaUpdateNote } from "./FigmaUpdateNote";
import { FIGMA_UPDATE_COPY } from "./figma-comment-update-copy";

function SubmitSpinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ animation: "hsSpin 0.8s linear infinite" }}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="42" strokeDashoffset="12" opacity={0.35} />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="14 50" />
    </svg>
  );
}

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    visibility: string;
    permissions: string;
    required: boolean;
  }) => void | Promise<void>;
  editMode?: boolean;
  initialData?: {
    name: string;
    visibility: string;
    permissions: string;
    required: boolean;
  };
  /** Other groups’ names (case-insensitive duplicate check). */
  existingGroupNames?: string[];
  /** Optional minimum time the primary button stays in a loading state (demo / slow networks). */
  submitHoldMs?: number;
  /** Edit mode: number of tags in the group — “Required for publishing” only shows when &gt; 0. */
  tagCount?: number;
}

export function CreateGroupModal({
  open,
  onClose,
  onSave,
  editMode = false,
  initialData,
  existingGroupNames = [],
  submitHoldMs = 0,
  tagCount = 0,
}: CreateGroupModalProps) {
  const figmaCommentUpdatesEnabled = useFigmaCommentUpdatesEnabled();
  const [name, setName] = useState(initialData?.name || "");
  const [visibility, setVisibility] = useState(initialData?.visibility || "everyone");
  const [permissions, setPermissions] = useState(initialData?.permissions || "everyone");
  const [required, setRequired] = useState(initialData?.required || false);
  const [submitting, setSubmitting] = useState(false);
  const [nameBlurred, setNameBlurred] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setVisibility(initialData?.visibility || "everyone");
      setPermissions(initialData?.permissions || "everyone");
      setRequired(initialData?.required || false);
      setSubmitting(false);
      setNameBlurred(false);
    }
  }, [open, initialData]);

  const duplicateName = useMemo(() => {
    const n = name.trim().toLowerCase();
    if (!n) return false;
    return existingGroupNames.some((x) => x.trim().toLowerCase() === n);
  }, [name, existingGroupNames]);

  if (!open) return null;

  const showDuplicateError = nameBlurred && duplicateName;
  const submitDisabled = !name.trim() || submitting;

  const handleSubmit = async () => {
    if (submitDisabled) return;
    if (duplicateName) {
      setNameBlurred(true);
      return;
    }
    setSubmitting(true);
    try {
      if (submitHoldMs > 0) {
        await new Promise((r) => setTimeout(r, submitHoldMs));
      }
      await Promise.resolve(
        onSave({ name: name.trim(), visibility, permissions, required })
      );
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`@keyframes hsSpin { to { transform: rotate(360deg); } }`}</style>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 40, background: "var(--hs-color-overlay-scrim)" }}
        onClick={submitting ? undefined : onClose}
      />
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          width: 571,
          borderRadius: "var(--hs-comp-input-border-radii)",
          background: "var(--hs-color-fill-base)",
          boxShadow: "var(--hs-comp-menu-shadow)",
          border: "1px solid var(--hs-color-border-subtle)",
          fontFamily: HS_FONT_FAMILY,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", padding: "28px 30px 0" }}>
          <div>
            <h2 style={{ fontSize: 26, lineHeight: "32px", fontWeight: 600, color: "var(--hs-color-text-base)", margin: 0 }}>
              {editMode ? "Edit tag group" : "Create tag group"}
            </h2>
          </div>
          <IconButton
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
            aria-label="Close"
            variant="ghost"
            size="small"
            disabled={submitting}
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "28px 30px 24px" }}>
          <div data-annotate="figma-create-group-name">
            <Input
              label="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameBlurred(true)}
              placeholder=""
              error={showDuplicateError}
              errorText={showDuplicateError ? "A tag group with this name already exists." : undefined}
            />
            {figmaCommentUpdatesEnabled && (
              <FigmaUpdateNote style={{ marginTop: 4 }}>{FIGMA_UPDATE_COPY.createGroupName}</FigmaUpdateNote>
            )}
          </div>

          <Select
            label="Who can apply tags from this group"
            options={[
              { value: "everyone", label: "Full organization" },
              { value: "admin", label: "Admins only" },
            ]}
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
          />

          <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <p style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, color: "var(--hs-color-text-base)", margin: 0 }}>
                Required for publishing
              </p>
              <p style={{ fontSize: 14, lineHeight: "20px", color: "var(--hs-color-text-subtle)", marginTop: 6, margin: "6px 0 0" }}>
                Users will need to apply at least 1 tag from this group before publishing or scheduling a post
              </p>
            </div>
            <Switch
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              disabled={submitting}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", padding: "0 30px 28px", gap: 12 }}>
          {figmaCommentUpdatesEnabled && (
            <FigmaUpdateNote style={{ marginTop: 0 }}>
              {FIGMA_UPDATE_COPY.createGroupSubmit}
            </FigmaUpdateNote>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <div data-annotate="figma-create-group-submit">
              <Button
                variant="primary"
                onClick={() => void handleSubmit()}
                disabled={submitDisabled}
                trailingIcon={submitting ? <SubmitSpinner /> : undefined}
              >
                {submitting ? (editMode ? "Saving…" : "Creating…") : editMode ? "Save changes" : "Create groups"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
