import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PersianJourney } from "./PersianJourney";

/**
 * **Persian Operations hub** — approvals queue, MCP connectors, proactive alerts, automations, ops chat.
 * Brief: `PERSIAN_EXPERIENCE_PROMPT` in `PersianJourney.tsx`. See `persian-playbook.md`.
 */
const meta: Meta<typeof PersianJourney> = {
  id: "flows-persian-product-journey",
  title: "Flows/Persian",
  component: PersianJourney,
  decorators: [
    (Story): React.ReactElement => (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--hs-color-fill-app)",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "bento-neutral" },
    docs: {
      description: {
        component:
          "Dashboard: **approvals** (Claude MCP vs in-app vs workflows), **MCP server** status, **proactive** alerts, **automation** toggles, **ops chat** — for governance while users plan in Claude.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PersianJourney>;

export const Default: Story = {
  name: "Operations hub (approvals · MCP · automations)",
  args: {},
};

export const BrandedTitle: Story = {
  name: "Custom product label",
  args: { productName: "Persian Pro" },
};
