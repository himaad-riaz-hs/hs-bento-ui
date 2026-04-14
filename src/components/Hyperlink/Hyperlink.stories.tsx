import { Meta, StoryObj } from "@storybook/react";
import { Hyperlink } from "./Hyperlink";

const meta: Meta<typeof Hyperlink> = {
  title: "Components/Hyperlink",
  component: Hyperlink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Hyperlink>;

export const Default: Story = {
  args: { children: "Learn more", href: "#" },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <Hyperlink size="small" href="#small">Small link</Hyperlink>
      <Hyperlink size="medium" href="#medium">Medium link</Hyperlink>
    </div>
  ),
};
