import { Meta, StoryObj } from "@storybook/react";
import { TagInteractivePrototype } from "./TagInteractivePrototype";

const meta: Meta<typeof TagInteractivePrototype> = {
  title: "Flows/Tagging",
  component: TagInteractivePrototype,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "**Interactive prototype** (not a slideshow): Tags admin hub with real flows. Toggle **Annotation mode** for pins and highlights to the dock. Toggle **Figma comment updates** to show **inline white note cards** next to each area we changed from Fabiana’s comments (same treatment as the in-product disclaimer cards). Use **Simulate groups loading / load error** to preview those states. Switch to **Composer** with Owly hidden. [Figma — Tagging](https://www.figma.com/design/FWbrDllz3IolgLMzPlqvyX/Tagging?node-id=3990-40445).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TagInteractivePrototype>;

export const InteractivePrototype: Story = {
  name: "Interactive prototype + annotations",
  render: () => <TagInteractivePrototype />,
};

/**
 * Opens directly to the edge case explorer drawer so all 19 scenarios are visible without
 * hunting through the Prototype options menu. Click any card to apply it instantly.
 */
export const EdgeCasesExplorer: Story = {
  name: "Edge case explorer (all scenarios)",
  render: () => <TagInteractivePrototype initialEdgeDrawerOpen={true} />,
  parameters: {
    docs: {
      description: {
        story:
          "Opens with the **edge case explorer drawer pre-loaded** (19 scenarios across 8 categories). Click any scenario card to apply it. Use ← / → arrow keys to walk through scenarios; Escape clears.",
      },
    },
  },
};
