import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import type { TagGroup } from "./types";

export { DEFAULT_TAG_COLOR } from "./tag-palette";

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
  /** When true, tag name field is omitted (e.g. create-tags modal uses a comma-separated textarea). */
  hideName?: boolean;
  disabled?: boolean;
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
  hideName = false,
  disabled = false,
}: TagEditorFieldsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {!hideName && (
        <Input
          label="Tag name"
          value={values.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder=""
          disabled={disabled}
        />
      )}

      {!hideGroup && (
        <Select
          label="Group"
          options={groups.map((g) => ({
            value: g.id,
            label: g.id === "ungrouped" ? "Ungrouped" : g.name,
          }))}
          value={values.groupId}
          onChange={(e) => onChange({ groupId: e.target.value })}
          disabled={disabled}
        />
      )}

    </div>
  );
}
