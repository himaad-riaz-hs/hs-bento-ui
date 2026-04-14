import { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "./Combobox";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
];

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: { default: "bento-app" },
  },
  /** Wide enough for listbox; same tokens as app (`--hs-focus-ring`, `rounded-hs-input`). */
  decorators: [(Story) => <div style={{ width: "min(100%, 400px)" }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: { label: "Fruit", options: fruits, placeholder: "Type to search..." },
};

export const WithHelperText: Story = {
  args: {
    label: "Fruit",
    options: fruits,
    placeholder: "Type to search…",
    helperText: "Pick a fruit from the list or type to filter.",
  },
};

export const WithError: Story = {
  args: {
    label: "Fruit",
    options: fruits,
    placeholder: "Type to search…",
    errorText: "Select a valid fruit.",
    defaultValue: "zzz",
  },
};

export const Disabled: Story = {
  args: {
    label: "Fruit",
    options: fruits,
    placeholder: "Unavailable",
    disabled: true,
    defaultValue: "apple",
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Combobox label="Default" options={fruits} placeholder="Type to search…" />
      <Combobox
        label="With helper"
        options={fruits}
        placeholder="Type to search…"
        helperText="Helper text below the field."
      />
      <Combobox
        label="With error"
        options={fruits}
        placeholder="Type to search…"
        errorText="This field needs attention."
        defaultValue="no match"
      />
      <Combobox label="Disabled" options={fruits} placeholder="Locked" disabled defaultValue="Banana" />
    </div>
  ),
};
