import { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const options = [
  { value: "opt1", label: "Option 1" },
  { value: "opt2", label: "Option 2" },
  { value: "opt3", label: "Option 3" },
  { value: "opt4", label: "Option 4 (disabled)", disabled: true },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: { label: "Choose option", options, placeholder: "Select..." },
};

export const WithError: Story = {
  args: { label: "Required field", options, placeholder: "Select...", errorText: "This field is required." },
};

export const Small: Story = {
  args: { label: "Small select", options, size: "small", placeholder: "Pick one" },
};

export const WithHelperText: Story = {
  args: {
    label: "Topic",
    options,
    placeholder: "Select…",
    helperText: "Choose the category that best fits your post.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    options,
    placeholder: "Cannot change",
    defaultValue: "opt1",
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Select label="Default" options={options} placeholder="Select…" />
      <Select label="With helper" options={options} placeholder="Select…" helperText="Optional helper text." />
      <Select label="Error" options={options} placeholder="Select…" errorText="Please choose an option." />
      <Select label="Small" options={options} size="small" placeholder="Select…" />
      <Select label="Disabled" options={options} placeholder="Select…" disabled defaultValue="opt2" />
    </div>
  ),
};
