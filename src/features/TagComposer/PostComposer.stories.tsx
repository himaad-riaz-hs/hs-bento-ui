import { Meta, StoryObj } from "@storybook/react";
import { PostComposer } from "./PostComposer";

/**
 * Full **Create a post** shell — same layout and tokens as the product (nav, header, tag combobox, preview).
 * For the smaller **Composer ↔ Tag Admin** demo only, see **Flows/Composer Tag Admin**.
 */
const meta: Meta<typeof PostComposer> = {
  title: "Flows/Post Composer",
  component: PostComposer,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "bento-neutral" },
    docs: {
      description: {
        component:
          "Full composer page including **TagCombobox** (multi-select tree, focus ring `--hs-color-border-focus`, Secondary Blue checks). Uses `src/tokens/index.css` via Storybook preview — should match Figma Tagging frames.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PostComposer>;

export const CreateAPost: Story = {
  name: "Create a post (full layout)",
  render: () => <PostComposer />,
};
