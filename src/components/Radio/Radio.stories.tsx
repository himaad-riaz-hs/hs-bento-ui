import { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: { label: "Option A", name: "demo" },
};

export const Group: Story = {
  render: () => (
    <RadioGroup name="example">
      <Radio name="example" label="Option A" value="a" defaultChecked />
      <Radio name="example" label="Option B" value="b" />
      <Radio name="example" label="Option C" value="c" />
      <Radio name="example" label="Disabled" value="d" disabled />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup name="horizontal" orientation="horizontal">
      <Radio name="horizontal" label="Left" value="left" defaultChecked />
      <Radio name="horizontal" label="Center" value="center" />
      <Radio name="horizontal" label="Right" value="right" />
    </RadioGroup>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Radio name="states-a" label="Unchecked" value="u" />
      <Radio name="states-b" label="Checked" value="c" defaultChecked />
      <Radio name="states-c" label="Disabled" value="d" disabled />
      <Radio name="states-d" label="Disabled selected" value="ds" disabled defaultChecked />
    </div>
  ),
};
