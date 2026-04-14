import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup } from "./ToggleGroup";

const meta: Meta<typeof ToggleGroup> = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const SingleSelect: Story = {
  render: function Render() {
    const [value, setValue] = useState("day");
    return (
      <ToggleGroup
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
          { value: "year", label: "Year" },
        ]}
        value={value}
        onChange={(v) => setValue(v as string)}
      />
    );
  },
};

export const MultiSelect: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(["bold"]);
    return (
      <ToggleGroup
        multiple
        items={[
          { value: "bold", label: "B" },
          { value: "italic", label: "I" },
          { value: "underline", label: "U" },
        ]}
        value={value}
        onChange={(v) => setValue(v as string[])}
      />
    );
  },
};

export const Small: Story = {
  render: function Render() {
    const [value, setValue] = useState("week");
    return (
      <ToggleGroup
        size="small"
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
        value={value}
        onChange={(v) => setValue(v as string)}
      />
    );
  },
};

export const WithDisabledItem: Story = {
  render: function Render() {
    const [value, setValue] = useState("a");
    return (
      <ToggleGroup
        items={[
          { value: "a", label: "Enabled A" },
          { value: "b", label: "Disabled B", disabled: true },
          { value: "c", label: "Enabled C" },
        ]}
        value={value}
        onChange={(v) => setValue(v as string)}
      />
    );
  },
};
