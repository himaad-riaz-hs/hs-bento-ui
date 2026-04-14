import { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { IconButton } from "../IconButton";

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 9v4M10 7h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "Helpful tooltip text",
    children: <IconButton icon={<InfoIcon />} aria-label="Info" variant="outlined" />,
    position: "bottom",
  },
};

export const Positions: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, padding: 64 }}>
      <Tooltip content="Top" position="top">
        <IconButton icon={<InfoIcon />} aria-label="Top" variant="outlined" />
      </Tooltip>
      <Tooltip content="Bottom" position="bottom">
        <IconButton icon={<InfoIcon />} aria-label="Bottom" variant="outlined" />
      </Tooltip>
      <Tooltip content="Left" position="left">
        <IconButton icon={<InfoIcon />} aria-label="Left" variant="outlined" />
      </Tooltip>
      <Tooltip content="Right" position="right">
        <IconButton icon={<InfoIcon />} aria-label="Right" variant="outlined" />
      </Tooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  args: {
    content: "Opens after a longer delay",
    delay: 600,
    position: "bottom",
    children: <IconButton icon={<InfoIcon />} aria-label="Delayed" variant="outlined" />,
  },
};
