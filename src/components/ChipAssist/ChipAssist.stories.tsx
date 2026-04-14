import { Meta, StoryObj } from "@storybook/react";
import { ChipAssist } from "./ChipAssist";

const SparkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="currentColor" />
  </svg>
);

const meta: Meta<typeof ChipAssist> = {
  title: "Components/ChipAssist",
  component: ChipAssist,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChipAssist>;

export const Default: Story = {
  args: { children: "Create event" },
};

export const WithLeadingIcon: Story = {
  args: { children: "Suggest with AI", leadingIcon: <SparkIcon /> },
};

export const Disabled: Story = {
  args: { children: "Unavailable", disabled: true },
};

export const Multiple: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <ChipAssist>Set a timer</ChipAssist>
      <ChipAssist>Add to calendar</ChipAssist>
      <ChipAssist>Share location</ChipAssist>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <ChipAssist>Default</ChipAssist>
      <ChipAssist leadingIcon={<SparkIcon />}>With icon</ChipAssist>
      <ChipAssist disabled>Disabled</ChipAssist>
    </div>
  ),
};
