import { Meta, StoryObj } from "@storybook/react";
import { ComposerTagAdminFlow } from "./ComposerTagAdminFlow";

const meta: Meta<typeof ComposerTagAdminFlow> = {
  title: "Flows/Composer Tag Admin",
  component: ComposerTagAdminFlow,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "bento-neutral" },
    docs: {
      description: {
        component:
          "Composer ↔ Tag Admin shell: **Manage tags** opens Tag Admin. In production, wire `onManageTags` from `PostComposer` to navigation.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComposerTagAdminFlow>;

export const FullInteractiveFlow: Story = {
  name: "Full Interactive Flow",
  render: () => <ComposerTagAdminFlow />,
};

export const BrowseAndSelect: Story = {
  name: "1 — Browse and Select",
  render: () => <ComposerTagAdminFlow />,
  parameters: {
    docs: {
      description: {
        story:
          "Open the Tags combobox, browse groups, expand with the chevron, select tags. Pills appear in the field.",
      },
    },
  },
};

export const SearchAndSelect: Story = {
  name: "2 — Search and Select",
  render: () => <ComposerTagAdminFlow />,
  parameters: {
    docs: {
      description: {
        story: "Type in the combobox to filter tags across groups in real time.",
      },
    },
  },
};

export const SearchNoResultsCreateTag: Story = {
  name: "3 — No Results + Create Tag",
  render: () => <ComposerTagAdminFlow />,
  parameters: {
    docs: {
      description: {
        story: "Search for a non-existent tag to see the empty state and optional create action.",
      },
    },
  },
};

export const FavoritesATag: Story = {
  name: "4 — Favorites a Tag",
  render: () => <ComposerTagAdminFlow />,
  parameters: {
    docs: {
      description: {
        story: "Use the star on a row to favorite; Favourites section updates.",
      },
    },
  },
};

export const UnfavoritesATag: Story = {
  name: "5 — Unfavorites a Tag",
  render: () => <ComposerTagAdminFlow />,
  parameters: {
    docs: {
      description: {
        story: "Click a filled star to remove from Favourites.",
      },
    },
  },
};
