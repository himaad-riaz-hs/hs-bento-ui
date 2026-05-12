/**
 * Tag swatch values — mirror `src/tokens/index.css` (`--hs-palette-tag-*`).
 * Hues follow NES nested-table dot assets (mint / rose / cream / mist); Lavender uses Bento discovery badge.
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
  { value: TAG_SWATCH.blue, label: "Mint" },
  { value: TAG_SWATCH.green, label: "Rose" },
  { value: TAG_SWATCH.purple, label: "Cream" },
  { value: TAG_SWATCH.yellow, label: "Mist" },
  { value: TAG_SWATCH.pink, label: "Lavender" },
] as const;

export const DEFAULT_TAG_COLOR = TAG_SWATCH.blue;
