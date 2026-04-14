import { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    inputSize: { control: "select", options: ["small", "medium"] },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email address",
    placeholder: "Enter your email",
    helperText: "We'll never share your email.",
  },
};

export const WithError: Story = {
  args: {
    label: "Email address",
    placeholder: "Enter your email",
    errorText: "Please enter a valid email address.",
    error: true,
    defaultValue: "notanemail",
  },
};

export const WithIcons: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    leadingIcon: <SearchIcon />,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input inputSize="small" label="Small" placeholder="Small input" />
      <Input inputSize="medium" label="Medium" placeholder="Medium input" />
    </div>
  ),
};

/** Label, helper, error, icons, sizes, and disabled in one view. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Input label="With helper" placeholder="Type here" helperText="Helper copy under the field." />
      <Input label="With error" placeholder="Invalid" errorText="This field has an error." error defaultValue="x" />
      <Input label="With icons" placeholder="Search" leadingIcon={<SearchIcon />} />
      <Input inputSize="small" label="Small" placeholder="40px height" />
      <Input inputSize="medium" label="Medium" placeholder="48px height" />
      <Input label="Disabled" placeholder="Read only" disabled defaultValue="Cannot edit" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    placeholder: "Cannot edit",
    disabled: true,
  },
};
