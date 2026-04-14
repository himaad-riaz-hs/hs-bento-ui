import { Meta, StoryObj } from "@storybook/react";
import { InlineDropdown } from "./InlineDropdown";

const sortOptions = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
  { value: "size", label: "Size" },
];

const meta: Meta<typeof InlineDropdown> = {
  title: "Components/InlineDropdown",
  component: InlineDropdown,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium"] },
  },
};

export default meta;
type Story = StoryObj<typeof InlineDropdown>;

export const Default: Story = {
  args: {
    label: "Sort by",
    options: sortOptions,
  },
};

export const Small: Story = {
  args: {
    label: "Sort by",
    options: sortOptions,
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    label: "Sort by",
    options: sortOptions,
    size: "medium",
  },
};

export const WithoutLabel: Story = {
  args: {
    options: sortOptions,
    defaultValue: "name",
  },
};

export const Disabled: Story = {
  args: {
    label: "Sort by",
    options: sortOptions,
    disabled: true,
    defaultValue: "date",
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
      <InlineDropdown label="Small" options={sortOptions} size="small" defaultValue="date" />
      <InlineDropdown label="Medium" options={sortOptions} size="medium" defaultValue="name" />
      <InlineDropdown options={sortOptions} defaultValue="size" />
      <InlineDropdown label="Disabled" options={sortOptions} disabled defaultValue="date" />
    </div>
  ),
};
