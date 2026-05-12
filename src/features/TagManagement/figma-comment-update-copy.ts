/** Short inline notes for “Figma comment updates” mode (Fabiana / Tagging file). */
export const FIGMA_UPDATE_COPY = {
  createGroupName:
    "Figma update: duplicate group names show both an error message and a red input border. Submit stays disabled until the name is unique.",
  createGroupSubmit:
    "Figma update: while the group is saving, the primary button shows a spinner and “Creating…” / “Saving…” so slow networks feel responsive.",
  createTagSubmit:
    "Figma update: Create tag uses the same in-flight button state as Create group when saves take a moment.",
  groupHeaderMeta:
    "Figma update: this line always shows the full tag count for the group. Search filters the table below, not the total in the header.",
  groupVisibilityDisclaimer:
    "Figma update: when a group isn’t visible to everyone, the header line shows “Visible to workspace admins only” so it’s not mistaken for “Visible to everyone.”",
  groupsEmptyCompact:
    "Figma update: hub empty state is tighter (less vertical space, shorter copy, no large hero illustration) so it reads as a card, not a full-page empty state.",
  groupsSearchEmptyCompact:
    "Figma update: no-results in the hub is compact—no big search illustration—so it fits the card column.",
  importExport:
    "Figma update: Import / export is an explicit header affordance for now (toast placeholder) until product wires CSV/API flows.",
  groupsLoadError:
    "Figma update: failed loads get this error panel + retry instead of looking like “no groups yet.” Use the prototype toggle to preview.",
  groupsLoading:
    "Figma update: skeleton placeholders cover the list while group cards resolve. Use the prototype toggle to preview.",
  groupsScrollNote:
    "Figma update: footnote documents scroll-in-place for large libraries and how paging could follow for 100+ cards.",
  archiveGroupDialog:
    "Figma update: archive copy clarifies existing posts keep their tags; pickers and Planner/Analytics filters hide the group until restore.",
  archivedInfoBanner:
    "Figma update: this info banner is dismissible and only once per browser session after you close it—not after every archive or restore.",
  deleteArchivedGroupDialog:
    "Figma update: permanent delete explains archive vs delete: historical reporting may still reference old labels; new pickers/filters won’t offer these tags.",
  deleteArchivedTagDialog:
    "Figma update: same reporting vs picker nuance as deleting an archived group, for a single archived tag.",
} as const;

export type FigmaUpdateCopyKey = keyof typeof FIGMA_UPDATE_COPY;

export function figmaNoteForDescriptionAnnotate(
  annotate: string | undefined
): keyof typeof FIGMA_UPDATE_COPY | null {
  switch (annotate) {
    case "figma-archive-group-dialog":
      return "archiveGroupDialog";
    case "figma-delete-archived-group-dialog":
      return "deleteArchivedGroupDialog";
    case "figma-delete-archived-tag-dialog":
      return "deleteArchivedTagDialog";
    default:
      return null;
  }
}
