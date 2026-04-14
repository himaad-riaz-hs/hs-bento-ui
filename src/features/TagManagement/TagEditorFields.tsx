import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { InlineDropdown } from "../../components/InlineDropdown";
import type { TagGroup } from "./types";
import { TAG_COLOR_OPTIONS } from "./tag-palette";

export { TAG_COLOR_OPTIONS, DEFAULT_TAG_COLOR } from "./tag-palette";

export interface TagEditorValues {
  name: string;
  groupId: string;
  color: string;
}

export interface TagEditorFieldsProps {
  groups: TagGroup[];
  values: TagEditorValues;
  onChange: (next: Partial<TagEditorValues>) => void;
  /** When true, group selector is hidden (parent fixes group context). */
  hideGroup?: boolean;
}

/**
 * Shared tag create/edit fields — use inside a Modal, Drawer, or panel so engineering
 * doesn’t duplicate form logic between surfaces.
 */
export function TagEditorFields({
  groups,
  values,
  onChange,
  hideGroup = false,
}: TagEditorFieldsProps) {
  const selectedColor =
    TAG_COLOR_OPTIONS.find((c) => c.value === values.color) || TAG_COLOR_OPTIONS[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <Input
        label="Tag name"
        value={values.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder=""
      />

      {!hideGroup && (
        <Select
          label="Tag group"
          options={groups.map((g) => ({
            value: g.id,
            label: g.id === "ungrouped" ? "Ungrouped" : g.name,
          }))}
          value={values.groupId}
          onChange={(e) => onChange({ groupId: e.target.value })}
        />
      )}

      <div>
        <p
          style={{
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 600,
            color: "var(--hs-color-text-base)",
            margin: "0 0 12px",
          }}
        >
          Tag colour
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: selectedColor.value,
              flexShrink: 0,
            }}
          />
          <InlineDropdown
            options={TAG_COLOR_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
            value={values.color}
            onChange={(e) => onChange({ color: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
