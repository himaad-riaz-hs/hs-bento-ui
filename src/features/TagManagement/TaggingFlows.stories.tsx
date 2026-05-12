import { Meta, StoryObj } from "@storybook/react";
import { TaggingFlowsShowcase } from "./TaggingFlowsShowcase";

const meta: Meta<typeof TaggingFlowsShowcase> = {
  title: "Flows/Tagging",
  component: TaggingFlowsShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Single scrollable page with **every tagging-related flow** (hub presets, settings shell, composer, composer↔admin). Matches the density and structure of [Tagging — Section 3990:40445](https://www.figma.com/design/FWbrDllz3IolgLMzPlqvyX/Tagging?node-id=3990-40445).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TaggingFlowsShowcase>;

export const AllFlows: Story = {
  name: "All flows (scroll)",
  render: () => <TaggingFlowsShowcase />,
};
