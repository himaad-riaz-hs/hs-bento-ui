/**
 * Tag swatch values — mirror `src/tokens/index.css` (`--hs-palette-tag-*`).
 * Stored as CSS `var(...)` so surfaces resolve against the active theme.
 */
export const TAG_SWATCH = {
  blue: "var(--hs-palette-tag-blue)",
  green: "var(--hs-palette-tag-green)",
  purple: "var(--hs-palette-tag-purple)",
  yellow: "var(--hs-palette-tag-yellow)",
  pink: "var(--hs-palette-tag-pink)",
} as const;

/** Archived / neutral dot (aligns with `--hs-color-border-base`) */
export const TAG_SWATCH_NEUTRAL = "var(--hs-color-border-base)";

export const TAG_COLOR_OPTIONS = [
  { value: TAG_SWATCH.blue, label: "Blue" },
  { value: TAG_SWATCH.green, label: "Green" },
  { value: TAG_SWATCH.purple, label: "Purple" },
  { value: TAG_SWATCH.yellow, label: "Yellow" },
  { value: TAG_SWATCH.pink, label: "Pink" },
] as const;

export const DEFAULT_TAG_COLOR = TAG_SWATCH.blue;
