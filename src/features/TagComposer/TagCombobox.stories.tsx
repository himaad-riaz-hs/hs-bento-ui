import { useState, useCallback } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { TagCombobox } from "./TagCombobox";
import { composerGroups as initialGroups, ungroupedTags as initialUngrouped } from "./sample-data";
import { ComposerTag, ComposerTagGroup } from "./types";

/**
 * Isolated **TagCombobox** — same component as in Post Composer, without the full page chrome.
 */
function TagComboboxPlayground() {
  const [groups, setGroups] = useState<ComposerTagGroup[]>(() =>
    initialGroups.map((g) => ({ ...g, tags: g.tags.map((t) => ({ ...t })) }))
  );
  const [ungrouped, setUngrouped] = useState<ComposerTag[]>(() => initialUngrouped.map((t) => ({ ...t })));
  const [selected, setSelected] = useState<ComposerTag[]>([]);

  const onSelect = useCallback((tag: ComposerTag) => {
    setSelected((s) => (s.some((x) => x.id === tag.id) ? s : [...s, tag]));
  }, []);

  const onDeselect = useCallback((tagId: string) => {
    setSelected((s) => s.filter((t) => t.id !== tagId));
  }, []);

  const onClearAll = useCallback(() => setSelected([]), []);

  const toggleFavorite = useCallback((id: string, favorited: boolean) => {
    const mapTag = (t: ComposerTag) => (t.id === id ? { ...t, favorited } : t);
    setGroups((gs) => gs.map((g) => ({ ...g, tags: g.tags.map(mapTag) })));
    setUngrouped((us) => us.map(mapTag));
    setSelected((s) => s.map(mapTag));
  }, []);

  const onFavorite = useCallback((id: string) => toggleFavorite(id, true), [toggleFavorite]);
  const onUnfavorite = useCallback((id: string) => toggleFavorite(id, false), [toggleFavorite]);

  return (
    <div
      style={{
        maxWidth: 720,
        padding: 24,
        borderRadius: 12,
        background: "var(--hs-color-fill-app)",
        border: "1px solid var(--hs-color-border-subtle)",
        boxShadow: "var(--hs-shadow-raised)",
      }}
    >
      <TagCombobox
        label="Tag"
        required
        groups={groups}
        ungrouped={ungrouped}
        selected={selected}
        onSelect={onSelect}
        onDeselect={onDeselect}
        onClearAll={onClearAll}
        onFavorite={onFavorite}
        onUnfavorite={onUnfavorite}
        onCreateTag={(name) => {
          const t: ComposerTag = { id: `new-${Date.now()}`, name, groupId: null };
          setUngrouped((u) => [...u, t]);
          onSelect(t);
        }}
      />
    </div>
  );
}

/** Empty catalog: no groups and no ungrouped tags (create-only / first-run). */
function TagComboboxEmptyCatalog() {
  const [groups] = useState<ComposerTagGroup[]>([]);
  const [ungrouped, setUngrouped] = useState<ComposerTag[]>([]);
  const [selected, setSelected] = useState<ComposerTag[]>([]);

  const onSelect = useCallback((tag: ComposerTag) => {
    setSelected((s) => (s.some((x) => x.id === tag.id) ? s : [...s, tag]));
  }, []);
  const onDeselect = useCallback((tagId: string) => {
    setSelected((s) => s.filter((t) => t.id !== tagId));
  }, []);
  const onClearAll = useCallback(() => setSelected([]), []);

  const noopFav = useCallback((_id: string) => {}, []);

  return (
    <div
      style={{
        maxWidth: 720,
        padding: 24,
        borderRadius: 12,
        background: "var(--hs-color-fill-app)",
        border: "1px solid var(--hs-color-border-subtle)",
        boxShadow: "var(--hs-shadow-raised)",
      }}
    >
      <TagCombobox
        label="Tag"
        groups={groups}
        ungrouped={ungrouped}
        selected={selected}
        onSelect={onSelect}
        onDeselect={onDeselect}
        onClearAll={onClearAll}
        onFavorite={noopFav}
        onUnfavorite={noopFav}
        onCreateTag={(name) => {
          const t: ComposerTag = { id: `new-${Date.now()}`, name, groupId: null };
          setUngrouped((u) => [...u, t]);
          onSelect(t);
        }}
      />
    </div>
  );
}

const meta: Meta<typeof TagCombobox> = {
  title: "Features/Tag Combobox",
  component: TagCombobox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: { default: "bento-neutral" },
    docs: {
      description: {
        component:
          "Bento **tag field** (multi-select tree). Styling comes from `src/tokens/index.css`: focus border `--hs-color-border-focus`, row selection `--hs-comp-combobox-list-row-selected-bg`, checks `--hs-comp-combobox-checkbox-selected-fill`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TagCombobox>;

export const Default: Story = {
  name: "Tag combobox (isolated)",
  render: () => <TagComboboxPlayground />,
};

export const EmptyCatalog: Story = {
  name: "Empty catalog (no tags)",
  render: () => <TagComboboxEmptyCatalog />,
};
