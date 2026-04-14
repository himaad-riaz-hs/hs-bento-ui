import { Meta, StoryObj } from "@storybook/react";
import { ButtonInfo } from "./ButtonInfo";

const meta: Meta<typeof ButtonInfo> = {
  title: "Components/ButtonInfo",
  component: ButtonInfo,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ButtonInfo>;

export const Default: Story = {
  args: {
    title: "Engagement rate",
    content: "The percentage of people who saw your content and engaged with it through likes, comments, shares, or clicks.",
  },
};

export const ContentOnly: Story = {
  args: {
    content: "Short tooltip without a title row.",
  },
};

export const LongContent: Story = {
  args: {
    title: "Metric details",
    content:
      "This metric aggregates engagement across posts, stories, and reels. It excludes bot traffic and updates after a short processing delay.",
  },
};
