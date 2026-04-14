import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Tree, TreeNode } from "./Tree";

const sampleNodes: TreeNode[] = [
  {
    id: "marketing",
    label: "Marketing",
    children: [
      { id: "social", label: "Social Media" },
      { id: "email", label: "Email Campaigns" },
      {
        id: "content",
        label: "Content",
        children: [
          { id: "blog", label: "Blog Posts" },
          { id: "guides", label: "Guides" },
        ],
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    children: [
      { id: "leads", label: "Lead Generation" },
      { id: "pipeline", label: "Pipeline Management" },
    ],
  },
];

const meta: Meta<typeof Tree> = {
  title: "Components/Tree",
  component: Tree,
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Tree>;

export const Default: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<Set<string>>(new Set(["blog"]));
    return <Tree nodes={sampleNodes} selected={selected} onChange={setSelected} />;
  },
};

export const NoSelection: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    return <Tree nodes={sampleNodes} selected={selected} onChange={setSelected} />;
  },
};
