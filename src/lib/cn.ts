import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * HS-Bento uses custom `text-hs-*` **font-size** utilities from `tailwind.config.ts`.
 * Default tailwind-merge treats unknown `text-*` classes as **text-color**, so e.g.
 * `text-hs-base-small` would replace `text-hs-comp-button-filled-text` on the same element.
 * @see https://github.com/dcastil/tailwind-merge/blob/main/docs/recipes.md#custom-font-size-utilities
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hs-display-1",
            "hs-display-2",
            "hs-display-3",
            "hs-base-small",
            "hs-base-medium",
            "hs-strong-medium",
            "hs-button-small",
            "hs-button-medium",
            "hs-link-small",
            "hs-link-medium",
            "hs-label-medium",
            "hs-others-label",
            "hs-timestamp",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
