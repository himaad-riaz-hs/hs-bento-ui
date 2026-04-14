import { Meta, StoryObj } from "@storybook/react";
import { ActionBar, ActionBarDivider } from "./ActionBar";
import { IconButton } from "../IconButton";

const BoldIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h5a3 3 0 0 1 0 6H4V2zM4 8h6a3 3 0 0 1 0 6H4V8z" stroke="currentColor" strokeWidth="1.5"/></svg>;
const ItalicIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7 2h4M5 14h4M9 2L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const UnderlineIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2v5a4 4 0 0 0 8 0V2M3 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7 9a3 3 0 0 0 4.24 0l2-2a3 3 0 0 0-4.24-4.24L8 3.76M9 7a3 3 0 0 0-4.24 0l-2 2a3 3 0 0 0 4.24 4.24L8 12.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;

const meta: Meta<typeof ActionBar> = {
  title: "Components/ActionBar",
  component: ActionBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

export const Default: Story = {
  render: () => (
    <ActionBar>
      <IconButton icon={<BoldIcon />} aria-label="Bold" variant="ghost" size="small" />
      <IconButton icon={<ItalicIcon />} aria-label="Italic" variant="ghost" size="small" />
      <IconButton icon={<UnderlineIcon />} aria-label="Underline" variant="ghost" size="small" />
      <ActionBarDivider />
      <IconButton icon={<LinkIcon />} aria-label="Insert link" variant="ghost" size="small" />
    </ActionBar>
  ),
};

export const Minimal: Story = {
  render: () => (
    <ActionBar>
      <IconButton icon={<BoldIcon />} aria-label="Bold" variant="ghost" size="small" />
      <IconButton icon={<ItalicIcon />} aria-label="Italic" variant="ghost" size="small" />
    </ActionBar>
  ),
};
