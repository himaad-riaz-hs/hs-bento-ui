import { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "brand", "positive", "critical", "warning", "info", "discovery"],
    },
    size: { control: "select", options: ["small", "medium"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: "Label", variant: "default" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag variant="default">Default</Tag>
      <Tag variant="brand">Brand</Tag>
      <Tag variant="positive">Positive</Tag>
      <Tag variant="critical">Critical</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="info">Info</Tag>
      <Tag variant="discovery">Discovery</Tag>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Tag size="small" variant="brand">Small</Tag>
        <Tag size="small" variant="info">Small</Tag>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Tag size="medium" variant="brand">Medium</Tag>
        <Tag size="medium" variant="info">Medium</Tag>
      </div>
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Tag variant="brand" onDismiss={() => {}}>Removable</Tag>
      <Tag variant="info" onDismiss={() => {}}>Filter</Tag>
    </div>
  ),
};
