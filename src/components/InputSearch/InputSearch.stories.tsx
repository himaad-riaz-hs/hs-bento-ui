import { Meta, StoryObj } from "@storybook/react";
import { InputSearch } from "./InputSearch";

const meta: Meta<typeof InputSearch> = {
  title: "Components/InputSearch",
  component: InputSearch,
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof InputSearch>;

export const Default: Story = {
  args: { placeholder: "Search..." },
};

export const WithValue: Story = {
  args: { placeholder: "Search...", defaultValue: "Design tokens" },
};

export const Disabled: Story = {
  args: { placeholder: "Search disabled", disabled: true, defaultValue: "Cannot edit" },
};

export const WithClear: Story = {
  args: {
    placeholder: "Type to show clear…",
    defaultValue: "Clear me",
    onClear: () => {},
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InputSearch placeholder="Empty" />
      <InputSearch placeholder="With value" defaultValue="Query text" />
      <InputSearch placeholder="Disabled" disabled defaultValue="Locked" />
    </div>
  ),
};
