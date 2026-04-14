import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ButtonChoice } from "./ButtonChoice";

const meta: Meta<typeof ButtonChoice> = {
  title: "Components/ButtonChoice",
  component: ButtonChoice,
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ButtonChoice>;

const sampleItems = [
  { value: "social", label: "Social Media" },
  { value: "email", label: "Email Marketing" },
  { value: "seo", label: "SEO" },
  { value: "ads", label: "Paid Ads" },
];

export const Default: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <ButtonChoice items={sampleItems} value={selected} onChange={setSelected} />
    );
  },
};

export const OneColumn: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>([]);
    return <ButtonChoice columns={1} items={sampleItems} value={selected} onChange={setSelected} />;
  },
};

export const ThreeColumns: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>([]);
    return <ButtonChoice columns={3} items={sampleItems} value={selected} onChange={setSelected} />;
  },
};

export const WithDisabledItems: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(["seo"]);
    return (
      <ButtonChoice
        items={[
          ...sampleItems.slice(0, 3),
          { value: "locked", label: "Coming soon", disabled: true },
        ]}
        value={selected}
        onChange={setSelected}
      />
    );
  },
};
