import { Meta, StoryObj } from "@storybook/react";
import { TagManagement } from "./TagManagement";

const meta: Meta<typeof TagManagement> = {
  title: "Flows/Tag Admin Settings",
  component: TagManagement,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TagManagement>;

export const FullInteractiveFlow: Story = {
  name: "Full Interactive Flow",
  render: () => <TagManagement />,
  parameters: {
    docs: {
      description: {
        story: "The complete Tag Admin Settings page. Click 'Create group' or 'Create tag' to open the modals. Expand group cards to see tags. Click edit on groups/tags to open the edit modals. Everything is fully interactive.",
      },
    },
  },
};

/**
 * Figma Tagging hub (Section 3990:40445) — 688px centered column, figma-mp workspace.
 * Ungrouped tags appear as the last row in Groups (no separate tab). Archived is a flat table.
 */
export const TaggingHubLatest: Story = {
  name: "Tagging hub (Figma latest)",
  render: () => <TagManagement layout="hub" hubWorkspace="figma-mp" />,
  parameters: {
    docs: {
      description: {
        story:
          "Matches **Section 3990:40445** artboards: product nav + Tags header + **688px** centered column (tabs → search → groups). Ungrouped tags are the last row on Groups, not a separate tab. Archived is a flat table with Restore / Delete.",
      },
    },
  },
};

/** Empty state — no groups, no tags. Shows the compact CTA empty state with Create group / Create tags. */
export const EmptyState: Story = {
  name: "Empty state",
  render: () => <TagManagement layout="hub" hubWorkspace="figma-mp" dataPreset="empty" />,
  parameters: {
    docs: {
      description: {
        story: "Zero tags and zero groups. Shows the compact **no groups yet** empty state with primary Create group CTA.",
      },
    },
  },
};

/** Loading skeleton — shimmer placeholders while group list resolves. */
export const GroupsLoading: Story = {
  name: "Groups loading",
  render: () => <TagManagement layout="hub" hubWorkspace="figma-mp" groupsLoading />,
};

/** Error state — couldn't load groups, shows retry. */
export const GroupsLoadError: Story = {
  name: "Groups load error",
  render: () => <TagManagement layout="hub" hubWorkspace="figma-mp" groupsLoadError />,
};

/** Archived tab pre-opened with sample archived groups and tags. */
export const ArchivedTab: Story = {
  name: "Archived tab",
  render: () => <TagManagement layout="hub" hubWorkspace="figma-mp" initialTab="archived" />,
};
