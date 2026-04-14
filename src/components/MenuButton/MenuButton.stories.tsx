import { Meta, StoryObj } from "@storybook/react";
import { MenuButton } from "./MenuButton";

const menuItems = [
  { value: "edit", label: "Edit" },
  { value: "duplicate", label: "Duplicate" },
  { value: "archive", label: "Archive" },
  { value: "delete", label: "Delete", destructive: true },
];

const meta: Meta<typeof MenuButton> = {
  title: "Components/MenuButton",
  component: MenuButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outlined", "ghost"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MenuButton>;

export const Default: Story = {
  args: {
    children: "Actions",
    variant: "outlined",
    items: menuItems,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <MenuButton variant="primary" items={menuItems}>
        Primary
      </MenuButton>
      <MenuButton variant="secondary" items={menuItems}>
        Secondary
      </MenuButton>
      <MenuButton variant="outlined" items={menuItems}>
        Outlined
      </MenuButton>
      <MenuButton variant="ghost" items={menuItems}>
        Ghost
      </MenuButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: "Actions",
    variant: "outlined",
    items: menuItems,
    disabled: true,
  },
};
