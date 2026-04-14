import { Meta, StoryObj } from "@storybook/react";
import { Planner } from "./Planner";

const meta: Meta<typeof Planner> = {
  title: "Flows/New features/Content Planner",
  component: Planner,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Demonstration page for a **content planner**: navigation, search, filters, schedule list, campaign tree, and sidebar settings. Major sections use a **24px gap** so spacing stays consistent with HS-Bento. Use this story when presenting planner concepts to design or product.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Planner>;

export const Example: Story = {
  name: "Planner example (all blocks)",
  render: () => <Planner />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive showcase: try week/month/agenda, chip filters, scheduled row checkboxes, campaign tree, assignees, topic combobox, and the formatting action bar.",
      },
    },
  },
};
