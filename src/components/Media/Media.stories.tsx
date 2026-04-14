import { Meta, StoryObj } from "@storybook/react";
import { Media } from "./Media";

const Placeholder = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M4 32l12-8 8 6 8-4 12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta: Meta<typeof Media> = {
  title: "Components/Media",
  component: Media,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: "select", options: ["1:1", "16:9", "4:3", "auto"] },
    rounded: { control: "select", options: ["none", "small", "medium", "full"] },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Media>;

export const WithFallback: Story = {
  args: { ratio: "16:9", fallback: <Placeholder /> },
};

export const Ratios: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Media ratio="1:1" fallback={<Placeholder />} style={{ width: 100 }} />
      <Media ratio="16:9" fallback={<Placeholder />} style={{ width: 160 }} />
      <Media ratio="4:3" fallback={<Placeholder />} style={{ width: 120 }} />
    </div>
  ),
};

export const AutoRatio: Story = {
  args: {
    ratio: "auto",
    rounded: "medium",
    children: (
      <div className="flex h-24 items-center justify-center text-hs-icon-subtle">
        <Placeholder />
      </div>
    ),
  },
};

const tinyPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export const WithImage: Story = {
  args: {
    ratio: "16:9",
    src: tinyPng,
    alt: "Sample",
    rounded: "medium",
  },
};

export const RoundedCorners: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
      <Media ratio="1:1" rounded="none" fallback={<Placeholder />} style={{ width: 80 }} />
      <Media ratio="1:1" rounded="small" fallback={<Placeholder />} style={{ width: 80 }} />
      <Media ratio="1:1" rounded="medium" fallback={<Placeholder />} style={{ width: 80 }} />
      <Media ratio="1:1" rounded="full" fallback={<Placeholder />} style={{ width: 80 }} />
    </div>
  ),
};
