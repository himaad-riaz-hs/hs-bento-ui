import { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Label", variant: "neutral" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "var(--hs-typeface-base-font-family)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 80, fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)" }}>Neutral</span>
        <Badge variant="neutral">Label</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 80, fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)" }}>Overlay</span>
        <Badge variant="overlay">Label</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 80, fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-positive)" }}>Positive</span>
        <Badge variant="positive">Positive</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 80, fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-warning)" }}>Warning</span>
        <Badge variant="warning">Warning</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 80, fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-critical)" }}>Negative</span>
        <Badge variant="negative">Negative</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 80, fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-discovery)" }}>Discovery</span>
        <Badge variant="discovery">Discovery</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 80, fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)" }}>Brand</span>
        <Badge variant="brand">Brand</Badge>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Badge size="small" variant="neutral">
        Small
      </Badge>
      <Badge size="medium" variant="neutral">
        Medium
      </Badge>
    </div>
  ),
};
