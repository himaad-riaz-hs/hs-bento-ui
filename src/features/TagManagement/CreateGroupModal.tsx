import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Switch } from "../../components/Switch";
import { IconButton } from "../../components/IconButton";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    visibility: string;
    permissions: string;
    required: boolean;
  }) => void;
  editMode?: boolean;
  initialData?: {
    name: string;
    visibility: string;
    permissions: string;
    required: boolean;
  };
}

export function CreateGroupModal({
  open,
  onClose,
  onSave,
  editMode = false,
  initialData,
}: CreateGroupModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [visibility, setVisibility] = useState(initialData?.visibility || "everyone");
  const [permissions, setPermissions] = useState(initialData?.permissions || "admin");
  const [required, setRequired] = useState(initialData?.required || false);

  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setVisibility(initialData?.visibility || "everyone");
      setPermissions(initialData?.permissions || "admin");
      setRequired(initialData?.required || false);
    }
  }, [open, initialData]);

  if (!open) return null;

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
          width: 571,
          borderRadius: "var(--hs-comp-input-border-radii)",
          background: "var(--hs-color-fill-app)",
          boxShadow: "var(--hs-comp-menu-shadow)",
          border: "1px solid var(--hs-color-border-subtle)",
          fontFamily: HS_FONT_FAMILY,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", padding: "28px 30px 0" }}>
          <div>
            <h2 style={{ fontSize: 26, lineHeight: "32px", fontWeight: 600, color: "var(--hs-color-text-base)", margin: 0 }}>
              {editMode ? "Edit group" : "Create group"}
            </h2>
            <p style={{ fontSize: 14, lineHeight: "20px", fontWeight: 400, color: "var(--hs-color-text-subtle)", margin: "8px 0 0" }}>
              {editMode
                ? "Update the group settings below."
                : "Groups help you organize tags by category. Set visibility and permissions for each group."}
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

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "28px 30px 24px" }}>
          <Input
            label="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=""
          />

          <Select
            label="Who can see tags in this group"
            options={[
              { value: "everyone", label: "Visible to everyone" },
              { value: "admins", label: "Admins only" },
            ]}
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          />

          <Select
            label="Who can add tags to this group"
            options={[
              { value: "admin", label: "Admin can add tags" },
              { value: "everyone", label: "Everyone can add tags" },
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
                Users will need to apply at least one tag from this group before publishing or scheduling a post
              </p>
            </div>
            <Switch
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "0 30px 28px" }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => { onSave({ name, visibility, permissions, required }); onClose(); }}
            disabled={!name.trim()}
          >
            {editMode ? "Save changes" : "Create group"}
          </Button>
        </div>
      </div>
    </>
  );
}
