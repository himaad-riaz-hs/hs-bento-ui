import { Meta, StoryObj } from "@storybook/react";
import { ProfilePicker, Profile } from "./ProfilePicker";

const sampleProfiles: Profile[] = [
  { id: "1", name: "Alice Johnson", initials: "AJ" },
  { id: "2", name: "Bob Smith", initials: "BS" },
  { id: "3", name: "Carol White", initials: "CW" },
  { id: "4", name: "Dan Brown", initials: "DB" },
  { id: "5", name: "Eve Davis", initials: "ED" },
  { id: "6", name: "Frank Lee", initials: "FL" },
];

const meta: Meta<typeof ProfilePicker> = {
  title: "Components/ProfilePicker",
  component: ProfilePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProfilePicker>;

export const Default: Story = {
  args: {
    profiles: sampleProfiles,
    selected: ["1", "2", "3"],
    onAdd: () => {},
    onManage: () => {},
  },
};

export const WithOverflow: Story = {
  args: {
    profiles: sampleProfiles,
    selected: ["1", "2", "3", "4", "5", "6"],
    maxVisible: 3,
    onManage: () => {},
  },
};

export const EmptySelection: Story = {
  args: {
    profiles: sampleProfiles,
    selected: [],
    onAdd: () => {},
    onManage: () => {},
  },
};

export const SingleSelection: Story = {
  args: {
    profiles: sampleProfiles,
    selected: ["2"],
    maxVisible: 4,
    onAdd: () => {},
    onManage: () => {},
  },
};
