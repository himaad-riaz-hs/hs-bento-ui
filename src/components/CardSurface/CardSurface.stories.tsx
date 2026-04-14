import { Meta, StoryObj } from "@storybook/react";
import { CardSurface } from "./CardSurface";
import { Button } from "../Button";

const meta: Meta<typeof CardSurface> = {
  title: "Components/CardSurface",
  component: CardSurface,
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof CardSurface>;

export const Flat: Story = {
  args: {
    variant: "flat",
    children: <p className="text-hs-base-medium text-hs-text-base">Card content goes here.</p>,
  },
};

export const Raised: Story = {
  args: {
    variant: "raised",
    children: <p className="text-hs-base-medium text-hs-text-base">Raised card with shadow.</p>,
  },
};

export const WithHeaderFooter: Story = {
  args: {
    variant: "flat",
    header: <span className="text-hs-strong-medium text-hs-text-base">Card Title</span>,
    footer: (
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" size="small">Cancel</Button>
        <Button variant="primary" size="small">Save</Button>
      </div>
    ),
    children: <p className="text-hs-base-medium text-hs-text-subtle">Some descriptive content inside the card body.</p>,
  },
};

export const Interactive: Story = {
  args: {
    variant: "interactive",
    children: <p className="text-hs-base-medium text-hs-text-base">Hover for raised shadow (interactive card).</p>,
  },
};

export const PaddingSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CardSurface variant="flat" padding="none">
        <p className="text-hs-base-small text-hs-text-subtle">Padding none</p>
      </CardSurface>
      <CardSurface variant="flat" padding="small">
        <p className="text-hs-base-medium text-hs-text-base">Padding small</p>
      </CardSurface>
      <CardSurface variant="flat" padding="medium">
        <p className="text-hs-base-medium text-hs-text-base">Padding medium</p>
      </CardSurface>
      <CardSurface variant="flat" padding="large">
        <p className="text-hs-base-medium text-hs-text-base">Padding large</p>
      </CardSurface>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CardSurface variant="flat">
        <p className="text-hs-base-medium text-hs-text-base">Flat — border only</p>
      </CardSurface>
      <CardSurface variant="raised">
        <p className="text-hs-base-medium text-hs-text-base">Raised — shadow</p>
      </CardSurface>
      <CardSurface variant="interactive">
        <p className="text-hs-base-medium text-hs-text-base">Interactive — hover lift</p>
      </CardSurface>
    </div>
  ),
};
