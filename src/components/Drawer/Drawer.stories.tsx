import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./Drawer";
import { Button } from "../Button";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const drawerBody = (
  <p className="text-hs-base-medium text-hs-text-subtle">Drawer content goes here. It scrolls independently.</p>
);

const drawerFooter = (onClose: () => void) => (
  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
    <Button variant="ghost" size="small" onClick={onClose}>
      Cancel
    </Button>
    <Button size="small" onClick={onClose}>
      Save
    </Button>
  </div>
);

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 32 }}>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          header={<span className="text-hs-strong-medium">Settings</span>}
          footer={drawerFooter(() => setOpen(false))}
        >
          {drawerBody}
        </Drawer>
      </div>
    );
  },
};

export const Left: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 32 }}>
        <Button onClick={() => setOpen(true)}>Open left drawer</Button>
        <Drawer
          position="left"
          open={open}
          onClose={() => setOpen(false)}
          header={<span className="text-hs-strong-medium">Navigation</span>}
          footer={drawerFooter(() => setOpen(false))}
        >
          {drawerBody}
        </Drawer>
      </div>
    );
  },
};

export const NoOverlay: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 32 }}>
        <Button onClick={() => setOpen(true)}>Open without overlay</Button>
        <Drawer open={open} overlay={false} onClose={() => setOpen(false)} header={<span className="text-hs-strong-medium">Panel</span>}>
          {drawerBody}
        </Drawer>
      </div>
    );
  },
};
