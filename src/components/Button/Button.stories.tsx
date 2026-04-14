import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 14s-5.5-3.5-5.5-7A2.8 2.8 0 018 4.5 2.8 2.8 0 0113.5 7C13.5 10.5 8 14 8 14z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outlined",
        "ghost",
        "overlayFilled",
        "overlayFilledInverse",
        "overlayGhost",
        "overlayGhostInverse",
      ],
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button", variant: "primary" },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", gap: 32, alignItems: "start", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)", marginBottom: 16 }}>Primary</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="primary">Button</Button>
            <Button variant="primary" leadingIcon={<HeartIcon />}>Button</Button>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)", marginBottom: 16 }}>Secondary</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary">Button</Button>
            <Button variant="secondary" leadingIcon={<HeartIcon />}>Button</Button>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)", marginBottom: 16 }}>Outlined</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="outlined">Button</Button>
            <Button variant="outlined" leadingIcon={<HeartIcon />}>Button</Button>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)", marginBottom: 16 }}>Ghost</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost">Button</Button>
            <Button variant="ghost" leadingIcon={<HeartIcon />}>Button</Button>
          </div>
        </div>
      </div>

      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-subtle)", marginBottom: 8 }}>
          Overlay (Figma <code style={{ fontSize: 12 }}>comp-button-overlay</code>) — on media / dark UI
        </p>
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "center",
            padding: 24,
            borderRadius: 8,
            background:
              "repeating-conic-gradient(var(--hs-color-border-subtle) 0% 25%, var(--hs-color-fill-subtle) 0% 50%) 50% / 16px 16px",
            border: "1px solid var(--hs-color-border-subtle)",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--hs-color-text-subtle)", width: 140 }}>Filled</span>
            <Button variant="overlayFilled">Button</Button>
            <Button variant="overlayFilled" leadingIcon={<HeartIcon />}>Button</Button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--hs-color-text-subtle)", width: 140 }}>Filled inverse</span>
            <Button variant="overlayFilledInverse">Button</Button>
            <Button variant="overlayFilledInverse" leadingIcon={<HeartIcon />}>Button</Button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--hs-color-text-subtle)", width: 140 }}>Ghost</span>
            <Button variant="overlayGhost">Button</Button>
            <Button variant="overlayGhost" leadingIcon={<HeartIcon />}>Button</Button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--hs-color-text-subtle)", width: 140 }}>Ghost inverse</span>
            <Button variant="overlayGhostInverse">Button</Button>
            <Button variant="overlayGhostInverse" leadingIcon={<HeartIcon />}>Button</Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button variant="primary" disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outlined" disabled>Outlined</Button>
      <Button variant="ghost" disabled>Ghost</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
    variant: "primary",
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};
