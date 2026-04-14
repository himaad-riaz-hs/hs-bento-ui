import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { TagEditorFields, type TagEditorValues, DEFAULT_TAG_COLOR } from "./TagEditorFields";
import type { TagGroup } from "./types";

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; groupId: string; color: string }) => void;
  groups: TagGroup[];
  editMode?: boolean;
  initialData?: { name: string; groupId: string; color: string };
  preselectedGroupId?: string;
}

export function CreateTagModal({
  open,
  onClose,
  onSave,
  groups,
  editMode = false,
  initialData,
  preselectedGroupId,
}: CreateTagModalProps) {
  const [values, setValues] = useState<TagEditorValues>({
    name: "",
    groupId: "ungrouped",
    color: DEFAULT_TAG_COLOR,
  });

  useEffect(() => {
    if (open) {
      setValues({
        name: initialData?.name || "",
        groupId: initialData?.groupId || preselectedGroupId || "ungrouped",
        color: initialData?.color || DEFAULT_TAG_COLOR,
      });
    }
  }, [open, initialData, preselectedGroupId]);

  if (!open) return null;

  const patch = (next: Partial<TagEditorValues>) => setValues((v) => ({ ...v, ...next }));

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
          width: 536,
          borderRadius: "var(--hs-comp-input-border-radii)",
          background: "var(--hs-color-fill-app)",
          boxShadow: "var(--hs-comp-menu-shadow)",
          border: "1px solid var(--hs-color-border-subtle)",
          fontFamily: HS_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", padding: "28px 30px 0" }}>
          <div>
            <h2 style={{ fontSize: 26, lineHeight: "32px", fontWeight: 600, color: "var(--hs-color-text-base)", margin: 0 }}>
              {editMode ? "Edit tag" : "Create tag"}
            </h2>
            <p style={{ fontSize: 14, lineHeight: "20px", fontWeight: 400, color: "var(--hs-color-text-subtle)", margin: "8px 0 0" }}>
              {editMode
                ? "Update the tag details below."
                : "Tags help organize and categorize your content across Composer, Plan, and Analytics."}
            </p>
          </div>
          <IconButton
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
            aria-label="Close"
            variant="ghost"
            size="small"
            onClick={onClose}
          />
        </div>

        <div style={{ padding: "28px 30px 24px" }}>
          <TagEditorFields groups={groups} values={values} onChange={patch} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "0 30px 28px" }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onSave({ name: values.name, groupId: values.groupId, color: values.color });
              onClose();
            }}
            disabled={!values.name.trim()}
          >
            {editMode ? "Save changes" : "Create tag"}
          </Button>
        </div>
      </div>
    </>
  );
}
