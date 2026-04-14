import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { IconButton, IconButtonToggleable } from "./IconButton";

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HeartOutline = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.98 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const HeartFilled = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.98 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined", "ghost", "tonal"],
    },
    size: { control: "select", options: ["small", "medium"] },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <PlusIcon />,
    "aria-label": "Add",
    variant: "ghost",
    size: "medium",
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <IconButton variant="filled" icon={<PlusIcon />} aria-label="Add" />
      <IconButton variant="outlined" icon={<PlusIcon />} aria-label="Add" />
      <IconButton variant="ghost" icon={<PlusIcon />} aria-label="Add" />
      <IconButton variant="tonal" icon={<PlusIcon />} aria-label="Add" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ width: 72, fontSize: 12, color: "var(--hs-color-text-subtle)" }}>Small</span>
        <IconButton size="small" variant="filled" icon={<PlusIcon />} aria-label="Add" />
        <IconButton size="small" variant="outlined" icon={<PlusIcon />} aria-label="Add" />
        <IconButton size="small" variant="ghost" icon={<PlusIcon />} aria-label="Add" />
        <IconButton size="small" variant="tonal" icon={<PlusIcon />} aria-label="Add" />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ width: 72, fontSize: 12, color: "var(--hs-color-text-subtle)" }}>Medium</span>
        <IconButton size="medium" variant="filled" icon={<PlusIcon />} aria-label="Add" />
        <IconButton size="medium" variant="outlined" icon={<PlusIcon />} aria-label="Add" />
        <IconButton size="medium" variant="ghost" icon={<PlusIcon />} aria-label="Add" />
        <IconButton size="medium" variant="tonal" icon={<PlusIcon />} aria-label="Add" />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    icon: <PlusIcon />,
    "aria-label": "Add",
    disabled: true,
    variant: "filled",
  },
};

export const Toggleable: Story = {
  render: function Render() {
    const [pressed, setPressed] = useState(false);
    return (
      <IconButtonToggleable
        pressed={pressed}
        onPressedChange={setPressed}
        icon={<HeartOutline />}
        iconOn={<HeartFilled />}
        aria-label="Favorite"
      />
    );
  },
};
