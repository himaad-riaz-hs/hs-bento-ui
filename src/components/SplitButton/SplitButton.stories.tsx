import { Meta, StoryObj } from "@storybook/react";
import { SplitButton } from "./SplitButton";

const saveItems = [
  { value: "save-draft", label: "Save as draft" },
  { value: "save-publish", label: "Save and publish" },
];

const meta: Meta<typeof SplitButton> = {
  title: "Components/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["filled", "outlined", "tonal"] },
    size: { control: "select", options: ["small", "medium"] },
  },
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

export const Default: Story = {
  args: {
    label: "Save",
    onAction: () => {},
    items: saveItems,
  },
};

export const Outlined: Story = {
  args: {
    label: "Export",
    variant: "outlined",
    onAction: () => {},
    items: [
      { value: "csv", label: "Export as CSV" },
      { value: "pdf", label: "Export as PDF" },
      { value: "xlsx", label: "Export as XLSX" },
    ],
  },
};

export const Tonal: Story = {
  args: {
    label: "Share",
    variant: "tonal",
    onAction: () => {},
    items: [
      { value: "copy", label: "Copy link" },
      { value: "email", label: "Email share" },
    ],
  },
};

export const Small: Story = {
  args: {
    label: "Save",
    size: "small",
    onAction: () => {},
    items: saveItems,
  },
};

export const Disabled: Story = {
  args: {
    label: "Save",
    disabled: true,
    onAction: () => {},
    items: saveItems,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <SplitButton label="Filled" variant="filled" onAction={() => {}} items={saveItems} />
      <SplitButton label="Outlined" variant="outlined" onAction={() => {}} items={saveItems} />
      <SplitButton label="Tonal" variant="tonal" onAction={() => {}} items={saveItems} />
    </div>
  ),
};
