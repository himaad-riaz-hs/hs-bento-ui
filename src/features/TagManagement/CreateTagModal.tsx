import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { useFigmaCommentUpdatesEnabled } from "./FigmaCommentUpdatesContext";
import { FigmaUpdateNote } from "./FigmaUpdateNote";
import { FIGMA_UPDATE_COPY } from "./figma-comment-update-copy";
import { TagEditorFields, type TagEditorValues, DEFAULT_TAG_COLOR } from "./TagEditorFields";
import type { TagGroup } from "./types";

function SubmitSpinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ animation: "hsSpinTag 0.8s linear infinite" }}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="42" strokeDashoffset="12" opacity={0.35} />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="14 50" />
    </svg>
  );
}

function parseTagNames(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
}

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { names: string[]; groupId: string; color: string }) => void | Promise<void>;
  groups: TagGroup[];
  editMode?: boolean;
  initialData?: { name: string; groupId: string; color: string };
  preselectedGroupId?: string;
  submitHoldMs?: number;
}

export function CreateTagModal({
  open,
  onClose,
  onSave,
  groups,
  editMode = false,
  initialData,
  preselectedGroupId,
  submitHoldMs = 0,
}: CreateTagModalProps) {
  const figmaCommentUpdatesEnabled = useFigmaCommentUpdatesEnabled();
  const [values, setValues] = useState<TagEditorValues>({
    name: "",
    groupId: "ungrouped",
    color: DEFAULT_TAG_COLOR,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues({
        name: initialData?.name || "",
        groupId: initialData?.groupId || preselectedGroupId || "ungrouped",
        color: initialData?.color || DEFAULT_TAG_COLOR,
      });
      setSubmitting(false);
    }
  }, [open, initialData, preselectedGroupId]);

  if (!open) return null;

  const patch = (next: Partial<TagEditorValues>) => setValues((v) => ({ ...v, ...next }));

  const parsedNames = editMode ? [values.name.trim()].filter(Boolean) : parseTagNames(values.name);
  const tagCount = parsedNames.length;
  const canSubmit = tagCount > 0 && !submitting;
  const submitDisabled = !canSubmit;

  const handleSubmit = async () => {
    if (submitDisabled) return;
    setSubmitting(true);
    try {
      if (submitHoldMs > 0) {
        await new Promise((r) => setTimeout(r, submitHoldMs));
      }
      await Promise.resolve(
        onSave({ names: parsedNames, groupId: values.groupId, color: values.color })
      );
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`@keyframes hsSpinTag { to { transform: rotate(360deg); } }`}</style>
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
          width: 536,
          borderRadius: "var(--hs-comp-input-border-radii)",
          background: "var(--hs-color-fill-base)",
          boxShadow: "var(--hs-comp-menu-shadow)",
          border: "1px solid var(--hs-color-border-subtle)",
          fontFamily: HS_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", padding: "28px 30px 0" }}>
          <div>
            <h2 style={{ fontSize: 26, lineHeight: "32px", fontWeight: 600, color: "var(--hs-color-text-base)", margin: 0 }}>
              {editMode ? "Edit tag" : "Create tags"}
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

        <div style={{ padding: "28px 30px 24px" }}>
          {editMode ? (
            <TagEditorFields groups={groups} values={values} onChange={patch} disabled={submitting} />
          ) : (
            <>
              <div data-annotate="call-multi-create-input">
                <label
                  htmlFor="create-tags-input"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--hs-color-text-base)",
                    marginBottom: 8,
                  }}
                >
                  Tags
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Separate multiple tags with commas">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
                    <path d="M8 7v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                    <circle cx="8" cy="5" r="0.8" fill="currentColor" opacity="0.6" />
                  </svg>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="create-tags-input"
                    type="text"
                    value={values.name}
                    onChange={(e) => patch({ name: e.target.value })}
                    placeholder="Tag 1, Tag2, Tag3"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      height: 48,
                      paddingLeft: 14,
                      paddingRight: values.name ? 44 : 14,
                      borderRadius: 8,
                      border: "1px solid var(--hs-color-border-subtle)",
                      fontFamily: HS_FONT_FAMILY,
                      fontSize: 16,
                      lineHeight: "24px",
                      outline: "none",
                      backgroundColor: "var(--hs-comp-input-bg)",
                    }}
                  />
                  {values.name && (
                    <button
                      type="button"
                      onClick={() => patch({ name: "" })}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--hs-color-text-muted)",
                        display: "flex",
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.55" />
                        <path d="M7 7l6 6M13 7l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 28 }}>
                <TagEditorFields groups={groups} values={values} onChange={patch} hideName disabled={submitting} />
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12, padding: "0 30px 28px" }}>
          {figmaCommentUpdatesEnabled && (
            <FigmaUpdateNote style={{ marginTop: 0 }}>{FIGMA_UPDATE_COPY.createTagSubmit}</FigmaUpdateNote>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <div data-annotate="figma-create-tag-submit">
              <Button
                variant="primary"
                onClick={() => void handleSubmit()}
                disabled={submitDisabled}
                trailingIcon={submitting ? <SubmitSpinner /> : undefined}
              >
                {submitting
                  ? editMode
                    ? "Saving…"
                    : "Creating…"
                  : editMode
                    ? "Save changes"
                    : tagCount > 1
                      ? `Create ${tagCount} tags`
                      : "Create tag"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
