/**
 * Composable class fragments for HS-Bento primitives.
 * Tokens: `src/tokens/index.css` · pair with {@link ./cn.cn}.
 */
export const hsPrimitive = {
  /** Form field label (Input, Select, Combobox) — label typeface + hs-label-medium + input label color */
  formLabel:
    "font-[family-name:var(--hs-typeface-label-font-family)] text-hs-label-medium text-[color:var(--hs-comp-input-label)]",
  /** Single-line input / textarea value */
  fieldText:
    "font-[family-name:var(--hs-typeface-base-font-family)] text-hs-base-medium text-[color:var(--hs-comp-input-text)]",
  /** Checkbox, radio, switch captions */
  controlLabel:
    "font-[family-name:var(--hs-typeface-base-font-family)] text-hs-base-medium text-[color:var(--hs-color-text-base)]",
  /** Menu / split dropdown rows */
  menuItem:
    "font-[family-name:var(--hs-typeface-base-font-family)] text-hs-base-medium text-[color:var(--hs-color-text-base)]",
  /** Destructive menu row */
  menuItemDestructive:
    "font-[family-name:var(--hs-typeface-base-font-family)] text-hs-base-medium text-[color:var(--hs-color-text-critical)]",
  /** Info popover title */
  popoverTitle:
    "font-[family-name:var(--hs-typeface-strong-font-family)] text-hs-strong-medium text-[color:var(--hs-color-text-base)]",
  /** Info popover body */
  popoverBody:
    "font-[family-name:var(--hs-typeface-base-font-family)] text-hs-base-small text-[color:var(--hs-color-text-subtle)]",
} as const;
