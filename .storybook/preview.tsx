import React from "react";
import "../src/tokens/index.css";

/** Matches `--hs-comp-badge-neutral-bg` — default app chrome behind composer/planner */
const BG_NEUTRAL = "#f4f5f6";
/** Matches `--hs-color-fill-app` */
const BG_APP = "#fdfdfd";

/** @type {import('@storybook/react').Preview} */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    /** `centered` clips dropdowns/overlays; `padded` matches Bento canvas. Fullscreen flows set `layout: 'fullscreen'`. */
    layout: "padded",
    backgrounds: {
      default: "bento-neutral",
      values: [
        { name: "bento-neutral", value: BG_NEUTRAL },
        { name: "bento-app", value: BG_APP },
        { name: "transparent", value: "transparent" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      if (context.parameters.layout === "fullscreen") {
        return <Story />;
      }
      return (
        <div
          style={{
            width: "100%",
            minHeight: "min(100vh, 960px)",
            boxSizing: "border-box",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
