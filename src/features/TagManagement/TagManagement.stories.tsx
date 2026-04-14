import { Meta, StoryObj } from "@storybook/react";
import { TagManagement } from "./TagManagement";

const meta: Meta<typeof TagManagement> = {
  title: "Flows/Tag Admin Settings",
  component: TagManagement,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TagManagement>;

export const FullInteractiveFlow: Story = {
  name: "Full Interactive Flow",
  render: () => <TagManagement />,
  parameters: {
    docs: {
      description: {
        story: "The complete Tag Admin Settings page. Click 'Create group' or 'Create tag' to open the modals. Expand group cards to see tags. Click edit on groups/tags to open the edit modals. Everything is fully interactive.",
      },
    },
  },
};
