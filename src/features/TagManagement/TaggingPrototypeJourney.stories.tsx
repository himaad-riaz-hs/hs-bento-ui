import { Meta, StoryObj } from "@storybook/react";
import { TaggingPrototypeJourney } from "./TaggingPrototypeJourney";

const meta: Meta<typeof TaggingPrototypeJourney> = {
  title: "Flows/Tagging",
  component: TaggingPrototypeJourney,
  args: {
    autoPlay: true,
    showCaptions: false,
  },
  argTypes: {
    autoPlay: { description: "Timed advance (Figma present mode). Space pauses when focus is not in a field." },
    showCaptions: { description: "Designer caption strip under the chrome (off by default for Figma parity)." },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "**Full-screen linear prototype** — empty account through composer and tag admin. **Auto-advances** like Figma present mode (~7–10s per step); **Space** pauses/resumes when you are not typing in an input. Slim bar: back, pause, **Play again** on the last slide. Optional `showCaptions` for designer notes. [Figma — Tagging](https://www.figma.com/design/FWbrDllz3IolgLMzPlqvyX/Tagging?node-id=3990-40445).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TaggingPrototypeJourney>;

export const PrototypeJourney: Story = {
  name: "Prototype journey (fullscreen)",
  render: (args) => <TaggingPrototypeJourney {...args} />,
};

export const PrototypeJourneyManual: Story = {
  name: "Prototype journey (manual steps)",
  args: { autoPlay: false },
  render: (args) => <TaggingPrototypeJourney {...args} />,
};
