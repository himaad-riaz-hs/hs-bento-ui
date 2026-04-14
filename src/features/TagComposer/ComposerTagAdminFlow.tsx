import { useState } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { TagManagement } from "../TagManagement/TagManagement";
import { PostComposer } from "./PostComposer";

/**
 * Storybook / demo shell: composer ↔ tag admin settings, wired by “Manage tags”.
 * In a real app, pass `onManageTags` from `PostComposer` to your router instead.
 */
export function ComposerTagAdminFlow() {
  const [view, setView] = useState<"composer" | "tagAdmin">("composer");

  if (view === "tagAdmin") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: HS_FONT_FAMILY,
        }}
      >
        <header
          style={{
            flexShrink: 0,
            height: 48,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            paddingRight: 16,
            borderBottom: "1px solid var(--hs-color-border-subtle)",
            background: "var(--hs-color-fill-app)",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setView("composer")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--hs-color-text-link)",
              padding: "8px 8px 8px 0",
              fontFamily: HS_FONT_FAMILY,
            }}
          >
            ← Back to composer
          </button>
        </header>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <TagManagement embedded />
        </div>
      </div>
    );
  }

  return <PostComposer onManageTags={() => setView("tagAdmin")} />;
}
