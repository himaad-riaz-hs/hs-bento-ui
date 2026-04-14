import { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import { Button } from "../Button";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ width: 560 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: "info",
    title: "Information",
    children: "Use the controls to try each alert variant.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert variant="info" title="Information">This is an informational alert.</Alert>
      <Alert variant="positive" title="Success">Operation completed successfully.</Alert>
      <Alert variant="warning" title="Warning">Please review before continuing.</Alert>
      <Alert variant="critical" title="Error">Something went wrong.</Alert>
      <Alert variant="discovery" title="New feature">Try out our latest update.</Alert>
    </div>
  ),
};

export const WithActions: Story = {
  args: {
    variant: "warning",
    title: "Unsaved changes",
    children: "You have unsaved changes. Do you want to save them?",
    actions: (
      <>
        <Button variant="primary">Save</Button>
        <Button variant="ghost">Discard</Button>
      </>
    ),
  },
};

export const Dismissible: Story = {
  args: {
    variant: "info",
    title: "Heads up",
    children: "This alert can be dismissed.",
    onDismiss: () => {},
  },
};
