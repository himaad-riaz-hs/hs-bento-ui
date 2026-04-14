import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ChipFilter } from "./ChipFilter";

const meta: Meta<typeof ChipFilter> = {
  title: "Components/ChipFilter",
  component: ChipFilter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChipFilter>;

export const Default: Story = {
  render: function Render() {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <ChipFilter selected={false}>Enabled</ChipFilter>
        <ChipFilter selected={true}>Selected</ChipFilter>
        <ChipFilter disabled>Disabled</ChipFilter>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: function Render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--hs-color-text-subtle)" }}>Unselected, selected, and disabled</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ChipFilter selected={false}>Filter</ChipFilter>
          <ChipFilter selected={true}>Active</ChipFilter>
          <ChipFilter disabled>Disabled</ChipFilter>
        </div>
      </div>
    );
  },
};

export const FilterGroup: Story = {
  render: function Render() {
    const [active, setActive] = useState<Set<string>>(new Set(["active"]));
    const filters = ["All", "Active", "Paused", "Archived", "Draft"];
    const toggle = (f: string) => {
      const next = new Set(active);
      next.has(f) ? next.delete(f) : next.add(f);
      setActive(next);
    };
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {filters.map((f) => (
          <ChipFilter key={f} selected={active.has(f)} onSelectedChange={() => toggle(f)}>
            {f}
          </ChipFilter>
        ))}
      </div>
    );
  },
};
