import { Meta, StoryObj } from "@storybook/react";
import { PersianJourney } from "../features/PersianConcept/PersianJourney";

/**
 * Sidebar shortcut: same screen as **Flows → Persian**.
 */
const meta: Meta<typeof PersianJourney> = {
  title: "Demos/Persian",
  component: PersianJourney,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "bento-neutral" },
  },
};

export default meta;
type Story = StoryObj<typeof PersianJourney>;

export const OpenHere: Story = {
  name: "Open here (operations hub)",
  args: {},
};
